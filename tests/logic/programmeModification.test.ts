import { afterEach, describe, expect, it, vi } from "vitest";

import { newFile } from "../../src/logic/filePersistence.ts";
import {
  modifiedProgrammes,
  modifyProgram,
  type ModificationParameters,
} from "../../src/logic/programmeModification.ts";
import {
  EDGE_CASE_SESSION,
  EXAMPLE_SESSION,
  sets,
  syntaxErrors,
} from "./testFixtures.ts";

vi.mock("../../src/logic/filePersistence.ts", () => ({ newFile: vi.fn() }));

/** The session docs/programme-adjustment.md compares old and new output on. */
const ORIGINAL_DEFECTS_SESSION = `set PoolLength 25

> Warm Up
400 Freestyle on 7:00

> Main Set
5 x 100 Freestyle on 1:45
2 x {
  50 Backstroke on 1:00
}
100 NumberOne
400 Freestyle on 6:40

> Warm Down
200 Backstroke on 4:00
`;

/** What the dialog submits, with nothing but a single pace filled in. */
function parameters(
  overrides: Partial<ModificationParameters> = {},
): ModificationParameters {
  return {
    group: "",
    paces: ["1:30"],
    goal: "duration",
    duration: "",
    volume: "",
    fit: "rescale",
    ...overrides,
  };
}

/** The source of one pace's version of a programme. */
function modified(
  programme: string,
  overrides: Partial<ModificationParameters> = {},
): string {
  return modifiedProgrammes(programme, parameters(overrides))[0]?.source ?? "";
}

