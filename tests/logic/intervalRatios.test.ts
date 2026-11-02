import { describe, expect, it } from "vitest";

import { measureIntervalRatios } from "../../src/logic/intervalRatios.ts";
import { parseProgramme } from "../../src/logic/programmeParsing.ts";

/** Measure the interval ratios of a programme. */
function ratiosOf(source: string): number[][] {
  return measureIntervalRatios(parseProgramme(source, 25));
}

describe("measureIntervalRatios", () => {
  it("is one for an interval with nothing to compare against", () => {
    expect(ratiosOf("400 Freestyle on 7:00")).toEqual([[1]]);
  });

  it("compares an interval with the average for its distance", () => {
    expect(ratiosOf("400 Freestyle on 7:00\n400 Freestyle on 6:40")).toEqual([
      [420 / 410],
      [400 / 410],
    ]);
  });

  it("only compares intervals of the same distance", () => {
    expect(ratiosOf("100 Freestyle on 1:45\n200 Freestyle on 5:00")).toEqual([[1], [1]]);
  });

  it("compares the distance of a repetition, not of the set", () => {
    expect(ratiosOf("5 x 100 Freestyle on 1:40\n100 Freestyle on 2:00")).toEqual([
      [100 / 110],
      [120 / 110],
    ]);
  });

  it("leaves lines with no interval out of the average", () => {
    expect(
      ratiosOf("100 Freestyle on 1:40\n100 Freestyle\n100 Freestyle with 0:10"),
    ).toEqual([[1], [1], [1]]);
  });

  it("gives elements that are not instructions no ratios", () => {
    expect(ratiosOf("# comment\n> Main Set\n\n100 Freestyle on 1:45")).toEqual([
      [],
      [],
      [],
      [1],
    ]);
  });

  it("gives every line of a block a ratio, indexed by line", () => {
    expect(
      ratiosOf("2 x {\n  50 Backstroke on 1:00\n  50 Freestyle on 0:50\n}"),
    ).toEqual([[1, 60 / 55, 50 / 55, 1]]);
  });

  it("compares the lines of a block with the rest of the programme", () => {
    expect(ratiosOf("50 Freestyle on 1:00\n2 x {\n  50 Backstroke on 0:40\n}")).toEqual([
      [60 / 50],
      [1, 40 / 50, 1],
    ]);
  });

  it("measures a block's own interval on its closing line", () => {
    expect(
      ratiosOf("100 Freestyle on 2:00\n2 x {\n  100 Backstroke\n} on 3:00"),
    ).toEqual([[120 / 150], [1, 1, 180 / 150]]);
  });

  it("is one when the average interval is nothing", () => {
    expect(ratiosOf("100 Freestyle on 0:00")).toEqual([[1]]);
  });

  it("is empty for an empty list of elements", () => {
    expect(measureIntervalRatios([])).toEqual([]);
  });
});
