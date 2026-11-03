import { describe, expect, it } from "vitest";

import {
  measureIntervalRatios,
  type IntervalRatios,
} from "../../src/logic/intervalRatios.ts";
import { parseProgramme } from "../../src/logic/programmeParsing.ts";

/** Measure the interval ratios of a programme. */
function ratiosOf(source: string): IntervalRatios[] {
  return measureIntervalRatios(parseProgramme(source, 25));
}

/** The ratios of an instruction with nothing inside it. */
function own(ratio: number): IntervalRatios {
  return { own: ratio, inner: [] };
}

describe("measureIntervalRatios", () => {
  it("is one for an interval with nothing to compare against", () => {
    expect(ratiosOf("400 Freestyle on 7:00")).toEqual([own(1)]);
  });

  it("compares an interval with the average for its distance", () => {
    expect(ratiosOf("400 Freestyle on 7:00\n400 Freestyle on 6:40")).toEqual([
      own(420 / 410),
      own(400 / 410),
    ]);
  });

  it("only compares intervals of the same distance", () => {
    expect(ratiosOf("100 Freestyle on 1:45\n200 Freestyle on 5:00")).toEqual([
      own(1),
      own(1),
    ]);
  });

  it("compares the distance of a repetition, not of the set", () => {
    expect(ratiosOf("5 x 100 Freestyle on 1:40\n100 Freestyle on 2:00")).toEqual([
      own(100 / 110),
      own(120 / 110),
    ]);
  });

  it("leaves lines with no interval out of the average", () => {
    expect(
      ratiosOf("100 Freestyle on 1:40\n100 Freestyle\n100 Freestyle with 0:10"),
    ).toEqual([own(1), own(1), own(1)]);
  });

  it("gives elements that are not instructions a ratio of one", () => {
    expect(ratiosOf("# comment\n> Main Set\n\n100 Freestyle on 1:45")).toEqual([
      own(1),
      own(1),
      own(1),
      own(1),
    ]);
  });

  it("gives every instruction inside a block a ratio, in order", () => {
    expect(
      ratiosOf("2 x {\n  50 Backstroke on 1:00\n  50 Freestyle on 0:50\n}"),
    ).toEqual([{ own: 1, inner: [60 / 55, 50 / 55] }]);
  });

  it("compares the lines of a block with the rest of the programme", () => {
    expect(ratiosOf("50 Freestyle on 1:00\n2 x {\n  50 Backstroke on 0:40\n}")).toEqual([
      own(60 / 50),
      { own: 1, inner: [40 / 50] },
    ]);
  });

  it("measures a block's own interval", () => {
    expect(
      ratiosOf("100 Freestyle on 2:00\n2 x {\n  100 Backstroke\n} on 3:00"),
    ).toEqual([own(120 / 150), { own: 180 / 150, inner: [1] }]);
  });

  it("keeps the two intervals of a block written on one line apart", () => {
    // One pass through the block is 50 m too, so all three are compared.
    expect(
      ratiosOf("50 Freestyle on 1:20\n2 x { 50 Backstroke on 0:40 } on 3:00\n100 Choice on 2:00"),
    ).toEqual([own(80 / 100), { own: 180 / 100, inner: [40 / 100] }, own(1)]);
  });

  it("is one when the average interval is nothing", () => {
    expect(ratiosOf("100 Freestyle on 0:00")).toEqual([own(1)]);
  });

  it("is empty for an empty list of elements", () => {
    expect(measureIntervalRatios([])).toEqual([]);
  });
});
