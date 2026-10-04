import { Programme } from "../../codemirror-swimdsl/src/astTypes";
import { evaluateIntensity } from "./intensityEvaluator";

export interface SessionLoad {
  date: string;
  volume: number;
  averageIntensity: number;
  trainingLoad: number;
}

export interface WeeklyLoad {
  week: number;
  totalLoad: number;
  averageSessionLoad: number;
  changeFromPreviousWeek: number | null;
}

export interface LoadResult {
  sessions: SessionLoad[];
  weeks: WeeklyLoad[];
  totalLoad: number;
  averageSessionLoad: number;
}

export function evaluateSessionLoad(programme: Programme, volume: number, date: string): SessionLoad {
  const intensity = evaluateIntensity(programme);

  const totalIntensityVolume =
    intensity.easy +
    intensity.endurance +
    intensity.threshold +
    intensity.racePace +
    intensity.max;

  const weightedIntensity =
    intensity.easy * 65 +
    intensity.endurance * 72 +
    intensity.threshold * 88 +
    intensity.racePace * 95 +
    intensity.max * 100;

  const averageIntensity = totalIntensityVolume === 0 ? 0 : weightedIntensity / totalIntensityVolume;

  const trainingLoad = volume * (averageIntensity / 100);

  return {
    date,
    volume,
    averageIntensity,
    trainingLoad,
  };
}

export function evaluateWeeklyLoad(sessions: SessionLoad[], startDate: string): WeeklyLoad[] {
  const start = new Date(startDate);
  const weeklyLoads = new Map<number, SessionLoad[]>();

  for (const session of sessions) {
    const date = new Date(session.date);

    const daysSinceStart = Math.floor(
      (date.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const week = Math.floor(daysSinceStart / 7) + 1;

    if (!weeklyLoads.has(week)) {
      weeklyLoads.set(week, []);
    }

    const existingSessions = weeklyLoads.get(week);

    if (existingSessions) {
      existingSessions.push(session);
    } else {
      weeklyLoads.set(week, [session]);
    }
  }

  const weeks = Array.from(weeklyLoads.entries())
    .sort(([weekA], [weekB]) => weekA - weekB);

  return weeks.map(([week, weekSessions], index) => {
    const totalLoad = weekSessions.reduce(
      (sum, session) => sum + session.trainingLoad,
      0
    );

    const averageSessionLoad =
      weekSessions.length === 0
        ? 0
        : totalLoad / weekSessions.length;

    let changeFromPreviousWeek: number | null = null;

    if (index > 0) {
      const previousWeek = weeks[index - 1];

      if (previousWeek) {
        const previousWeekSessions = previousWeek[1];

        const previousTotalLoad = previousWeekSessions.reduce(
          (sum, session) => sum + session.trainingLoad,
          0
        );

        if (previousTotalLoad !== 0) {
          changeFromPreviousWeek =
            ((totalLoad - previousTotalLoad) / previousTotalLoad) * 100;
        }
      }
    }

    return {
      week,
      totalLoad,
      averageSessionLoad,
      changeFromPreviousWeek,
    };
  });
}

export function evaluateLoad(sessions: SessionLoad[], startDate: string): LoadResult {
  const totalLoad = sessions.reduce(
    (sum, session) => sum + session.trainingLoad,
    0
  );

  const averageSessionLoad = sessions.length === 0 ? 0 : totalLoad / sessions.length;

  return {
    sessions,
    weeks: evaluateWeeklyLoad(sessions, startDate),
    totalLoad,
    averageSessionLoad,
  };
}
