/**
 * Measuring how hard each interval in a programme was written to be, so that
 * the shape of the session survives its intervals being recalculated.
 */

import { lengthMetres } from "./programmeParsing.ts";
import type { InstructionElement, ProgrammeElement } from "./programmeTypes.ts";

/** An `on` interval as the programme wrote it. */
interface WrittenInterval {
  /** Which of the instruction's lines the interval sits on. */
  lineIndex: number;
  /** The distance the interval covers, in metres. */
  metres: number;
  seconds: number;
}

/**
 * Work out how each interval in a programme compares with the average
 * interval written for that distance. Keeping the ratio when the intervals
 * are recalculated keeps a set that was written as a hard effort hard, and an
 * easy one easy. Ratios are taken from the programme as authored, so every
 * pace it is rewritten for keeps the same shape.
 *
 * @param elements The parsed programme.
 * @returns For each element, the interval ratio of each of its lines,
 *   indexed as the elements and their lines are. Lines without an interval
 *   are left at one.
 */
export function measureIntervalRatios(elements: ProgrammeElement[]): number[][] {
  const intervalsByDistance = new Map<number, number[]>();

  for (const element of elements) {
    if (element.kind !== "instruction") continue;

    for (const { metres, seconds } of writtenIntervals(element)) {
      const intervals = intervalsByDistance.get(metres) ?? [];
      intervals.push(seconds);
      intervalsByDistance.set(metres, intervals);
    }
  }

  const ratioOf = (metres: number, seconds: number): number => {
    const intervals = intervalsByDistance.get(metres) ?? [];
    const average =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return average > 0 ? seconds / average : 1;
  };

  return elements.map(element => {
    if (element.kind !== "instruction") return [];

    const ratios = new Array<number>(element.lines.length).fill(1);

    for (const { lineIndex, metres, seconds } of writtenIntervals(element)) {
      ratios[lineIndex] = ratioOf(metres, seconds);
    }

    return ratios;
  });
}

/**
 * Find the `on` intervals written on an instruction's own closing line and on
 * the lines inside it, the instruction's own first.
 */
function writtenIntervals(element: InstructionElement): WrittenInterval[] {
  const ownLine = {
    lineIndex: element.lines.length - 1,
    metres: lengthMetres(element.length),
    rest: element.rest,
  };

  return [ownLine, ...element.inner].flatMap(({ lineIndex, metres, rest }) =>
    rest.kind === "sinceStart" ? [{ lineIndex, metres, seconds: rest.seconds }] : [],
  );
}
