/**
 * Fitting a swim programme to a session's duration or distance.
 *
 * A programme is written once, but it has to work for swimmers of different
 * speeds and for pools booked for different lengths of time. Rewriting the
 * intervals for a slower swimmer makes the session longer, so the volume has
 * to come down to compensate, and a faster swimmer will finish early unless
 * volume is added. Scaling volume against pace this way keeps the training
 * load (average pace multiplied by volume, which is simply the time spent
 * swimming) roughly the same for everyone the programme is written out for.
 *
 * Volume is added and removed with a coach's priorities rather than
 * uniformly:
 *
 * - The main set is what the session is for, so it is the last thing cut and
 *   the first thing extended. The warm up and warm down give way first, but
 *   only up to half of their combined volume, which keeps a session that has
 *   been cut hard from starting cold.
 * - Within a section the later sets take the strain first, and only a slice
 *   of a set is taken at a time, so a long swim at the end of the session is
 *   trimmed a little before an earlier set is touched at all.
 * - Sets are resized in whole repetitions where a set repeats, and otherwise
 *   in whole lengths of the pool, so that what comes out is still a sensible
 *   thing to ask a swimmer to do.
 * - Extra volume goes to sets of repetitions ahead of swims written once, and
 *   twice as readily, since another 100 on the end of `5 x 100` is the same
 *   set asked for a little longer where the same metres on a lone 400 make a
 *   swim the coach never wrote.
 */

import { summarise, type AdjustmentSummary } from "./adjustmentSummary.ts";
import { lengthFixedSeconds, lengthMetres } from "./programmeParsing.ts";
import { renderProgramme, rewriteOnInterval } from "./programmeRewriting.ts";
import {
  intervalFor,
  intervalSeconds,
  secondsPerMetre,
  swimmingSeconds,
  totals,
  type AdjustableUnit,
} from "./programmeTiming.ts";
import { cutToTargets } from "./programmeTrim.ts";
import type {
  FitMethod,
  ProgrammeElement,
  SessionTargets,
} from "./programmeTypes.ts";
import {
  budgetFor,
  growUnit,
  isScaffold,
  resizeUnit,
  shrinkUnit,
  smallestStepUp,
  type ResizeContext,
  type StepUp,
} from "./setResizing.ts";
import { secondsToTime, timeToSeconds } from "./swimTime.ts";

/** A programme fitted to a set of targets for one swimmer's pace. */
export interface FittedProgramme {
  source: string;
  summary: AdjustmentSummary;
}

/**
 * How much of the warm up and warm down may be given up before the main set
 * is touched at all.
 */
const SCAFFOLD_BUDGET_FRACTION = 0.5;

/**
 * How much of a set's original volume may be taken in a single pass. Later
 * sets are visited first, so a small allowance spreads a cut backwards
 * through the session instead of gutting whichever set comes last. The passes
 * widen until the cut fits, the last of them lifting the limit entirely.
 */
const SWEEP_FRACTIONS = [0.25, 0.5, 1, Infinity];

/**
 * The same passes, for volume being added rather than taken away. Growth
 * never lifts the limit: a pass that let one set take everything left of the
 * session would turn a 4 x 50 into a 64 x 50. Doubling the allowance instead
 * keeps a large increase spread across the sets in proportion to how big they
 * already are, and the last pass is wide enough to be no real limit at all.
 */
const GROWTH_FIRST_FRACTION = 0.25;
const GROWTH_LAST_FRACTION = 64;

/**
 * How much more readily a set of repetitions takes on extra volume than a
 * swim written once. A weight of two lets `5 x 100` grow twice as far in a
 * pass as a lone 400 alongside it.
 */
const REPEATED_SET_GROWTH_WEIGHT = 2;

/** Totals are compared with a little slack to keep rounding out of the loop. */
const TOLERANCE_SECONDS = 0.5;

/** What the steps of a fit share while a programme is being resized. */
interface FitContext extends ResizeContext {
  units: AdjustableUnit[];
  pace: number;
  targets: SessionTargets;
}

/**
 * Fit a programme to a swimmer's pace and to the session's targets.
 *
 * @param elements The parsed programme, which is left untouched.
 * @param intervalRatios The interval ratios measured by
 *   {@link "./intervalRatios.ts"}.
 * @param paceSecondsPer100 The swimmer's pace, in seconds per 100 metres.
 * @param targets The goal the programme is fitted to, and the duration and
 *   volume the session has to fit into.
 * @param poolLength The pool length the programme is written for.
 * @param method Whether to resize the sets of the programme or simply to stop
 *   the programme where the session runs out.
 * @returns The rewritten programme and what it came out as.
 */
