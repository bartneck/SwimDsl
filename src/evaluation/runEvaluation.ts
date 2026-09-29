import fs from "fs";
import path from "path";
import { generateProgrammes, GeneratorSettings } from "../logic/sessionGenerator";
import parseProgramme from "./parseProgramme";
import { evaluateVolume } from "./volumeEvaluator";

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
  };
}

const results: ProgrammeResult[] = [];

for (let i = 0; i < NUMBER_OF_PROGRAMMES; i++) {
  const programmes = generateProgrammes(settings);
  let totalActualVolume = 0

  for (const source of programmes) {
    const programme = parseProgramme(source);
    const volumeResult = evaluateVolume(programme, settings.distance);
    totalActualVolume += volumeResult.actualVolume;
  }

  const totalTargetVolume = settings.distance * programmes.length;
  const absoluteError = Math.abs(totalActualVolume - totalTargetVolume);
  const percentageError = totalTargetVolume === 0 ? 0 : (absoluteError / totalTargetVolume) * 100

  results.push({
    programmeId: i + 1,
    targetVolume: totalTargetVolume,
    actualVolume: totalActualVolume,
    absoluteError,
    percentageError,
    source: programmes.join("\n\n"),
  })
}

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
    name: "Baseline Volume Evaluation",
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
  "baseline-volume-evaluation.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(output, null, 2)
);
