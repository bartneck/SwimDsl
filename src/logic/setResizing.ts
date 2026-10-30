/**
 * Resizing a single set, by whole repetitions where it repeats and otherwise
 * by whole lengths of the pool. Which sets to resize, and how far, is decided
 * by {@link "./programmeAdjustment.ts"}.
 */

import { rewriteHead } from "./programmeRewriting.ts";
import type { AdjustableUnit } from "./programmeTiming.ts";

/** What resizing a set needs to know about the fit it is part of. */
export interface ResizeContext {
  poolLength: number;
  /** How much the warm up and warm down may still change, in metres. */
  scaffoldBudget: number;
}

/** Whether a unit belongs to the warm up or the warm down. */
export function isScaffold(unit: AdjustableUnit): boolean {
  const { section } = unit.instruction;
  return section === "warmUp" || section === "warmDown";
}

/** What is left of a unit's section allowance. */
export function budgetFor(fit: ResizeContext, unit: AdjustableUnit): number {
  return isScaffold(unit) ? fit.scaffoldBudget : Infinity;
}

/** Record volume taken from, or added to, a unit. */
function spend(fit: ResizeContext, unit: AdjustableUnit, metres: number): void {
  unit.changedMetres += metres;
  if (isScaffold(unit)) fit.scaffoldBudget -= metres;
}

/**
 * Give a unit a new size, rewriting its head in the style it was written in.
 * Only the repetition count of a block or a timed length can change.
 *
 * @param unit The set to resize, rewritten in place.
 * @param repetitions The new repetition count.
 * @param metres The new distance of one repetition.
 * @param poolLength The pool length the programme is written for.
 */
export function resizeUnit(
  unit: AdjustableUnit,
  repetitions: number,
  metres: number,
  poolLength: number,
): void {
  const { kind } = unit.instruction.length;

  rewriteHead(
    unit.instruction,
    repetitions,
    metres === unit.perRepetitionMetres || (kind !== "distance" && kind !== "laps")
      ? null
      : kind === "distance"
        ? { kind, metres }
        : { kind, laps: Math.round(metres / poolLength), metres },
  );
  unit.perRepetitionMetres = metres;
}

/**
 * Take volume out of a single set.
 *
 * Dropping a repetition is preferred, since it leaves the distance of the set
 * as the coach wrote it, and shortening each repetition by whole lengths of
 * the pool is the fallback for sets that are swum once.
 *
 * @param fit The fit in progress.
 * @param unit The set to shrink, rewritten in place.
 * @param allowanceMetres The most that may be taken in this pass.
 * @param allowOvershoot Whether a single step may be taken even when it takes
 *   out more than was asked for. Granularity means the last step of a cut
 *   often has to overshoot for the programme to fit at all.
 * @returns The volume removed, in metres.
 */
export function shrinkUnit(
  fit: ResizeContext,
  unit: AdjustableUnit,
  allowanceMetres: number,
  allowOvershoot: boolean,
): number {
  const { poolLength } = fit;
  const repetitions = unit.instruction.repetitions;
  const perRepetition = unit.perRepetitionMetres;
  const budgetMetres = budgetFor(fit, unit);

  if (perRepetition <= 0 || budgetMetres <= 0) return 0;
  if (allowanceMetres <= 0 && !allowOvershoot) return 0;

  const cap = Math.min(allowanceMetres, budgetMetres);

  let repetitionSteps = 0;
  let repetitionForced = false;
  if (unit.canChangeRepetitions && repetitions > 1) {
    repetitionSteps = Math.min(repetitions - 1, Math.floor(cap / perRepetition));
    if (repetitionSteps === 0 && allowOvershoot) {
      repetitionSteps = 1;
      repetitionForced = true;
    }
  }

  const lengthStep = repetitions * poolLength;
  let lengthSteps = 0;
  let lengthForced = false;
  if (unit.canChangeLength) {
    const mostSteps = Math.floor((perRepetition - poolLength) / poolLength);
    lengthSteps = Math.max(0, Math.min(mostSteps, Math.floor(cap / lengthStep)));
    if (lengthSteps === 0 && allowOvershoot && mostSteps > 0) {
      lengthSteps = 1;
      lengthForced = true;
    }
  }

  const repetitionDelta = repetitionSteps * perRepetition;
  const lengthDelta = lengthSteps * lengthStep;

  const takeRepetitions =
    repetitionDelta > 0 &&
    (repetitionForced === lengthForced
      ? // Neither step overshoots, or both do. Dropping a repetition leaves
        // the distance of the set as the coach wrote it, so it is preferred
        // unless shortening the swim is clearly the better fit; when both
        // steps overshoot, the smaller of the two wastes less.
        repetitionForced
        ? repetitionDelta <= lengthDelta || lengthDelta === 0
        : repetitionDelta * 2 >= lengthDelta
      : // One of the two fits inside what was asked for. Take that one.
        !repetitionForced);

  if (takeRepetitions) {
    resizeUnit(unit, repetitions - repetitionSteps, perRepetition, poolLength);
    spend(fit, unit, repetitionDelta);
    return repetitionDelta;
  }

  if (lengthDelta > 0) {
    const metres = perRepetition - lengthSteps * poolLength;
    resizeUnit(unit, repetitions, metres, poolLength);
    spend(fit, unit, lengthDelta);
    return lengthDelta;
  }

  return 0;
}

