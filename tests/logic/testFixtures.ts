/**
 * Programmes and helpers shared by the unit tests of the programme modifier.
 * Nothing in the application imports this file.
 */

import { swimdslLanguage } from "codemirror-lang-swimdsl";

import { measureIntervalRatios } from "../../src/logic/intervalRatios.ts";
import { fitProgramme, type FittedProgramme } from "../../src/logic/programmeAdjustment.ts";
import {
  getPoolLength,
  lengthFixedSeconds,
  lengthMetres,
  parseProgramme,
} from "../../src/logic/programmeParsing.ts";
import type { AdjustableUnit } from "../../src/logic/programmeTiming.ts";
import type {
  FitMethod,
  InstructionElement,
  ProgrammeElement,
  SectionKind,
  SessionTargets,
} from "../../src/logic/programmeTypes.ts";
import { timeToSeconds } from "../../src/logic/swimTime.ts";

/** The session the worked examples in docs/programme-adjustment.md use. */
export const EXAMPLE_SESSION = `set PoolLength 25

> Warm Up
400 Freestyle on 7:00
8 x 50 Choice on 1:00 -- "build on feel"

> Main Set
5 x 100 Freestyle on 1:45
4 x 50 Butterfly on 1:00
400 Freestyle on 6:40

> Warm Down
200 Backstroke on 4:00
`;

/** Every kind of line the modifier has to cope with, in a single programme. */
export const EDGE_CASE_SESSION = `set PoolLength 25
# a comment that says on 1:00

> Warm Up
2 laps Freestyle with 0:10
100 Freestyle Kick -- "Focus on pointed toes"
5:00 Freestyle # swim on feel

> Drills
4 x 50 Choice in-out 2 -- "on feel"
2 x { 25 Butterfly on 0:40 } on 1:30

> Main Set
2 x {
  3 x 100 Freestyle on 1:50
  2 x {
    50 Butterfly on 1:00
  }
}
100 NumberOne

> Warm Down
200 Backstroke on 4:00
`;

/** The parts of a programme a test usually wants to start from. */
interface ParsedProgramme {
  poolLength: number;
  elements: ProgrammeElement[];
  units: AdjustableUnit[];
}

/**
 * Parse a programme and build its adjustable units the way the fit does, so
 * that the modules underneath it can be tested without running a whole fit.
 */
export function parsed(source: string): ParsedProgramme {
  const poolLength = getPoolLength(source);
  const elements = parseProgramme(source, poolLength);
  const ratios = measureIntervalRatios(elements);

  const units = elements.flatMap((element, index): AdjustableUnit[] => {
    if (element.kind !== "instruction") return [];

    const metres = lengthMetres(element.length);
    const elementRatios = ratios[index];

    return [
      {
        instruction: element,
        intervalRatio: elementRatios?.own ?? 1,
        innerModels: element.inner.map((inner, innerIndex) => ({
          inner,
          intervalRatio: elementRatios?.inner[innerIndex] ?? 1,
        })),
        perRepetitionMetres: metres,
        perRepetitionFixedSeconds: lengthFixedSeconds(element.length),
        originalMetres: metres * element.repetitions,
        changedMetres: 0,
        canChangeRepetitions: element.hasRepetitionOperator,
        canChangeLength:
          element.length.kind === "distance" || element.length.kind === "laps",
      },
    ];
  });

  return { poolLength, elements, units };
}

/** The only adjustable unit of a programme with a single instruction. */
export function unitOf(source: string): AdjustableUnit {
  const [unit] = parsed(source).units;
  if (!unit) throw new Error(`No instruction in: ${source}`);
  return unit;
}

/** The first instruction of a programme. */
export function instructionOf(source: string, poolLength = 25): InstructionElement {
  const instruction = parseProgramme(source, poolLength).find(
    element => element.kind === "instruction",
  );
  if (instruction?.kind !== "instruction") {
    throw new Error(`No instruction in: ${source}`);
  }
  return instruction;
}

/** Fit a programme the way one pace of `modifiedProgrammes` does. */
export function fit(
  source: string,
  pace: string,
  targets: Partial<SessionTargets> = {},
  method: FitMethod = "rescale",
): FittedProgramme {
  const poolLength = getPoolLength(source);
  const elements = parseProgramme(source, poolLength);

  return fitProgramme(
    elements,
    measureIntervalRatios(elements),
    timeToSeconds(pace),
    { goal: "duration", durationSeconds: null, volumeMetres: null, ...targets },
    poolLength,
    method,
  );
}

/**
 * The heads of a programme's sets, such as `5 x 100` or `400`, in order. Sets
 * inside a block are left out, since only the block itself is ever resized.
 */
export function sets(source: string): string[] {
  return parseProgramme(source, getPoolLength(source)).flatMap(element =>
    element.kind === "instruction"
      ? [element.lines[0]?.split(/\s(?=[A-Z{])/)[0]?.trim() ?? ""]
      : [],
  );
}

/** How many metres a programme has in each kind of section. */
export function sectionMetres(source: string): Record<SectionKind, number> {
  const metres = { warmUp: 0, mainSet: 0, warmDown: 0, other: 0 };

  for (const element of parseProgramme(source, getPoolLength(source))) {
    if (element.kind === "instruction") {
      metres[element.section] += lengthMetres(element.length) * element.repetitions;
    }
  }

  return metres;
}

/** How many syntax errors the real SwimDSL grammar finds in a programme. */
export function syntaxErrors(source: string): number {
  let errors = 0;

  swimdslLanguage.parser.parse(source).iterate({
    enter: node => {
      if (node.type.isError) errors++;
    },
  });

  return errors;
}
