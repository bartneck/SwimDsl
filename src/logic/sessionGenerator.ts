type SessionType = "volume" | "threshold" | "speed" | "mixed";

export interface GeneratorSettings {
  startDate: string;
  weeks: number;
  trainingDays: string[];
  phase: "base" | "build" | "peak" | "taper";
  focus: "speed" | "endurance" | "mixed";
  distance: number;
  baselineTime: string;
  poolLength: number;
  distanceUnit: "metres" | "yards";
  pace: {
    easy: number;
    endurance: number;
    threshold: number;
    racePace: number;
    max: number;
  };
  strokes: {
    Freestyle: number;
    Backstroke: number;
    Breaststroke: number;
    Butterfly: number;
  };
  equipment: string[];
  weeklyRampPercent: number;
}
interface SwimSet {
  kind: "set";
  repetitions: number;
  distance: number;
  durationSeconds?: number;
  laps?: number;
  stroke: string;
  strokeModifier?: string;
  intensityPercent?: number;
  intensityPercentEnd?: number;
  intensityZone?: string;
  restKind?: "on" | "with" | "in-out";
  sendoffSeconds: number;
  inOutCount?: number;
  equipment?: string[];
  underwater?: boolean;
  breatheEvery?: number;
  description?: string;
}

interface SwimGroup {
  kind: "group";
  repetitions?: number;
  items: SwimItem[];
  intensityZone?: string;
  description?: string;
}

type SwimItem = SwimSet | SwimGroup;

// Helpers

/**
 * Picks a random item from the provided array.
 * @param arr array of items to choose from
 * @returns randomly selected item from the array
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Picks a random item from the list based on the provided weights.
 * @param items list of items to choose from
 * @param weights corresponding weights for each item (must sum to > 0)
 * @returns randomly selected item from the list based on weights
 */
function pickWeighted(items: string[], weights: number[]): string {
  const total = weights.reduce((a, b) => a + b, 0);

  let r = Math.random() * total;

  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return items[i]!;
  }

  return items[items.length - 1]!;
}

/**
 * Rounds the distance to the nearest pool length, ensuring it's at least one pool length.
 * @param distance distance in metres to round
 * @returns rounded distance that is a multiple of the pool length
 */
function roundToPool(distance: number, poolLength: number): number {
  return Math.max(poolLength, Math.round(distance / poolLength) * poolLength);
}

/**
 * Formats the duration in seconds into a MM:SS string.
 * @param seconds duration in seconds
 * @returns formatted duration string
 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Turn input into numbers

/**
 * Parses "mm:ss" into seconds
 * @param baselineTime input time
 * @returns inputted time as seconds
 */
function parseBaselineSeconds(baselineTime: string): number {
  const parts = baselineTime.split(":").map((p) => parseFloat(p));

  if (parts.length === 2 && parts.every((p) => !Number.isNaN(p))) {
    return parts[0]! * 60 + parts[1]!;
  }

  if (parts.length === 1 && !Number.isNaN(parts[0])) {
    return parts[0]!;
  }

  return 95
}

const STROKE_PACE_RATIO: Record<string, number> = {
  Freestyle: 1,
  Backstroke: 1.15,
  Butterfly: 1.15,
  Breaststroke: 1.5,
};

/**
 * Provides a rough pace per 100m for different strokes to inform sendoff calculations.
 * @param stroke stroke type
 * @returns approximate pace in seconds per 100m for the given stroke
 */
function pacePer100(stroke: string, settings: GeneratorSettings): number {
  const baseline = parseBaselineSeconds(settings.baselineTime);
  return baseline * (STROKE_PACE_RATIO[stroke] ?? 1);
}

const AEROBIC_TRANSITION_SECONDS = 160;
const SPRINT_FADE_EXPONENT = 1.06;
const AEROBIC_FADE_EXPONENT = 1.025;

