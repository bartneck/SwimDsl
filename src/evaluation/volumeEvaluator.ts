import { Programme, Instruction, SwimInstruction, Statements } from "../../codemirror-swimdsl/src/astTypes";

export interface VolumeResult {
  inputVolume: number;
  actualVolume: number;
  absoluteError: number;
  percentageError: number;
}

function calculateInstructionVolume(instruction: SwimInstruction): number {
  const repetitions = instruction.repetitions || 1;

  // Handle blocks
  if (instruction.instruction.isBlock) {
    const blockVolume = instruction.instruction.instructions.reduce(
      (total: number, child: Instruction) => {
        if (child.statement === Statements.SWIM_INSTRUCTION) {
          return total + calculateInstructionVolume(child);
        }
        return total;
      }, 0);
    return blockVolume * repetitions;
  }

  // Calculate volume if it is specified as a distance
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

export function calculateProgrammeVolume(programme: Programme): number {
  return programme.statements.reduce((total: number, statement) => {
    if (statement.statement === Statements.SWIM_INSTRUCTION) {
      return total + calculateInstructionVolume(statement);
    }
    return total;
  }, 0);
}

export function evaluateVolume(programme: Programme, targetVolume: number): VolumeResult {
  const actualVolume = calculateProgrammeVolume(programme);
  const absoluteError = Math.abs(actualVolume - targetVolume);
  const percentageError = targetVolume === 0 ? 0 : (absoluteError / targetVolume) * 100;

  return {
    inputVolume: targetVolume,
    actualVolume,
    absoluteError,
    percentageError,
  };
}
