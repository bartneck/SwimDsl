import { describe, expect, it } from "vitest";

import {
  budgetFor,
  growUnit,
  isScaffold,
  resizeUnit,
  shrinkUnit,
  smallestStepUp,
  type ResizeContext,
} from "../../src/logic/setResizing.ts";
import { unitOf } from "./testFixtures.ts";

const BLOCK = "3 x {\n  50 Freestyle\n  50 Backstroke\n}";

/** A fit in a 25 m pool, with plenty of the warm up and warm down to spare. */
function context(scaffoldBudget = 1000): ResizeContext {
  return { poolLength: 25, scaffoldBudget };
}

describe("isScaffold", () => {
  it.each([
    ["> Warm Up", true],
    ["> Warm Down", true],
    ["> Main Set", false],
    ["> Drills", false],
  ])("under %j is %s", (header, expected) => {
    expect(isScaffold(unitOf(`${header}\n100 Freestyle`))).toBe(expected);
  });
});

describe("budgetFor", () => {
  it("is what is left of the budget for the warm up and warm down", () => {
    expect(budgetFor(context(250), unitOf("> Warm Up\n100 Freestyle"))).toBe(250);
  });

  it("does not limit any other set", () => {
    expect(budgetFor(context(250), unitOf("> Main Set\n100 Freestyle"))).toBe(Infinity);
  });
});

describe("resizeUnit", () => {
  it("changes the repetitions", () => {
    const unit = unitOf("5 x 100 Freestyle on 1:45");

    resizeUnit(unit, 3, 100, 25);

    expect(unit.instruction.lines[0]).toBe("3 x 100 Freestyle on 1:45");
  });

  it("changes the distance of each repetition", () => {
    const unit = unitOf("5 x 100 Freestyle");

    resizeUnit(unit, 5, 75, 25);

    expect(unit.instruction.lines[0]).toBe("5 x 75 Freestyle");
    expect(unit.perRepetitionMetres).toBe(75);
  });

  it("writes laps as laps", () => {
    const unit = unitOf("4 laps Freestyle");

    resizeUnit(unit, 1, 75, 25);

    expect(unit.instruction.lines[0]).toBe("3 laps Freestyle");
    expect(unit.instruction.length).toEqual({ kind: "laps", laps: 3, metres: 75 });
  });

  it("only changes the repetitions of a block", () => {
    const unit = unitOf(BLOCK);

    resizeUnit(unit, 2, 100, 25);

    expect(unit.instruction.lines[0]).toBe("2 x {");
  });

  it("only changes the repetitions of a length written as a time", () => {
    const unit = unitOf("3 x 5:00 Freestyle");

    resizeUnit(unit, 2, 0, 25);

    expect(unit.instruction.lines[0]).toBe("2 x 5:00 Freestyle");
  });
});

