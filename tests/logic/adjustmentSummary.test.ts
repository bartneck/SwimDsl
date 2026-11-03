import { describe, expect, it } from "vitest";

import {
  describeAdjustment,
  summarise,
  withoutAdjustmentSummary,
  type AdjustmentSummary,
} from "../../src/logic/adjustmentSummary.ts";
import type { SessionTargets } from "../../src/logic/programmeTypes.ts";
import { parsed } from "./testFixtures.ts";

const SUMMARY: AdjustmentSummary = {
  paceSecondsPer100: 90,
  totalSeconds: 1783,
  totalMetres: 1700,
  loadSeconds: 1530,
};

const NO_TARGETS: SessionTargets = {
  goal: "duration",
  durationSeconds: null,
  volumeMetres: null,
};

describe("describeAdjustment", () => {
  it("states the pace, volume, time, and training load", () => {
    expect(describeAdjustment(SUMMARY, NO_TARGETS)).toBe(
      "# Fitted to a 1:30 per 100 pace: 1700 metres in 29:43, training load 25:30.",
    );
  });

  it("shows the duration it was fitted to", () => {
    expect(describeAdjustment(SUMMARY, { ...NO_TARGETS, durationSeconds: 1800 })).toBe(
      "# Fitted to a 1:30 per 100 pace: 1700 metres in 29:43 of 30:00, training load 25:30.",
    );
  });

  it("shows the volume it was fitted to", () => {
    expect(describeAdjustment(SUMMARY, { ...NO_TARGETS, volumeMetres: 1800 })).toBe(
      "# Fitted to a 1:30 per 100 pace: 1700 metres of 1800 in 29:43, training load 25:30.",
    );
  });

  it("shows both targets", () => {
    expect(
      describeAdjustment(
        {
          paceSecondsPer100: 70,
          totalSeconds: 1563,
          totalMetres: 1850,
          loadSeconds: 1295,
        },
        { goal: "distance", durationSeconds: 2400, volumeMetres: 1840 },
      ),
    ).toBe(
      "# Fitted to a 1:10 per 100 pace: 1850 metres of 1840 in 26:03 of 40:00, training load 21:35.",
    );
  });

  it("shows a target that could not be met", () => {
    expect(
      describeAdjustment(
        { ...SUMMARY, totalSeconds: 4510 },
        { ...NO_TARGETS, durationSeconds: 300 },
      ),
    ).toContain("in 75:10 of 5:00,");
  });

  it("reads the same whichever goal was chosen", () => {
    const targets = { durationSeconds: 1800, volumeMetres: 1800 };

    expect(describeAdjustment(SUMMARY, { goal: "distance", ...targets })).toBe(
      describeAdjustment(SUMMARY, { goal: "duration", ...targets }),
    );
  });

  it("is a single line of comment", () => {
    const description = describeAdjustment(SUMMARY, NO_TARGETS);

    expect(description.startsWith("#")).toBe(true);
    expect(description).not.toContain("\n");
  });
});

describe("withoutAdjustmentSummary", () => {
  const summary = describeAdjustment(SUMMARY, NO_TARGETS);

  it("removes the comment a previous adjustment left", () => {
    expect(withoutAdjustmentSummary(`${summary}\n100 Freestyle\n`)).toBe(
      "100 Freestyle\n",
    );
  });

  it("removes every one of them", () => {
    expect(withoutAdjustmentSummary(`${summary}\n${summary}\n100 Freestyle`)).toBe(
      "100 Freestyle",
    );
  });

  it("recognises what it wrote, whatever the targets", () => {
    const fitted = describeAdjustment(SUMMARY, {
      goal: "distance",
      durationSeconds: 2400,
      volumeMetres: 1840,
    });

    expect(withoutAdjustmentSummary(`${fitted}\n100 Freestyle`)).toBe("100 Freestyle");
  });

  it.each([
    ["a programme with no summary", "100 Freestyle\n"],
    ["a comment of the coach's own", "# Fitted for lane 3\n100 Freestyle"],
    ["a summary further down", `100 Freestyle\n${summary}\n`],
    ["a summary below a blank line", `\n${summary}\n100 Freestyle`],
    ["an empty programme", ""],
  ])("leaves %s alone", (_name, programme) => {
    expect(withoutAdjustmentSummary(programme)).toBe(programme);
  });

  it("leaves nothing of a programme that is only a summary", () => {
    expect(withoutAdjustmentSummary(summary)).toBe("");
  });
});

describe("summarise", () => {
  it("totals up the units", () => {
    expect(summarise(parsed("3 x 100 Freestyle on 1:45\n").units, 90)).toEqual({
      paceSecondsPer100: 90,
      totalSeconds: 315,
      totalMetres: 300,
      loadSeconds: 270,
    });
  });

  it("leaves rest out of the training load", () => {
    const rested = summarise(parsed("100 Freestyle with 5:00\n").units, 90);

    expect(rested.totalSeconds).toBe(390);
    expect(rested.loadSeconds).toBe(90);
  });

  it("leaves a timed swim out of the volume and the training load", () => {
    const timed = summarise(parsed("5:00 Freestyle\n").units, 90);

    expect(timed).toMatchObject({
      totalSeconds: 300,
      totalMetres: 0,
      loadSeconds: 0,
    });
  });

  it("rounds to whole seconds", () => {
    expect(summarise(parsed("25 Freestyle\n").units, 90)).toMatchObject({
      totalSeconds: 23,
      loadSeconds: 23,
    });
  });

  it("is nothing for no units", () => {
    expect(summarise([], 90)).toEqual({
      paceSecondsPer100: 90,
      totalSeconds: 0,
      totalMetres: 0,
      loadSeconds: 0,
    });
  });
});
