/**
 * Line oriented parsing support for rewriting SwimDSL programmes.
 *
 * Programmes are authored, stored, and rendered as source text, so the
 * modifier reads and writes source text too. Parsing is therefore kept
 * deliberately line oriented: every line the modifier does not recognise is
 * carried through to the output untouched, comments, blank lines, and
 * formatting included. Only the parts of a line that actually change (the
 * repetition count, the length, and the interval) are rewritten in place.
 */

import { timeToSeconds } from "./swimTime.ts";

/**
 * The part a set plays in the session, taken from the `>` headers a
 * programme is divided up with.
 */
export type SectionKind = "warmUp" | "mainSet" | "warmDown" | "other";

/** How the length of an instruction is written in the source. */
export type InstructionLength =
  | { kind: "distance"; metres: number }
  | { kind: "laps"; laps: number; metres: number }
  | { kind: "time"; seconds: number }
  | { kind: "block"; metres: number; fixedSeconds: number };

/** How an instruction specifies rest, if it specifies any at all. */
export type InstructionRest =
  | { kind: "sinceStart"; seconds: number }
  | { kind: "afterStop"; seconds: number }
  | { kind: "inOut"; swimmers: number }
  | { kind: "none" };

/**
 * An instruction written inside a `{ ... }` block. The lines of a block are
 * not resized on their own, but they still have to be timed, and their
 * intervals still have to be rewritten when the pace changes.
 */
export interface InnerInstruction {
  /** Where the instruction sits among the block's own lines. */
  lineIndex: number;
  /** The repetitions applied by any blocks nested around this line. */
  multiplier: number;
  repetitions: number;
  /** The distance of one repetition, in metres. */
  metres: number;
  /** The time of one repetition, when it is written as a length of time. */
  fixedSeconds: number;
  rest: InstructionRest;
}

/** A line carried through to the output exactly as it was written. */
export interface VerbatimElement {
  kind: "verbatim";
  lines: string[];
}

/** A `> Some Heading` line, which starts a new section of the programme. */
export interface HeaderElement {
  kind: "header";
  lines: string[];
  section: SectionKind;
}

/**
 * A swim instruction, either a single line or a whole `{ ... }` block. The
 * source lines are kept alongside the parsed values so that an instruction
 * can be rewritten without regenerating the rest of its line.
 */
export interface InstructionElement {
  kind: "instruction";
  lines: string[];
  section: SectionKind;
  repetitions: number;
  /** Whether the source spells out an `N x` repetition count. */
  hasRepetitionOperator: boolean;
  length: InstructionLength;
  rest: InstructionRest;
  /** The instructions inside a `{ ... }` block, and empty for a single line. */
  inner: InnerInstruction[];
}

export type ProgrammeElement =
  | VerbatimElement
  | HeaderElement
  | InstructionElement;

/** The pool length assumed when a programme does not set one. */
export const DEFAULT_POOL_LENGTH = 25;

