/**
 * How long a programme takes and how far it goes at a swimmer's pace. Every
 * step of a fit measures the programme through this model.
 */

import type {
  InnerInstruction,
  InstructionElement,
  InstructionRest,
} from "./programmeTypes.ts";
import { ENDURANCE_REST_SECONDS, swimSeconds } from "./swimTime.ts";

/** Seconds of rest assumed for each swimmer waited on by an `in-out` rest. */
const IN_OUT_SECONDS_PER_SWIMMER = 5;

/** A parsed instruction together with everything needed to resize it. */
export interface AdjustableUnit {
  instruction: InstructionElement;
  /** Measured by {@link "./intervalRatios.ts"}. */
  intervalRatio: number;
  /** Metres swum in one repetition of the instruction. */
  perRepetitionMetres: number;
  /** Seconds of time based lengths in one repetition, such as `5:00 Free`. */
  perRepetitionFixedSeconds: number;
  /** The volume of the instruction before any adjustment, in metres. */
  originalMetres: number;
  /** How much volume this set has given up, or taken on, so far. */
  changedMetres: number;
  canChangeRepetitions: boolean;
  canChangeLength: boolean;
  /** The instructions inside a block, with the interval ratio of each. */
  innerModels: InnerModel[];
}

/** An instruction inside a block, and how its interval was written. */
interface InnerModel {
  inner: InnerInstruction;
  intervalRatio: number;
}

/** The time one repetition spends swimming, rest aside. */
export function swimmingSeconds(
  metres: number,
  fixedSeconds: number,
  pace: number,
): number {
  return swimSeconds(metres, pace) + fixedSeconds;
}

/** The time one repetition of a unit spends swimming, rest aside. */
function unitSwimmingSeconds(unit: AdjustableUnit, pace: number): number {
  return swimmingSeconds(
    unit.perRepetitionMetres,
    unit.perRepetitionFixedSeconds,
    pace,
  );
}

/**
 * The interval an `on` rest should be given at a pace, keeping the interval
 * as generous, or as tight, as it was written relative to the rest of the
 * programme.
 *
 * @param swim The time spent swimming within the interval.
 * @param ratio How the original interval compared with the average written
 *   for the same distance.
 * @returns The interval in seconds, never shorter than the swim itself.
 */
export function intervalFor(swim: number, ratio: number): number {
  const base = swim + ENDURANCE_REST_SECONDS;
  return Math.max(swim, Math.round(base * ratio));
}

/** How long a swim takes once its own rest specification is added on. */
function restedSeconds(
  swim: number,
  rest: InstructionRest,
  ratio: number,
): number {
  switch (rest.kind) {
    case "sinceStart":
      return intervalFor(swim, ratio);
    case "afterStop":
      return swim + rest.seconds;
    case "inOut":
      return swim + rest.swimmers * IN_OUT_SECONDS_PER_SWIMMER;
    case "none":
      return swim;
  }
}

/** The interval a unit written with an `on` rest should be given at a pace. */
export function intervalSeconds(unit: AdjustableUnit, pace: number): number {
  return intervalFor(unitSwimmingSeconds(unit, pace), unit.intervalRatio);
}

/**
 * The time one repetition of a unit takes, rest inside a block included but
 * the unit's own rest not yet added on.
 */
function contentSeconds(unit: AdjustableUnit, pace: number): number {
  if (unit.innerModels.length === 0) return unitSwimmingSeconds(unit, pace);

  let seconds = 0;

  for (const { inner, intervalRatio } of unit.innerModels) {
    const swim = swimmingSeconds(inner.metres, inner.fixedSeconds, pace);
    seconds +=
      inner.multiplier *
      inner.repetitions *
      restedSeconds(swim, inner.rest, intervalRatio);
  }

  return seconds;
}

/** The time a unit takes, including rest, at a pace. */
export function unitSeconds(unit: AdjustableUnit, pace: number): number {
  const rest = unit.instruction.rest;

  // An `on` interval covers everything the instruction contains, inner rests
  // included, so it is calculated from the swim alone. Every other kind of
  // rest is added on top of the time the instruction's contents take.
  const perRepetition =
    rest.kind === "sinceStart"
      ? intervalSeconds(unit, pace)
      : restedSeconds(contentSeconds(unit, pace), rest, unit.intervalRatio);

  return perRepetition * unit.instruction.repetitions;
}

/** The volume of a unit in metres. */
export function unitMetres(unit: AdjustableUnit): number {
  return unit.perRepetitionMetres * unit.instruction.repetitions;
}

/** The totals of a whole programme at a pace. */
export function totals(
  units: AdjustableUnit[],
  pace: number,
): { seconds: number; metres: number } {
  let seconds = 0;
  let metres = 0;

  for (const unit of units) {
    seconds += unitSeconds(unit, pace);
    metres += unitMetres(unit);
  }

  return { seconds, metres };
}

/**
 * How many seconds a unit costs per metre swum. Used to convert a shortfall
 * or an overrun in session time into the volume that has to move.
 */
export function secondsPerMetre(unit: AdjustableUnit, pace: number): number {
  const metres = unitMetres(unit);
  return metres > 0 ? unitSeconds(unit, pace) / metres : 0;
}
