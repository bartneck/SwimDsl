/**
 * Helpers for the `m:ss` durations used throughout SwimDSL programmes, plus
 * the simple constant pace model used to predict how long an instruction
 * takes to swim.
 */

/**
 * The session types the interval calculator knows about. Endurance sessions
 * use a short fixed rest, speed sessions rest for as long as the swim itself.
 */
export type SessionType = "endurance" | "speed";

/** Fixed rest added to an endurance interval, in seconds. */
const ENDURANCE_REST_SECONDS = 15;

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
 * Add two `m:ss` durations together.
 *
 * @param a The first duration.
 * @param b The second duration.
 * @returns The sum, written as `m:ss`.
 */
export function addTimes(a: string, b: string): string {
  return secondsToTime(timeToSeconds(a) + timeToSeconds(b));
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
  return (metres / 100) * paceSecondsPer100;
}

/**
 * The distance a swimmer covers in a given time at a given pace. This is the
 * inverse of {@link swimSeconds}.
 *
 * @param seconds The time spent swimming.
 * @param paceSecondsPer100 The swimmer's pace, in seconds per 100 metres.
 * @returns The distance covered, in metres.
 */
export function swimMetres(seconds: number, paceSecondsPer100: number): number {
  return paceSecondsPer100 > 0 ? (seconds / paceSecondsPer100) * 100 : 0;
}

/**
 * The rest a swimmer is given on top of their swim time when an interval is
 * calculated from scratch.
 *
 * @param swimTimeSeconds The time spent swimming within the interval.
 * @param sessionType The kind of session being written.
 * @returns The rest in seconds.
 */
export function restSecondsFor(
  swimTimeSeconds: number,
  sessionType: SessionType,
): number {
  return sessionType === "endurance" ? ENDURANCE_REST_SECONDS : swimTimeSeconds;
}

/**
 * The time a swimmer should be given to complete a distance, excluding rest.
 *
 * @param distance The distance swum, in metres, as written in the programme.
 * @param pace The swimmer's pace per 100 metres, written as `m:ss`.
 * @returns The swim time, written as `m:ss`.
 */
export function getIntervalTime(distance: string, pace: string): string {
  // TODO: factor in the distance, e.g. a 50 is swum at a faster pace than a
  // 100, which is in turn faster than a 400.
  return secondsToTime(
    Math.floor(swimSeconds(Number(distance), timeToSeconds(pace))),
  );
}

/**
 * The rest to add to an interval for a given kind of session.
 *
 * @param interval The swim time of the interval, written as `m:ss`.
 * @param sessionType The kind of session being written.
 * @returns The rest, written as `m:ss`.
 */
export function getRestTime(interval: string, sessionType: string): string {
  return secondsToTime(
    restSecondsFor(
      timeToSeconds(interval),
      sessionType === "endurance" ? "endurance" : "speed",
    ),
  );
}
