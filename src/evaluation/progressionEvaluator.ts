import { getWeekProgressionFactor } from "../../src/logic/sessionGenerator"

export interface SessionVolume {
  date: string;
  actualVolume: number;
}

export interface WeeklyProgression {
  week: number;
  startDate: string;
  endDate: string;
  totalVolume: number;
  averageSessionVolume: number;
  changeFromPreviousWeek: number | null;
  expectedChange: number | null;
  deviationFromExpected: number | null;
}

export interface ProgressionResult {
  weeklyRampPercent: number;
  weeks: WeeklyProgression[];
  increasingWeeks: number;
  decreasingWeeks: number;
  unchangedWeeks: number;
  averageWeeklyChange: number | null;
}

export function evaluateProgression(sessions: SessionVolume[], startDate: string, weeklyRampPercent: number, totalWeeks: number, phase: "base" | "build" | "peak" | "taper"): ProgressionResult {
  const start = new Date(`${startDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime())) {
    throw new Error(`Invalid start date: ${startDate}`);
  }

  if (!Number.isFinite(weeklyRampPercent) || weeklyRampPercent < 0) {
    throw new Error("weeklyRampPercent must be a non-negative number.");
  }

  const weeklyTotals = new Map<number, { totalVolume: number; sessionCount: number }>();

  for (const session of sessions) {
    const date = new Date(`${session.date}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid session date: ${session.date}`);
    }

    if (!Number.isFinite(session.actualVolume) || session.actualVolume < 0) {
      throw new Error(`Invalid session volume for ${session.date}`);
    }

    const daysFromStart = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

    if (daysFromStart < 0) {
      throw new Error(
        `Session ${session.date} is before the programme start date.`
      );
    }

    const week = Math.floor(daysFromStart / 7) + 1;
    const current = weeklyTotals.get(week) ?? {
      totalVolume: 0,
      sessionCount: 0,
    };
    current.totalVolume += session.actualVolume;
    current.sessionCount += 1;
    weeklyTotals.set(week, current);
  }

  const weeks: WeeklyProgression[] = [];
  const lastWeek = Math.max(0, ...weeklyTotals.keys());
  for (let week = 1; week <= lastWeek; week++) {
    const current = weeklyTotals.get(week);

    if (!current) {
      continue;
    }

    const weekStart = new Date(start);
    weekStart.setUTCDate(start.getUTCDate() + (week - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    const previous = weeks[weeks.length - 1];
    const isConsecutive = previous?.week === week - 1;
    const changeFromPreviousWeek =
      previous && isConsecutive && previous.totalVolume > 0
        ? ((current.totalVolume - previous.totalVolume) /
            previous.totalVolume) *
          100
        : null;
    const expectedChange =
      previous
        ? getExpectedWeeklyChange(
            previous.week - 1,
            totalWeeks,
            phase,
            weeklyRampPercent
          )
        : null;
    weeks.push({
      week,
      startDate: weekStart.toISOString().slice(0, 10),
      endDate: weekEnd.toISOString().slice(0, 10),
      totalVolume: current.totalVolume,
      averageSessionVolume:
        current.totalVolume / current.sessionCount,
      changeFromPreviousWeek,
      expectedChange,
      deviationFromExpected:
        changeFromPreviousWeek === null || expectedChange === null
          ? null
          : changeFromPreviousWeek - expectedChange,
    });
  }

  const changes = weeks
    .map((week) => week.changeFromPreviousWeek)
    .filter((change): change is number => change !== null);

  return {
    weeklyRampPercent,
    weeks,
    increasingWeeks: changes.filter((change) => change > 0).length,
    decreasingWeeks: changes.filter((change) => change < 0).length,
    unchangedWeeks: changes.filter((change) => change === 0).length,
    averageWeeklyChange:
      changes.length > 0
        ? changes.reduce((total, change) => total + change, 0) /
          changes.length
        : null,
  };
}

function getExpectedWeeklyChange(
  previousWeekIndex: number,
  totalWeeks: number,
  phase: "base" | "build" | "peak" | "taper",
  rampPercent: number
): number {
  const previousFactor = getWeekProgressionFactor(
    previousWeekIndex,
    totalWeeks,
    phase,
    rampPercent
  );

  const currentFactor = getWeekProgressionFactor(
    previousWeekIndex + 1,
    totalWeeks,
    phase,
    rampPercent
  );

  if (previousFactor === 0) return 0;

  return ((currentFactor - previousFactor) / previousFactor) * 100;
}
