/**
 * Measuring how hard each interval in a programme was written to be, so that
 * the shape of the session survives its intervals being recalculated.
 */

import { lengthMetres } from "./programmeParsing.ts";
import type {
  InstructionElement,
  InstructionRest,
  ProgrammeElement,
} from "./programmeTypes.ts";

/** The interval ratios of one element of a programme. */
export interface IntervalRatios {
  /** The ratio of the instruction's own interval. */
  own: number;
  /** The ratio of each instruction inside a block, in the order of `inner`. */
  inner: number[];
}

/** A distance and the rest it is swum with. */
interface Interval {
  /** The distance the interval covers, in metres. */
  metres: number;
  rest: InstructionRest;
}

/**
 * Work out how each interval in a programme compares with the average
 * interval written for that distance. Keeping the ratio when the intervals
 * are recalculated keeps a set that was written as a hard effort hard, and an
 * easy one easy. Ratios are taken from the programme as authored, so every
 * pace it is rewritten for keeps the same shape.
 *
 * @param elements The parsed programme.
 * @returns For each element, the interval ratio of the instruction itself and
 *   of each instruction inside it. Anything without an `on` interval is left
 *   at one.
 */
export function measureIntervalRatios(
  elements: ProgrammeElement[],
): IntervalRatios[] {
  const intervalsByDistance = new Map<number, number[]>();

  for (const element of elements) {
    if (element.kind !== "instruction") continue;

    for (const { metres, rest } of intervalsOf(element)) {
      if (rest.kind !== "sinceStart") continue;

      const intervals = intervalsByDistance.get(metres) ?? [];
      intervals.push(rest.seconds);
      intervalsByDistance.set(metres, intervals);
    }
  }

  const ratioOf = ({ metres, rest }: Interval): number => {
    if (rest.kind !== "sinceStart") return 1;

    const intervals = intervalsByDistance.get(metres) ?? [];
    const average =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return average > 0 ? rest.seconds / average : 1;
  };

  return elements.map(element =>
    element.kind === "instruction"
      ? { own: ratioOf(ownInterval(element)), inner: element.inner.map(ratioOf) }
      : { own: 1, inner: [] },
  );
}

/** The distance an instruction's own rest covers. */
function ownInterval(element: InstructionElement): Interval {
  return { metres: lengthMetres(element.length), rest: element.rest };
}

/** The intervals of an instruction, its own first, then those inside it. */
function intervalsOf(element: InstructionElement): Interval[] {
  return [ownInterval(element), ...element.inner];
}
