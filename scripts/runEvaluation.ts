import fs from "fs";
import path from "path";
import { generateProgrammes, GeneratorSettings } from "../src/logic/sessionGenerator.ts";
import parseProgramme from "../src/evaluation/parseProgramme.ts";
import { evaluateVolume } from "../src/evaluation/volumeEvaluator.ts";
import { evaluateIntensity } from "../src/evaluation/intensityEvaluator.ts";
import { evaluateProgression, ProgressionResult } from "../src/evaluation/progressionEvaluator.ts";
import { evaluateVariation, extractSessionVariation, evaluateBetweenProgrammeVariation, type SessionVariation, type VariationResult, type BetweenProgrammeVariation, } from "../src/evaluation/variationEvaluator";
import { evaluateResponsiveness, type ResponsivenessCase, type ResponsivenessResult } from "../src/evaluation/responsivenessEvaluator.ts";
import { evaluatePeriodisation, getExpectedPhaseFactor, type TrainingPhase, type PhaseMetrics, type PeriodisationResult } from "../src/evaluation/periodisationEvaluator.ts";

function getProgrammeMetrics(
  settings: GeneratorSettings
) {
  const programmes = generateProgrammes(settings);

  let totalVolume = 0;

  for (const source of programmes) {
    const programme = parseProgramme(source);

    const volumeResult = evaluateVolume(
      programme,
      settings.distance
    );

    totalVolume += volumeResult.actualVolume;
  }

  return {
    sessionCount: programmes.length,
    totalVolume,
  };
}

const NUMBER_OF_PROGRAMMES = 20

const settings: GeneratorSettings = {
  startDate: "2026-09-28",
  weeks: 4,

  trainingDays: [
    "monday",
    "tuesday",
    "thursday",
    "friday",
    "saturday",
  ],

  phase: "base",
  focus: "mixed",

  distance: 3000,

  baselineTime: "1:40",

  poolLength: 25,
  distanceUnit: "metres",

  pace: {
    easy: 65,
    endurance: 72,
    threshold: 88,
    racePace: 95,
    max: 100,
  },

  strokes: {
    Freestyle: 70,
    Backstroke: 10,
    Breaststroke: 10,
    Butterfly: 10,
  },

  equipment: [
    "Kickboard",
    "Fins",
    "Pull Buoy",
    "Paddles",
    "Snorkel",
  ],

  weeklyRampPercent: 6,
};

interface ProgrammeResult {
  programmeId: number;
  targetVolume: number;
  actualVolume: number;
  absoluteError: number;
  percentageError: number;

  intensity: {
    easy: number;
    endurance: number;
    threshold: number;
    racePace: number;
    max: number;
    unknown: number;

    percentages: {
      easy: number;
      endurance: number;
      threshold: number;
      racePace: number;
      max: number;
      unknown: number;
    };
  };

  progression: ProgressionResult;
  variation: VariationResult;

  source: string;
}

interface EvaluationOutput {
  experiment: {
    name: string;
    numberOfProgrammes: number;
    settings: GeneratorSettings;
  };

  results: ProgrammeResult[];

  summary: {
    meanActualVolume: number;
    meanAbsoluteError: number;
    meanPercentageError: number;
    minimumActualVolume: number;
    maximumActualVolume: number;
    betweenProgrammeVariation: BetweenProgrammeVariation;
    responsiveness: ResponsivenessResult;
    periodisation: PeriodisationResult;
  };
}

const results: ProgrammeResult[] = [];
const allProgrammeVariations: SessionVariation[][] = [];