function swimTimeSeconds(distance: number, stroke: string, settings: GeneratorSettings): number {
  const per100 = pacePer100(stroke, settings);
  const roughSeconds = per100 * (distance / 100);
  const exponent = roughSeconds <= AEROBIC_TRANSITION_SECONDS ? SPRINT_FADE_EXPONENT : AEROBIC_FADE_EXPONENT;
  return per100 * Math.pow(distance / 100, exponent);
}

/**
 * Calculates a sendoff interval (swim time + rest) for a given distance and stroke.
 * @param distance distance in metres
 * @param restRatio ratio of rest time to swim time
 * @param stroke stroke type
 * @returns rest time in seconds
 */
function calculateSendoff(distance: number, restRatio: number, settings: GeneratorSettings, stroke: string = "Freestyle"): number {
  const swimTime = swimTimeSeconds(distance, stroke, settings);
  const sendoff = swimTime * (1 + restRatio);
  return Math.max(45, Math.round(sendoff / 5) * 5);
}

/**
 * Calculates a rest interval after a set based on the distance and a base rest time, ensuring a minimum rest.
 * @param distance distance in metres of the preceding set
 * @param restSeconds base rest time in seconds before adjustment
 * @returns adjusted rest time in seconds, ensuring a minimum of 10 seconds
 */
function calculateAfterStop(restSeconds: number): number {
  return Math.max(20, Math.round(restSeconds / 5) * 5);
}

function getStrokeDistribution(
  settings: GeneratorSettings
): { strokes: string[]; weights: number[] } {
  const entries = Object.entries(settings.strokes).filter(
    ([, percentage]) => percentage > 0
  );

  if (entries.length === 0) {
    return { strokes: ["Freestyle"], weights: [1] };
  }

  return {
    strokes: entries.map(([stroke]) => stroke),
    weights: entries.map(([, percentage]) => percentage),
  };
}

/**
 *
 * @param settings
 * @param preferred
 * @param fallbackPool
 * @returns
 */
function pickStroke(settings: GeneratorSettings, preferred: string, fallbackPool?: string[]): string {
  if ((settings.strokes[preferred as keyof typeof settings.strokes] ?? 0) > 0) {
    return preferred;
  }
  const { strokes, weights } = getStrokeDistribution(settings);
  const pool = fallbackPool ? strokes.filter((s) => fallbackPool.includes(s)) : strokes;
  if (pool.length === 0) return preferred;
  const poolWeights = pool.map((s) => weights[strokes.indexOf(s)]!);
  return pickWeighted(pool, poolWeights);
}

// Equipment

const KICK_EQUIPMENT = ["Kickboard", "Fins"];
const PULL_EQUIPMENT = ["Pull Buoy", "Paddles", "Snorkel"];

function pickEquipment(category: string[], available: string[]): string[] {
  const matches = available.filter((e) => category.includes(e));
  return matches.length > 0 ? [pickRandom(matches)] : [];
}

// Start date, weeks, training days into session dates