export function fitProgramme(
  elements: ProgrammeElement[],
  intervalRatios: number[][],
  paceSecondsPer100: number,
  targets: SessionTargets,
  poolLength: number,
  method: FitMethod,
): FittedProgramme {
  const rewritten = structuredClone(elements);
  const units = buildUnits(rewritten, intervalRatios);
  const constrained =
    targets.durationSeconds !== null || targets.volumeMetres !== null;

  let kept = rewritten;
  let swum = units;

  if (constrained && method === "trim") {
    const cut = cutToTargets(rewritten, units, paceSecondsPer100, targets);
    kept = cut.elements;
    swum = cut.units;
  } else if (constrained) {
    fitToTargets(units, paceSecondsPer100, targets, poolLength);
  }

  rewriteIntervals(units, paceSecondsPer100);

  return {
    source: renderProgramme(kept),
    summary: summarise(swum, paceSecondsPer100),
  };
}

/**
 * Read a session target typed into the modification dialog.
 *
 * @param value The raw field value.
 * @param scale What one unit of the field is worth, such as 60 for minutes.
 * @returns The target, or null when the field was left empty or unusable.
 */
export function parseTarget(value: string, scale: number): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = trimmed.includes(":")
    ? timeToSeconds(trimmed)
    : Number(trimmed) * scale;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

// BUILDING THE ADJUSTABLE UNITS
/**
 * Turn the instructions of a programme into units that can be resized.
 *
 * @param elements The parsed programme, whose instructions are resized in place.
 * @param intervalRatios The interval ratios of the elements.
 * @returns One unit per instruction, in programme order.
 */
function buildUnits(
  elements: ProgrammeElement[],
  intervalRatios: number[][],
): AdjustableUnit[] {
  return elements.flatMap((element, index): AdjustableUnit[] => {
    if (element.kind !== "instruction") return [];

    const length = element.length;
    const metres = lengthMetres(length);
    const ratios = intervalRatios[index] ?? [];

    return [
      {
        instruction: element,
        intervalRatio: ratios[element.lines.length - 1] ?? 1,
        innerModels: element.inner.map(inner => ({
          inner,
          intervalRatio: ratios[inner.lineIndex] ?? 1,
        })),
        perRepetitionMetres: metres,
        perRepetitionFixedSeconds: lengthFixedSeconds(length),
        originalMetres: metres * element.repetitions,
        changedMetres: 0,
        canChangeRepetitions: element.hasRepetitionOperator,
        // The distance of a block belongs to the instructions inside it, and a
        // length written as a time is the swimmer's to fill, so neither can be
        // rewritten from out here.
        canChangeLength: length.kind === "distance" || length.kind === "laps",
      },
    ];
  });
}

// MEASURING AGAINST THE TARGETS

/** Whether a total time runs past the session's duration. */
function runsOverDuration(seconds: number, targets: SessionTargets): boolean {
  return (
    targets.durationSeconds !== null &&
    seconds > targets.durationSeconds + TOLERANCE_SECONDS
  );
}

/** Whether the programme is currently longer or bigger than the targets. */
function exceedsTargets({ units, pace, targets }: FitContext): boolean {
  const { seconds, metres } = totals(units, pace);
  return (
    runsOverDuration(seconds, targets) ||
    (targets.volumeMetres !== null && metres > targets.volumeMetres)
  );
}

/**
 * How far the programme sits under each target, in metres, measured through
 * one unit, since a metre of an easy set and a metre of a hard one cost
 * different amounts of session time.
 *
 * @returns The room left under each target, negative where the programme runs
 *   over it, and null where the target is not set or the unit cannot measure
 *   it.
 */
function roomUnderTargets(
  { units, pace, targets }: FitContext,
  unit: AdjustableUnit,
): { volume: number | null; time: number | null } {
  const { seconds, metres } = totals(units, pace);
  const perMetre = secondsPerMetre(unit, pace);

  return {
    volume: targets.volumeMetres === null ? null : targets.volumeMetres - metres,
    time:
      targets.durationSeconds === null || perMetre <= 0
        ? null
        : (targets.durationSeconds - seconds) / perMetre,
  };
}