for (let i = 0; i < NUMBER_OF_PROGRAMMES; i++) {
  const programmes = generateProgrammes(settings);
  const sessionVolumes: {
    date: string;
    actualVolume: number;
  }[] = [];
  const sessionVariations: SessionVariation[] = [];
  let totalActualVolume = 0
  let totalEasy = 0;
  let totalEndurance = 0;
  let totalThreshold = 0;
  let totalRacePace = 0;
  let totalMax = 0;
  let totalUnknown = 0;

  for (const source of programmes) {
    const programme = parseProgramme(source);
    const volumeResult = evaluateVolume(programme, settings.distance);
    totalActualVolume += volumeResult.actualVolume;

    const dateMatch = source.match(
      /set Date\s+"(\d{4}-\d{2}-\d{2})"/
    );
    if (!dateMatch || !dateMatch[1]) {
      throw new Error(
        `Could not find a date in generated session:\n${source}`
      );
    }

    sessionVolumes.push({
      date: dateMatch[1],
      actualVolume: volumeResult.actualVolume,
    });

    sessionVariations.push(
      extractSessionVariation(source, dateMatch[1])
    );

    const intensityResult = evaluateIntensity(programme);

    totalEasy += intensityResult.easy;
    totalEndurance += intensityResult.endurance;
    totalThreshold += intensityResult.threshold;
    totalRacePace += intensityResult.racePace;
    totalMax += intensityResult.max;
    totalUnknown += intensityResult.unknown;
  }

  allProgrammeVariations.push(sessionVariations);

  const progression = evaluateProgression(
    sessionVolumes,
    settings.startDate,
    settings.weeklyRampPercent,
    settings.weeks,
    settings.phase
  );

  const variation = evaluateVariation(sessionVariations);

  const totalTargetVolume = settings.distance * programmes.length;
  const absoluteError = Math.abs(totalActualVolume - totalTargetVolume);
  const percentageError = totalTargetVolume === 0 ? 0 : (absoluteError / totalTargetVolume) * 100

  const intensityTotal = totalEasy + totalEndurance + totalThreshold + totalRacePace + totalMax + totalUnknown;

  const intensityPercentages = {
    easy: intensityTotal === 0 ? 0 : (totalEasy / intensityTotal) * 100,
    endurance: intensityTotal === 0 ? 0 : (totalEndurance / intensityTotal) * 100,
    threshold: intensityTotal === 0 ? 0 : (totalThreshold / intensityTotal) * 100,
    racePace: intensityTotal === 0 ? 0 : (totalRacePace / intensityTotal) * 100,
    max: intensityTotal === 0 ? 0 : (totalMax / intensityTotal) * 100,
    unknown: intensityTotal === 0 ? 0 : (totalUnknown / intensityTotal) * 100,
  };

  results.push({
    programmeId: i + 1,
    targetVolume: totalTargetVolume,
    actualVolume: totalActualVolume,
    absoluteError,
    percentageError,

    intensity: {
      easy: totalEasy,
      endurance: totalEndurance,
      threshold: totalThreshold,
      racePace: totalRacePace,
      max: totalMax,
      unknown: totalUnknown,

      percentages: intensityPercentages,
    },

    progression,
    variation,


    source: programmes.join("\n\n"),
  })
}

const betweenProgrammeVariation =
  evaluateBetweenProgrammeVariation(
    allProgrammeVariations
  );

const baselineMetrics = getProgrammeMetrics(settings);
const responsivenessCases: ResponsivenessCase[] = [];
const distanceSettings: GeneratorSettings = {
  ...settings,
  distance: 4000,
};
const distanceMetrics = getProgrammeMetrics(distanceSettings);

responsivenessCases.push({
  name: "Distance",
  changedSetting: "distance",
  baselineValue: settings.distance,
  modifiedValue: distanceSettings.distance,
  baselineMetric: baselineMetrics.totalVolume,
  modifiedMetric: distanceMetrics.totalVolume,
  direction: "increase",
  responded:
    distanceMetrics.totalVolume >
    baselineMetrics.totalVolume,
});

// Training days: 5 -> 3
const trainingDaysSettings: GeneratorSettings = {
  ...settings,
  trainingDays: [
    "monday",
    "wednesday",
    "friday",
  ],
};

const trainingDaysMetrics = getProgrammeMetrics(trainingDaysSettings);

responsivenessCases.push({
  name: "Training days",
  changedSetting: "trainingDays",
  baselineValue: settings.trainingDays.length,
  modifiedValue: trainingDaysSettings.trainingDays.length,
  baselineMetric: baselineMetrics.sessionCount,
  modifiedMetric: trainingDaysMetrics.sessionCount,
  direction: "decrease",
  responded:
    trainingDaysMetrics.sessionCount <
    baselineMetrics.sessionCount,
});

