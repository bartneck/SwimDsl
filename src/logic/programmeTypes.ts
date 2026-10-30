/**
 * The shapes shared across parsing, timing, and fitting a programme: how a
 * parsed programme is represented, and what a session asks of it. This file
 * holds types alone, so any of the others can use it without depending on one
 * another.
 */

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
interface VerbatimElement {
  kind: "verbatim";
  lines: string[];
}

/** A `> Some Heading` line, which starts a new section of the programme. */
interface HeaderElement {
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

/**
 * What a programme is fitted to.
 *
 * `duration` fills the session's time, so that swimmers of different speeds
 * swim different distances for about the same training load. `distance`
 * brings the programme to the session's volume, so that every swimmer swims
 * the same sets and only the intervals change with pace. Whichever of the two
 * targets is not the goal still applies as a limit the programme is kept
 * within.
 */
export type FitGoal = "duration" | "distance";

/** What the session has to fit into. */
export interface SessionTargets {
  /** Which of the two targets the programme is fitted to. */
  goal: FitGoal;
  /** The length of the session in seconds, or null when it is open ended. */
  durationSeconds: number | null;
  /** The volume of the session in metres, or null when it is unconstrained. */
  volumeMetres: number | null;
}

/**
 * How a programme is made to fit the session.
 *
 * `rescale` resizes the sets of the programme, keeping its shape from the
 * first length to the last. `trim` leaves the sets as the coach wrote them
 * and simply stops the programme where the session runs out, or where the
 * distance is reached, which is the blunter option but the one that leaves
 * every set that survives untouched.
 */
export type FitMethod = "rescale" | "trim";