describe("shrinkUnit", () => {
  it("drops as many whole repetitions as the allowance covers", () => {
    const unit = unitOf("> Main Set\n5 x 100 Freestyle on 1:45");
    const fit = context();

    expect(shrinkUnit(fit, unit, 250, false)).toBe(200);

    expect(unit.instruction.lines[0]).toBe("3 x 100 Freestyle on 1:45");
    expect(unit.changedMetres).toBe(200);
  });

  it("prefers dropping a repetition to shortening each one", () => {
    const unit = unitOf("4 x 100 Freestyle");

    expect(shrinkUnit(context(), unit, 150, false)).toBe(100);

    expect(unit.instruction.lines[0]).toBe("3 x 100 Freestyle");
  });

  it("never goes below one repetition", () => {
    const unit = unitOf("3 x 100 Freestyle");

    expect(shrinkUnit(context(), unit, 1000, false)).toBe(200);

    expect(unit.instruction.lines[0]).toBe("1 x 100 Freestyle");
  });

  it("shortens a set swum once by whole pool lengths", () => {
    const unit = unitOf("400 Freestyle");

    expect(shrinkUnit(context(), unit, 110, false)).toBe(100);

    expect(unit.instruction.lines[0]).toBe("300 Freestyle");
  });

  it("shortens each repetition of a set at one repetition", () => {
    const unit = unitOf("1 x 100 Freestyle");

    expect(shrinkUnit(context(), unit, 50, false)).toBe(50);

    expect(unit.instruction.lines[0]).toBe("1 x 50 Freestyle");
  });

  it("shortens laps by whole laps", () => {
    const unit = unitOf("4 laps Freestyle");

    expect(shrinkUnit(context(), unit, 50, false)).toBe(50);

    expect(unit.instruction.lines[0]).toBe("2 laps Freestyle");
  });

  it("never goes below one length of the pool", () => {
    const unit = unitOf("50 Freestyle");

    expect(shrinkUnit(context(), unit, 1000, false)).toBe(25);
    expect(shrinkUnit(context(), unit, 1000, true)).toBe(0);

    expect(unit.instruction.lines[0]).toBe("25 Freestyle");
  });

  it("drops whole repetitions of a block", () => {
    const unit = unitOf(BLOCK);

    expect(shrinkUnit(context(), unit, 200, false)).toBe(200);

    expect(unit.instruction.lines[0]).toBe("1 x {");
  });

  it.each([
    ["a block with no repetitions", "{\n  50 Freestyle\n}"],
    ["a block at one repetition", "1 x {\n  50 Freestyle\n}"],
    ["a length written as a time", "5:00 Freestyle"],
    ["repetitions of a length written as a time", "3 x 5:00 Freestyle"],
  ])("cannot shrink %s", (_name, source) => {
    expect(shrinkUnit(context(), unitOf(source), 1000, true)).toBe(0);
  });

  it("takes nothing when the allowance is too small for a step", () => {
    const unit = unitOf("5 x 100 Freestyle");

    expect(shrinkUnit(context(), unit, 10, false)).toBe(0);

    expect(unit.instruction.lines[0]).toBe("5 x 100 Freestyle");
  });

  it("takes nothing when there is no allowance", () => {
    expect(shrinkUnit(context(), unitOf("5 x 100 Freestyle"), 0, false)).toBe(0);
  });

  describe("overshooting", () => {
    it("takes a single step that goes past the allowance", () => {
      const unit = unitOf("400 Freestyle");

      expect(shrinkUnit(context(), unit, 10, true)).toBe(25);

      expect(unit.instruction.lines[0]).toBe("375 Freestyle");
    });

    it("takes the step that fits over the step that overshoots", () => {
      const unit = unitOf("2 x 100 Freestyle");

      // A repetition would overshoot by 40, and a length fits.
      expect(shrinkUnit(context(), unit, 60, true)).toBe(50);

      expect(unit.instruction.lines[0]).toBe("2 x 75 Freestyle");
    });

    it("takes the smaller step when both overshoot", () => {
      const shorter = unitOf("2 x 100 Freestyle");
      const fewer = unitOf("3 x 50 Freestyle");

      expect(shrinkUnit(context(), shorter, 30, true)).toBe(50);
      expect(shrinkUnit(context(), fewer, 10, true)).toBe(50);

      expect(shorter.instruction.lines[0]).toBe("2 x 75 Freestyle");
      expect(fewer.instruction.lines[0]).toBe("2 x 50 Freestyle");
    });

    it("drops a repetition when both steps overshoot by the same", () => {
      const unit = unitOf("2 x 50 Freestyle");

      expect(shrinkUnit(context(), unit, 10, true)).toBe(50);

      expect(unit.instruction.lines[0]).toBe("1 x 50 Freestyle");
    });

    it.each([
      ["a block", BLOCK, 100, "2 x {"],
      ["repetitions of one pool length", "8 x 25 Freestyle", 25, "7 x 25 Freestyle"],
    ])("drops a repetition of %s, which cannot be shortened", (_name, source, metres, head) => {
      const unit = unitOf(source);

      expect(shrinkUnit(context(), unit, 10, true)).toBe(metres);

      expect(unit.instruction.lines[0]).toBe(head);
    });

    it("still takes nothing from them without overshooting", () => {
      expect(shrinkUnit(context(), unitOf("8 x 25 Freestyle"), 10, false)).toBe(0);
    });
  });

  describe("the warm up and warm down budget", () => {
    it("is spent by the warm up", () => {
      const fit = context(1000);

      shrinkUnit(fit, unitOf("> Warm Up\n5 x 100 Freestyle"), 200, false);

      expect(fit.scaffoldBudget).toBe(800);
    });

    it("is spent by the warm down", () => {
      const fit = context(1000);

      shrinkUnit(fit, unitOf("> Warm Down\n5 x 100 Freestyle"), 200, false);

      expect(fit.scaffoldBudget).toBe(800);
    });

    it("is not spent by any other set", () => {
      const fit = context(1000);

      shrinkUnit(fit, unitOf("> Main Set\n5 x 100 Freestyle"), 200, false);

      expect(fit.scaffoldBudget).toBe(1000);
    });

    it("caps what can be taken", () => {
      const fit = context(150);
      const unit = unitOf("> Warm Up\n5 x 100 Freestyle");

      expect(shrinkUnit(fit, unit, 1000, false)).toBe(100);

      expect(fit.scaffoldBudget).toBe(50);
    });

    it("stops the set shrinking once it has run out, overshoot or not", () => {
      const unit = unitOf("> Warm Up\n5 x 100 Freestyle");

      expect(shrinkUnit(context(0), unit, 1000, true)).toBe(0);
    });
  });
});

