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

import type {
  InnerInstruction,
  InstructionLength,
  InstructionRest,
  ProgrammeElement,
  SectionKind,
} from "./programmeTypes.ts";
import { timeToSeconds } from "./swimTime.ts";

/** The pool length assumed when a programme does not set one. */
const DEFAULT_POOL_LENGTH = 25;

// The optional repetition count an instruction or a block opens with. The
// separator is captured too, so that a rewritten head keeps the spacing of the
// original.
const REPETITIONS_PATTERN = String.raw`^(?:(\d+)(\s*x\s+))?`;
export const HEAD_PATTERN = new RegExp(
  REPETITIONS_PATTERN + String.raw`(\d+:\d+|\d+(?:\s+laps?)?)(\s+)(?=\S)`,
);
export const BLOCK_OPEN_PATTERN = new RegExp(REPETITIONS_PATTERN + String.raw`\{`);
const POOL_LENGTH_PATTERN = /^\s*set\s+PoolLength\s+(\d+)/;
// A quoted string, capturing its closing quote, or a comment to the line's end.
const STRING_OR_COMMENT_PATTERN = /"(?:\\[\s\S]|[^"])*("?)|#[\s\S]*/g;

/** Build the pattern for a rest keyword, capturing the duration after it. */
export function restDurationPattern(keyword: "on" | "with"): RegExp {
  return new RegExp(String.raw`(?:^|\s)${keyword}\s+(\d+:\d+)`);
}

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
  return line.replace(
    STRING_OR_COMMENT_PATTERN,
    (text: string, closing: string | undefined) =>
      closing === undefined
        ? " ".repeat(text.length)
        : `"${" ".repeat(text.length - 1 - closing.length)}${closing}`,
  );
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

/** Work out which part of the session a `>` header line introduces. */
function classifyHeader(header: string): SectionKind {
  const words = header.toLowerCase().replace(/[^a-z]/g, "");

  if (words.includes("warmup")) return "warmUp";
  if (/warmdown|cooldown|swimdown/.test(words)) return "warmDown";
  if (words.includes("main")) return "mainSet";
  return "other";
}

/** Read a repetition count, which is one when none is spelled out. */
function parseRepetitions(count: string | undefined): number {
  return Number(count ?? "1") || 1;
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
 * The distance a length covers, in metres. Lengths written as a time swim an
 * unknown distance, so they count as none.
 */
export function lengthMetres(length: InstructionLength): number {
  return length.kind === "time" ? 0 : length.metres;
}

/** The part of a length that is written as a time, in seconds. */
export function lengthFixedSeconds(length: InstructionLength): number {
  if (length.kind === "time") return length.seconds;
  return length.kind === "block" ? length.fixedSeconds : 0;
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

  const sinceStart = restDurationPattern("on").exec(masked);
  if (sinceStart?.[1] !== undefined) {
    return { kind: "sinceStart", seconds: timeToSeconds(sinceStart[1]) };
  }

  const afterStop = restDurationPattern("with").exec(masked);
  if (afterStop?.[1] !== undefined) {
    return { kind: "afterStop", seconds: timeToSeconds(afterStop[1]) };
  }

  const inOut = /(?:^|\s)in-out\s+(\d+)/.exec(masked);
  if (inOut?.[1] !== undefined) {
    return { kind: "inOut", swimmers: Number(inOut[1]) };
  }

  return { kind: "none" };
}

/** The change in block nesting depth a masked line causes. */
function braceDepthChange(masked: string): number {
  return masked.split("{").length - masked.split("}").length;
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
      multipliers.push(multiplier * parseRepetitions(opening[1]));
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
      repetitions: parseRepetitions(head[1]),
      metres: lengthMetres(length),
      fixedSeconds: lengthFixedSeconds(length),
      rest: parseRest(line),
    });
  }

  return contents;
}

/** Total up the distance and the fixed time of one pass through a block. */
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
        repetitions: parseRepetitions(opening[1]),
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
        repetitions: parseRepetitions(head[1]),
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
