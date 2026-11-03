import { describe, expect, it } from "vitest";

import { measureIntervalRatios } from "../../src/logic/intervalRatios.ts";
import { fitProgramme, parseTarget } from "../../src/logic/programmeAdjustment.ts";
import { parseProgramme } from "../../src/logic/programmeParsing.ts";
import { secondsToTime } from "../../src/logic/swimTime.ts";
import {
  EXAMPLE_SESSION,
  fit,
  sectionMetres,
  sets,
} from "./testFixtures.ts";

const MINUTE = 60;
const EXAMPLE_SETS = ["400", "8 x 50", "5 x 100", "4 x 50", "400", "200"];

/** Fit the example session at a 1:30 pace. */
function fitExample(targets: Parameters<typeof fit>[2]) {
  const fitted = fit(EXAMPLE_SESSION, "1:30", targets);

  return {
    sets: sets(fitted.source),
    metres: fitted.summary.totalMetres,
    time: secondsToTime(fitted.summary.totalSeconds),
  };
}

describe("parseTarget", () => {
  it.each([
    ["45", 60, 2700],
    ["1.5", 60, 90],
    ["2000", 1, 2000],
    ["  30  ", 60, 1800],
  ])("reads %j at a scale of %i as %i", (value, scale, target) => {
    expect(parseTarget(value, scale)).toBe(target);
  });

  it("reads m:ss as a time, whatever the scale", () => {
    expect(parseTarget("1:30", 60)).toBe(90);
  });

  it("reads h:mm:ss as a time", () => {
    expect(parseTarget("1:30:15", 60)).toBe(5415);
  });

  it.each([[""], ["   "], ["abc"], ["0"], ["-5"], ["0:00"], ["Infinity"]])(
    "has no target for %j",
    value => {
      expect(parseTarget(value, 60)).toBeNull();
    },
  );
});

