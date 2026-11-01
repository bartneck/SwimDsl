/**
 * Writing a parsed programme back out as source text. Only the characters that
 * actually change are rewritten, so everything else about a line stays exactly
 * as it was written.
 */

import {
  BLOCK_OPEN_PATTERN,
  HEAD_PATTERN,
  maskLine,
  restDurationPattern,
} from "./programmeParsing.ts";
import type {
  InstructionElement,
  InstructionLength,
  ProgrammeElement,
} from "./programmeTypes.ts";

/** Write a parsed programme back out as SwimDSL source. */
export function renderProgramme(elements: ProgrammeElement[]): string {
  return elements.flatMap(element => element.lines).join("\n");
}

/** Write a length back out in the style of its original source token. */
function formatLength(length: InstructionLength, original: string): string {
  if (length.kind === "distance") return String(length.metres);
  if (length.kind === "laps") {
    return original.replace(/^\d+/, String(length.laps));
  }
  return original;
}

/**
 * Rewrite the repetition count and the length in the head of an instruction,
 * keeping the spacing, and everything that follows, exactly as it was. An
 * instruction that does not spell out an `N x` repetition count keeps its
 * implied single repetition, since inventing one changes how the instruction
 * reads. A block has no length of its own to rewrite.
 *
 * @param instruction The instruction to rewrite, modified in place.
 * @param repetitions The new repetition count.
 * @param length The new length, or null to leave the length alone.
 */
export function rewriteHead(
  instruction: InstructionElement,
  repetitions: number,
  length: InstructionLength | null,
): void {
  const line = instruction.lines[0] ?? "";
  const indent = /^\s*/.exec(line)?.[0] ?? "";
  const body = line.slice(indent.length);
  const maskedBody = maskLine(line).slice(indent.length);

  const match =
    BLOCK_OPEN_PATTERN.exec(maskedBody) ?? HEAD_PATTERN.exec(maskedBody);
  if (!match) return;

  const [, count, separator = " x ", token, gap = " "] = match;

  const repetitionPart = count === undefined ? "" : String(repetitions) + separator;

  if (token === undefined) {
    // The opening brace matched last, and has to stay in what follows.
    instruction.lines[0] =
      indent + repetitionPart + body.slice(match[0].length - 1);
  } else {
    const lengthToken = length === null ? token : formatLength(length, token);
    instruction.lines[0] =
      indent + repetitionPart + lengthToken + gap + body.slice(match[0].length);
    if (length !== null) instruction.length = length;
  }

  if (count !== undefined) instruction.repetitions = repetitions;
}

/**
 * Rewrite the duration of an `on` interval.
 *
 * @param instruction The instruction to rewrite, modified in place.
 * @param duration The new duration, written as `m:ss`.
 * @param lineIndex Which of the instruction's lines to rewrite. The modifiers
 *   of a block sit on its closing line, so the last line is the default.
 */
export function rewriteOnInterval(
  instruction: InstructionElement,
  duration: string,
  lineIndex = instruction.lines.length - 1,
): void {
  const line = instruction.lines[lineIndex] ?? "";
  const match = restDurationPattern("on").exec(maskLine(line));
  if (match?.[1] === undefined) return;

  const end = match.index + match[0].length;

  instruction.lines[lineIndex] =
    line.slice(0, end - match[1].length) + duration + line.slice(end);
}
