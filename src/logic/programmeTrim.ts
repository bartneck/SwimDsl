/**
 * The blunter way of fitting a programme: leaving the sets as they were written
 * and stopping where the session runs out.
 */

import { rewriteHead } from "./programmeRewriting.ts";
import {
  unitMetres,
  unitSeconds,
  type AdjustableUnit,
} from "./programmeTiming.ts";
import type { ProgrammeElement, SessionTargets } from "./programmeTypes.ts";

/**
 * Stop a programme where the session runs out, rather than resizing it.
 *
 * The sets are swum as written until one of them would take the session past
 * its duration or its distance. That set is cut down to however many
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
export function cutToTargets(
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