// The head of an instruction: an optional repetition count followed by the
// length. The separators are captured too, so that a rewritten head keeps the
// spacing of the original.
const HEAD_PATTERN = /^(?:(\d+)(\s*x\s+))?(\d+:\d+|\d+(?:\s+laps?)?)(\s+)(?=\S)/;
const BLOCK_OPEN_PATTERN = /^(?:(\d+)(\s*x\s+))?\{/;
const POOL_LENGTH_PATTERN = /^\s*set\s+PoolLength\s+(\d+)/;

/**
 * Blank out everything a parser should not look inside, keeping the length of
 * the line so that match positions still line up with the original text.
 * Quoted descriptions and trailing comments are replaced by spaces, which
 * stops keywords such as the `on` inside `-- "swim on feel"` being mistaken
 * for a rest specification.
 *
 * @param line A single line of SwimDSL source.
 * @returns The line with strings and comments blanked out.
 */
export function maskLine(line: string): string {
  let masked = "";
  let inString = false;

  for (let index = 0; index < line.length; index++) {
    const character = line[index] ?? "";

    if (inString) {
      if (character === "\\" && index + 1 < line.length) {
        masked += "  ";
        index++;
        continue;
      }
      if (character === '"') {
        inString = false;
        masked += '"';
      } else {
        masked += " ";
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      masked += '"';
      continue;
    }

    if (character === "#") {
      // Everything from here to the end of the line is a comment.
      masked += " ".repeat(line.length - index);
      break;
    }

    masked += character;
  }

  return masked;
}

/**
 * Read the pool length a programme is written for.
 *
 * @param programme The full SwimDSL source.
 * @returns The pool length in metres, defaulting to
 *   {@link DEFAULT_POOL_LENGTH} when the programme does not set one.
 */
export function getPoolLength(programme: string): number {
  for (const line of programme.split("\n")) {
    const match = POOL_LENGTH_PATTERN.exec(maskLine(line));
    const poolLength = Number(match?.[1]);
    if (poolLength > 0) return poolLength;
  }
  return DEFAULT_POOL_LENGTH;
}

/**
 * Work out which part of the session a `>` header introduces.
 *
 * @param header The text of the header line, including the `>`.
 * @returns The section the header starts.
 */
function classifyHeader(header: string): SectionKind {
  const words = header.toLowerCase().replace(/[^a-z]/g, "");

  if (words.includes("warmup")) return "warmUp";
  if (
    words.includes("warmdown") ||
    words.includes("cooldown") ||
    words.includes("swimdown")
  ) {
    return "warmDown";
  }
  if (words.includes("main")) return "mainSet";
  return "other";
}

/**
 * Read a length token such as `100`, `4 laps`, or `5:00`.
 *
 * @param token The length as written in the source.
 * @param poolLength The pool length, used to turn laps into a distance.
 * @returns The parsed length.
 */
function parseLengthToken(token: string, poolLength: number): InstructionLength {
  if (token.includes(":")) {
    return { kind: "time", seconds: timeToSeconds(token) };
  }

  const value = Number(/^\d+/.exec(token)?.[0] ?? "0");

  if (/laps?$/.test(token)) {
    return { kind: "laps", laps: value, metres: value * poolLength };
  }

  return { kind: "distance", metres: value };
}

/**
 * Read the rest specification of an instruction, if it has one.
 *
 * @param line The line carrying the instruction's modifiers. The modifiers of
 *   a `{ ... }` block sit on its closing line, so this is always the last
 *   line of the instruction.
 * @returns The rest the instruction specifies.
 */
function parseRest(line: string): InstructionRest {
  const masked = maskLine(line);

  const sinceStart = /(?:^|\s)on\s+(\d+:\d+)/.exec(masked);
  if (sinceStart?.[1] !== undefined) {
    return { kind: "sinceStart", seconds: timeToSeconds(sinceStart[1]) };
  }

  const afterStop = /(?:^|\s)with\s+(\d+:\d+)/.exec(masked);
  if (afterStop?.[1] !== undefined) {
    return { kind: "afterStop", seconds: timeToSeconds(afterStop[1]) };
  }

  const inOut = /(?:^|\s)in-out\s+(\d+)/.exec(masked);
  if (inOut?.[1] !== undefined) {
    return { kind: "inOut", swimmers: Number(inOut[1]) };
  }

  return { kind: "none" };
}

/**
 * Count how far a line opens or closes `{ ... }` blocks.
 *
 * @param masked A masked line, so that braces inside strings are ignored.
 * @returns The change in block nesting depth the line causes.
 */
function braceDepthChange(masked: string): number {
  let depth = 0;
  for (const character of masked) {
    if (character === "{") depth++;
    if (character === "}") depth--;
  }
  return depth;
}

/**
 * Read the instructions inside a `{ ... }` block, keeping track of how far
 * the nested repetitions around each line multiply it up.
 *
 * @param lines All of the block's lines, opening and closing lines included.
 * @param poolLength The pool length the programme is written for.
 * @returns One entry per instruction line inside the block.
 */
function parseBlockContents(
  lines: string[],
  poolLength: number,
): InnerInstruction[] {
  const contents: InnerInstruction[] = [];
  const multipliers: number[] = [1];

  for (let lineIndex = 1; lineIndex < lines.length - 1; lineIndex++) {
    const line = lines[lineIndex] ?? "";
    const masked = maskLine(line).trim();
    if (masked === "" || masked.startsWith(">")) continue;

    const multiplier = multipliers[multipliers.length - 1] ?? 1;

    const opening = BLOCK_OPEN_PATTERN.exec(masked);
    if (opening) {
      multipliers.push(multiplier * (Number(opening[1] ?? "1") || 1));
      continue;
    }

    if (masked.startsWith("}")) {
      if (multipliers.length > 1) multipliers.pop();
      continue;
    }

    const head = HEAD_PATTERN.exec(masked);
    if (head?.[3] === undefined) continue;

    const length = parseLengthToken(head[3], poolLength);

    contents.push({
      lineIndex,
      multiplier,
      repetitions: Number(head[1] ?? "1") || 1,
      metres: length.kind === "distance" || length.kind === "laps" ? length.metres : 0,
      fixedSeconds: length.kind === "time" ? length.seconds : 0,
      rest: parseRest(line),
    });
  }

  return contents;
}

/**
 * Total up the distance and the fixed time of one pass through a block.
 *
 * @param contents The instructions inside the block.
 * @returns The distance swum, and the time spent on lengths written as a
 *   time, in one pass through the block.
 */
function measureBlockContents(contents: InnerInstruction[]): {
  metres: number;
  fixedSeconds: number;
} {
  let metres = 0;
  let fixedSeconds = 0;

  for (const inner of contents) {
    const count = inner.multiplier * inner.repetitions;
    metres += count * inner.metres;
    fixedSeconds += count * inner.fixedSeconds;
  }

  return { metres, fixedSeconds };
}

/**
 * Split a programme into the elements the modifier works with.
 *
 * @param programme The full SwimDSL source.
 * @param poolLength The pool length the programme is written for.
 * @returns The elements of the programme, in source order.
 */
export function parseProgramme(
  programme: string,
  poolLength: number,
): ProgrammeElement[] {
  const lines = programme.split("\n");
  const elements: ProgrammeElement[] = [];
  let section: SectionKind = "other";

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const masked = maskLine(line).trim();

    if (masked.startsWith(">")) {
      section = classifyHeader(masked);
      elements.push({ kind: "header", lines: [line], section });
      continue;
    }

    const opening = BLOCK_OPEN_PATTERN.exec(masked);
    if (opening) {
      const blockLines: string[] = [];
      let depth = 0;

      while (index < lines.length) {
        const blockLine = lines[index] ?? "";
        blockLines.push(blockLine);
        depth += braceDepthChange(maskLine(blockLine));
        if (depth <= 0) break;
        index++;
      }

      if (depth > 0) {
        // Unbalanced braces: leave the rest of the programme well alone.
        elements.push({ kind: "verbatim", lines: blockLines });
        continue;
      }

      const contents = parseBlockContents(blockLines, poolLength);
      elements.push({
        kind: "instruction",
        lines: blockLines,
        section,
        repetitions: Number(opening[1] ?? "1") || 1,
        hasRepetitionOperator: opening[1] !== undefined,
        length: { kind: "block", ...measureBlockContents(contents) },
        rest: parseRest(blockLines[blockLines.length - 1] ?? ""),
        inner: contents,
      });
      continue;
    }

    const head = HEAD_PATTERN.exec(masked);
    if (head?.[3] !== undefined) {
      elements.push({
        kind: "instruction",
        lines: [line],
        section,
        repetitions: Number(head[1] ?? "1") || 1,
        hasRepetitionOperator: head[1] !== undefined,
        length: parseLengthToken(head[3], poolLength),
        rest: parseRest(line),
        inner: [],
      });
      continue;
    }

    elements.push({ kind: "verbatim", lines: [line] });
  }

  return elements;
}

/**
 * Take a copy of a parsed programme, so that it can be rewritten once per
 * pace without disturbing the original.
 *
 * @param elements The parsed programme.
 * @returns An independent copy of the elements.
 */
export function cloneProgramme(
  elements: ProgrammeElement[],
): ProgrammeElement[] {
  return elements.map(element => {
    if (element.kind !== "instruction") {
      return { ...element, lines: [...element.lines] };
    }
    return {
      ...element,
      lines: [...element.lines],
      length: { ...element.length },
      rest: { ...element.rest },
      inner: element.inner.map(inner => ({ ...inner, rest: { ...inner.rest } })),
    };
  });
}

/**
 * Write a parsed programme back out as SwimDSL source.
 *
 * @param elements The parsed programme.
 * @returns The source text of the programme.
 */
export function renderProgramme(elements: ProgrammeElement[]): string {
  return elements.flatMap(element => element.lines).join("\n");
}

/**
 * Write a length back out in the style it was written in originally.
 *
 * @param length The new length.
 * @param original The length token as it appeared in the source.
 * @returns The new length token.
 */
function formatLength(length: InstructionLength, original: string): string {
  switch (length.kind) {
    case "distance":
      return String(length.metres);
    case "laps":
      return original.replace(/^\d+/, String(length.laps));
    default:
      return original;
  }
}

/**
 * Rewrite the repetition count and the length in the head of an instruction,
 * keeping the spacing, and everything that follows, exactly as it was. An
 * instruction that does not spell out an `N x` repetition count keeps its
 * implied single repetition, since inventing one changes how the instruction
 * reads.
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

  const opening = BLOCK_OPEN_PATTERN.exec(maskedBody);
  if (opening) {
    if (opening[1] !== undefined) {
      const head = opening[1] + (opening[2] ?? " x ");
      instruction.lines[0] =
        indent + String(repetitions) + (opening[2] ?? " x ") + body.slice(head.length);
      instruction.repetitions = repetitions;
    }
    return;
  }

  const match = HEAD_PATTERN.exec(maskedBody);
  if (match?.[3] === undefined) return;

  const repetitionPart =
    match[1] === undefined ? "" : String(repetitions) + (match[2] ?? " x ");
  const lengthToken =
    length === null ? match[3] : formatLength(length, match[3]);

  instruction.lines[0] =
    indent +
    repetitionPart +
    lengthToken +
    (match[4] ?? " ") +
    body.slice(match[0].length);

  if (match[1] !== undefined) instruction.repetitions = repetitions;
  if (length !== null) instruction.length = length;
}

/**
 * Rewrite the duration of a rest specification.
 *
 * @param instruction The instruction to rewrite, modified in place.
 * @param keyword The rest keyword whose duration should change.
 * @param duration The new duration, written as `m:ss`.
 * @param lineIndex Which of the instruction's lines to rewrite. The modifiers
 *   of a block sit on its closing line, so the last line is the default.
 */
export function rewriteRestDuration(
  instruction: InstructionElement,
  keyword: "on" | "with",
  duration: string,
  lineIndex = instruction.lines.length - 1,
): void {
  const line = instruction.lines[lineIndex] ?? "";
  const match = new RegExp(`(^|\\s)(${keyword})(\\s+)(\\d+:\\d+)`).exec(
    maskLine(line),
  );
  if (!match) return;

  const start =
    match.index +
    (match[1] ?? "").length +
    (match[2] ?? "").length +
    (match[3] ?? "").length;

  instruction.lines[lineIndex] =
    line.slice(0, start) +
    duration +
    line.slice(start + (match[4] ?? "").length);
}
