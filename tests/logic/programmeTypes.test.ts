/**
 * programmeTypes.ts holds types alone, so there is nothing in it to run. These
 * assertions do nothing at runtime: they are checked by `tsc`, which covers
 * this file through tsconfig.app.json.
 */

import { describe, expectTypeOf, it } from "vitest";

import type {
  FitGoal,
  FitMethod,
  InstructionLength,
  InstructionRest,
  ProgrammeElement,
  SectionKind,
  SessionTargets,
} from "../../src/logic/programmeTypes.ts";

describe("programmeTypes", () => {
  it("names the options the rest of the modifier switches on", () => {
    expectTypeOf<FitGoal>().toEqualTypeOf<"duration" | "distance">();
    expectTypeOf<FitMethod>().toEqualTypeOf<"rescale" | "trim">();
    expectTypeOf<SectionKind>().toEqualTypeOf<
      "warmUp" | "mainSet" | "warmDown" | "other"
    >();
  });

  it("tells the kinds of length, rest, and element apart", () => {
    expectTypeOf<InstructionLength["kind"]>().toEqualTypeOf<
      "distance" | "laps" | "time" | "block"
    >();
    expectTypeOf<InstructionRest["kind"]>().toEqualTypeOf<
      "sinceStart" | "afterStop" | "inOut" | "none"
    >();
    expectTypeOf<ProgrammeElement["kind"]>().toEqualTypeOf<
      "verbatim" | "header" | "instruction"
    >();
  });

  it("carries the distance on every length a distance can be read from", () => {
    expectTypeOf<
      Extract<InstructionLength, { kind: "distance" | "laps" | "block" }>["metres"]
    >().toEqualTypeOf<number>();
  });

  it("requires a goal, and leaves either target open with null", () => {
    expectTypeOf<SessionTargets>().toEqualTypeOf<{
      goal: FitGoal;
      durationSeconds: number | null;
      volumeMetres: number | null;
    }>();
  });
});
