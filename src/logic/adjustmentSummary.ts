/**
 * The comment left at the top of a fitted programme, which tells a swimmer
 * picking it up what it was fitted to.
 */

import { totals, type AdjustableUnit } from "./programmeTiming.ts";
import type { SessionTargets } from "./programmeTypes.ts";
import { secondsToTime, swimSeconds } from "./swimTime.ts";

/** How the comment describing an adjustment begins. */
const SUMMARY_PREFIX = "# Fitted to a ";

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

/**
 * Describe a fitted programme as a SwimDSL comment, so that a swimmer picking
 * up the programme can see what it was fitted to.
 *
 * @param summary The summary of the fitted programme.
 * @param targets The targets the programme was fitted to.
 * @returns A single comment line.
 */
export function describeAdjustment(
  summary: AdjustmentSummary,
  targets: SessionTargets,
): string {
  const volumeTarget =
    targets.volumeMetres === null ? "" : ` of ${String(targets.volumeMetres)}`;
  const durationTarget =
    targets.durationSeconds === null
      ? ""
      : ` of ${secondsToTime(targets.durationSeconds)}`;

  return (
    `${SUMMARY_PREFIX}${secondsToTime(summary.paceSecondsPer100)} per 100 pace: ` +
    `${String(summary.totalMetres)} metres${volumeTarget} ` +
    `in ${secondsToTime(summary.totalSeconds)}${durationTarget}, ` +
    `training load ${secondsToTime(summary.loadSeconds)}.`
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

/** Total up what the fitted programme asks of the swimmer. */
export function summarise(
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