/**
 * Add volume to a single set, using the same two knobs as {@link shrinkUnit}
 * and never going past what was asked for.
 *
 * @returns The volume added, in metres.
 */
export function growUnit(
  fit: ResizeContext,
  unit: AdjustableUnit,
  allowanceMetres: number,
): number {
  const { poolLength } = fit;
  const repetitions = unit.instruction.repetitions;
  const perRepetition = unit.perRepetitionMetres;

  if (perRepetition <= 0) return 0;

  const cap = Math.min(allowanceMetres, budgetFor(fit, unit));
  if (cap <= 0) return 0;

  const repetitionSteps = unit.canChangeRepetitions
    ? Math.floor(cap / perRepetition)
    : 0;
  const lengthStep = repetitions * poolLength;
  const lengthSteps = unit.canChangeLength ? Math.floor(cap / lengthStep) : 0;

  const repetitionDelta = repetitionSteps * perRepetition;
  const lengthDelta = lengthSteps * lengthStep;

  // Another repetition of a set the swimmer is already doing beats making
  // each repetition longer, so it is taken whenever one fits.
  if (repetitionDelta > 0) {
    resizeUnit(unit, repetitions + repetitionSteps, perRepetition, poolLength);
    spend(fit, unit, repetitionDelta);
    return repetitionDelta;
  }

  if (lengthDelta > 0) {
    const metres = perRepetition + lengthSteps * poolLength;
    resizeUnit(unit, repetitions, metres, poolLength);
    spend(fit, unit, lengthDelta);
    return lengthDelta;
  }

  return 0;
}

/** The smallest single step a set can take up. */
export interface StepUp {
  unit: AdjustableUnit;
  /** The volume the step adds. */
  metres: number;
  repetitions: number;
  perRepetitionMetres: number;
}

/**
 * The smallest amount of volume a set can take on in one go: one more
 * repetition, or one more length of the pool on each repetition. A
 * repetition is preferred when the two are the same size, as it is whenever
 * volume is added.
 */
export function smallestStepUp(
  unit: AdjustableUnit,
  poolLength: number,
): StepUp | null {
  const repetitions = unit.instruction.repetitions;
  const perRepetitionMetres = unit.perRepetitionMetres;
  if (perRepetitionMetres <= 0) return null;

  const lengthStep = repetitions * poolLength;

  if (
    unit.canChangeRepetitions &&
    (!unit.canChangeLength || perRepetitionMetres <= lengthStep)
  ) {
    return {
      unit,
      metres: perRepetitionMetres,
      repetitions: repetitions + 1,
      perRepetitionMetres,
    };
  }

  if (!unit.canChangeLength) return null;

  return {
    unit,
    metres: lengthStep,
    repetitions,
    perRepetitionMetres: perRepetitionMetres + poolLength,
  };
}