describe("growUnit", () => {
  it("adds as many whole repetitions as the allowance covers", () => {
    const unit = unitOf("5 x 100 Freestyle on 1:45");

    expect(growUnit(context(), unit, 350)).toBe(300);

    expect(unit.instruction.lines[0]).toBe("8 x 100 Freestyle on 1:45");
    expect(unit.changedMetres).toBe(300);
  });

  it("adds a repetition rather than lengthening each one", () => {
    const unit = unitOf("2 x 100 Freestyle");

    expect(growUnit(context(), unit, 150)).toBe(100);

    expect(unit.instruction.lines[0]).toBe("3 x 100 Freestyle");
  });

  it("lengthens each repetition when a repetition does not fit", () => {
    const unit = unitOf("2 x 100 Freestyle");

    expect(growUnit(context(), unit, 60)).toBe(50);

    expect(unit.instruction.lines[0]).toBe("2 x 125 Freestyle");
  });

  it("lengthens a set swum once, since it has no repetitions to add to", () => {
    const unit = unitOf("400 Freestyle");

    expect(growUnit(context(), unit, 60)).toBe(50);

    expect(unit.instruction.lines[0]).toBe("450 Freestyle");
  });

  it("lengthens laps by whole laps", () => {
    const unit = unitOf("4 laps Freestyle");

    expect(growUnit(context(), unit, 50)).toBe(50);

    expect(unit.instruction.lines[0]).toBe("6 laps Freestyle");
  });

  it("adds repetitions to a block", () => {
    const unit = unitOf(BLOCK);

    expect(growUnit(context(), unit, 250)).toBe(200);

    expect(unit.instruction.lines[0]).toBe("5 x {");
  });

  it("never goes past what was asked for", () => {
    const unit = unitOf("5 x 100 Freestyle");

    expect(growUnit(context(), unit, 99)).toBe(0);

    expect(unit.instruction.lines[0]).toBe("5 x 100 Freestyle");
  });

  it.each([
    ["a block with no repetitions", "{\n  50 Freestyle\n}"],
    ["a length written as a time", "5:00 Freestyle"],
    ["repetitions of a length written as a time", "3 x 5:00 Freestyle"],
  ])("cannot grow %s", (_name, source) => {
    expect(growUnit(context(), unitOf(source), 1000)).toBe(0);
  });

  it.each([[0], [-50]])("adds nothing given an allowance of %i", allowance => {
    expect(growUnit(context(), unitOf("5 x 100 Freestyle"), allowance)).toBe(0);
  });

  it("spends the warm up and warm down budget", () => {
    const fit = context(120);
    const unit = unitOf("> Warm Up\n8 x 50 Freestyle");

    expect(growUnit(fit, unit, 1000)).toBe(100);

    expect(unit.instruction.lines[0]).toBe("10 x 50 Freestyle");
    expect(fit.scaffoldBudget).toBe(20);
  });

  it("stops the warm up growing once the budget has run out", () => {
    expect(growUnit(context(0), unitOf("> Warm Up\n8 x 50 Freestyle"), 1000)).toBe(0);
  });

  it("does not limit any other set by the budget", () => {
    const fit = context(0);

    expect(growUnit(fit, unitOf("> Main Set\n8 x 50 Freestyle"), 100)).toBe(100);

    expect(fit.scaffoldBudget).toBe(0);
  });
});

describe("smallestStepUp", () => {
  it("is a repetition when that adds less than a length on each", () => {
    const unit = unitOf("6 x 100 Freestyle");

    expect(smallestStepUp(unit, 25)).toEqual({
      unit,
      metres: 100,
      repetitions: 7,
      perRepetitionMetres: 100,
    });
  });

  it("is a length on each repetition when that adds less", () => {
    const unit = unitOf("2 x 100 Freestyle");

    expect(smallestStepUp(unit, 25)).toEqual({
      unit,
      metres: 50,
      repetitions: 2,
      perRepetitionMetres: 125,
    });
  });

  it("is a repetition when the two are the same size", () => {
    expect(smallestStepUp(unitOf("4 x 100 Freestyle"), 25)).toMatchObject({
      metres: 100,
      repetitions: 5,
    });
  });

  it("is one length for a set swum once", () => {
    expect(smallestStepUp(unitOf("400 Freestyle"), 25)).toMatchObject({
      metres: 25,
      repetitions: 1,
      perRepetitionMetres: 425,
    });
  });

  it("follows the pool length", () => {
    expect(smallestStepUp(unitOf("400 Freestyle"), 50)).toMatchObject({ metres: 50 });
  });

  it("is a repetition for a block", () => {
    expect(smallestStepUp(unitOf(BLOCK), 25)).toMatchObject({
      metres: 100,
      repetitions: 4,
    });
  });

  it.each([
    ["a block with no repetitions", "{\n  50 Freestyle\n}"],
    ["a length written as a time", "5:00 Freestyle"],
  ])("does not exist for %s", (_name, source) => {
    expect(smallestStepUp(unitOf(source), 25)).toBeNull();
  });
});
