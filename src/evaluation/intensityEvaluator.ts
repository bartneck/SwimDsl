import { Programme, SwimInstruction, Statements, Instruction, InstructionModifier, InstructionModifiers, Pace, } from "../../codemirror-swimdsl/src/astTypes";

export interface IntensityResult {
  totalVolume: number;

  easy: number;
  endurance: number;
  threshold: number;
  racePace: number;
  max: number;

  unknown: number;

  percentages: {
    easy: number;
    endurance: number;
    threshold: number;
    racePace: number;
    max: number;
    unknown: number;
  };
}

function getDistance(instruction: SwimInstruction): number {
  const repetitions = instruction.repetitions || 1;

  if (instruction.instruction.isBlock) {
    return (
      instruction.instruction.instructions.reduce(
        (total: number, child: Instruction) => {
          if (child.statement === Statements.SWIM_INSTRUCTION) {
            return total + getDistance(child);
          }
          return total;
        },
        0
      ) * repetitions
    );
  }
  const length = instruction.instruction.length;

  if (length.kind !== "distance") {
    return 0;
  }

  const distance = Number(length.value);

  if (Number.isNaN(distance)) {
    return 0;
  }

  return distance * repetitions;
}

function getIntensity(instruction: SwimInstruction): number | null {
  const paceModifier = instruction.instructionModifiers.find(
    (modifier: InstructionModifier): modifier is Pace =>
      modifier.modifier === InstructionModifiers.PACE
  );

   if (!paceModifier) {
    return null;
  }

  const intensity = paceModifier.startIntensity;

  if (intensity.kind === "percentage") {
    const value = Number(intensity.value);
    return Number.isFinite(value) ? value : null;
  }

  if (intensity.kind === "alias") {
    const alias = intensity.value.replace(/\s+/g, "").toLowerCase();

    const aliases: Record<string, number> = {
      easy: 65,
      endurance: 72,
      threshold: 88,
      racepace: 95,
      max: 100,
    };

    return aliases[alias] ?? null;
  }

  return null
}

function addToIntensity(result: IntensityResult, intensity: number | null, distance: number): void {
  if (intensity === null) {
    result.unknown += distance;
    return;
  }

  if (intensity <= 65) {
    result.easy += distance;
  } else if (intensity <= 80) {
    result.endurance += distance;
  } else if (intensity <= 90) {
    result.threshold += distance;
  } else if (intensity < 100) {
    result.racePace += distance;
  } else {
    result.max += distance;
  }
}

function evaluateInstruction(instruction: SwimInstruction, result: IntensityResult): void {
  const repetitions = instruction.repetitions || 1;

  if (instruction.instruction.isBlock) {
    for (const child of instruction.instruction.instructions) {
      if (child.statement === Statements.SWIM_INSTRUCTION) {
        evaluateInstruction(
          {
            ...child,
            repetitions: (child.repetitions || 1) * repetitions,
          },
          result
        );
      }
    }
    return
  }

  const distance = getDistance(instruction);

  if (distance === 0) {
    return;
  }

  const intensity = getIntensity(instruction);
  addToIntensity(result, intensity, distance);
}

export function evaluateIntensity(programme: Programme): IntensityResult {
  const result: IntensityResult = {
    totalVolume: 0,

    easy: 0,
    endurance: 0,
    threshold: 0,
    racePace: 0,
    max: 0,
    unknown: 0,

    percentages: {
      easy: 0,
      endurance: 0,
      threshold: 0,
      racePace: 0,
      max: 0,
      unknown: 0,
    },
  };

  for (const statement of programme.statements) {
    if (
      statement.statement === Statements.SWIM_INSTRUCTION
    ) {
      evaluateInstruction(statement, result);
    }
  }

  result.totalVolume =
    result.easy +
    result.endurance +
    result.threshold +
    result.racePace +
    result.max +
    result.unknown;

  if (result.totalVolume > 0) {
    result.percentages.easy =
      (result.easy / result.totalVolume) * 100;

    result.percentages.endurance =
      (result.endurance / result.totalVolume) * 100;

    result.percentages.threshold =
      (result.threshold / result.totalVolume) * 100;

    result.percentages.racePace =
      (result.racePace / result.totalVolume) * 100;

    result.percentages.max =
      (result.max / result.totalVolume) * 100;

    result.percentages.unknown =
      (result.unknown / result.totalVolume) * 100;
  }

  return result;
}
