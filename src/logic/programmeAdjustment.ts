/**
 * Fitting a swim programme to a session's duration and volume.
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

import {
  cloneProgramme,
  renderProgramme,
  rewriteHead,
  rewriteRestDuration,
  type InnerInstruction,
  type InstructionElement,
  type InstructionLength,
  type InstructionRest,
  type ProgrammeElement,
  type SectionKind,
} from "./programmeParsing.ts";
import {
  restSecondsFor,
  secondsToTime,
  swimSeconds,
  timeToSeconds,
} from "./swimTime.ts";

/** What the session has to fit into. */
export interface SessionTargets {
  /** The length of the session in seconds, or null when it is open ended. */
  durationSeconds: number | null;
  /** The volume of the session in metres, or null when it is unconstrained. */
  volumeMetres: number | null;
}

/** What a programme came out as, once it had been fitted to the targets. */
export interface AdjustmentSummary {
  paceSecondsPer100: number;
  totalSeconds: number;
  totalMetres: number;
  /**
   * The training load of the session: pace multiplied by volume, which is the
   * time the swimmer actually spends swimming rather than resting.
   */
  loadSeconds: number;
}

/** A programme fitted to a set of targets for one swimmer's pace. */
export interface FittedProgramme {
  source: string;
  summary: AdjustmentSummary;
}

/**
 * How a programme is made to fit the session.
 *
 * `rescale` resizes the sets of the programme, keeping its shape from the
 * first length to the last. `trim` leaves the sets as the coach wrote them
 * and simply stops the programme where the session runs out, which is the
 * blunter option but the one that leaves every set that survives untouched.
 */
export type FitMethod = "rescale" | "trim";

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

/** Seconds of rest assumed for each swimmer waited on by an `in-out` rest. */
const IN_OUT_SECONDS_PER_SWIMMER = 5;

/** Totals are compared with a little slack to keep rounding out of the loop. */
const TOLERANCE_SECONDS = 0.5;

