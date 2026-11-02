import { describe, expect, it } from "vitest";

import {
  ENDURANCE_REST_SECONDS,
  secondsToTime,
  swimSeconds,
  timeToSeconds,
} from "../../src/logic/swimTime.ts";

describe("timeToSeconds", () => {
  it.each([
    ["1:30", 90],
    ["0:45", 45],
    ["12:05", 725],
    ["0:00", 0],
    ["90:00", 5400],
    ["1:5", 65],
  ])("reads %s as %i seconds", (time, seconds) => {
    expect(timeToSeconds(time)).toBe(seconds);
  });

  it("reads a lone number as minutes", () => {
    expect(timeToSeconds("5")).toBe(300);
  });

  it.each([
    ["", 0],
    ["abc", 0],
    ["1:xx", 60],
    ["x:30", 30],
  ])("treats the unreadable parts of %j as zero", (time, seconds) => {
    expect(timeToSeconds(time)).toBe(seconds);
  });

  it("ignores anything after the seconds", () => {
    expect(timeToSeconds("1:30:15")).toBe(90);
  });
});

describe("secondsToTime", () => {
  it.each([
    [0, "0:00"],
    [59, "0:59"],
    [60, "1:00"],
    [90, "1:30"],
    [3600, "60:00"],
  ])("writes %i seconds as %s", (seconds, time) => {
    expect(secondsToTime(seconds)).toBe(time);
  });

  it("zero pads the seconds", () => {
    expect(secondsToTime(65)).toBe("1:05");
  });

  it("rounds to whole seconds, since a fraction is not valid SwimDSL", () => {
    expect(secondsToTime(384.146341463414615)).toBe("6:24");
    expect(secondsToTime(365.85)).toBe("6:06");
  });

  it("carries a rounded second over into the minutes", () => {
    expect(secondsToTime(59.5)).toBe("1:00");
  });

  it("never writes a negative time", () => {
    expect(secondsToTime(-30)).toBe("0:00");
  });

  it("round trips through timeToSeconds", () => {
    for (const seconds of [0, 1, 59, 60, 61, 599, 3661]) {
      expect(timeToSeconds(secondsToTime(seconds))).toBe(seconds);
    }
  });
});

describe("swimSeconds", () => {
  it.each([
    [100, 90, 90],
    [50, 90, 45],
    [200, 90, 180],
    [0, 90, 0],
    [100, 0, 0],
  ])("takes %i m at %i s per 100 in %i s", (metres, pace, seconds) => {
    expect(swimSeconds(metres, pace)).toBe(seconds);
  });
});

describe("ENDURANCE_REST_SECONDS", () => {
  it("is the 15 s the intervals are recalculated with", () => {
    expect(ENDURANCE_REST_SECONDS).toBe(15);
  });
});
