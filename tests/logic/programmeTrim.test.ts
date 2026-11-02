import { describe, expect, it } from "vitest";

import { renderProgramme } from "../../src/logic/programmeRewriting.ts";
import { cutToTargets } from "../../src/logic/programmeTrim.ts";
import { secondsToTime } from "../../src/logic/swimTime.ts";
import { EXAMPLE_SESSION, fit, parsed, sets, syntaxErrors } from "./testFixtures.ts";

const PACE = 90;
const MINUTE = 60;

/** Trim a programme, giving back what is left of it and of its units. */
function trim(
  source: string,
  targets: { durationSeconds?: number; volumeMetres?: number },
) {
  const { elements, units } = parsed(source);
  const cut = cutToTargets(elements, units, PACE, {
    goal: "duration",
    durationSeconds: targets.durationSeconds ?? null,
    volumeMetres: targets.volumeMetres ?? null,
  });

  return { source: renderProgramme(cut.elements), units: cut.units };
}

describe("cutToTargets", () => {
  it("keeps everything when the session fits", () => {
    const { source, units } = trim(EXAMPLE_SESSION, { durationSeconds: 60 * MINUTE });

    expect(source).toBe(EXAMPLE_SESSION);
    expect(units).toHaveLength(6);
  });

  it("never adds volume", () => {
    expect(trim("> Main Set\n4 x 100 Freestyle\n", { volumeMetres: 5000 }).source).toBe(
      "> Main Set\n4 x 100 Freestyle\n",
    );
  });

  it("keeps a set that fits exactly", () => {
    expect(trim("4 x 100 Freestyle\n200 Choice", { volumeMetres: 400 }).source).toBe(
      "4 x 100 Freestyle",
    );
    expect(trim("4 x 100 Freestyle", { durationSeconds: 360 }).source).toBe(
      "4 x 100 Freestyle",
    );
  });

  it("reduces a set to the whole repetitions that still fit", () => {
    expect(trim("5 x 100 Freestyle on 1:45", { durationSeconds: 300 }).source).toBe(
      "2 x 100 Freestyle on 1:45",
    );
  });

  it("reduces a set to fit the volume", () => {
    expect(trim("5 x 100 Freestyle", { volumeMetres: 350 }).source).toBe(
      "3 x 100 Freestyle",
    );
  });

  it("ends the programme at a reduced set", () => {
    const { source, units } = trim(
      "5 x 100 Freestyle\n100 Choice\n# after the cut\n> Warm Down\n100 Backstroke",
      { volumeMetres: 350 },
    );

    expect(source).toBe("3 x 100 Freestyle");
    expect(units).toHaveLength(1);
  });

  it("drops a single swim that does not fit, and all that follows it", () => {
    const { source, units } = trim(
      "100 Freestyle\n400 Choice\n50 Backstroke",
      { volumeMetres: 300 },
    );

    expect(source).toBe("100 Freestyle");
    expect(units).toHaveLength(1);
  });

  it("drops a repeated set when not even one repetition fits", () => {
    expect(trim("100 Freestyle\n3 x 200 Choice", { volumeMetres: 150 }).source).toBe(
      "100 Freestyle",
    );
  });

  it("does not carry on to a later set that would have fitted", () => {
    expect(
      trim("100 Freestyle\n400 Choice\n50 Backstroke", { volumeMetres: 150 }).source,
    ).not.toContain("50 Backstroke");
  });

  it("keeps the comments, headers, and blank lines before the cut", () => {
    const kept = '# Notes\nset PoolLength 25\n\n> Warm Up\n  100 Freestyle -- "easy"\n';

    expect(trim(`${kept}\n400 Choice`, { volumeMetres: 100 }).source).toBe(kept);
  });

  it("leaves the header of a section whose sets were all cut", () => {
    expect(
      trim("100 Freestyle\n> Main Set\n400 Choice", { volumeMetres: 100 }).source,
    ).toBe("100 Freestyle\n> Main Set");
  });

  it("is left with no sets when none of them fit", () => {
    const { source, units } = trim("> Main Set\n400 Freestyle", { volumeMetres: 100 });

    expect(source).toBe("> Main Set");
    expect(units).toEqual([]);
  });

  it("reduces a block through its repetitions, keeping it whole", () => {
    const { source } = trim("3 x {\n  50 Freestyle\n  50 Choice\n}", {
      volumeMetres: 250,
    });

    expect(source).toBe("2 x {\n  50 Freestyle\n  50 Choice\n}");
  });

  it("drops a block it cannot reduce, whole", () => {
    expect(
      trim("100 Choice\n{\n  50 Freestyle\n  50 Choice\n}", { volumeMetres: 150 }).source,
    ).toBe("100 Choice");
  });

  it("drops a block when not even one pass through it fits", () => {
    expect(
      trim("3 x {\n  50 Freestyle\n  50 Choice\n}", { volumeMetres: 50 }).source,
    ).toBe("");
  });

  it("counts a timed swim towards the time but not the distance", () => {
    const source = "5:00 Freestyle\n100 Choice";

    expect(trim(source, { volumeMetres: 100 }).source).toBe(source);
    expect(trim(source, { durationSeconds: 5 * MINUTE }).source).toBe("5:00 Freestyle");
  });

  it("stops at whichever target runs out first", () => {
    const source = "10 x 100 Freestyle";

    expect(
      trim(source, { durationSeconds: 9 * MINUTE, volumeMetres: 300 }).source,
    ).toBe("3 x 100 Freestyle");
    expect(
      trim(source, { durationSeconds: 3 * MINUTE, volumeMetres: 900 }).source,
    ).toBe("2 x 100 Freestyle");
  });

  it("carries the total over from one set to the next", () => {
    expect(
      trim("100 Freestyle\n100 Choice\n5 x 100 Backstroke", { volumeMetres: 400 }).source,
    ).toBe("100 Freestyle\n100 Choice\n2 x 100 Backstroke");
  });

  it("updates the unit of a reduced set", () => {
    const { units } = trim("5 x 100 Freestyle", { volumeMetres: 350 });

    expect(units[0]?.instruction.repetitions).toBe(3);
  });
});

