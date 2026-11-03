import { describe, expect, it } from "vitest";

import {
  getPoolLength,
  lengthFixedSeconds,
  lengthMetres,
  maskLine,
  parseProgramme,
  restDurationPattern,
} from "../../src/logic/programmeParsing.ts";
import { instructionOf } from "./testFixtures.ts";

describe("maskLine", () => {
  it("leaves a line with nothing to hide alone", () => {
    const line = "5 x 100 Freestyle on 1:45";
    expect(maskLine(line)).toBe(line);
  });

  it("blanks a description, keeping its quotes", () => {
    expect(maskLine('100 Freestyle -- "on feel"')).toBe(
      '100 Freestyle -- "       "',
    );
  });

  it("blanks a trailing comment", () => {
    expect(maskLine("100 Freestyle # on 1:00")).toBe(
      "100 Freestyle          ",
    );
  });

  it.each([
    ['100 Freestyle -- "on feel" on 1:30'],
    ['100 Freestyle -- "say \\"on 1:00\\" twice" on 1:30'],
    ['100 Freestyle -- "never closed on 1:00'],
    ["100 Freestyle # on 1:00"],
    ['100 Freestyle # a "quoted" comment'],
  ])("keeps the length of %j", line => {
    expect(maskLine(line)).toHaveLength(line.length);
  });

  it("does not take a # inside a description for a comment", () => {
    expect(maskLine('100 Freestyle -- "lane #1" on 1:30')).toBe(
      '100 Freestyle -- "       " on 1:30',
    );
  });

  it("does not stop at an escaped quote", () => {
    expect(maskLine('100 Freestyle -- "a \\" on 1:00" on 1:30')).toMatch(
      /^100 Freestyle -- " +" on 1:30$/,
    );
  });

  it("blanks an unterminated description to the end of the line", () => {
    expect(maskLine('100 Freestyle -- "never closed')).toMatch(
      /^100 Freestyle -- " +$/,
    );
  });
});

describe("restDurationPattern", () => {
  it("captures the duration after the keyword", () => {
    expect(restDurationPattern("on").exec("100 Freestyle on 1:45")?.[1]).toBe("1:45");
    expect(restDurationPattern("with").exec("100 Freestyle with 0:10")?.[1]).toBe("0:10");
  });

  it("only matches the keyword as a word of its own", () => {
    expect(restDurationPattern("on").exec("100 Freestyle Ron 1:45")).toBeNull();
  });

  it("needs a duration after the keyword", () => {
    expect(restDurationPattern("on").exec("100 Freestyle on feel")).toBeNull();
  });
});

describe("getPoolLength", () => {
  it("reads the pool length a programme sets", () => {
    expect(getPoolLength("set PoolLength 50\n100 Freestyle")).toBe(50);
  });

  it("finds it anywhere in the programme, indented or not", () => {
    expect(getPoolLength("# Notes\n\n  set PoolLength 33")).toBe(33);
  });

  it("defaults to 25", () => {
    expect(getPoolLength("100 Freestyle")).toBe(25);
    expect(getPoolLength("")).toBe(25);
  });

  it("ignores a commented out setting", () => {
    expect(getPoolLength("# set PoolLength 50")).toBe(25);
  });

  it("ignores a pool with no length", () => {
    expect(getPoolLength("set PoolLength 0\nset PoolLength 50")).toBe(50);
    expect(getPoolLength("set PoolLength 0")).toBe(25);
  });
});