describe("fitProgramme", () => {
  it("leaves the parsed programme it was given alone", () => {
    const elements = parseProgramme(EXAMPLE_SESSION, 25);
    const before = structuredClone(elements);

    fitProgramme(
      elements,
      measureIntervalRatios(elements),
      90,
      { goal: "duration", durationSeconds: 20 * MINUTE, volumeMetres: null },
      25,
      "rescale",
    );

    expect(elements).toEqual(before);
  });

  it("can fit the same elements to one pace after another", () => {
    const elements = parseProgramme(EXAMPLE_SESSION, 25);
    const ratios = measureIntervalRatios(elements);
    const targets = {
      goal: "duration" as const,
      durationSeconds: 20 * MINUTE,
      volumeMetres: null,
    };

    const first = fitProgramme(elements, ratios, 90, targets, 25, "rescale");
    fitProgramme(elements, ratios, 135, targets, 25, "rescale");
    const again = fitProgramme(elements, ratios, 90, targets, 25, "rescale");

    expect(again).toEqual(first);
  });

  it("copes with a programme with no sets", () => {
    expect(fit("# nothing here\n", "1:30", { durationSeconds: 600 })).toMatchObject({
      source: "# nothing here\n",
      summary: { totalMetres: 0, totalSeconds: 0 },
    });
  });

  it("summarises the programme as it was fitted", () => {
    expect(fit(EXAMPLE_SESSION, "1:30", { durationSeconds: 20 * MINUTE }).summary).toEqual({
      paceSecondsPer100: 90,
      totalSeconds: 19 * MINUTE + 47,
      totalMetres: 1100,
      loadSeconds: 16 * MINUTE + 30,
    });
  });

  describe("with no targets", () => {
    it.each([["rescale" as const], ["trim" as const]])(
      "only rewrites the intervals with %s",
      method => {
        const { source } = fit(EXAMPLE_SESSION, "2:15", {}, method);

        expect(sets(source)).toEqual(EXAMPLE_SETS);
        expect(source).toContain("5 x 100 Freestyle on 2:30");
      },
    );
  });

  describe("rewriting intervals", () => {
    it("recalculates an interval for the pace", () => {
      const { source } = fit("100 Freestyle on 5:00\n", "1:30");

      expect(source).toBe("100 Freestyle on 1:45\n");
    });

    it("recalculates an interval for the size a set ended up at", () => {
      const { source } = fit(
        "> Main Set\n400 Freestyle on 7:00\n",
        "1:30",
        { volumeMetres: 200 },
      );

      expect(source).toBe("> Main Set\n200 Freestyle on 3:15\n");
    });

    it("keeps a hard set harder than an easy one at every pace", () => {
      const source = "100 Freestyle on 2:00\n100 Freestyle on 1:40\n";

      for (const pace of ["1:10", "1:30", "2:15"]) {
        const [easy = "", hard = ""] = fit(source, pace).source.split("\n");

        expect(easy > hard).toBe(true);
      }
    });

    it("rewrites the intervals inside a block", () => {
      const { source } = fit("2 x {\n  50 Backstroke on 2:00\n}\n", "1:30");

      expect(source).toBe("2 x {\n  50 Backstroke on 1:00\n}\n");
    });

    it("rewrites a block's own interval", () => {
      const { source } = fit("2 x {\n  50 Backstroke\n} on 5:00\n", "1:30");

      expect(source).toBe("2 x {\n  50 Backstroke\n} on 1:00\n");
    });

    it("keeps how hard each interval inside a block was written", () => {
      // The two 25s average out at 0:30, so they are 2/3 and 4/3 of it.
      const { source } = fit(
        "25 Freestyle on 0:20\n2 x {\n  2 x 25 Backstroke on 0:40\n} on 2:00\n",
        "1:30",
      );

      expect(source).toBe(
        "25 Freestyle on 0:25\n2 x {\n  2 x 25 Backstroke on 0:50\n} on 1:55\n",
      );
    });

    it("leaves other kinds of rest alone", () => {
      const source = "100 Freestyle with 0:10\n100 Freestyle in-out 2\n";

      expect(fit(source, "2:15").source).toBe(source);
    });

    it("leaves what is in a description or a comment alone", () => {
      const source = '100 Freestyle on 5:00 -- "on 1:00 sharp" # on 2:00\n';

      expect(fit(source, "1:30").source).toBe(
        '100 Freestyle on 1:45 -- "on 1:00 sharp" # on 2:00\n',
      );
    });
  });

  describe("rescale, cutting", () => {
    // The worked examples in docs/programme-adjustment.md.
    it.each([
      [33, ["375", "6 x 50", "5 x 100", "4 x 50", "400", "125"], 1900, "33:00"],
      [30, ["275", "5 x 50", "5 x 100", "4 x 50", "400", "75"], 1700, "29:43"],
      [20, ["200", "4 x 50", "4 x 100", "2 x 50", "100", "100"], 1100, "19:47"],
    ])("fits the example to %i minutes", (minutes, expected, metres, time) => {
      expect(fitExample({ durationSeconds: minutes * MINUTE })).toEqual({
        sets: expected,
        metres,
        time,
      });
    });

    it("fits the example to a volume", () => {
      expect(fitExample({ volumeMetres: 1500 })).toEqual({
        sets: ["200", "4 x 50", "5 x 100", "4 x 50", "300", "100"],
        metres: 1500,
        time: "26:28",
      });
    });

    it("applies whichever target is stricter", () => {
      expect(
        fitExample({ durationSeconds: 45 * MINUTE, volumeMetres: 2000 }),
      ).toEqual({
        sets: ["400", "7 x 50", "5 x 100", "4 x 50", "400", "150"],
        metres: 2000,
        time: "34:45",
      });
    });

    it("gets within every target it can reach", () => {
      for (const pace of ["1:10", "1:30", "2:15"]) {
        for (let minutes = 22; minutes <= 36; minutes++) {
          const { summary } = fit(EXAMPLE_SESSION, pace, {
            durationSeconds: minutes * MINUTE,
          });

          expect(summary.totalSeconds).toBeLessThanOrEqual(minutes * MINUTE + 1);
        }
      }
    });

    it("leaves the main set alone until the warm up and warm down are used up", () => {
      for (let minutes = 12; minutes <= 36; minutes++) {
        const { source } = fit(EXAMPLE_SESSION, "1:30", {
          durationSeconds: minutes * MINUTE,
        });
        const { warmUp, warmDown, mainSet } = sectionMetres(source);

        if (mainSet < 900) expect(warmUp + warmDown).toBe(500);
      }
    });

    it("keeps at least half of the warm up and warm down", () => {
      for (const pace of ["1:10", "1:30", "2:15"]) {
        for (let minutes = 5; minutes <= 36; minutes++) {
          const { source } = fit(EXAMPLE_SESSION, pace, {
            durationSeconds: minutes * MINUTE,
          });
          const { warmUp, warmDown } = sectionMetres(source);

          expect(warmUp + warmDown).toBeGreaterThanOrEqual(500);
        }
      }
    });

    it("cuts the warm up and warm down before an unlabelled section", () => {
      const source = `> Warm Up
400 Freestyle
> Drills
400 Choice
> Main Set
400 Freestyle
`;

      const { warmUp, other, mainSet } = sectionMetres(
        fit(source, "1:30", { volumeMetres: 1000 }).source,
      );

      expect({ warmUp, other, mainSet }).toEqual({
        warmUp: 200,
        other: 400,
        mainSet: 400,
      });
    });

    it("cuts an unlabelled section before the main set", () => {
      const source = `> Warm Up
400 Freestyle
> Drills
400 Choice
> Main Set
400 Freestyle
`;

      const { warmUp, other, mainSet } = sectionMetres(
        fit(source, "1:30", { volumeMetres: 800 }).source,
      );

      expect({ warmUp, other, mainSet }).toEqual({
        warmUp: 200,
        other: 200,
        mainSet: 400,
      });
    });

    it("cuts later sets before earlier ones, a slice at a time", () => {
      const source = "> Main Set\n400 Freestyle\n400 Choice\n";

      expect(sets(fit(source, "1:30", { volumeMetres: 700 }).source)).toEqual([
        "400",
        "300",
      ]);
      expect(sets(fit(source, "1:30", { volumeMetres: 500 }).source)).toEqual([
        "300",
        "200",
      ]);
    });

    it("cuts past a target rather than touch a section it can spare", () => {
      const source = "> Warm Up\n8 x 100 Freestyle\n> Main Set\n400 Freestyle\n";

      // Only whole hundreds can go, so 1190 has to land on 1100.
      expect(sets(fit(source, "1:30", { volumeMetres: 1190 }).source)).toEqual([
        "7 x 100",
        "400",
      ]);
    });

    it("skips a set with no distance to give up", () => {
      const source = "> Main Set\n400 Freestyle\n5:00 Choice\n";

      expect(sets(fit(source, "1:30", { volumeMetres: 200 }).source)).toEqual([
        "200",
        "5:00",
      ]);
    });

    it("keeps the time of a set it cannot resize in the session", () => {
      const source = "> Main Set\n400 Freestyle\n5:00 Choice\n";

      // 5:00 of the 6:00 is spoken for, leaving a minute for the 400.
      const { summary } = fit(source, "1:30", { durationSeconds: 6 * MINUTE });

      expect(summary).toMatchObject({ totalMetres: 50, totalSeconds: 345 });
    });

    it("cannot get below a block with no repetitions", () => {
      const source = "> Main Set\n{\n  200 Freestyle\n}\n";

      expect(fit(source, "1:30", { durationSeconds: 60 }).source).toBe(source);
    });

    it("cannot get below a block at one repetition or a timed swim", () => {
      const source = "1 x {\n  100 Freestyle\n}\n5:00 Freestyle\n";

      expect(fit(source, "1:30", { durationSeconds: 60 }).summary).toMatchObject({
        totalMetres: 100,
        totalSeconds: 390,
      });
    });

    it("treats a total within half a second of the target as fitting", () => {
      const source = "> Main Set\n4 x 100 Freestyle\n";

      expect(sets(fit(source, "1:30", { durationSeconds: 359.6 }).source)).toEqual([
        "4 x 100",
      ]);
      expect(sets(fit(source, "1:30", { durationSeconds: 359.4 }).source)).toEqual([
        "3 x 100",
      ]);
    });

    it("reaches a target a block only reaches in whole repetitions", () => {
      const source = `> Main Set
3 x {
  100 Freestyle on 1:50
  100 Backstroke on 2:00
}
`;

      // Each pass through the block takes 5:00 at this pace.
      const { source: fitted, summary } = fit(source, "2:15", {
        durationSeconds: 12 * MINUTE,
      });

      expect(sets(fitted)).toEqual(["2 x"]);
      expect(summary.totalSeconds).toBe(10 * MINUTE);
    });

    it("reaches a target sets of single lengths only reach in whole repetitions", () => {
      const { source, summary } = fit("> Main Set\n8 x 25 Freestyle on 0:40\n", "2:15", {
        durationSeconds: 2 * MINUTE,
      });

      expect(sets(source)).toEqual(["2 x 25"]);
      expect(summary.totalSeconds).toBeLessThanOrEqual(2 * MINUTE);
    });
  });

  describe("rescale, growing", () => {
    // The worked examples in docs/programme-adjustment.md.
    it.each([
      [45, ["7 x 100", "7 x 50", "525"], 2575, "44:50"],
      [60, ["12 x 100", "12 x 50", "600"], 3400, "59:40"],
      [90, ["23 x 100", "20 x 50", "800"], 5100, "89:54"],
      [120, ["27 x 100", "36 x 50", "1250"], 6750, "119:39"],
    ])("fits the example to %i minutes", (minutes, mainSet, metres, time) => {
      expect(fitExample({ durationSeconds: minutes * MINUTE })).toEqual({
        sets: ["400", "8 x 50", ...mainSet, "200"],
        metres,
        time,
      });
    });

    it("leaves a programme that fits nearly exactly alone", () => {
      expect(fitExample({ durationSeconds: 36 * MINUTE + 31 }).sets).toEqual(EXAMPLE_SETS);
    });

    it("never goes past the duration", () => {
      for (const pace of ["1:10", "1:30", "2:15"]) {
        for (let minutes = 37; minutes <= 150; minutes += 7) {
          const { summary } = fit(EXAMPLE_SESSION, pace, {
            durationSeconds: minutes * MINUTE,
          });

          expect(summary.totalSeconds).toBeLessThanOrEqual(minutes * MINUTE);
        }
      }
    });

    it("never goes past the volume", () => {
      expect(fitExample({ volumeMetres: 3333 }).metres).toBeLessThanOrEqual(3333);
    });

    it("stops at whichever target comes first", () => {
      expect(
        fitExample({ durationSeconds: 120 * MINUTE, volumeMetres: 3000 }).metres,
      ).toBeLessThanOrEqual(3000);
    });

    it("grows the main set before anything else", () => {
      const source = "> Warm Up\n4 x 100 Freestyle\n> Main Set\n4 x 100 Freestyle\n";

      expect(sets(fit(source, "1:30", { volumeMetres: 1000 }).source)).toEqual([
        "4 x 100",
        "6 x 100",
      ]);
    });

    it("favours repeated sets over single swims", () => {
      const source = "> Main Set\n5 x 100 Freestyle\n400 Choice\n";

      expect(sets(fit(source, "1:30", { volumeMetres: 1150 }).source)).toEqual([
        "7 x 100",
        "450",
      ]);
    });

    it("spreads a big increase rather than feed one set", () => {
      // An unlimited last pass once turned the 4 x 50 into a 64 x 50 here.
      const repetitions = sets(
        fit(EXAMPLE_SESSION, "1:30", { durationSeconds: 120 * MINUTE }).source,
      ).filter(set => set.endsWith("x 50"));

      expect(repetitions).toEqual(["8 x 50", "36 x 50"]);
    });

    it("limits the growth of the warm up and warm down to half of their volume", () => {
      const source = "> Warm Up\n4 x 100 Freestyle\n> Warm Down\n200 Backstroke\n";

      const { warmUp, warmDown } = sectionMetres(
        fit(source, "1:30", { durationSeconds: 120 * MINUTE }).source,
      );

      expect(warmUp + warmDown).toBe(900);
    });

    it("stops at 64 times a set's volume, or twice that for a repeated set", () => {
      const grown = (source: string) =>
        fit(source, "1:30", { volumeMetres: 100000 }).summary.totalMetres;

      expect(grown("> Main Set\n100 Freestyle\n")).toBe(100 + 64 * 100);
      expect(grown("> Main Set\n1 x 100 Freestyle\n")).toBe(100 + 128 * 100);
    });

    it("can only lengthen a programme of single swims", () => {
      const { source } = fit("> Main Set\n400 Freestyle\n", "1:30", {
        volumeMetres: 500,
      });

      expect(sets(source)).toEqual(["500"]);
    });

    it("cannot grow what cannot be resized", () => {
      const source = "> Main Set\n{\n  200 Freestyle\n}\n5:00 Choice\n";

      expect(fit(source, "1:30", { durationSeconds: 60 * MINUTE }).source).toBe(source);
    });
  });

  describe("fitting by distance", () => {
    /** Fit the example session to a distance at a pace. */
    const toDistance = (volumeMetres: number, pace = "1:30") =>
      fit(EXAMPLE_SESSION, pace, { goal: "distance", volumeMetres });

    /** The same fit, treating the distance as a limit. */
    const toLimit = (volumeMetres: number) =>
      fit(EXAMPLE_SESSION, "1:30", { volumeMetres });

    it("gives the same sets at every pace", () => {
      const expected = ["300", "6 x 50", "5 x 100", "4 x 50", "425", "125"];

      for (const pace of ["1:10", "1:30", "2:15"]) {
        expect(sets(toDistance(1840, pace).source)).toEqual(expected);
      }
    });

    it.each([
      ["1:10", "26:03"],
      ["1:30", "32:13"],
      ["2:15", "46:08"],
    ])("only changes how long it takes at %s", (pace, time) => {
      const { summary } = toDistance(1840, pace);

      expect(summary.totalMetres).toBe(1850);
      expect(secondsToTime(summary.totalSeconds)).toBe(time);
    });

    it("goes past the distance when that lands nearer", () => {
      expect(toLimit(1840).summary.totalMetres).toBe(1825);
      expect(toDistance(1840).summary.totalMetres).toBe(1850);
    });

    it("stays under the distance when that lands nearer", () => {
      expect(toLimit(1830).summary.totalMetres).toBe(1825);
      expect(toDistance(1830).summary.totalMetres).toBe(1825);
    });

    it("stays under the distance when the two are as near as each other", () => {
      const source = "set PoolLength 50\n> Main Set\n10 x 100 Freestyle\n";

      expect(
        fit(source, "1:30", { goal: "distance", volumeMetres: 1050 }).summary.totalMetres,
      ).toBe(1000);
      expect(
        fit(source, "1:30", { goal: "distance", volumeMetres: 1060 }).summary.totalMetres,
      ).toBe(1100);
    });

    it("never lands further from the distance than a limit would", () => {
      for (let metres = 1050; metres <= 4000; metres += 35) {
        const goal = toDistance(metres).summary.totalMetres;
        const limit = toLimit(metres).summary.totalMetres;

        expect(Math.abs(goal - metres)).toBeLessThanOrEqual(Math.abs(limit - metres));
      }
    });

    it("lands on a distance it can hit exactly", () => {
      expect(toDistance(1500).summary.totalMetres).toBe(1500);
    });

    it("takes the last step from the main set first", () => {
      const source = "> Warm Up\n300 Choice\n> Main Set\n300 Freestyle\n";

      expect(
        sets(fit(source, "1:30", { goal: "distance", volumeMetres: 630 }).source),
      ).toEqual(["300", "325"]);
    });

    it("does not take a step the warm up and warm down have no budget for", () => {
      const source = "set PoolLength 50\n> Warm Up\n2 x 100 Choice\n";

      expect(
        sets(fit(source, "1:30", { goal: "distance", volumeMetres: 370 }).source),
      ).toEqual(["3 x 100"]);
    });

    it("does not take a step that runs past the time limit", () => {
      const source = "set PoolLength 50\n> Main Set\n10 x 100 Freestyle\n";

      const { summary, source: fitted } = fit(source, "1:30", {
        goal: "distance",
        volumeMetres: 1060,
        durationSeconds: 15 * MINUTE,
      });

      expect(summary.totalMetres).toBe(1000);
      expect(sets(fitted)).toEqual(["10 x 100"]);
    });

    it("lets the time limit win when it is the stricter", () => {
      const limited = (pace: string) =>
        fit(EXAMPLE_SESSION, pace, {
          goal: "distance",
          volumeMetres: 1840,
          durationSeconds: 40 * MINUTE,
        }).summary;

      expect(limited("1:10")).toMatchObject({
        totalMetres: 1850,
        totalSeconds: 26 * MINUTE + 3,
      });
      expect(limited("2:15")).toMatchObject({
        totalMetres: 1600,
        totalSeconds: 39 * MINUTE + 58,
      });
    });

    it("counts a timed swim for nothing, so it runs longer than it reports", () => {
      const { summary } = fit("5:00 Freestyle\n200 Freestyle\n", "1:30", {
        goal: "distance",
        volumeMetres: 100,
      });

      expect(summary).toMatchObject({ totalMetres: 100, totalSeconds: 390 });
    });

    it("does nothing with no distance to aim for", () => {
      expect(
        sets(fit(EXAMPLE_SESSION, "1:30", { goal: "distance" }).source),
      ).toEqual(EXAMPLE_SETS);
    });
  });

  describe("fitting by duration with a distance limit", () => {
    it("never goes over the limit", () => {
      expect(fitExample({ volumeMetres: 1840 }).metres).toBe(1825);
    });
  });

  describe("trim", () => {
    it("is used in place of resizing the sets", () => {
      const { source, summary } = fit(
        EXAMPLE_SESSION,
        "1:30",
        { durationSeconds: 30 * MINUTE },
        "trim",
      );

      expect(sets(source)).toEqual(["400", "8 x 50", "5 x 100", "4 x 50"]);
      expect(summary).toMatchObject({ totalMetres: 1500, totalSeconds: 27 * MINUTE + 9 });
    });

    it("rewrites the intervals of what is left", () => {
      const { source } = fit(
        EXAMPLE_SESSION,
        "2:15",
        { durationSeconds: 30 * MINUTE },
        "trim",
      );

      expect(source).toContain("3 x 100 Freestyle on 2:30");
    });
  });
});