describe("trimming the example session", () => {
  // The worked examples in docs/programme-adjustment.md.
  it.each([
    [{ durationSeconds: 30 * MINUTE }, ["400", "8 x 50", "5 x 100", "4 x 50"], 1500, "27:09"],
    [{ volumeMetres: 1200 }, ["400", "8 x 50", "4 x 100"], 1200, "21:24"],
    [{ durationSeconds: 12 * MINUTE }, ["400", "5 x 50"], 650, "11:24"],
    [
      { durationSeconds: 60 * MINUTE },
      ["400", "8 x 50", "5 x 100", "4 x 50", "400", "200"],
      2100,
      "36:30",
    ],
  ])("fits %j", (targets, expected, metres, time) => {
    const { source, summary } = fit(EXAMPLE_SESSION, "1:30", targets, "trim");

    expect(sets(source)).toEqual(expected);
    expect(summary.totalMetres).toBe(metres);
    expect(secondsToTime(summary.totalSeconds)).toBe(time);
  });

  it("stops when the distance is reached, never going over", () => {
    for (let volumeMetres = 100; volumeMetres <= 2200; volumeMetres += 35) {
      const { summary } = fit(
        EXAMPLE_SESSION,
        "1:30",
        { goal: "distance", volumeMetres },
        "trim",
      );

      expect(summary.totalMetres).toBeLessThanOrEqual(volumeMetres);
    }
  });

  it("always stays within the duration, and writes valid SwimDSL", () => {
    for (const pace of ["1:10", "1:30", "2:15"]) {
      for (let minutes = 1; minutes <= 60; minutes += 3) {
        const { source, summary } = fit(
          EXAMPLE_SESSION,
          pace,
          { durationSeconds: minutes * MINUTE },
          "trim",
        );

        expect(summary.totalSeconds).toBeLessThanOrEqual(minutes * MINUTE);
        expect(syntaxErrors(source)).toBe(0);
      }
    }
  });
});