// Phase: base -> taper
const taperSettings: GeneratorSettings = {
  ...settings,
  phase: "taper",
};

const taperMetrics = getProgrammeMetrics(taperSettings);

responsivenessCases.push({
  name: "Training phase",
  changedSetting: "phase",
  baselineValue: settings.phase,
  modifiedValue: taperSettings.phase,
  baselineMetric: baselineMetrics.totalVolume,
  modifiedMetric: taperMetrics.totalVolume,
  direction: "decrease",
  responded:
    taperMetrics.totalVolume <
    baselineMetrics.totalVolume,
});

// Programme duration: 4 -> 6 weeks
const weeksSettings: GeneratorSettings = {
  ...settings,
  weeks: 6,
};

const weeksMetrics = getProgrammeMetrics(weeksSettings);

responsivenessCases.push({
  name: "Programme duration",
  changedSetting: "weeks",
  baselineValue: settings.weeks,
  modifiedValue: weeksSettings.weeks,
  baselineMetric: baselineMetrics.sessionCount,
  modifiedMetric: weeksMetrics.sessionCount,
  direction: "increase",
  responded:
    weeksMetrics.sessionCount >
    baselineMetrics.sessionCount,
});

const responsiveness = evaluateResponsiveness(responsivenessCases);

const phases: TrainingPhase[] = [
  "base",
  "build",
  "peak",
  "taper",
];

const phaseMetrics: PhaseMetrics[] = [];

const PERIODISATION_REPEATS = 20;

for (const phase of phases) {
  let totalVolume = 0;
  let totalSessions = 0;

  for (let i = 0; i < PERIODISATION_REPEATS; i++) {
    const phaseSettings: GeneratorSettings = {
      ...settings,
      phase,
    };

    const metrics = getProgrammeMetrics(phaseSettings);

    totalVolume += metrics.totalVolume;
    totalSessions += metrics.sessionCount;
  }

  const averageSessionVolume =
  totalSessions === 0 ? 0 : totalVolume / totalSessions;

  phaseMetrics.push({
    phase,
    phaseFactor: getExpectedPhaseFactor(phase),
    totalProgrammes: PERIODISATION_REPEATS,
    totalSessions,
    totalVolume,
    averageSessionVolume,
    reductionFromBase: 0
  });
}

const basePhase = phaseMetrics.find(
  (phase) => phase.phase === "base"
);

if (basePhase && basePhase.averageSessionVolume > 0) {
  for (const phase of phaseMetrics) {
    phase.reductionFromBase =
      ((basePhase.averageSessionVolume -
        phase.averageSessionVolume) /
        basePhase.averageSessionVolume) *
      100;
  }
}

const periodisation = evaluatePeriodisation(phaseMetrics);

const actualVolumes = results.map(
  (result) => result.actualVolume
);

const absoluteErrors = results.map(
  (result) => result.absoluteError
);

const percentageErrors = results.map(
  (result) => result.percentageError
);

const output: EvaluationOutput = {
  experiment: {
    name: "Baseline Evaluation",
    numberOfProgrammes: NUMBER_OF_PROGRAMMES,
    settings,
  },

  results,

  summary: {
    meanActualVolume:
      actualVolumes.reduce(
        (sum, value) => sum + value,
        0
      ) / actualVolumes.length,

    meanAbsoluteError:
      absoluteErrors.reduce(
        (sum, value) => sum + value,
        0
      ) / absoluteErrors.length,

    meanPercentageError:
      percentageErrors.reduce(
        (sum, value) => sum + value,
        0
      ) / percentageErrors.length,

    minimumActualVolume: Math.min(...actualVolumes),

    maximumActualVolume: Math.max(...actualVolumes),
    betweenProgrammeVariation,
    responsiveness,
    periodisation,
  },
};

const outputDirectory = path.join(
  process.cwd(),
  "evaluation-results"
);

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

const outputPath = path.join(
  outputDirectory,
  "baseline-evaluation.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(output, null, 2)
);