/**
 * The volume that has to come out of the programme, measured through one
 * unit. At or below zero when the programme already fits.
 */
function metresToRemove(fit: FitContext, unit: AdjustableUnit): number {
  const { volume, time } = roomUnderTargets(fit, unit);
  return Math.max(-(volume ?? 0), -(time ?? 0));
}

/**
 * The volume that can still be added to the programme, measured through one
 * unit, without going past either target.
 */
function metresToAdd(fit: FitContext, unit: AdjustableUnit): number {
  const { volume, time } = roomUnderTargets(fit, unit);
  return Math.min(volume ?? Infinity, time ?? Infinity);
}

// FITTING THE PROGRAMME

/** A reversed copy of a list, which is left as it was. */
function reversed<T>(items: T[]): T[] {
  return [...items].reverse();
}

/**
 * Group the units of a programme by the priority their section is given.
 *
 * @param units The units of the programme.
 * @returns The warm up and warm down, then any unlabelled sets, then the main
 *   set. Cuts run through this order and additions run through its reverse.
 */
function tiersOf(units: AdjustableUnit[]): AdjustableUnit[][] {
  const isMainSet = (unit: AdjustableUnit): boolean =>
    unit.instruction.section === "mainSet";

  return [
    units.filter(isScaffold),
    units.filter(unit => !isScaffold(unit) && !isMainSet(unit)),
    units.filter(isMainSet),
  ];
}

/**
 * The most a set may still give up, or take on, at this point in the pass.
 *
 * The allowance counts everything the set has already given up, not just what
 * it gave up on the current sweep. Without that, a set that can be trimmed a
 * length at a time would keep absorbing the whole change while a set that
 * only moves in whole repetitions, being too coarse to fit the allowance,
 * was never touched at all.
 */
function allowanceFor(
  unit: AdjustableUnit,
  fraction: number,
  weight = 1,
): number {
  if (fraction === Infinity) return Infinity;
  return Math.max(0, weight * fraction * unit.originalMetres - unit.changedMetres);
}

/** How readily a set takes on extra volume. */
function growthWeightOf(unit: AdjustableUnit): number {
  return unit.canChangeRepetitions ? REPEATED_SET_GROWTH_WEIGHT : 1;
}

/**
 * The order the sets of a tier are offered extra volume in: sets of
 * repetitions before swims written once, and later sets before earlier ones
 * within each of the two groups.
 */
function growthOrder(tier: AdjustableUnit[]): AdjustableUnit[] {
  const visits = reversed(tier);

  return [
    ...visits.filter(unit => unit.canChangeRepetitions),
    ...visits.filter(unit => !unit.canChangeRepetitions),
  ];
}

/**
 * Bring a programme down to its targets, taking the warm up and warm down
 * before the main set, and later sets before earlier ones.
 */
function shrinkToFit(fit: FitContext, tiers: AdjustableUnit[][]): void {
  // Each tier is worked to exhaustion before the next one is touched, so the
  // warm up and warm down have given up everything they are allowed to give
  // before the main set loses a single length.
  for (const tier of tiers) {
    for (const fraction of SWEEP_FRACTIONS) {
      let changed = true;

      while (changed && exceedsTargets(fit)) {
        changed = false;

        for (const unit of reversed(tier)) {
          if (!exceedsTargets(fit)) return;

          // A set swum for a fixed time has no distance to give up, so it is
          // skipped rather than taken as a sign that the cut is finished.
          const wanted = metresToRemove(fit, unit);
          if (wanted <= 0) continue;

          const allowance = Math.min(wanted, allowanceFor(unit, fraction));
          if (shrinkUnit(fit, unit, allowance, false) > 0) changed = true;
        }
      }
    }

    // What is left to cut is now smaller than any single repetition or length
    // this tier can give up. Rather than move on to a tier the session can
    // less afford to lose, take one step here and accept that it cuts a
    // little deeper than was asked for.
    while (exceedsTargets(fit)) {
      const stepped = reversed(tier).some(
        unit => shrinkUnit(fit, unit, metresToRemove(fit, unit), true) > 0,
      );
      if (!stepped) break;
    }

    if (!exceedsTargets(fit)) return;
  }
}

/**
 * Build a programme up towards its targets, extending the main set first and
 * leaning on the warm up and warm down last, so that a longer session is
 * spent on the work the session was written around.
 */