describe("modifiedProgrammes", () => {
  it("writes one version per pace, in the order they were given", () => {
    const versions = modifiedProgrammes(
      EXAMPLE_SESSION,
      parameters({ paces: ["2:15", "1:10", "1:30"] }),
    );

    expect(versions.map(version => version.pace)).toEqual(["2:15", "1:10", "1:30"]);
    expect(versions.map(version => version.summary.paceSecondsPer100)).toEqual([
      135, 70, 90,
    ]);
  });

  it("writes nothing for no paces", () => {
    expect(modifiedProgrammes(EXAMPLE_SESSION, parameters({ paces: [] }))).toEqual([]);
  });

  it("keeps a version for each of two swimmers at the same pace", () => {
    const [first, second] = modifiedProgrammes(
      EXAMPLE_SESSION,
      parameters({ paces: ["1:30", "1:30"] }),
    );

    expect(second).toEqual(first);
  });

  it("does not let one pace's version leak into the next", () => {
    const together = modifiedProgrammes(
      EXAMPLE_SESSION,
      parameters({ paces: ["1:10", "2:15"], duration: "30" }),
    );
    const alone = modifiedProgrammes(
      EXAMPLE_SESSION,
      parameters({ paces: ["2:15"], duration: "30" }),
    );

    expect(together[1]).toEqual(alone[0]);
  });

  it("opens each version with its summary", () => {
    expect(modified(EXAMPLE_SESSION, { duration: "30" }).split("\n")[0]).toBe(
      "# Fitted to a 1:30 per 100 pace: 1700 metres in 29:43 of 30:00, training load 25:30.",
    );
  });

  it("reads the duration in minutes and the volume in metres", () => {
    expect(
      modified(EXAMPLE_SESSION, { duration: "45", volume: "2000" }).split("\n")[0],
    ).toContain("2000 metres of 2000 in 34:45 of 45:00");
  });

  it("only rewrites intervals with no duration or volume", () => {
    for (const fit of ["rescale", "trim"] as const) {
      expect(sets(modified(EXAMPLE_SESSION, { fit }))).toEqual(sets(EXAMPLE_SESSION));
    }
  });

  it("ignores targets it cannot read", () => {
    expect(modified(EXAMPLE_SESSION, { duration: "soon", volume: "-5" })).toBe(
      modified(EXAMPLE_SESSION),
    );
  });

  it("reads the pool length from the programme", () => {
    const fitted = (poolLength: number) =>
      sets(
        modified(`set PoolLength ${poolLength}\n> Main Set\n400 Freestyle\n`, {
          volume: "330",
        }),
      );

    expect(fitted(25)).toEqual(["325"]);
    expect(fitted(50)).toEqual(["300"]);
  });

  it("passes the goal on", () => {
    expect(sets(modified(EXAMPLE_SESSION, { goal: "distance", volume: "1840" }))).toEqual(
      ["300", "6 x 50", "5 x 100", "4 x 50", "425", "125"],
    );
  });

  it("passes the fit method on", () => {
    expect(sets(modified(EXAMPLE_SESSION, { fit: "trim", duration: "30" }))).toEqual([
      "400",
      "8 x 50",
      "5 x 100",
      "4 x 50",
    ]);
  });

  describe("compatibility", () => {
    it("fits by duration for any goal other than distance", () => {
      const goal = "pool time" as ModificationParameters["goal"];

      expect(modified(EXAMPLE_SESSION, { goal, duration: "30", volume: "1840" })).toBe(
        modified(EXAMPLE_SESSION, { duration: "30", volume: "1840" }),
      );
    });

    it("adjusts the sets for any fit other than trim", () => {
      const fit = undefined as unknown as ModificationParameters["fit"];

      expect(modified(EXAMPLE_SESSION, { fit, duration: "30" })).toBe(
        modified(EXAMPLE_SESSION, { duration: "30" }),
      );
    });
  });

  describe("programmes that have already been fitted", () => {
    it("leaves exactly one summary", () => {
      const once = modified(EXAMPLE_SESSION, { duration: "30" });
      const twice = modified(once, { duration: "30" });

      expect(twice.match(/^# Fitted to a /gm)).toHaveLength(1);
    });

    it("gives the same sets when fitted to the same target again", () => {
      const once = modified(EXAMPLE_SESSION, { volume: "1500" });

      expect(sets(modified(once, { volume: "1500" }))).toEqual(sets(once));
    });
  });

  // Each of these is a defect of the original modifier that this rewrite was
  // written to fix.
  describe("defects of the original modifier", () => {
    it("writes the example from the docs exactly", () => {
      expect(modified(ORIGINAL_DEFECTS_SESSION)).toBe(`# Fitted to a 1:30 per 100 pace: 1700 metres in 28:00, training load 25:30.
set PoolLength 25

> Warm Up
400 Freestyle on 6:24

> Main Set
5 x 100 Freestyle on 1:45
2 x {
  50 Backstroke on 1:00
}
100 NumberOne
400 Freestyle on 6:06

> Warm Down
200 Backstroke on 3:15
`);
    });

    it("keeps blank lines, comments, and indentation", () => {
      const source = "# Notes\n\n> Main Set\n2 x {\n    50 Backstroke\n}\n";

      expect(modified(source).split("\n").slice(1).join("\n")).toBe(source);
    });

    it("does not take NumberOne for a time", () => {
      const source = "100 NumberOne\n5 x 100 Freestyle on 1:45\n";

      expect(modified(source)).toContain("100 NumberOne\n5 x 100 Freestyle on 1:45");
    });

    it("fits sets written with compact repetitions", () => {
      const [version] = modifiedProgrammes(
        "> Main Set\n4x100 Freestyle on 2:00\n2x{\n  50 Backstroke\n}\n",
        parameters({ volume: "400" }),
      );

      expect(version?.source.split("\n").slice(1).join("\n")).toBe(
        "> Main Set\n3x100 Freestyle on 1:45\n2x{\n  50 Backstroke\n}\n",
      );
      expect(version?.summary.totalMetres).toBe(400);
      expect(syntaxErrors(version?.source ?? "")).toBe(0);
    });

    it("does not lose the programme to a word in a description", () => {
      const source = '100 Freestyle Kick -- "Focus on pointed toes"\n200 Choice\n';

      expect(modified(source).split("\n").slice(1).join("\n")).toBe(source);
    });

    it("only writes whole, zero padded seconds", () => {
      const source = modified(ORIGINAL_DEFECTS_SESSION, { paces: ["1:07"] });

      expect(source).not.toMatch(/on \d+:\d(\D|$)/m);
      expect(source).not.toMatch(/on \d+:\d+\.\d/);
    });

    it("counts the lines inside a block for every repetition", () => {
      const [version] = modifiedProgrammes("2 x {\n  50 Freestyle\n}\n", parameters());

      expect(version?.summary.totalMetres).toBe(100);
    });

    it("keeps the warm down when a cut is needed", () => {
      expect(sets(modified(EXAMPLE_SESSION, { duration: "30" })).pop()).toBe("75");
    });

    it("extends a programme that falls short", () => {
      const [version] = modifiedProgrammes(
        EXAMPLE_SESSION,
        parameters({ duration: "60" }),
      );

      expect(version?.summary.totalMetres).toBe(3400);
    });
  });

  describe("training load across paces", () => {
    const paces = ["1:10", "1:30", "1:45", "2:15"];

    /** How far the training load varies across the paces, as a fraction. */
    function loadVariation(versions: ReturnType<typeof modifiedProgrammes>): number {
      const loads = versions.map(version => version.summary.loadSeconds);
      return (Math.max(...loads) - Math.min(...loads)) / Math.max(...loads);
    }

    it("stays close when fitted to a duration", () => {
      const versions = modifiedProgrammes(
        EXAMPLE_SESSION,
        parameters({ paces, duration: "45" }),
      );

      expect(versions.map(version => version.summary.totalMetres)).toEqual([
        3175, 2575, 2250, 1775,
      ]);
      expect(loadVariation(versions)).toBeCloseTo(0.072, 3);
    });

    it("varies widely without adjustment", () => {
      expect(
        loadVariation(modifiedProgrammes(EXAMPLE_SESSION, parameters({ paces }))),
      ).toBeCloseTo(0.481, 3);
    });

    it("is not kept equal when fitted to a distance", () => {
      const versions = modifiedProgrammes(
        EXAMPLE_SESSION,
        parameters({ paces, goal: "distance", volume: "1840" }),
      );

      expect(new Set(versions.map(version => version.summary.totalMetres)).size).toBe(1);
      expect(loadVariation(versions)).toBeGreaterThan(0.4);
    });
  });

  describe("what the grammar makes of the output", () => {
    const paces = ["1:10", "1:30", "2:15"];
    const programmes = [
      ["the example session", EXAMPLE_SESSION],
      ["the edge case session", EDGE_CASE_SESSION],
      ["a session with no headers", "400 Freestyle on 7:00\n8 x 50 Choice on 1:00\n"],
      ["a 50 m pool", "set PoolLength 50\n> Main Set\n8 x 100 Freestyle on 1:50\n"],
    ] as const;

    it("is happy with the programmes being fitted", () => {
      for (const [, programme] of programmes) {
        expect(syntaxErrors(programme)).toBe(0);
      }
    });

    it.each(programmes)("is valid for %s", (_name, programme) => {
      for (const fit of ["rescale", "trim"] as const) {
        for (const duration of ["", "5", "12", "20", "30", "60", "120"]) {
          for (const volume of ["", "500", "1000", "2000", "5000"]) {
            for (const version of modifiedProgrammes(
              programme,
              parameters({ paces, fit, duration, volume }),
            )) {
              expect(syntaxErrors(version.source)).toBe(0);
            }
          }
        }
      }
    });

    it("is valid when fitting to a distance", () => {
      for (const [, programme] of programmes) {
        for (const volume of ["700", "1840", "7777"]) {
          for (const version of modifiedProgrammes(
            programme,
            parameters({ paces, goal: "distance", volume }),
          )) {
            expect(syntaxErrors(version.source)).toBe(0);
          }
        }
      }
    });
  });

  describe("the edge case session", () => {
    it("comes through with its descriptions and comments untouched", () => {
      for (const fit of ["rescale", "trim"] as const) {
        const source = modified(EDGE_CASE_SESSION, { fit });

        expect(source).toContain('-- "Focus on pointed toes"');
        expect(source).toContain("5:00 Freestyle # swim on feel");
        expect(source).toContain("# a comment that says on 1:00");
      }
    });

    it("leaves an unbalanced block as it was", () => {
      const programme = "100 Freestyle\n2 x {\n  50 Freestyle on 1:00\n";

      expect(modified(programme).split("\n").slice(1).join("\n")).toBe(programme);
    });

    it("keeps Windows line endings", () => {
      const source = modified("> Main Set\r\n5 x 100 Freestyle on 1:45\r\n", {
        volume: "300",
      });

      expect(source).toContain("3 x 100 Freestyle on 1:45\r\n");
    });
  });

  describe("programmes with no headers", () => {
    const programme = "400 Freestyle on 7:00\n8 x 50 Choice on 1:00\n4 x 100 Choice on 2:00\n";

    it("stays within every duration", () => {
      for (const duration of [10, 15, 20, 25]) {
        const [version] = modifiedProgrammes(
          programme,
          parameters({ duration: String(duration) }),
        );

        expect(version?.summary.totalSeconds).toBeLessThanOrEqual(duration * 60);
      }
    });
  });

  describe("sessions rescaling cannot fit", () => {
    it("shows the miss in the summary rather than failing", () => {
      const programme = "> Main Set\n{\n  400 Freestyle\n}\n";

      expect(modified(programme, { duration: "1" })).toContain("in 6:00 of 1:00,");
    });
  });
});

describe("modifyProgram", () => {
  afterEach(() => {
    vi.mocked(newFile).mockReset();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("saves a file for each pace, named after the pace and the original", () => {
    const setSelectedFile = vi.fn();

    modifyProgram(
      EXAMPLE_SESSION,
      "Tuesday",
      setSelectedFile,
      parameters({ paces: ["1:10", "2:15"], duration: "30" }),
    );

    const [slower, faster] = modifiedProgrammes(
      EXAMPLE_SESSION,
      parameters({ paces: ["1:10", "2:15"], duration: "30" }),
    );

    expect(vi.mocked(newFile).mock.calls).toEqual([
      ["Tuesday", setSelectedFile, "1:10 (Tuesday)", slower?.source],
      ["Tuesday", setSelectedFile, "2:15 (Tuesday)", faster?.source],
    ]);
  });

  it("saves nothing for no paces", () => {
    modifyProgram(EXAMPLE_SESSION, "Tuesday", vi.fn(), parameters({ paces: [] }));

    expect(newFile).not.toHaveBeenCalled();
  });

  it("does not overwrite a file that already exists", async () => {
    const { newFile: realNewFile } = await vi.importActual<
      typeof import("../../src/logic/filePersistence.ts")
    >("../../src/logic/filePersistence.ts");
    const stored = new Map([["1:30 (Tuesday)", "the coach's edits"]]);

    vi.mocked(newFile).mockImplementation(realNewFile);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => stored.set(key, value),
    });
    vi.spyOn(console, "log").mockImplementation(() => undefined);

    const setSelectedFile = vi.fn();
    modifyProgram(EXAMPLE_SESSION, "Tuesday", setSelectedFile, parameters());

    expect(stored.get("1:30 (Tuesday)")).toBe("the coach's edits");
    expect(setSelectedFile).not.toHaveBeenCalled();
  });
});
