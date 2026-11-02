import type { GeneratorSettings } from "./sessionGenerator.ts";

type PaceZone = keyof GeneratorSettings["pace"];
export interface GeneratorValidationErrors {
  startDate?: string;
  weeks?: string;
  trainingDays?: string;
  baselineTime?: string;
  paces?: string;
  pace: Partial<Record<PaceZone, string>>;
  strokes?: string;
  poolLength?: string;
  distance?: string;
  weeklyRampPercent?: string;
}

/** Shared by the dialog and direct generator callers. */
export function validateGeneratorSettings(settings: GeneratorSettings): GeneratorValidationErrors {
  const errors: GeneratorValidationErrors = { pace: {} };
  const date = new Date(`${settings.startDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(settings.startDate) || !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== settings.startDate) {
    errors.startDate = "Choose a valid start date.";
  }
  if (!Number.isInteger(settings.weeks) || settings.weeks < 1 || settings.weeks > 12) {
    errors.weeks = "Enter a whole number of weeks from 1 to 12.";
  }
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  if (settings.trainingDays.length === 0 || settings.trainingDays.some((day) => !days.includes(day))) {
    errors.trainingDays = "Select at least one valid training day.";
  }
  const time = /^(\d{1,2}):([0-5]\d)$/.exec(settings.baselineTime.trim());
  if (!time || Number(time[1]) * 60 + Number(time[2]) <= 0) {
    errors.baselineTime = "Enter a time greater than 0:00 in m:ss or mm:ss format, with seconds from 00 to 59.";
  }
  for (const zone of Object.keys(settings.pace) as PaceZone[]) {
    const value = settings.pace[zone];
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      errors.pace[zone] = "Enter a percentage from 0 to 100.";
    }
  }
  if (!Object.values(settings.pace).some((value) => Number.isFinite(value) && value > 0 && value <= 100)) {
    errors.paces = "Enable at least one pace above 0%.";
  }
  const strokes = Object.values(settings.strokes);
  if (strokes.some((value) => !Number.isFinite(value) || value < 0 || value > 100) ||
      Math.abs(strokes.reduce((sum, value) => sum + value, 0) - 100) > 0.000001) {
    errors.strokes = "Enable at least one stroke; stroke percentages must total 100%.";
  }
  if (!Number.isFinite(settings.poolLength) || settings.poolLength <= 0) errors.poolLength = "Choose a positive pool length.";
  if (!Number.isFinite(settings.distance) || settings.distance <= 0) errors.distance = "Choose a positive target distance.";
  if (!Number.isFinite(settings.weeklyRampPercent) || settings.weeklyRampPercent < 0 || settings.weeklyRampPercent > 40) {
    errors.weeklyRampPercent = "Choose weekly progression from 0 to 40%.";
  }
  return errors;
}

export function generatorValidationMessages(errors: GeneratorValidationErrors): string[] {
  const { pace, ...fields } = errors;
  return [...Object.values(fields), ...Object.values(pace)];
}
