import { describe, expect, it } from "vitest";

import { parseProgramme } from "../../src/logic/programmeParsing.ts";
import {
  renderProgramme,
  rewriteHead,
  rewriteOnInterval,
} from "../../src/logic/programmeRewriting.ts";
import type { InstructionElement } from "../../src/logic/programmeTypes.ts";
import { EDGE_CASE_SESSION, EXAMPLE_SESSION, instructionOf } from "./testFixtures.ts";

describe("renderProgramme", () => {
  it.each([
    ["the example session", EXAMPLE_SESSION],
    ["the edge case session", EDGE_CASE_SESSION],
    ["an empty programme", ""],
    ["blank lines", "\n\n\n"],
    ["indentation and trailing spaces", "   # comment   \n  100 Freestyle  "],
    ["Windows line endings", "> Main Set\r\n100 Freestyle on 1:45\r\n"],
    ["unbalanced braces", "2 x {\n  50 Freestyle\n"],
  ])("gives back %s exactly as it was written", (_name, source) => {
    expect(renderProgramme(parseProgramme(source, 25))).toBe(source);
  });
});

describe("rewriteHead", () => {
  it("changes the repetition count", () => {
    const instruction = instructionOf("5 x 100 Freestyle on 1:45");

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe("3 x 100 Freestyle on 1:45");
    expect(instruction.repetitions).toBe(3);
  });

  it("changes a distance", () => {
    const instruction = instructionOf("400 Freestyle on 6:40");

    rewriteHead(instruction, 1, { kind: "distance", metres: 375 });

    expect(instruction.lines[0]).toBe("375 Freestyle on 6:40");
    expect(instruction.length).toEqual({ kind: "distance", metres: 375 });
  });

  it("changes the repetitions and the distance together", () => {
    const instruction = instructionOf("5 x 100 Freestyle");

    rewriteHead(instruction, 4, { kind: "distance", metres: 75 });

    expect(instruction.lines[0]).toBe("4 x 75 Freestyle");
  });

  it("keeps the spacing and indentation it was written with", () => {
    const instruction = instructionOf("    5  x   100   Freestyle   on 1:45");

    rewriteHead(instruction, 3, { kind: "distance", metres: 75 });

    expect(instruction.lines[0]).toBe("    3  x   75   Freestyle   on 1:45");
  });

  it("keeps compact repetitions compact", () => {
    const single = instructionOf("5x100 Freestyle");
    const block = instructionOf("3x{\n  50 Freestyle\n}");

    rewriteHead(single, 3, { kind: "distance", metres: 75 });
    rewriteHead(block, 2, null);

    expect(single.lines[0]).toBe("3x75 Freestyle");
    expect(block.lines[0]).toBe("2x{");
  });

  it("changes the laps, keeping how they were worded", () => {
    const instruction = instructionOf("4 laps Freestyle");

    rewriteHead(instruction, 1, { kind: "laps", laps: 3, metres: 75 });

    expect(instruction.lines[0]).toBe("3 laps Freestyle");
    expect(instruction.length).toEqual({ kind: "laps", laps: 3, metres: 75 });
  });

  it("does not fix the plural of the laps", () => {
    const instruction = instructionOf("1 lap Freestyle");

    rewriteHead(instruction, 1, { kind: "laps", laps: 2, metres: 50 });

    expect(instruction.lines[0]).toBe("2 lap Freestyle");
  });

  it("never adds a repetition count that was not written", () => {
    const instruction = instructionOf("400 Freestyle on 6:40");

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe("400 Freestyle on 6:40");
    expect(instruction.repetitions).toBe(1);
  });

  it("leaves the length alone when given none", () => {
    const instruction = instructionOf("5 x 4 laps Freestyle");

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe("3 x 4 laps Freestyle");
    expect(instruction.length).toEqual({ kind: "laps", laps: 4, metres: 100 });
  });

  it("changes the repetitions of a length written as a time", () => {
    const instruction = instructionOf("3 x 5:00 Freestyle");

    rewriteHead(instruction, 2, null);

    expect(instruction.lines[0]).toBe("2 x 5:00 Freestyle");
  });

  it("does not touch a description repeating the head", () => {
    const instruction = instructionOf('5 x 100 Freestyle -- "5 x 100 hard"');

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe('3 x 100 Freestyle -- "5 x 100 hard"');
  });

  it("changes the repetitions of a block, keeping its brace", () => {
    const instruction = instructionOf("  3 x {\n    50 Freestyle\n  } on 2:00");

    rewriteHead(instruction, 2, null);

    expect(instruction.lines).toEqual(["  2 x {", "    50 Freestyle", "  } on 2:00"]);
    expect(instruction.repetitions).toBe(2);
  });

  it("leaves a block without repetitions alone", () => {
    const instruction = instructionOf("{\n  50 Freestyle\n}");

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe("{");
    expect(instruction.repetitions).toBe(1);
  });

  it("leaves a line it cannot read alone", () => {
    const instruction: InstructionElement = {
      ...instructionOf("5 x 100 Freestyle"),
      lines: ["no head here"],
    };

    rewriteHead(instruction, 3, null);

    expect(instruction.lines[0]).toBe("no head here");
    expect(instruction.repetitions).toBe(5);
  });
});

describe("rewriteOnInterval", () => {
  it("changes only the duration", () => {
    const instruction = instructionOf("5 x 100 Freestyle on 1:45");

    rewriteOnInterval(instruction, "2:30");

    expect(instruction.lines[0]).toBe("5 x 100 Freestyle on 2:30");
  });

  it("keeps whatever follows the interval", () => {
    const instruction = instructionOf('100 Freestyle on 1:45 -- "hold on" # easy');

    rewriteOnInterval(instruction, "2:30");

    expect(instruction.lines[0]).toBe('100 Freestyle on 2:30 -- "hold on" # easy');
  });

  it("skips an interval written inside a description", () => {
    const instruction = instructionOf('100 Freestyle -- "on 9:99" on 1:45');

    rewriteOnInterval(instruction, "2:30");

    expect(instruction.lines[0]).toBe('100 Freestyle -- "on 9:99" on 2:30');
  });

  it("leaves a line with no interval alone", () => {
    for (const line of ["100 Freestyle", "100 Freestyle with 0:10", "100 NumberOne"]) {
      const instruction = instructionOf(line);

      rewriteOnInterval(instruction, "2:30");

      expect(instruction.lines[0]).toBe(line);
    }
  });

  it("does not take an interval from a comment", () => {
    const instruction = instructionOf("100 Freestyle # on 1:45");

    rewriteOnInterval(instruction, "2:30");

    expect(instruction.lines[0]).toBe("100 Freestyle # on 1:45");
  });

  it("rewrites a block's closing line by default", () => {
    const instruction = instructionOf("2 x {\n  50 Freestyle on 1:00\n} on 3:00");

    rewriteOnInterval(instruction, "2:30");

    expect(instruction.lines).toEqual(["2 x {", "  50 Freestyle on 1:00", "} on 2:30"]);
  });

  it("rewrites a line inside a block when told which", () => {
    const instruction = instructionOf("2 x {\n  50 Freestyle on 1:00\n} on 3:00");

    rewriteOnInterval(instruction, "0:50", 1);

    expect(instruction.lines).toEqual(["2 x {", "  50 Freestyle on 0:50", "} on 3:00"]);
  });

  it("does nothing for a line that does not exist", () => {
    const instruction = instructionOf("100 Freestyle on 1:45");

    rewriteOnInterval(instruction, "2:30", 5);

    expect(instruction.lines).toEqual(["100 Freestyle on 1:45"]);
  });
});
