import { describe, expect, it } from "vitest";

import {
  intervalFor,
  intervalSeconds,
  secondsPerMetre,
  swimmingSeconds,
  totals,
  unitMetres,
  unitSeconds,
} from "../../src/logic/programmeTiming.ts";
import { EXAMPLE_SESSION, parsed, unitOf } from "./testFixtures.ts";

const PACE = 90;

describe("swimmingSeconds", () => {
  it("adds any time based length to the swim", () => {
    expect(swimmingSeconds(100, 0, PACE)).toBe(90);
    expect(swimmingSeconds(100, 30, PACE)).toBe(120);
    expect(swimmingSeconds(0, 300, PACE)).toBe(300);
  });
});

describe("intervalFor", () => {
  it("adds the endurance rest to the swim", () => {
    expect(intervalFor(90, 1)).toBe(105);
    expect(intervalFor(45, 1)).toBe(60);
  });

  it("keeps an interval as generous as it was written", () => {
    expect(intervalFor(90, 1.2)).toBe(126);
  });

  it("keeps an interval as tight as it was written", () => {
    expect(intervalFor(90, 0.9)).toBe(95);
  });

  it("rounds to a whole second", () => {
    expect(intervalFor(90, 1.03)).toBe(108);
  });

  it("is never shorter than the swim itself", () => {
    expect(intervalFor(90, 0.5)).toBe(90);
  });
});

describe("intervalSeconds", () => {
  it("uses the swim of one repetition", () => {
    expect(intervalSeconds(unitOf("5 x 100 Freestyle on 1:45"), PACE)).toBe(105);
  });

  it("uses the ratio the interval was written with", () => {
    const [easy, hard] = parsed(
      "100 Freestyle on 2:00\n100 Freestyle on 1:00\n",
    ).units;

    // The two average out at 1:30, so they are 4/3 and 2/3 of it.
    expect(easy && intervalSeconds(easy, PACE)).toBe(140);
    expect(hard && intervalSeconds(hard, PACE)).toBe(90);
  });
});

describe("unitSeconds", () => {
  it.each([
    ["no rest", "100 Freestyle", 90],
    ["an on interval", "100 Freestyle on 1:45", 105],
    ["a with rest", "100 Freestyle with 0:10", 100],
    ["an in-out rest", "100 Freestyle in-out 2", 100],
    ["a time based length", "5:00 Freestyle", 300],
    ["a time based length with rest", "5:00 Freestyle with 0:30", 330],
    ["a time based length on an interval", "5:00 Freestyle on 5:15", 315],
    ["laps", "4 laps Freestyle", 90],
  ])("times %s", (_name, line, seconds) => {
    expect(unitSeconds(unitOf(line), PACE)).toBe(seconds);
  });

  it.each([
    ["no rest", "3 x 100 Freestyle", 270],
    ["an on interval", "3 x 100 Freestyle on 1:45", 315],
    ["a with rest", "3 x 100 Freestyle with 0:10", 300],
    ["an in-out rest", "3 x 100 Freestyle in-out 2", 300],
  ])("counts every repetition of a set with %s", (_name, line, seconds) => {
    expect(unitSeconds(unitOf(line), PACE)).toBe(seconds);
  });

  it("adds up the lines of a block, each with its own rest", () => {
    const block = unitOf(`2 x {
  100 Freestyle on 1:45
  50 Backstroke with 0:10
  50 Choice
}`);

    expect(unitSeconds(block, PACE)).toBe(2 * (105 + 55 + 45));
  });

  it("multiplies a line by the blocks nested around it", () => {
    const block = unitOf(`2 x {
  100 Freestyle on 1:45
  3 x {
    2 x 50 Backstroke with 0:10
  }
}`);

    expect(unitSeconds(block, PACE)).toBe(2 * (105 + 3 * 2 * 55));
  });

  it("adds a time based line inside a block", () => {
    expect(unitSeconds(unitOf("2 x {\n  1:00 Freestyle\n}"), PACE)).toBe(120);
  });

  it("adds a block's own rest to what is inside it", () => {
    expect(
      unitSeconds(unitOf("2 x {\n  100 Freestyle with 0:10\n} with 0:30"), PACE),
    ).toBe(2 * (100 + 30));
  });

  it("lets a block's own on interval cover the whole block", () => {
    expect(
      unitSeconds(unitOf("2 x {\n  50 Freestyle\n  50 Backstroke\n} on 1:45"), PACE),
    ).toBe(2 * 105);
  });

  it("gives a block's own interval room for the rests inside it", () => {
    const block = unitOf(`3 x {
  100 Freestyle on 1:50
  2 x {
    50 Butterfly with 0:10
  }
} on 7:00`);

    // The lines take 105 + 2 × 55 = 215 s, and the interval adds its 15 s.
    expect(intervalSeconds(block, PACE)).toBe(230);
    expect(unitSeconds(block, PACE)).toBe(3 * 230);
  });

  it("gives a block's own interval room for the intervals inside it", () => {
    const block = unitOf("2 x {\n  2 x 50 Freestyle on 1:00\n} on 5:00");

    expect(intervalSeconds(block, PACE)).toBe(2 * 60 + 15);
  });
});

describe("unitMetres", () => {
  it("counts every repetition", () => {
    expect(unitMetres(unitOf("5 x 100 Freestyle"))).toBe(500);
  });

  it("counts a block's whole contents", () => {
    expect(unitMetres(unitOf("2 x {\n  100 Freestyle\n  2 x 50 Choice\n}"))).toBe(400);
  });

  it("counts a length written as a time for nothing", () => {
    expect(unitMetres(unitOf("3 x 5:00 Freestyle"))).toBe(0);
  });

  it("follows the unit as it is resized", () => {
    const unit = unitOf("5 x 100 Freestyle");

    unit.instruction.repetitions = 3;
    unit.perRepetitionMetres = 75;

    expect(unitMetres(unit)).toBe(225);
  });
});

describe("totals", () => {
  it("adds up a whole programme", () => {
    expect(totals(parsed(EXAMPLE_SESSION).units, PACE)).toEqual({
      seconds: 36 * 60 + 30,
      metres: 2100,
    });
  });

  it("is nothing for a programme with no sets", () => {
    expect(totals([], PACE)).toEqual({ seconds: 0, metres: 0 });
  });

  it("depends on the pace for time but not for distance", () => {
    const { units } = parsed(EXAMPLE_SESSION);

    expect(totals(units, 135).metres).toBe(totals(units, 70).metres);
    expect(totals(units, 135).seconds).toBeGreaterThan(totals(units, 70).seconds);
  });
});

describe("secondsPerMetre", () => {
  it("includes the rest of the set", () => {
    expect(secondsPerMetre(unitOf("5 x 100 Freestyle on 1:45"), PACE)).toBeCloseTo(1.05);
  });

  it("is nothing for a set with no distance", () => {
    expect(secondsPerMetre(unitOf("5:00 Freestyle"), PACE)).toBe(0);
  });
});
