/**
 * Helpers for the `m:ss` durations used throughout SwimDSL programmes, plus
 * the simple constant pace model used to predict how long an instruction
 * takes to swim.
 */

/** Fixed rest added to an endurance interval, in seconds. */
export const ENDURANCE_REST_SECONDS = 15;

/**
 * Convert an `m:ss` duration into a whole number of seconds.
 *
 * @param time A duration such as `1:30`.
 * @returns The duration in seconds.
 */
export function timeToSeconds(time: string): number {
  const [mins = 0, secs = 0] = time.split(":").map(Number);
  return (Number.isNaN(mins) ? 0 : mins) * 60 + (Number.isNaN(secs) ? 0 : secs);
}

/**
 * Format a number of seconds as an `m:ss` duration.
 *
 * @param total The duration in seconds. Fractions are rounded to the nearest
 *   second so that generated programmes only ever contain whole seconds.
 * @returns The duration written as `m:ss`.
 */
export function secondsToTime(total: number): string {
  const rounded = Math.max(0, Math.round(total));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * The time a swimmer takes to cover a distance at a given pace.
 *
 * Pace is modelled as a constant speed, so a swimmer holding 1:30 per 100 m
 * is assumed to take 45 seconds for a 50 and three minutes for a 200.
 *
 * @param metres The distance swum.
 * @param paceSecondsPer100 The swimmer's pace, in seconds per 100 metres.
 * @returns The swim time in seconds.
 */
export function swimSeconds(metres: number, paceSecondsPer100: number): number {
  // TODO: factor in the distance, e.g. a 50 is swum at a faster pace than a
  // 100, which is in turn faster than a 400.
  return (metres / 100) * paceSecondsPer100;
}