/** A parsed instruction together with everything needed to resize it. */
interface AdjustableUnit {
  instruction: InstructionElement;
  /**
   * The interval this instruction was written with, relative to the average
   * interval its distance was given across the programme. Keeping the ratio
   * keeps a set written as a hard effort hard, and an easy one easy, when the
   * intervals are recalculated for a new pace.
   */
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

/**
 * Work out how each interval in a programme compares with the average
 * interval written for that distance. Keeping the ratio when the intervals
 * are recalculated keeps a set that was written as a hard effort hard, and an
 * easy one easy. Ratios are taken from the programme as authored, so every
 * pace it is rewritten for keeps the same shape.
 *
 * @param elements The parsed programme.
 * @param poolLength The pool length the programme is written for.
 * @returns For each element, the interval ratio of each of its lines,
 *   indexed as the elements and their lines are. Lines without an interval
 *   are left at one.
 */
export function measureIntervalRatios(
  elements: ProgrammeElement[],
  poolLength: number,
): number[][] {
  const intervalsByDistance = new Map<number, number[]>();

  const record = (metres: number, seconds: number): void => {
    const intervals = intervalsByDistance.get(metres);
    if (intervals) {
      intervals.push(seconds);
    } else {
      intervalsByDistance.set(metres, [seconds]);
    }
  };

  for (const element of elements) {
    if (element.kind !== "instruction") continue;

    if (element.rest.kind === "sinceStart") {
      record(perRepetitionMetres(element, poolLength), element.rest.seconds);
    }
    for (const inner of element.inner) {
      if (inner.rest.kind === "sinceStart") {
        record(inner.metres, inner.rest.seconds);
      }
    }
  }

  const ratioOf = (metres: number, seconds: number): number => {
    const intervals = intervalsByDistance.get(metres);
    if (!intervals || intervals.length === 0) return 1;

    const average =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return average > 0 ? seconds / average : 1;
  };

  return elements.map(element => {
    if (element.kind !== "instruction") return [];

    const ratios = new Array<number>(element.lines.length).fill(1);

    if (element.rest.kind === "sinceStart") {
      ratios[element.lines.length - 1] = ratioOf(
        perRepetitionMetres(element, poolLength),
        element.rest.seconds,
      );
    }
    for (const inner of element.inner) {
      if (inner.rest.kind === "sinceStart") {
        ratios[inner.lineIndex] = ratioOf(inner.metres, inner.rest.seconds);
      }
    }

    return ratios;
  });
}

/**
 * Fit a programme to a swimmer's pace and to the session's targets.
 *
 * @param elements The parsed programme, which is left untouched.
 * @param intervalRatios The interval ratios from {@link measureIntervalRatios}.
 * @param paceSecondsPer100 The swimmer's pace, in seconds per 100 metres.
 * @param targets The duration and volume the session has to fit into.
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
  const rewritten = cloneProgramme(elements);
  const units = buildUnits(rewritten, intervalRatios, poolLength);
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

/** How the comment describing an adjustment begins. */
const SUMMARY_PREFIX = "# Fitted to a ";

/**
 * Describe a rescaled programme as a SwimDSL comment, so that a swimmer
 * picking up the programme can see what it was fitted to.
 *
 * @param summary The summary of the rescaled programme.
 * @param targets The targets the programme was fitted to.
 * @returns A single comment line.
 */
export function describeAdjustment(
  summary: AdjustmentSummary,
  targets: SessionTargets,
): string {
  const target =
    targets.durationSeconds === null
      ? ""
      : ` of ${secondsToTime(targets.durationSeconds)}`;

  return (
    `${SUMMARY_PREFIX}${secondsToTime(summary.paceSecondsPer100)} per 100 pace: ` +
    `${summary.totalMetres} metres in ${secondsToTime(summary.totalSeconds)}` +
    `${target}, training load ${secondsToTime(summary.loadSeconds)}.`
  );
}

/**
 * Strip the comment left by a previous adjustment, so that a programme that
 * has already been fitted once does not collect a summary for every pass.
 *
 * @param programme The SwimDSL source of a programme.
 * @returns The programme without its adjustment summary.
 */
export function withoutAdjustmentSummary(programme: string): string {
  const lines = programme.split("\n");
  while (lines[0]?.startsWith(SUMMARY_PREFIX)) lines.shift();
  return lines.join("\n");
}

// BUILDING THE ADJUSTABLE UNITS

/**
 * The distance swum in one repetition of an instruction.
 *
 * @param instruction The instruction to measure.
 * @param poolLength The pool length the programme is written for.
 * @returns The distance in metres. Instructions written as a length of time
 *   swim an unknown distance, so they count as none.
 */
function perRepetitionMetres(
  instruction: InstructionElement,
  poolLength: number,
): number {
  const length = instruction.length;
  switch (length.kind) {
    case "distance":
      return length.metres;
    case "laps":
      return length.laps * poolLength;
    case "block":
      return length.metres;
    case "time":
      return 0;
  }
}

/**
 * Turn the instructions of a programme into units that can be resized.
 *
 * @param elements The parsed programme, whose instructions are resized in place.
 * @param intervalRatios The interval ratios of the elements.
 * @param poolLength The pool length the programme is written for.
 * @returns One unit per instruction, in programme order.
 */
function buildUnits(
  elements: ProgrammeElement[],
  intervalRatios: number[][],
  poolLength: number,
): AdjustableUnit[] {
  const units: AdjustableUnit[] = [];

  elements.forEach((element, index) => {
    if (element.kind !== "instruction") return;

    const metres = perRepetitionMetres(element, poolLength);
    const length = element.length;
    const ratios = intervalRatios[index] ?? [];

    units.push({
      instruction: element,
      intervalRatio: ratios[element.lines.length - 1] ?? 1,
      innerModels: element.inner.map(inner => ({
        inner,
        intervalRatio: ratios[inner.lineIndex] ?? 1,
      })),
      perRepetitionMetres: metres,
      perRepetitionFixedSeconds:
        length.kind === "time"
          ? length.seconds
          : length.kind === "block"
            ? length.fixedSeconds
            : 0,
      originalMetres: metres * element.repetitions,
      changedMetres: 0,
      canChangeRepetitions: element.hasRepetitionOperator,
      // The distance of a block belongs to the instructions inside it, and a
      // length written as a time is the swimmer's to fill, so neither can be
      // rewritten from out here.
      canChangeLength: length.kind === "distance" || length.kind === "laps",
    });
  });

  return units;
}

// THE TIME AND VOLUME MODEL

/** The time one repetition of a unit spends swimming, rest aside. */
function swimmingSeconds(unit: AdjustableUnit, pace: number): number {
  return (
    swimSeconds(unit.perRepetitionMetres, pace) + unit.perRepetitionFixedSeconds
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
function intervalFor(swim: number, ratio: number): number {
  const base = swim + restSecondsFor(swim, "endurance");
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
function intervalSeconds(unit: AdjustableUnit, pace: number): number {
  return intervalFor(swimmingSeconds(unit, pace), unit.intervalRatio);
}

/**
 * The time one repetition of a unit takes, rest inside a block included but
 * the unit's own rest not yet added on.
 */
function contentSeconds(unit: AdjustableUnit, pace: number): number {
  if (unit.innerModels.length === 0) return swimmingSeconds(unit, pace);

  let seconds = 0;

  for (const { inner, intervalRatio } of unit.innerModels) {
    const swim = swimSeconds(inner.metres, pace) + inner.fixedSeconds;
    seconds +=
      inner.multiplier *
      inner.repetitions *
      restedSeconds(swim, inner.rest, intervalRatio);
  }

  return seconds;
}

/** The time a unit takes, including rest, at a pace. */
function unitSeconds(unit: AdjustableUnit, pace: number): number {
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
function unitMetres(unit: AdjustableUnit): number {
  return unit.perRepetitionMetres * unit.instruction.repetitions;
}

/** The totals of a whole programme at a pace. */
function totals(
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
function secondsPerMetre(unit: AdjustableUnit, pace: number): number {
  const metres = unitMetres(unit);
  return metres > 0 ? unitSeconds(unit, pace) / metres : 0;
}

/** Whether the programme is currently longer or bigger than the targets. */
function exceedsTargets(
  units: AdjustableUnit[],
  pace: number,
  targets: SessionTargets,
): boolean {
  const { seconds, metres } = totals(units, pace);
  return (
    (targets.durationSeconds !== null &&
      seconds > targets.durationSeconds + TOLERANCE_SECONDS) ||
    (targets.volumeMetres !== null && metres > targets.volumeMetres)
  );
}

/**
 * The volume that has to come out of the programme, measured through one
 * unit, since a metre of an easy set and a metre of a hard one cost different
 * amounts of session time.
 *
 * @returns Metres to remove, or a value at or below zero when the programme
 *   already fits.
 */
function metresToRemove(
  units: AdjustableUnit[],
  pace: number,
  targets: SessionTargets,
  unit: AdjustableUnit,
): number {
  const { seconds, metres } = totals(units, pace);
  const perMetre = secondsPerMetre(unit, pace);

  const overVolume =
    targets.volumeMetres === null ? 0 : metres - targets.volumeMetres;
  const overTime =
    targets.durationSeconds === null || perMetre <= 0
      ? 0
      : (seconds - targets.durationSeconds) / perMetre;

  return Math.max(overVolume, overTime);
}

/**
 * The volume that can still be added to the programme, measured through one
 * unit, without going past either target.
 */
function metresToAdd(
  units: AdjustableUnit[],
  pace: number,
  targets: SessionTargets,
  unit: AdjustableUnit,
): number {
  const { seconds, metres } = totals(units, pace);
  const perMetre = secondsPerMetre(unit, pace);

  const spareVolume =
    targets.volumeMetres === null ? Infinity : targets.volumeMetres - metres;
  const spareTime =
    targets.durationSeconds === null || perMetre <= 0
      ? Infinity
      : (targets.durationSeconds - seconds) / perMetre;

  return Math.min(spareVolume, spareTime);
}

// RESIZING SETS

/** Rebuild a length of the same style as the original, at a new distance. */
function lengthOf(
  unit: AdjustableUnit,
  metres: number,
  poolLength: number,
): InstructionLength | null {
  const length = unit.instruction.length;

  if (length.kind === "distance") return { kind: "distance", metres };
  if (length.kind === "laps") {
    return { kind: "laps", laps: Math.round(metres / poolLength), metres };
  }
  return null;
}

/**
 * Take volume out of a single set.
 *
 * Dropping a repetition is preferred, since it leaves the distance of the set
 * as the coach wrote it, and shortening each repetition by whole lengths of
 * the pool is the fallback for sets that are swum once.
 *
 * @param unit The set to shrink, rewritten in place.
 * @param allowanceMetres The most that may be taken in this pass.
 * @param budgetMetres What is left of the section's overall allowance.
 * @param poolLength The pool length the programme is written for.
 * @param allowOvershoot Whether a single step may be taken even when it takes
 *   out more than was asked for. Granularity means the last step of a cut
 *   often has to overshoot for the programme to fit at all.
 * @returns The volume removed, in metres.
 */
function shrinkUnit(
  unit: AdjustableUnit,
  allowanceMetres: number,
  budgetMetres: number,
  poolLength: number,
  allowOvershoot: boolean,
): number {
  const repetitions = unit.instruction.repetitions;
  const perRepetition = unit.perRepetitionMetres;

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
    rewriteHead(unit.instruction, repetitions - repetitionSteps, null);
    return repetitionDelta;
  }

  if (lengthDelta > 0) {
    const metres = perRepetition - lengthSteps * poolLength;
    const length = lengthOf(unit, metres, poolLength);
    if (length) {
      rewriteHead(unit.instruction, repetitions, length);
      unit.perRepetitionMetres = metres;
      return lengthDelta;
    }
  }

  return 0;
}

/**
 * Add volume to a single set, using the same two knobs as {@link shrinkUnit}
 * and never going past what was asked for.
 *
 * @returns The volume added, in metres.
 */
function growUnit(
  unit: AdjustableUnit,
  allowanceMetres: number,
  budgetMetres: number,
  poolLength: number,
): number {
  const repetitions = unit.instruction.repetitions;
  const perRepetition = unit.perRepetitionMetres;

  if (perRepetition <= 0) return 0;

  const cap = Math.min(allowanceMetres, budgetMetres);
  if (cap <= 0) return 0;

  const repetitionSteps = unit.canChangeRepetitions
    ? Math.floor(cap / perRepetition)
    : 0;
  const lengthStep = repetitions * poolLength;
  const lengthSteps = unit.canChangeLength
    ? Math.floor(cap / lengthStep)
    : 0;

  const repetitionDelta = repetitionSteps * perRepetition;
  const lengthDelta = lengthSteps * lengthStep;

  // Another repetition of a set the swimmer is already doing beats making
  // each repetition longer, so it is taken whenever one fits.
  if (repetitionDelta > 0) {
    rewriteHead(unit.instruction, repetitions + repetitionSteps, null);
    return repetitionDelta;
  }

  if (lengthDelta > 0) {
    const metres = perRepetition + lengthSteps * poolLength;
    const length = lengthOf(unit, metres, poolLength);
    if (length) {
      rewriteHead(unit.instruction, repetitions, length);
      unit.perRepetitionMetres = metres;
      return lengthDelta;
    }
  }

  return 0;
}

// FITTING THE PROGRAMME

/** Whether a unit belongs to the warm up or the warm down. */
function isScaffold(section: SectionKind): boolean {
  return section === "warmUp" || section === "warmDown";
}

/**
 * Group the units of a programme by the priority their section is given.
 *
 * @param units The units of the programme.
 * @returns The warm up and warm down, then any unlabelled sets, then the main
 *   set. Cuts run through this order and additions run through its reverse.
 */
function tiersOf(units: AdjustableUnit[]): AdjustableUnit[][] {
  const scaffold: AdjustableUnit[] = [];
  const other: AdjustableUnit[] = [];
  const main: AdjustableUnit[] = [];

  for (const unit of units) {
    const section = unit.instruction.section;
    if (isScaffold(section)) scaffold.push(unit);
    else if (section === "mainSet") main.push(unit);
    else other.push(unit);
  }

  return [scaffold, other, main];
}

/** Tracks how much of the warm up and warm down has been given up so far. */
interface ScaffoldBudget {
  remaining: number;
}

/** What is left of a unit's section allowance. */
function budgetFor(unit: AdjustableUnit, budget: ScaffoldBudget): number {
  return isScaffold(unit.instruction.section) ? budget.remaining : Infinity;
}

/** Record volume taken from, or added to, the warm up or warm down. */
function spend(
  unit: AdjustableUnit,
  budget: ScaffoldBudget,
  metres: number,
): void {
  unit.changedMetres += metres;
  if (isScaffold(unit.instruction.section)) budget.remaining -= metres;
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

/**
 * How readily a set should take on extra volume.
 *
 * Extra volume sits far better on a set of repetitions than on a swim done
 * once: another 100 on the end of `5 x 100` is the same set asked for a
 * little longer, where the same metres added to a lone 400 turn it into a
 * swim the coach never wrote. Repeated sets are therefore given a larger
 * share of the growth, and single swims lengthen only once the repeated sets
 * around them have taken what they can.
 */
function growthWeightOf(unit: AdjustableUnit): number {
  return unit.canChangeRepetitions ? REPEATED_SET_GROWTH_WEIGHT : 1;
}

/**
 * The order the sets of a tier are offered extra volume in.
 *
 * Sets of repetitions come first, and are offered as much as their allowance
 * holds before a swim written once is lengthened at all. Within each of the
 * two groups the later sets still come first, as they do when volume is being
 * taken away.
 *
 * @param tier The sets of one tier, in programme order.
 * @returns The sets in the order they should be offered volume.
 */
function growthOrder(tier: AdjustableUnit[]): AdjustableUnit[] {
  const visits = [...tier].reverse();

  return [
    ...visits.filter(unit => unit.canChangeRepetitions),
    ...visits.filter(unit => !unit.canChangeRepetitions),
  ];
}

/**
 * Bring a programme down to its targets, taking the warm up and warm down
 * before the main set, and later sets before earlier ones.
 */
function shrinkToFit(
  units: AdjustableUnit[],
  tiers: AdjustableUnit[][],
  pace: number,
  targets: SessionTargets,
  poolLength: number,
  budget: ScaffoldBudget,
): void {
  // Each tier is worked to exhaustion before the next one is touched, so the
  // warm up and warm down have given up everything they are allowed to give
  // before the main set loses a single length.
  for (const tier of tiers) {
    for (const fraction of SWEEP_FRACTIONS) {
      let changed = true;

      while (changed && exceedsTargets(units, pace, targets)) {
        changed = false;

        for (let index = tier.length - 1; index >= 0; index--) {
          const unit = tier[index];
          if (!unit) continue;
          if (!exceedsTargets(units, pace, targets)) return;

          // A set swum for a fixed time has no distance to give up, so it is
          // skipped rather than taken as a sign that the cut is finished.
          const wanted = metresToRemove(units, pace, targets, unit);
          if (wanted <= 0) continue;

          const removed = shrinkUnit(
            unit,
            Math.min(wanted, allowanceFor(unit, fraction)),
            budgetFor(unit, budget),
            poolLength,
            false,
          );

          if (removed > 0) {
            spend(unit, budget, removed);
            changed = true;
          }
        }
      }
    }

    // What is left to cut is now smaller than any single repetition or length
    // this tier can give up. Rather than move on to a tier the session can
    // less afford to lose, take one step here and accept that it cuts a
    // little deeper than was asked for.
    while (exceedsTargets(units, pace, targets)) {
      let removed = 0;

      for (let index = tier.length - 1; index >= 0 && removed === 0; index--) {
        const unit = tier[index];
        if (!unit) continue;

        removed = shrinkUnit(
          unit,
          metresToRemove(units, pace, targets, unit),
          budgetFor(unit, budget),
          poolLength,
          true,
        );
        if (removed > 0) spend(unit, budget, removed);
      }

      if (removed === 0) break;
    }

    if (!exceedsTargets(units, pace, targets)) return;
  }
}

/**
 * Build a programme up towards its targets, extending the main set first and
 * leaning on the warm up and warm down last, so that a longer session is
 * spent on the work the session was written around.
 */
function growToFit(
  units: AdjustableUnit[],
  tiers: AdjustableUnit[][],
  pace: number,
  targets: SessionTargets,
  poolLength: number,
  budget: ScaffoldBudget,
): void {
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
          const spare = metresToAdd(units, pace, targets, unit);
          if (spare <= 0) continue;

          const added = growUnit(
            unit,
            Math.min(spare, allowanceFor(unit, fraction, growthWeightOf(unit))),
            budgetFor(unit, budget),
            poolLength,
          );

          if (added > 0) {
            spend(unit, budget, added);
            changed = true;
          }
        }
      }
    }
  }
}

/**
 * Stop a programme where the session runs out, rather than resizing it.
 *
 * The sets are swum as written until one of them would take the session past
 * its duration or its volume. That set is cut down to however many
 * repetitions still fit, and the programme ends there. A set that is swum
 * once, and so cannot be cut down, is dropped along with everything after it.
 *
 * @param elements The parsed programme, whose surviving sets are rewritten in
 *   place.
 * @param units The units of the programme.
 * @param pace The swimmer's pace, in seconds per 100 metres.
 * @param targets The duration and volume the session has to fit into.
 * @returns The elements that make up the shortened programme, and the units
 *   that are actually swum.
 */
function cutToTargets(
  elements: ProgrammeElement[],
  units: AdjustableUnit[],
  pace: number,
  targets: SessionTargets,
): { elements: ProgrammeElement[]; units: AdjustableUnit[] } {
  const unitsByInstruction = new Map(units.map(unit => [unit.instruction, unit]));
  const maxSeconds = targets.durationSeconds ?? Infinity;
  const maxMetres = targets.volumeMetres ?? Infinity;

  const kept: ProgrammeElement[] = [];
  const swum: AdjustableUnit[] = [];
  let seconds = 0;
  let metres = 0;

  for (const element of elements) {
    if (element.kind !== "instruction") {
      kept.push(element);
      continue;
    }

    const unit = unitsByInstruction.get(element);
    if (!unit) continue;

    const repetitions = element.repetitions;
    const perRepetitionSeconds = unitSeconds(unit, pace) / repetitions;
    const perRepetitionMetres = unitMetres(unit) / repetitions;

    const fits = Math.min(
      repetitions,
      perRepetitionSeconds > 0
        ? Math.floor((maxSeconds - seconds) / perRepetitionSeconds)
        : repetitions,
      perRepetitionMetres > 0
        ? Math.floor((maxMetres - metres) / perRepetitionMetres)
        : repetitions,
    );

    if (fits >= repetitions) {
      seconds += perRepetitionSeconds * repetitions;
      metres += perRepetitionMetres * repetitions;
      kept.push(element);
      swum.push(unit);
      continue;
    }

    // The session runs out part way through this set. Keep whatever whole
    // repetitions still fit, and end the programme here.
    if (fits >= 1 && unit.canChangeRepetitions) {
      rewriteHead(element, fits, null);
      kept.push(element);
      swum.push(unit);
    }
    break;
  }

  return { elements: kept, units: swum };
}

/**
 * Fit a programme to its targets, in whichever direction it needs to move.
 */
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
  const budget: ScaffoldBudget = {
    remaining: SCAFFOLD_BUDGET_FRACTION * (scaffoldMetres ?? 0),
  };

  if (exceedsTargets(units, pace, targets)) {
    shrinkToFit(units, tiers, pace, targets, poolLength, budget);
  } else {
    growToFit(units, [...tiers].reverse(), pace, targets, poolLength, budget);
  }
}

/**
 * Rewrite every `on` interval in the programme for the swimmer's pace, so
 * that the intervals match the distances the sets ended up at.
 */
function rewriteIntervals(units: AdjustableUnit[], pace: number): void {
  for (const unit of units) {
    if (unit.instruction.rest.kind === "sinceStart") {
      const seconds = intervalSeconds(unit, pace);
      rewriteRestDuration(unit.instruction, "on", secondsToTime(seconds));
      unit.instruction.rest = { kind: "sinceStart", seconds };
    }

    for (const { inner, intervalRatio } of unit.innerModels) {
      if (inner.rest.kind !== "sinceStart") continue;

      const swim = swimSeconds(inner.metres, pace) + inner.fixedSeconds;
      const seconds = intervalFor(swim, intervalRatio);
      rewriteRestDuration(
        unit.instruction,
        "on",
        secondsToTime(seconds),
        inner.lineIndex,
      );
      inner.rest = { kind: "sinceStart", seconds };
    }
  }
}

/** Total up what the rescaled programme asks of the swimmer. */
function summarise(
  units: AdjustableUnit[],
  pace: number,
): AdjustmentSummary {
  const { seconds, metres } = totals(units, pace);

  return {
    paceSecondsPer100: pace,
    totalSeconds: Math.round(seconds),
    totalMetres: Math.round(metres),
    loadSeconds: Math.round(swimSeconds(metres, pace)),
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