function growToFit(fit: FitContext, tiers: AdjustableUnit[][]): void {
  // As with cutting, one tier at a time: the main set takes on as much of the
  // spare time as it can hold before anything is added to the warm up or the
  // warm down.
  for (const tier of tiers) {
    for (
      let fraction = GROWTH_FIRST_FRACTION;
      fraction <= GROWTH_LAST_FRACTION;
      fraction *= 2
    ) {
      let changed = true;

      while (changed) {
        changed = false;

        for (const unit of growthOrder(tier)) {
          const spare = metresToAdd(fit, unit);
          if (spare <= 0) continue;

          const allowance = allowanceFor(unit, fraction, growthWeightOf(unit));
          if (growUnit(fit, unit, Math.min(spare, allowance)) > 0) changed = true;
        }
      }
    }
  }
}

/**
 * Bring a programme fitted to a distance as close to that distance as its
 * sets allow.
 *
 * Resizing stops at or under the volume, which is right for a limit but not
 * for a distance the coach asked for: a programme that only moves in steps
 * of 100 would otherwise finish 90 metres short of a target it could have
 * passed by 10. One more step is taken when it lands nearer the distance
 * than the programme already is, as long as the session still fits its
 * duration. Tiers are offered the step in the order they take on volume, and
 * within a tier the smallest step is taken.
 *
 * @param fit The fit in progress.
 * @param tiers The tiers of the programme, in the order they take on volume.
 */
function settleOnDistance(fit: FitContext, tiers: AdjustableUnit[][]): void {
  const { units, pace, targets, poolLength } = fit;
  if (targets.volumeMetres === null) return;

  const shortfall = targets.volumeMetres - totals(units, pace).metres;
  if (shortfall <= 0) return;

  for (const tier of tiers) {
    const steps = growthOrder(tier)
      .map(unit => smallestStepUp(unit, poolLength))
      .filter(
        (step): step is StepUp =>
          step !== null &&
          // Going past the distance must still leave the programme nearer it.
          step.metres - shortfall < shortfall &&
          step.metres <= budgetFor(fit, step.unit),
      )
      .sort((a, b) => a.metres - b.metres);

    for (const { unit, repetitions, perRepetitionMetres } of steps) {
      const originalRepetitions = unit.instruction.repetitions;
      const originalMetres = unit.perRepetitionMetres;

      resizeUnit(unit, repetitions, perRepetitionMetres, poolLength);

      if (!runsOverDuration(totals(units, pace).seconds, targets)) return;

      resizeUnit(unit, originalRepetitions, originalMetres, poolLength);
    }
  }
}

/** Fit a programme to its targets, in whichever direction it needs to move. */
function fitToTargets(
  units: AdjustableUnit[],
  pace: number,
  targets: SessionTargets,
  poolLength: number,
): void {
  const tiers = tiersOf(units);
  const scaffoldMetres = tiers[0]?.reduce(
    (total, unit) => total + unit.originalMetres,
    0,
  );
  const fit: FitContext = {
    units,
    pace,
    targets,
    poolLength,
    scaffoldBudget: SCAFFOLD_BUDGET_FRACTION * (scaffoldMetres ?? 0),
  };
  const growthTiers = reversed(tiers);

  if (exceedsTargets(fit)) {
    shrinkToFit(fit, tiers);
  } else {
    growToFit(fit, growthTiers);
  }

  // A duration is a limit the session cannot run past, but a distance is
  // something to arrive at, so it is allowed to land just beyond.
  if (targets.goal === "distance") settleOnDistance(fit, growthTiers);
}

/**
 * Rewrite every `on` interval in the programme for the swimmer's pace, so
 * that the intervals match the distances the sets ended up at.
 */
function rewriteIntervals(units: AdjustableUnit[], pace: number): void {
  for (const unit of units) {
    if (unit.instruction.rest.kind === "sinceStart") {
      rewriteOnInterval(
        unit.instruction,
        secondsToTime(intervalSeconds(unit, pace)),
      );
    }

    for (const { inner, intervalRatio } of unit.innerModels) {
      if (inner.rest.kind !== "sinceStart") continue;

      const swim = swimmingSeconds(inner.metres, inner.fixedSeconds, pace);
      rewriteOnInterval(
        unit.instruction,
        secondsToTime(intervalFor(swim, intervalRatio)),
        inner.lineIndex,
      );
    }
  }
}