describe("parseProgramme", () => {
  describe("lines carried through untouched", () => {
    it.each([
      ["a comment", "# build on feel"],
      ["a blank line", ""],
      ["a setting", "set PoolLength 25"],
      ["a pace", "pace max = 90%"],
      ["an unrecognised line", "something else entirely"],
      ["a length with nothing after it", "100"],
    ])("keeps %s verbatim", (_name, line) => {
      expect(parseProgramme(line, 25)).toEqual([{ kind: "verbatim", lines: [line] }]);
    });

    it("gives each line an element of its own, in order", () => {
      const elements = parseProgramme("# one\n\n> Main Set\n100 Freestyle", 25);
      expect(elements.map(element => element.kind)).toEqual([
        "verbatim",
        "verbatim",
        "header",
        "instruction",
      ]);
    });
  });

  describe("sections", () => {
    it.each([
      ["> Warm Up", "warmUp"],
      ["> warmup", "warmUp"],
      ["> WARM-UP", "warmUp"],
      ["> Warm Down", "warmDown"],
      ["> Warmdown", "warmDown"],
      ["> Cool Down", "warmDown"],
      ["> cool-down", "warmDown"],
      ["> Swim Down", "warmDown"],
      ["> Main Set", "mainSet"],
      ["> main", "mainSet"],
      ["> Drills", "other"],
      ["> Pre Set", "other"],
      ["  > Warm Up", "warmUp"],
    ])("classifies %j as %s", (header, section) => {
      expect(parseProgramme(header, 25)).toEqual([
        { kind: "header", lines: [header], section },
      ]);
    });

    it("does not read the section from a header's comment", () => {
      expect(parseProgramme("> Drills # before the main set", 25)[0]).toMatchObject({
        section: "other",
      });
    });

    it("gives an instruction the section of the header above it", () => {
      expect(instructionOf("> Main Set\n100 Freestyle").section).toBe("mainSet");
    });

    it("counts instructions before the first header as other", () => {
      expect(instructionOf("100 Freestyle\n> Main Set").section).toBe("other");
    });

    it("moves on to the next section at the next header", () => {
      const elements = parseProgramme(
        "> Warm Up\n100 Freestyle\n> Main Set\n200 Freestyle",
        25,
      );
      expect(elements[3]).toMatchObject({ section: "mainSet" });
    });
  });

  describe("single instructions", () => {
    it("reads a distance", () => {
      expect(instructionOf("400 Freestyle")).toMatchObject({
        kind: "instruction",
        lines: ["400 Freestyle"],
        repetitions: 1,
        hasRepetitionOperator: false,
        length: { kind: "distance", metres: 400 },
        rest: { kind: "none" },
        inner: [],
      });
    });

    it("reads repetitions", () => {
      expect(instructionOf("5 x 100 Freestyle")).toMatchObject({
        repetitions: 5,
        hasRepetitionOperator: true,
        length: { kind: "distance", metres: 100 },
      });
    });

    it("remembers that a repetition count was written, even a count of one", () => {
      expect(instructionOf("1 x 100 Freestyle")).toMatchObject({
        repetitions: 1,
        hasRepetitionOperator: true,
      });
    });

    it("reads a repetition count of zero as one", () => {
      expect(instructionOf("0 x 100 Freestyle").repetitions).toBe(1);
    });

    it.each([
      ["5 x 100 Freestyle"],
      ["5  x  100 Freestyle"],
      ["5x 100 Freestyle"],
      ["  5 x 100 Freestyle"],
    ])("allows the spacing of %j", line => {
      expect(instructionOf(line)).toMatchObject({
        repetitions: 5,
        length: { kind: "distance", metres: 100 },
      });
    });

    // The grammar reads each of these as repetitions. These were once left
    // verbatim, counting for nothing, or read as a 4 m swim.
    it.each([["4x100 Freestyle"], ["4 x100 Freestyle"], ["4x 100 Freestyle"]])(
      "reads the compact repetitions of %j",
      line => {
        expect(instructionOf(line)).toMatchObject({
          repetitions: 4,
          length: { kind: "distance", metres: 100 },
        });
      },
    );

    it("reads laps, using the pool length", () => {
      expect(instructionOf("4 laps Freestyle", 50).length).toEqual({
        kind: "laps",
        laps: 4,
        metres: 200,
      });
    });

    it("reads a single lap", () => {
      expect(instructionOf("1 lap Freestyle").length).toEqual({
        kind: "laps",
        laps: 1,
        metres: 25,
      });
    });

    it("reads a length written as a time", () => {
      expect(instructionOf("5:00 Freestyle").length).toEqual({
        kind: "time",
        seconds: 300,
      });
    });

    it("reads repetitions of a length written as a time", () => {
      expect(instructionOf("3 x 1:30 Freestyle")).toMatchObject({
        repetitions: 3,
        length: { kind: "time", seconds: 90 },
      });
    });
  });

  describe("rest", () => {
    it.each([
      ["100 Freestyle on 1:45", { kind: "sinceStart", seconds: 105 }],
      ["100 Freestyle with 0:10", { kind: "afterStop", seconds: 10 }],
      ["100 Freestyle in-out 3", { kind: "inOut", swimmers: 3 }],
      ["100 Freestyle", { kind: "none" }],
    ])("reads %j", (line, rest) => {
      expect(instructionOf(line).rest).toEqual(rest);
    });

    it("does not mistake NumberOne for a rest", () => {
      expect(instructionOf("100 NumberOne").rest).toEqual({ kind: "none" });
    });

    it("does not look for a rest inside a description", () => {
      expect(
        instructionOf('100 Freestyle Kick -- "Focus on pointed toes"').rest,
      ).toEqual({ kind: "none" });
      expect(instructionOf('100 Freestyle -- "on 1:00"').rest).toEqual({
        kind: "none",
      });
    });

    it("does not look for a rest inside a comment", () => {
      expect(instructionOf("100 Freestyle # on 1:00").rest).toEqual({ kind: "none" });
    });

    it("finds a rest written after a description", () => {
      expect(instructionOf('100 Freestyle -- "on feel" on 1:45').rest).toEqual({
        kind: "sinceStart",
        seconds: 105,
      });
    });
  });

  describe("blocks", () => {
    const nested = `3 x {
  100 Freestyle on 1:50

  # a comment inside the block
  2 x {
    50 Butterfly with 0:10
    4 x 25 Choice
  }
  5:00 Backstroke
} on 7:00`;

    it("gathers a block into one element, keeping its lines", () => {
      const elements = parseProgramme("2 x {\n  50 Freestyle\n}\n100 Freestyle", 25);

      expect(elements).toHaveLength(2);
      expect(elements[0]?.lines).toEqual(["2 x {", "  50 Freestyle", "}"]);
    });

    it("reads the repetitions of the block", () => {
      expect(instructionOf("2 x {\n  50 Freestyle\n}")).toMatchObject({
        repetitions: 2,
        hasRepetitionOperator: true,
      });
    });

    it("reads a block with no repetitions", () => {
      expect(instructionOf("{\n  50 Freestyle\n}")).toMatchObject({
        repetitions: 1,
        hasRepetitionOperator: false,
      });
    });

    it("records each inner line against its position in the block", () => {
      const { inner } = instructionOf(nested);
      expect(inner.map(line => line.lineIndex)).toEqual([1, 5, 6, 8]);
    });

    it("multiplies an inner line by the blocks nested around it", () => {
      const { inner } = instructionOf(nested);
      expect(inner.map(line => [line.multiplier, line.repetitions])).toEqual([
        [1, 1],
        [2, 1],
        [2, 4],
        [1, 1],
      ]);
    });

    it("multiplies through every level of nesting", () => {
      const block = instructionOf(`2 x {
  3 x {
    4 x {
      50 Freestyle
    }
  }
}`);

      expect(block.inner[0]?.multiplier).toBe(12);
      expect(block.length).toMatchObject({ metres: 600 });
    });

    it("adds up one pass through the block", () => {
      expect(instructionOf(nested).length).toEqual({
        kind: "block",
        // 100 + 2 × (50 + 4 × 25), and a time counts for no distance.
        metres: 400,
        fixedSeconds: 300,
      });
    });

    it("reads the rest of each inner line", () => {
      expect(instructionOf(nested).inner.map(line => line.rest)).toEqual([
        { kind: "sinceStart", seconds: 110 },
        { kind: "afterStop", seconds: 10 },
        { kind: "none" },
        { kind: "none" },
      ]);
    });

    it("reads the block's own rest from its closing line", () => {
      expect(instructionOf(nested).rest).toEqual({ kind: "sinceStart", seconds: 420 });
    });

    it("gives a block the section it sits in", () => {
      expect(instructionOf("> Main Set\n2 x {\n  50 Freestyle\n}").section).toBe(
        "mainSet",
      );
    });

    it("does not count a brace inside a description", () => {
      const elements = parseProgramme(
        '2 x {\n  50 Freestyle -- "a } brace"\n}\n100 Freestyle',
        25,
      );

      expect(elements).toHaveLength(2);
      expect(elements[0]?.lines).toHaveLength(3);
    });

    it("leaves a block with unbalanced braces, and all that follows, verbatim", () => {
      const source = "100 Freestyle\n2 x {\n  50 Freestyle\n200 Freestyle";
      const elements = parseProgramme(source, 25);

      expect(elements).toHaveLength(2);
      expect(elements[1]).toEqual({
        kind: "verbatim",
        lines: ["2 x {", "  50 Freestyle", "200 Freestyle"],
      });
    });

    describe("written on one line", () => {
      it("reads the instruction between the braces", () => {
        expect(instructionOf("2 x { 50 Freestyle on 1:00 }")).toMatchObject({
          repetitions: 2,
          length: { kind: "block", metres: 50 },
          rest: { kind: "none" },
          inner: [
            {
              lineIndex: 0,
              multiplier: 1,
              repetitions: 1,
              metres: 50,
              rest: { kind: "sinceStart", seconds: 60 },
            },
          ],
        });
      });

      it("reads the block's own rest from after the closing brace", () => {
        expect(instructionOf("2 x { 50 Freestyle on 1:00 } on 2:30")).toMatchObject({
          rest: { kind: "sinceStart", seconds: 150 },
          inner: [{ rest: { kind: "sinceStart", seconds: 60 } }],
        });
      });

      it("does not give the instruction inside the block's own rest", () => {
        expect(instructionOf("2 x { 50 Freestyle } on 2:00")).toMatchObject({
          rest: { kind: "sinceStart", seconds: 120 },
          inner: [{ rest: { kind: "none" } }],
        });
      });

      it("does not take a brace in a description after the block for its end", () => {
        expect(instructionOf('2 x { 50 Freestyle } on 2:00 -- "end }"')).toMatchObject({
          rest: { kind: "sinceStart", seconds: 120 },
        });
        expect(
          instructionOf('2 x {\n  50 Freestyle\n} on 2:00 -- "end }"').rest,
        ).toEqual({ kind: "sinceStart", seconds: 120 });
      });

      it("reads repetitions inside the braces", () => {
        expect(instructionOf("2 x { 4 x 25 Butterfly }")).toMatchObject({
          length: { kind: "block", metres: 100 },
          inner: [{ repetitions: 4, metres: 25 }],
        });
      });

      it("reads blocks nested on the one line", () => {
        expect(instructionOf("2 x { 3 x { 25 Freestyle } }")).toMatchObject({
          length: { kind: "block", metres: 75 },
          inner: [{ multiplier: 3, metres: 25 }],
        });
      });

      it("does not take a brace inside a description for the end of the block", () => {
        expect(instructionOf('2 x { 50 Freestyle -- "}" on 1:00 }')).toMatchObject({
          inner: [{ rest: { kind: "sinceStart", seconds: 60 } }],
        });
      });

      // The grammar allows any number of instructions on a line, but the
      // modifier reads a line as one instruction at most, and only the first
      // of these is read.
      it.fails("reads every instruction on the line", () => {
        expect(instructionOf("2 x { 50 Freestyle 50 Backstroke }")).toMatchObject({
          length: { kind: "block", metres: 100 },
        });
      });
    });

    describe("with instructions on the lines of its braces", () => {
      it("reads an instruction after the opening brace", () => {
        expect(instructionOf("2 x { 50 Freestyle\n  50 Backstroke\n}")).toMatchObject({
          length: { kind: "block", metres: 100 },
          inner: [{ lineIndex: 0 }, { lineIndex: 1 }],
        });
      });

      it("reads an instruction before the closing brace, keeping their rests apart", () => {
        expect(
          instructionOf("2 x {\n  50 Freestyle\n  50 Backstroke on 1:00 } on 3:00"),
        ).toMatchObject({
          length: { kind: "block", metres: 100 },
          rest: { kind: "sinceStart", seconds: 180 },
          inner: [
            { lineIndex: 1, rest: { kind: "none" } },
            { lineIndex: 2, rest: { kind: "sinceStart", seconds: 60 } },
          ],
        });
      });

      it("closes a nested block where its brace ends a line", () => {
        const block = instructionOf(`2 x {
  3 x {
    25 Freestyle }
  50 Backstroke
}`);

        expect(block.inner.map(line => line.multiplier)).toEqual([3, 1]);
        expect(block.length).toMatchObject({ metres: 125 });
      });

      it("closes every nested block whose brace ends a line", () => {
        const block = instructionOf(`2 x {
  3 x {
    4 x {
      25 Freestyle } }
  50 Backstroke
}`);

        expect(block.inner.map(line => line.multiplier)).toEqual([12, 1]);
      });

      it("opens a nested block written on one line within the block", () => {
        const block = instructionOf(`2 x {
  2 x { 50 Butterfly on 1:00 }
  100 Freestyle
}`);

        expect(block.inner.map(line => [line.lineIndex, line.multiplier])).toEqual([
          [1, 2],
          [2, 1],
        ]);
        expect(block.length).toMatchObject({ metres: 200 });
      });
    });

    it.each([["2x{\n  50 Freestyle\n}"], ["2 x{\n  50 Freestyle\n}"]])(
      "reads the compact block of %j",
      source => {
        expect(instructionOf(source)).toMatchObject({
          repetitions: 2,
          length: { kind: "block", metres: 50 },
        });
      },
    );
  });
});

describe("lengthMetres", () => {
  it("is the distance of a distance, laps, or block length", () => {
    expect(lengthMetres({ kind: "distance", metres: 100 })).toBe(100);
    expect(lengthMetres({ kind: "laps", laps: 4, metres: 100 })).toBe(100);
    expect(lengthMetres({ kind: "block", metres: 100, fixedSeconds: 30 })).toBe(100);
  });

  it("counts a length written as a time for nothing", () => {
    expect(lengthMetres({ kind: "time", seconds: 300 })).toBe(0);
  });
});

describe("lengthFixedSeconds", () => {
  it("is the time of a length written as a time", () => {
    expect(lengthFixedSeconds({ kind: "time", seconds: 300 })).toBe(300);
  });

  it("is the timed part of a block", () => {
    expect(lengthFixedSeconds({ kind: "block", metres: 100, fixedSeconds: 30 })).toBe(30);
  });

  it("is nothing for a length written as a distance", () => {
    expect(lengthFixedSeconds({ kind: "distance", metres: 100 })).toBe(0);
    expect(lengthFixedSeconds({ kind: "laps", laps: 4, metres: 100 })).toBe(0);
  });
});