function getTrainingDates(
  startDate: string,
  weeks: number,
  trainingDays: string[]
): string[] {
  const dates: string[] = [];

  const start = new Date(`${startDate}T00:00:00`);

  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const totalDays = weeks * 7;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const dayName = Object.keys(dayMap).find(
      (day) => dayMap[day] === date.getDay()
    );

    if (dayName && trainingDays.includes(dayName)) {
      dates.push(
        `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      );
    }
  }

  return dates;
}

// Session type and volume scaling

function getPhaseFactor(phase: string): number {
  switch (phase) {
    case "base":
      return 1.0;

    case "build":
      return 1.05;

    case "peak":
      return 0.9;

    case "taper":
      return 0.7;

    default:
      return 1.0;
  }
}

function getWeekProgressionFactor(
  weekIndex: number,
  totalWeeks: number,
  phase: GeneratorSettings["phase"],
  rampPercent: number
): number {
  if (totalWeeks <= 1) return 1;

  const rampRange = Math.max(0, rampPercent) / 100;
  let progress = weekIndex / (totalWeeks - 1); // 0 in week 1, 1 in the final week
  if (phase === "taper") progress = 1 - progress; // taper unloads rather than builds

  return 1 - rampRange / 2 + rampRange * progress;
}

/**
 * Builds a session plan with a mix of session types based on the number of sessions.
 * @param count number of sessions to generate
 * @returns array of session plans with label, type, and volume factor
 */
function buildSessionPlan(
  count: number,
  totalWeeks: number,
  focus: GeneratorSettings["focus"],
  phase: GeneratorSettings["phase"],
  rampPercent: number
): { type: SessionType; factor: number }[] {
  const pattern: SessionType[] =
    focus === "speed"
      ? ["speed", "speed", "mixed"]
      : focus === "endurance"
      ? ["volume", "volume", "threshold"]
      : ["volume", "threshold", "mixed", "speed"];

  const phaseFactor = getPhaseFactor(phase);

  const sessionsPerWeek = totalWeeks > 0 ? count / totalWeeks : count;

  return Array.from({ length: count }, (_, i) => {
    const weekIndex = sessionsPerWeek > 0 ? Math.floor(i / sessionsPerWeek) : 0;
    const weekFactor = getWeekProgressionFactor(weekIndex, totalWeeks, phase, rampPercent);
    return {
      type: pattern[i % pattern.length]!,
      factor: phaseFactor * weekFactor * (0.97 + Math.random() * 0.06),
    };
  });
}

// Volume budgeting

/**
 * Chooses an appropriate warm-up volume based on the total session volume, ensuring a reasonable proportion of the session is allocated to warm-up.
 * @param totalVolume total volume of the session in metres
 * @returns chosen warm-up volume in metres
 */
function chooseWarmupVolume(totalVolume: number): number {
  if (totalVolume <= 2500) return 300;
  if (totalVolume <= 3500) return 400;
  if (totalVolume <= 4500) return 500;
  return 600;
}

/**
 * Chooses an appropriate cool-down volume based on the total session volume, ensuring a reasonable proportion of the session is allocated to cool-down.
 * @param totalVolume total volume of the session in metres
 * @returns chosen cool-down volume in metres
 */
function chooseCooldownVolume(totalVolume: number): number {
  if (totalVolume <= 2500) return 200;
  if (totalVolume <= 3500) return 300;
  return 400;
}

// Set builder

/**
 * Helper function to create a time-based SwimSet
 * @param durationSeconds duration of the set in seconds
 * @param stroke stroke type for the set
 * @param opts optional parameters for intensity and equipment
 * @returns a SwimSet object representing a time-based set
 */
function makeSet(repetitions: number, distance: number, stroke: string, opts: Partial<Omit<SwimSet, "kind" | "repetitions" | "distance" | "stroke" | "durationSeconds">> = {}): SwimSet {
  return {
    kind: "set",
    repetitions,
    distance,
    stroke,
    sendoffSeconds: 15,
    ...opts
  };
}

/**
 * Helper function to create a SwimGroup
 * @param items array of SwimItem objects that belong to the group
 * @param opts optional parameters for repetitions, intensity, and equipment
 * @returns a SwimGroup object that encapsulates the provided SwimItems
 */
function makeGroup(items: SwimItem[], opts: Partial<Omit<SwimGroup, "kind" | "items">> = {}): SwimGroup {
  return {
    kind: "group",
    items, ...opts
  };
}

// Warmup

/**
 * Generates the warm-up sets based on the provided warm-up volume.
 * @param warmupVolume total warm-up volume in metres
 * @returns array of SwimSet objects representing the warm-up sets
 */
function generateWarmup(
  warmupVolume: number,
  settings: GeneratorSettings
) {
  const template = pickRandom(["standard", "stroke-rotation", "build"] as const);
  const sets: SwimItem[] = [];

  if (template === "standard") {
    // Easy swim + kick + underwater activation
    const mainDist = warmupVolume >= 500 ? 400 : warmupVolume >= 400 ? 300 : 200;
    sets.push(makeSet(1, mainDist, "Freestyle", { intensityZone: "easy", sendoffSeconds: 0 }));
    const rem = warmupVolume - mainDist;

    if (rem >= 100) {
      sets.push(makeSet(Math.round(rem / 50), 50, "Freestyle", {
        strokeModifier: "Kick",
        intensityZone: "easy",
        sendoffSeconds: calculateSendoff(50, 0.5, settings),
        equipment: pickEquipment(KICK_EQUIPMENT, settings.equipment),
      }));
    }
  } else if (template === "stroke-rotation") {
    const { strokes } = getStrokeDistribution(settings);
    const distPer = roundToPool(warmupVolume / strokes.length, settings.poolLength);
    for (const stroke of strokes) {
      sets.push(makeSet(1, distPer, stroke, { intensityZone: "easy", sendoffSeconds: 0 }));
    }
  } else {
    sets.push(
      makeSet(1, warmupVolume, "Freestyle", {
        intensityPercent: settings.pace.easy,
        intensityPercentEnd: settings.pace.endurance,
        sendoffSeconds: 0,
        description: "build from easy to aerobic",
      })
    );
  }

  return sets
}

// Pull set

/**
 * Generates the pull sets based on the provided pull volume.
 * @param volume total pull volume in metres
 * @returns array of SwimSet objects representing the pull sets
 */
function generatePullSet(
  volume: number,
  settings: GeneratorSettings
): SwimItem[] {
  const distOptions = [100, 150, 200, 300].filter((d) => volume / d >= 3);
  const setDist = pickRandom(distOptions.length ? distOptions : [100]);
  const reps = Math.max(3, Math.round(volume / setDist));

  const stroke = pickStroke(settings, "Freestyle", ["Freestyle", "Backstroke"]);
  const equipment = pickEquipment(PULL_EQUIPMENT, settings.equipment);
  const hasSnorkel = equipment.includes("Snorkel");

  return [
    makeSet(reps, setDist, stroke, {
      intensityZone: "endurance",
      restKind: "on",
      sendoffSeconds: calculateSendoff(setDist, 0.25, settings, stroke),
      equipment,
      ...(stroke === "Freestyle" && !hasSnorkel && { breatheEvery: pickRandom([3, 5]) }),
    }),
  ];
}

// Main sets

/**
 * Generates the main sets for a volume-focused session based on the provided main volume.
 * @param mainVolume total main set volume in metres
 * @returns array of SwimSet objects representing the main sets for a volume-focused session
 */
function generateVolumeMainSet(
  mainVolume: number,
  settings: GeneratorSettings): SwimItem[] {
  const sets: SwimItem[] = [];
  const { strokes, weights } = getStrokeDistribution(settings);

  // 55% of total workout is easy aerobic swimming
  const aerobicVolume = Math.floor(mainVolume * 0.55);
  const aerobicStroke = pickWeighted(strokes, weights);
  const maxDist = aerobicStroke === "Breaststroke" ? 200 : 500;
  const distOptions = [200, 300, 400].filter((d) => d <= maxDist && aerobicVolume / d >= 3);
  const aerobicDist = pickRandom(distOptions.length ? distOptions : [200]);
  const aerobicReps = Math.max(3, Math.round(aerobicVolume / aerobicDist));

  sets.push(
    makeSet(aerobicReps, aerobicDist, aerobicStroke, {
      intensityZone: "endurance",
      restKind: "on",
      sendoffSeconds: calculateSendoff(aerobicDist, 0.25, settings, aerobicStroke),
      ...(aerobicStroke === "Freestyle" && { breatheEvery: pickRandom([3, 5]) }),
    })
  );

  // Descend block, 25% main block
  const descendVolume = Math.floor(mainVolume * 0.25);
  const descendStroke = pickStroke(settings, "Freestyle", ["Freestyle", "Backstroke"]);
  const descendDistOptions = [50, 75, 100].filter((d) => descendVolume / d >= 2);
  const descendDist = descendDistOptions.length ? pickRandom(descendDistOptions) : 50;
  const descendReps = Math.max(2, Math.round(descendVolume / descendDist));

  sets.push(
    makeSet(descendReps, descendDist, descendStroke, {
      intensityPercent: settings.pace.easy,
      intensityPercentEnd: settings.pace.threshold,
      restKind: "on",
      sendoffSeconds: calculateSendoff(descendDist, 0.35, settings, descendStroke),
      description: "negative split each rep",
    })
  );

  // Remaining volume, endurance pace
  const remainingVolume = mainVolume - aerobicVolume - descendVolume;
  if (remainingVolume >= 100) {
    const finishStroke = pickWeighted(strokes, weights);
    sets.push(
      makeSet(1, roundToPool(remainingVolume, settings.poolLength), finishStroke, {
        intensityPercent: settings.pace.endurance,
        sendoffSeconds: 0,
      })
    );
  }

  return sets;
}

/**
 * Generates the main sets for a threshold-focused session based on the provided main volume.
 * @param mainVolume total main set volume in metres
 * @returns array of SwimSet objects representing the main sets for a threshold-focused session
 */
function generateThresholdMainSet(
  mainVolume: number,
  settings: GeneratorSettings
): SwimItem[] {
  const sets: SwimSet[] = [];
  const { strokes, weights } = getStrokeDistribution(settings);

  // Aerobic base before threshold, 35% of total volume
  const baseVolume = Math.floor(mainVolume * 0.35);
  const baseStroke = pickWeighted(strokes, weights);
  const baseDistOptions = [100, 150, 200].filter((d) => baseVolume / d >= 3);
  const baseDist = baseDistOptions.length ? pickRandom(baseDistOptions) : 100;
  const baseReps = Math.max(3, Math.round(baseVolume / baseDist));

  sets.push(
    makeSet(baseReps, baseDist, baseStroke, {
      intensityPercent: settings.pace.endurance,
      restKind: "on",
      sendoffSeconds: calculateSendoff(baseDist, 0.28, settings, baseStroke),
    })
  );

  // Primary threshold set, 45% of total volume
  const thresholdVolume = Math.floor(mainVolume * 0.45);
  const thresholdStroke = pickWeighted(strokes, weights);
  const thresholdDistOptions = [100, 150, 200].filter((d) => thresholdVolume / d >= 3);
  const thresholdDist = thresholdDistOptions.length ? pickRandom(thresholdDistOptions) : 100;
  const thresholdReps = Math.max(3, Math.round(thresholdVolume / thresholdDist));

  sets.push(
    makeSet(thresholdReps, thresholdDist, thresholdStroke, {
      intensityZone: "threshold",
      restKind: "with",
      sendoffSeconds: calculateAfterStop(20),
      description: "hold pace every rep",
    })
  );

  // 20% short aerobic finish
  const finishVolume = Math.floor(mainVolume * 0.20);
  const finishStroke = pickStroke(settings, "Freestyle", ["Freestyle", "Backstroke"]);
  const finishDistOptions = [50, 100].filter((d) => finishVolume / d >= 2);
  const finishDist = finishDistOptions.length ? pickRandom(finishDistOptions) : 50;
  const finishReps = Math.max(2, Math.round(finishVolume / finishDist));

  sets.push(
    makeSet(finishReps, finishDist, finishStroke, {
      intensityPercent: settings.pace.endurance,
      restKind: "on",
      sendoffSeconds: calculateSendoff(finishDist, 0.45, settings, finishStroke),
      ...(finishStroke === "Freestyle" && Math.random() < 0.6 && { breatheEvery: pickRandom([3, 5]) }),
    })
  );

  return sets;
}

/**
 * Generates the main sets for a speed-focused session based on the provided main volume.
 * @param mainVolume total main set volume in metres
 * @returns array of SwimSet objects representing the main sets for a speed-focused session
 */
function generateSpeedMainSet(
  mainVolume: number,
  settings: GeneratorSettings
): SwimItem[] {
  const sets: SwimItem[] = [];
  const { strokes, weights } = getStrokeDistribution(settings);
  const speedStroke = pickWeighted(strokes, weights);

  // Light aerobic before sprint, 35%
  const floatVolume = Math.floor(mainVolume * 0.35);
  const floatReps = Math.max(3, Math.round(floatVolume / 100));

  sets.push(
    makeSet(floatReps, 100, speedStroke, {
      intensityZone: "endurance",
      restKind: "on",
      sendoffSeconds: calculateSendoff(100, 0.25, settings, speedStroke),
    })
  );

  // Descending distance speed ladder, 65%
  const speedVolume = mainVolume * 0.65;
  const ladder: { dist: number; zone: string }[] = [
    { dist: 100, zone: "endurance" },
    { dist: 75, zone: "racePace" },
    { dist: 50, zone: "max" },
    { dist: 25, zone: "max" },
  ];
  const ladderVolume = ladder.reduce((s, d) => s + d.dist, 0);
  const outerReps = Math.max(2, Math.min(6, Math.floor(speedVolume / ladderVolume)));
  const finsEquipment = pickEquipment(["Fins"], settings.equipment);

  const innerItems: SwimItem[] = ladder.map(({ dist, zone }) =>
    makeSet(1, dist, speedStroke, {
      intensityZone: zone,
      restKind: "with",
      sendoffSeconds: calculateAfterStop(dist <= 25 ? 25 : 15),
      underwater: dist === 25,
      ...(dist <= 50 && finsEquipment.length > 0 && { equipment: finsEquipment }),
    })
  );

  sets.push(makeGroup(innerItems, { repetitions: outerReps, description: "max effort on every 25" }));

  return sets;
}

/**
 * Generates the main sets for a mixed-focus session
 * @param mainVolume total main set volume in metres
 * @returns array of SwimItem objects representing the main sets for a mixed-focus session
 */
function generateMixedMainSet(
  mainVolume: number,
  settings: GeneratorSettings): SwimItem[] {
  const sets: SwimItem[] = [];
  const { strokes, weights } = getStrokeDistribution(settings);

  // Aerobic block, 40%
  const aerobicVolume = Math.floor(mainVolume * 0.40);
  const aerobicStroke = pickWeighted(strokes, weights);
  const aerobicDistOptions = [150, 200, 300].filter((d) => aerobicVolume / d >= 3);
  const aerobicDist = aerobicDistOptions.length ? pickRandom(aerobicDistOptions) : 200;
  const aerobicReps = Math.max(3, Math.round(aerobicVolume / aerobicDist));
  const restRatio = aerobicStroke === "Breaststroke" ? 0.5 : 0.28;

  sets.push(
    makeSet(aerobicReps, aerobicDist, aerobicStroke, {
      intensityZone: "endurance",
      restKind: "on",
      sendoffSeconds: calculateSendoff(aerobicDist, restRatio, settings, aerobicStroke),
      ...(aerobicStroke === "Freestyle" && { breatheEvery: 3 }),
    })
  );
  // Threshold block, 35%
  const thresholdVolume = Math.floor(mainVolume * 0.35);
  const thresholdStroke = pickStroke(settings, "Freestyle", ["Freestyle", "Backstroke"]);
  const thresholdDistOptions = [100, 150].filter((d) => thresholdVolume / d >= 3);
  const thresholdDist = thresholdDistOptions.length ? pickRandom(thresholdDistOptions) : 100;
  const thresholdReps = Math.max(3, Math.round(thresholdVolume / thresholdDist));

  sets.push(
    makeSet(thresholdReps, thresholdDist, thresholdStroke, {
      intensityZone: "threshold",
      restKind: "with",
      sendoffSeconds: calculateAfterStop(thresholdDist <= 100 ? 30 : 35),
    })
  );

  // Speed block, 25%, alternating fast rep with easier stroke
  const speedVolume = Math.floor(mainVolume * 0.25);
  const speedReps = Math.min(8, Math.max(4, Math.round(speedVolume / 50)));
  const fastStroke = pickStroke(settings, "Freestyle");
  const taperStroke = strokes.find((s) => s !== fastStroke) ?? fastStroke;

  sets.push(
    makeGroup(
      [
        makeSet(1, 25, fastStroke, { intensityZone: "max", restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
        makeSet(1, 25, taperStroke, { intensityZone: "endurance", restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
      ],
      { repetitions: speedReps, description: "fast/easy alternating" }
    )
  );

  return sets;
}

// Cooldown

/**
 *
 * @param cooldownVolume
 * @param settings
 * @returns
 */
function generateCooldown(
  cooldownVolume: number,
  settings: GeneratorSettings
): SwimItem[] {
  const stroke = pickStroke(settings, "Freestyle", ["Freestyle", "Backstroke"]);
  return [
    makeSet(1, roundToPool(cooldownVolume, settings.poolLength), stroke, {
      intensityZone: "easy",
      sendoffSeconds: 0,
    }),
  ];
}

// Render to text

/**
 * Formats intensity information for display
 * @param intensityPercent single intensity percentage
 * @param intensityPercentEnd optional end intensity percentage for a range
 * @param intensityZone optional intensity zone label
 * @returns formatted intensity string for display in the DSL
 */
function formatIntensity(s: SwimSet | SwimGroup): string {
  if (s.intensityZone) return s.intensityZone;

  if ("intensityPercent" in s && s.intensityPercent != null) {
    if ("intensityPercentEnd" in s && s.intensityPercentEnd != null) {
      return `${s.intensityPercent}% -> ${s.intensityPercentEnd}%`;
    }
    return `${s.intensityPercent}%`;
  }

  return "";
}

/**
 * Renders the length information for a SwimSet
 * @param s SwimSet object to extract length information from
 * @returns formatted length string for display in the DSL
 */
function renderLength(s: SwimSet): string {
  if (s.durationSeconds != null) return formatDuration(s.durationSeconds);

  if (s.laps != null) return `${s.laps} laps`;

  return `${s.distance}`;
}

/**
 * Renders the rest information for a SwimSet based on its rest kind and associated parameters.
 * @param s SwimSet object to extract rest information from
 * @param insideGroup boolean indicating whether the set is inside a group
 * @returns formatted rest string for display in the DSL
 */
function renderRest(s: SwimSet, insideGroup: boolean): string {
  if (s.restKind === "with") return s.sendoffSeconds > 0 ? ` with ${formatDuration(s.sendoffSeconds)}` : "";

  if (s.restKind === "in-out") return s.inOutCount != null ? ` in-out ${s.inOutCount}` : "";

  if (s.sendoffSeconds > 0 && (s.repetitions > 1 || insideGroup))
    return ` on ${formatDuration(s.sendoffSeconds)}`;

  return "";
}

/**
 * Converts a SwimSet into its corresponding SwimDSL string representation
 * @param s SwimSet object to convert to SwimDSL
 * @param insideGroup boolean indicating whether the set is inside a group
 * @returns formatted string representing the SwimSet in SwimDSL syntax
 */
function setToLine(s: SwimSet, insideGroup = false): string {
  const length = renderLength(s);
  const base = s.repetitions > 1 ? `${s.repetitions} x ${length} ${s.stroke}` : `${length} ${s.stroke}`;
  const modifier = s.strokeModifier ? ` ${s.strokeModifier}` : "";
  const intensity = formatIntensity(s);
  const pace = intensity ? ` @ ${intensity}` : "";
  const rest = renderRest(s, insideGroup);
  const equipment = s.equipment?.length ? ` + ${s.equipment.join(" ")}` : "";
  const underwater = s.underwater ? " underwater" : "";
  const breathe = s.breatheEvery != null ? ` breathe ${s.breatheEvery}` : "";
  const desc = s.description ? ` -- "${s.description}"` : "";

  return `${base}${modifier}${pace}${rest}${equipment}${underwater}${breathe}${desc}`;
}

/**
 * Recursively converts a SwimItem into its corresponding SwimDSL string representation
 * @param item SwimItem object to convert to SwimDSL
 * @param depth current depth in the item hierarchy for indentation purposes
 * @returns formatted string representing the SwimItem in SwimDSL syntax
 */
function itemToLines(item: SwimItem, depth = 0): string {
  const indent = "  ".repeat(depth);

  // if its a set, render the line directly
  if (item.kind === "set") return indent + setToLine(item, depth > 0);

  const lines: string[] = [];
  const repPrefix = item.repetitions && item.repetitions > 1 ? `${item.repetitions} x ` : ""; // only show repetition count on group if more than 1
  lines.push(`${indent}${repPrefix}{`);

  // recursively render child items with increased indentation
  for (const child of item.items) lines.push(itemToLines(child, depth + 1));

  // render modifiers for the group after closing brace
  const mods: string[] = [];
  const intensity = formatIntensity(item);
  if (intensity) mods.push(`@ ${intensity}`);
  if (item.description) mods.push(`-- "${item.description}"`);
  lines.push(`${indent}}${mods.length ? ` ${mods.join(" ")}` : ""}`);

  return lines.join("\n");
}

/**
 * Main function to generate a week of swim sessions based on a target session length in metres
 * @param sessionLengthMetres target length in metres for each session in the generated week
 * @returns string representing the generated swim sessions in SwimDSL format
 */
export function generateProgrammes(
  settings: GeneratorSettings
): string[] {
  const {
    startDate,
    weeks,
    trainingDays,
    phase,
    focus,
    distance,
    poolLength,
    distanceUnit,
    pace,
  } = settings;

  // Calendar
  const trainingDates = getTrainingDates(
    startDate,
    weeks,
    trainingDays
  );

  // Session type
  const sessionPlan = buildSessionPlan(trainingDates.length, weeks, focus, phase, settings.weeklyRampPercent);

  const programmes: string[] = [];

  for (let i = 0; i < sessionPlan.length; i++) {
    const plan = sessionPlan[i]!;
    const sessionDate = trainingDates[i];

    // Volume budget
    const totalVolume = roundToPool(distance * plan.factor, poolLength);

    const warmupVolume = chooseWarmupVolume(totalVolume);
    const pullVolume = roundToPool(totalVolume * 0.12, poolLength);
    const cooldownVolume = chooseCooldownVolume(totalVolume);
    const mainVolume = totalVolume - warmupVolume - pullVolume - cooldownVolume;

    // Fill sets
    const mainItems: SwimItem[] =
      plan.type === "volume"
        ? generateVolumeMainSet(mainVolume, settings)
        : plan.type === "threshold"
        ? generateThresholdMainSet(mainVolume, settings)
        : plan.type === "speed"
        ? generateSpeedMainSet(mainVolume, settings)
        : generateMixedMainSet(mainVolume, settings);

    const allItems: SwimItem[] = [
      ...generateWarmup(warmupVolume, settings),
      ...generatePullSet(pullVolume, settings),
      ...mainItems,
      ...generateCooldown(cooldownVolume, settings),
    ];

    // Render
    const lines: string[] = [
      `set PoolLength ${poolLength}`,
      `set LengthUnit "${distanceUnit}"`,
      `set Title "Generated ${phase} Session"`,
      `set Date "${sessionDate}"`,
      `set Description "Generated ${phase} session. Target session length: ${distance}m"`,
      "",
      `pace easy = ${pace.easy}%`,
      `pace endurance = ${pace.endurance}%`,
      `pace threshold = ${pace.threshold}%`,
      `pace racePace = ${pace.racePace}%`,
      `pace max = ${pace.max}%`,
      "",
    ];

    for (const item of allItems) lines.push(itemToLines(item));

    programmes.push(lines.join("\n"));
  }

  return programmes;
}
