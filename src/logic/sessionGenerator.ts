type SessionType = "volume" | "threshold" | "speed" | "mixed";

export interface GeneratorSettings {
  startDate: string;
  weeks: number;
  trainingDays: string[];
  phase: string;
  focus: string;
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
  noalign?: boolean;
}

interface SwimGroup {
  kind: "group";
  repetitions?: number;
  items: SwimItem[];
  intensityPercent?: number;
  intensityPercentEnd?: number;
  intensityZone?: string;
  onSeconds?: number;
  equipment?: string[];
  description?: string;
}

type SwimItem = SwimSet | SwimGroup;

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
 * Picks a random item from the provided array.
 * @param arr array of items to choose from
 * @returns randomly selected item from the array
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function getStrokeDistribution(
  settings: GeneratorSettings
): { strokes: string[]; weights: number[] } {
  const entries = Object.entries(settings.strokes).filter(
    ([, percentage]) => percentage > 0
  );

  return {
    strokes: entries.map(([stroke]) => stroke),
    weights: entries.map(([, percentage]) => percentage),
  };
}

/**
 * Rounds the distance to the nearest pool length, ensuring it's at least one pool length.
 * @param distance distance in metres to round
 * @returns rounded distance that is a multiple of the pool length
 */
function roundToPool(
    distance: number,
    poolLength: number
  ): number {
    return Math.max(poolLength, Math.round(distance / poolLength) * poolLength);
  }

/**
 * Formats the duration in seconds into a MM:SS string.
 * @param seconds duration in seconds
 * @returns formatted duration string
 */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Provides a rough pace per 100m for different strokes to inform sendoff calculations.
 * @param stroke stroke type
 * @returns approximate pace in seconds per 100m for the given stroke
 */
function pacePer100(stroke: string): number {
  const table: Record<string, number> = {
    Freestyle:    95,
    Backstroke:   110,
    Breaststroke: 145,
    Butterfly:    110,
  };
  return table[stroke] ?? 100;
}

/**
 * Calculates a sendoff interval (swim time + rest) for a given distance and stroke.
 * @param distance distance in metres
 * @param restRatio ratio of rest time to swim time
 * @param stroke stroke type
 * @returns rest time in seconds
 */
function calculateSendoff(distance: number, restRatio: number, stroke: string = "Freestyle"): number {
  const swimTime = (distance / 100) * pacePer100(stroke);
  const sendoff  = swimTime * (1 + restRatio);
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

function getPhaseFactor(phase: string): number {
  switch (phase) {
    case "base":
      return 1.0;

    case "build":
      return 1.05;

    case "peak":
      return 0.9;

    case "recovery":
      return 0.7;

    default:
      return 1.0;
  }
}

/**
 * Resolves an intensity zone to either a specific percentage or a range of percentages based on predefined pace definitions
 * @param zone intensity zone name
 * @returns object containing either intensityPercent or intensityZone
 */
function resolveIntensity(
  zone: string,
  settings: GeneratorSettings
): Partial<
  Pick<
    SwimSet,
    "intensityZone" | "intensityPercent" | "intensityPercentEnd"
  >
> {
  if (zone === "descend") {
    return {
      intensityPercent: settings.pace.easy,
      intensityPercentEnd: settings.pace.threshold,
    };
  }

  return {
    intensityZone: zone,
  };
}

/**
 * Builds a session plan with a mix of session types based on the number of sessions.
 * @param count number of sessions to generate
 * @returns array of session plans with label, type, and volume factor
 */
function buildSessionPlan(
  count: number,
  focus: string,
  phase: string
): {
  label: string;
  type: SessionType;
  factor: number;
}[] {
  let pattern: SessionType[];
  const phaseFactor = getPhaseFactor(phase);

  if (focus === "speed") {
    pattern = ["speed", "speed", "mixed"];
  } else if (focus === "endurance") {
    pattern = ["volume", "volume", "threshold"];
  } else {
    pattern = [
      "volume",
      "threshold",
      "mixed",
      "speed",
    ];
  }

  return Array.from({ length: count }, (_, i) => ({
    label: `Session ${i + 1}`,
    type: pattern[i % pattern.length]!,
    factor: phaseFactor * (0.95 + Math.random() * 0.1),
  }));
}

/**
 * Helper function to create a SwimSet with default values for sendoffSeconds and optional intensity and equipment parameters.
 * @param repetitions number of repetitions in the set
 * @param distance distance in metres for each repetition
 * @param stroke stroke type for the set
 * @param opts optional parameters for intensity and equipment
 * @returns a SwimSet object
 */
function makeSet(repetitions: number, distance: number, stroke: string, opts: Partial<Omit<SwimSet, "kind" | "repetitions" | "distance" | "stroke">> = {}): SwimSet {
  return {
    kind: "set",
    repetitions,
    distance,
    stroke,
    sendoffSeconds: 15,
    ...opts,
  };
}

/**
 * Helper function to create a time-based SwimSet
 * @param durationSeconds duration of the set in seconds
 * @param stroke stroke type for the set
 * @param opts optional parameters for intensity and equipment
 * @returns a SwimSet object representing a time-based set
 */
function makeTimedSet(durationSeconds: number, stroke: string, opts: Partial<Omit<SwimSet, "kind" | "repetitions" | "distance" | "stroke" | "durationSeconds">> = {}): SwimSet {
  return {
    kind: "set",
    repetitions: 1,
    distance: 0,
    durationSeconds,
    stroke,
    sendoffSeconds: 0,
    ...opts
  };
}

/**
 * Helper function to create a SwimSet representing a set of laps
 * @param laps number of laps in the set
 * @param stroke stroke type for the set
 * @param opts optional parameters for intensity and equipment
 * @returns a SwimSet object representing a set of laps
 */
function makeLapSet(
  laps: number,
  poolLength: number,
  stroke: string,
  opts: Partial<Omit<SwimSet, "kind" | "repetitions" | "distance" | "stroke" | "laps">> = {}
): SwimSet {
  return {
    kind: "set",
    repetitions: 1,
    distance: laps * poolLength,
    laps,
    stroke,
    sendoffSeconds: 0,
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

/**
 * Generates the warm-up sets based on the provided warm-up volume.
 * @param warmupVolume total warm-up volume in metres
 * @returns array of SwimSet objects representing the warm-up sets
 */
function generateWarmup(
  warmupVolume: number,
  settings: GeneratorSettings
) {
  const template = pickRandom(["standard", "stroke-focus", "progressive", "build-kick"] as const);
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
        sendoffSeconds: calculateSendoff(50, 0.5),
        equipment: ["Board"],
      }));
    }
    if (warmupVolume >= 400) {
      sets.push(makeSet(2, 25, "Freestyle", {
        underwater: true,
        intensityZone: "endurance",
        restKind: "with",
        sendoffSeconds: 20,
      }));
    }

  } else if (template === "stroke-focus") {
    // IM-style rotation through strokes
    const strokeOrder = ["Freestyle", "Backstroke", "Breaststroke"];
    const distPer = roundToPool(warmupVolume / 3, settings.poolLength);
    for (const stroke of strokeOrder) {
      sets.push(makeSet(1, distPer, stroke, { intensityZone: "easy", sendoffSeconds: 0 }));
    }

  } else if (template === "progressive") {
    // Single continuous build swim filling full warmup volume
    sets.push(makeSet(1, warmupVolume, "Freestyle", {
      ...resolveIntensity("descend", settings),
      sendoffSeconds: 0,
      description: "build from easy to aerobic",
    }));

  } else {
    // build-kick: easy swim + kick set building pace + short activation
    const mainDist = warmupVolume >= 500 ? 300 : 200;
    sets.push(makeSet(1, mainDist, "Freestyle", { intensityZone: "easy", sendoffSeconds: 0 }));
    const kickReps = warmupVolume >= 400 ? 4 : 2;
    sets.push(makeSet(kickReps, 50, "Freestyle", {
      strokeModifier: "Kick",
      ...resolveIntensity("descend", settings),
      sendoffSeconds: calculateSendoff(50, 0.6),
      equipment: ["Board"],
    }));
    if (warmupVolume >= 400) {
      sets.push(makeSet(4, 25, "Freestyle", {
        intensityZone: "endurance",
        restKind: "with",
        sendoffSeconds: 15,
        breatheEvery: 3,
      }));
    }
  }

  return sets;
}

/**
 * Generates the pull sets based on the provided pull volume.
 * @param volume total pull volume in metres
 * @returns array of SwimSet objects representing the pull sets
 */
function generatePullSet(
  volume: number,
  settings: GeneratorSettings
): SwimItem[] {
  const availableEquipment = settings.equipment;
  const distOptions = [100, 150, 200, 300];
  const setDist = pickRandom(distOptions.filter(d => volume / d >= 3) as number[]) ?? 100;
  const reps = Math.max(3, Math.round(volume / setDist));

  const equipment =
  availableEquipment.length > 0
    ? [pickRandom(availableEquipment)]
    : [];
  const hasSnorkel = equipment.includes("Snorkel");

  return [
  makeSet(reps, setDist, "Freestyle", {
    intensityZone: "endurance",
    restKind: "on",
    sendoffSeconds: calculateSendoff(
      setDist,
      0.25
    ),
    equipment,
    ...(!hasSnorkel && {
      breatheEvery: pickRandom([3, 5]),
    }),
  }),
];
}

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
  const a1Volume = Math.floor(mainVolume * 0.55);
  const a1Stroke = pickWeighted(strokes, weights);
  const maxDist = a1Stroke === "Breaststroke" ? 200 : 500;
  const a1Dist = pickRandom([200, 300, 400, 500].filter(d => d <= maxDist && a1Volume / d >= 3) as number[]) ?? 200;// choose distance only if at least 3 reps can be done
  const a1Reps = Math.max(3, Math.round(a1Volume / a1Dist));

  sets.push(makeSet(a1Reps, a1Dist, a1Stroke, {
    intensityZone: "endurance",
    restKind: "on",
    sendoffSeconds: calculateSendoff(a1Dist, 0.25, a1Stroke),
    ...(a1Stroke === "Freestyle" && { breatheEvery: pickRandom([3, 5]) }),
  }));

  // Slightly harder aerobic work, 30% of total volume
  const a2Volume = Math.floor(mainVolume * 0.30);
  const a2Dist = pickRandom([100, 150, 200].filter(d => a2Volume / d >= 3) as number[]) ?? 100;
  const a2Reps = Math.max(2, Math.round(a2Volume / a2Dist));

  sets.push(makeSet(a2Reps, a2Dist, "Freestyle", {
    intensityPercent: settings.pace.endurance,
    restKind: "on",
    sendoffSeconds: calculateSendoff(a2Dist, 0.30),
  }));

  // 15% descend
  const ltVolume = Math.floor(mainVolume * 0.15);
  const ltDist = pickRandom([50, 75, 100].filter(d => ltVolume / d >= 2)) ?? 50;
  const ltReps = Math.max(2, Math.round(ltVolume / ltDist));
  const ltSendoff = calculateSendoff(ltDist, 0.35);

  sets.push(makeSet(ltReps, ltDist, "Freestyle", {
    ...resolveIntensity("descend", settings),
    restKind: "on",
    sendoffSeconds: ltSendoff,
    description: "negative split each rep",
  }));

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
  const a2Volume = Math.floor(mainVolume * 0.35);
  const a2Dist = pickRandom([100, 150, 200].filter(d => a2Volume / d >= 3) as number[]) ?? 100;
  const a2Reps = Math.max(3, Math.round(a2Volume / a2Dist));
  const a2Stroke = pickWeighted(strokes, weights);

  sets.push(makeSet(a2Reps, a2Dist, a2Stroke, {
    intensityPercent: settings.pace.endurance,
    restKind: "on",
    sendoffSeconds: calculateSendoff(a2Dist, 0.28, a2Stroke),
  }));

  // Primary threshold set, 45% of total volume
  const ltVolume = Math.floor(mainVolume * 0.45);
  const ltDist = pickRandom([100, 150, 200].filter(d => ltVolume / d >= 3) as number[]) ?? 100;
  const ltReps = Math.max(3, Math.round(ltVolume / ltDist));
  const ltStroke = pickWeighted(strokes, weights);
  const afterStop = calculateAfterStop(20);

  sets.push(makeSet(ltReps, ltDist, ltStroke, {
    intensityZone: "threshold",
    restKind: "with",
    sendoffSeconds: afterStop,
    description: "hold pace every rep",
  }));

  // 20% short aerobic finish
  const a3Volume = Math.floor(mainVolume * 0.20);
  const a3Dist = pickRandom([50, 100].filter(d => a3Volume / d >= 2)) ?? 50;
  const a3Reps = Math.max(2, Math.round(a3Volume / a3Dist));
  const a3BreatheOpts = [3, 5] as const;

  sets.push(makeSet(a3Reps, a3Dist, "Freestyle", {
    intensityPercent: settings.pace.endurance,
    restKind: "on",
    sendoffSeconds: calculateSendoff(a3Dist, 0.45),
    ...(Math.random() < 0.6 && { breatheEvery: pickRandom([...a3BreatheOpts]) }),
  }));

  return sets;
}

/**
 * Generates the main sets for a speed-focused session based on the provided main volume.
 * @param mainVolume total main set volume in metres
 * @returns array of SwimSet objects representing the main sets for a speed-focused session
 */
function generateSpeedMainSet(
  mainVolume: number,
  poolLength: number
): SwimItem[] {
  const sets: SwimItem[] = [];

  // Light aerobic before sprint, 35% of total volume
  const a1Volume   = Math.floor(mainVolume * 0.35);
  const a1Rounded  = roundToPool(a1Volume, poolLength);
  const a1LapCount = a1Rounded / poolLength;
  const TIDY_LAPS  = new Set([2, 4, 6, 8, 10, 12]);
  // If the aerobic volume can be neatly expressed as a whole number of laps, do that for simplicity and better pacing. Otherwise, do a distance-based set.
  if (TIDY_LAPS.has(a1LapCount)) {
    sets.push(makeLapSet(a1LapCount, poolLength, "Freestyle", {
      intensityZone: "endurance",
      sendoffSeconds: 0,
    }));
  } else {
    const a1Reps = Math.max(3, Math.round(a1Volume / 100));
    sets.push(makeSet(a1Reps, 100, "Freestyle", {
      intensityZone: "endurance",
      restKind: "on",
      sendoffSeconds: calculateSendoff(100, 0.25),
    }));
  }

  // Descending distance speed set
  const speedVolume = mainVolume * 0.65;
  const descSets: { dist: number; zone: string }[] = [
    { dist: 100, zone: "endurance" },
    { dist: 75,  zone: "racePace" },
    { dist: 50,  zone: "max" },
    { dist: 25,  zone: "max" },
  ];

  const outerReps = Math.max(2, Math.min(6,
    Math.floor(speedVolume / descSets.reduce((s, d) => s + d.dist, 0))
  ));

  const innerItems: SwimItem[] = descSets.map(({ dist, zone }) =>
    makeSet(1, dist, "Freestyle", {
      intensityZone: zone,
      restKind: "with",
      sendoffSeconds: calculateAfterStop(dist <= 25 ? 25 : 15),
      underwater: dist === 25,
    })
  );

  sets.push(makeGroup(innerItems, {
    repetitions: outerReps,
    description: "max effort on every 25",
  }));

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

  // Aerobic block
  const a1Volume = Math.floor(mainVolume * 0.40);
  const a1Dist = pickRandom([150, 200, 300].filter(d => a1Volume / d >= 3) as number[]) ?? 200;
  const a1Reps = Math.max(3, Math.round(a1Volume / a1Dist));
  const a1Stroke = pickWeighted(strokes, weights);
  const a1RestRatio = a1Stroke === "Breaststroke" ? 0.50 : 0.28;

  sets.push(makeSet(a1Reps, a1Dist, a1Stroke, {
    intensityZone: "endurance",
    restKind: "on",
    sendoffSeconds: calculateSendoff(a1Dist, a1RestRatio, a1Stroke),
    ...(a1Stroke === "Freestyle" && { breatheEvery: 3 }),
  }));

  // Threshold block
  const ltVolume = Math.floor(mainVolume * 0.35);
  const ltDist = pickRandom([100, 150].filter(d => ltVolume / d >= 3)) ?? 100;
  const ltReps = Math.max(3, Math.round(ltVolume / ltDist));
  const ltRestSecs = ltDist <= 100 ? 30 : 35;

  sets.push(makeSet(ltReps, ltDist, "Freestyle", {
    intensityZone: "threshold",
    restKind: "with",
    sendoffSeconds: calculateAfterStop(ltRestSecs),
  }));

  // Speed block with short sprints and more rest
  const spVolume = Math.floor(mainVolume * 0.25);
  const spReps = Math.min(8, Math.max(4, Math.round(spVolume / (25 * 2))));

  sets.push(makeGroup(
    [
      makeSet(1, 25, "Freestyle",  { intensityZone: "max",  restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
      makeSet(1, 25, "Backstroke", { intensityZone: "endurance", restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
    ],
    { repetitions: spReps, description: "fast/easy alternating" }
  ));

  return sets;
}

function generateCooldown(
  cooldownVolume: number,
  poolLength: number
): SwimItem[] {
  const useTimed = Math.random() < 0.25;
  const stroke = Math.random() < 0.4 ? "Backstroke" : "Freestyle";

  if (useTimed) {
    const estimatedSeconds = Math.round((cooldownVolume / 100) * pacePer100(stroke));
    const mins = Math.max(3, Math.round(estimatedSeconds / 60));
    return [makeTimedSet(mins * 60, stroke, {
      intensityZone: "easy",
    })];
  }

  return [makeSet(1, roundToPool(cooldownVolume, poolLength), stroke, {
    intensityZone: "easy",
    sendoffSeconds: 0,
  })];
}

/**
 * Formats intensity information for display
 * @param intensityPercent single intensity percentage
 * @param intensityPercentEnd optional end intensity percentage for a range
 * @param intensityZone optional intensity zone label
 * @returns formatted intensity string for display in the DSL
 */
function formatIntensity(intensityPercent?: number, intensityPercentEnd?: number, intensityZone?: string): string {
  if (intensityZone) return intensityZone;

  if (intensityPercent != null && intensityPercentEnd != null)
    return `${intensityPercent}% -> ${intensityPercentEnd}%`;

  if (intensityPercent != null) return `${intensityPercent}%`;

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
function setLineToSwimDsl(s: SwimSet, insideGroup = false): string {
  const lengthStr = renderLength(s);
  const base = s.repetitions > 1
    ? `${s.repetitions} x ${lengthStr} ${s.stroke}`
    : `${lengthStr} ${s.stroke}`;
  const modifier = s.strokeModifier ? ` ${s.strokeModifier}` : "";
  const intensity = formatIntensity(s.intensityPercent, s.intensityPercentEnd, s.intensityZone);
  const paceStr = intensity ? ` @ ${intensity}` : "";
  const rest = renderRest(s, insideGroup);
  const equipment = s.equipment?.length ? ` + ${s.equipment.join(" ")}` : "";
  const underwater = s.underwater ? " underwater" : "";
  const breathe = s.breatheEvery != null ? ` breathe ${s.breatheEvery}` : "";
  const noalign = s.noalign ? " noalign" : "";
  const desc = s.description ? ` -- "${s.description}"` : "";

  return `${base}${modifier}${paceStr}${rest}${equipment}${underwater}${breathe}${noalign}${desc}`;
}

/**
 * Recursively converts a SwimItem into its corresponding SwimDSL string representation
 * @param item SwimItem object to convert to SwimDSL
 * @param depth current depth in the item hierarchy for indentation purposes
 * @returns formatted string representing the SwimItem in SwimDSL syntax
 */
function itemToSwimDsl(item: SwimItem, depth = 0): string {
  const indent = "  ".repeat(depth);

  // if its a set, render the line directly
  if (item.kind === "set") {
    return indent + setLineToSwimDsl(item, depth > 0);
  }

  const lines: string[] = [];
  const repPrefix = item.repetitions && item.repetitions > 1 ? `${item.repetitions} x ` : ""; // only show repetition count on group if more than 1
  lines.push(`${indent}${repPrefix}{`);

  // recursively render child items with increased indentation
  for (const child of item.items) {
    lines.push(itemToSwimDsl(child, depth + 1));
  }

  // render modifiers for the group after closing brace
  const mods: string[] = [];
  const intensity = formatIntensity(item.intensityPercent, item.intensityPercentEnd, item.intensityZone);
  if (intensity) mods.push(`@ ${intensity}`);
  if (item.onSeconds && item.onSeconds > 0) mods.push(`on ${formatDuration(item.onSeconds)}`);
  if (item.equipment?.length) mods.push(`+ ${item.equipment.join(" ")}`);
  if (item.description) mods.push(`-- "${item.description}"`);

  const closing = mods.length > 0 ? ` ${mods.join(" ")}` : "";
  lines.push(`${indent}}${closing}`);

  return lines.join("\n");
}

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

/**
 * Main function to generate a week of swim sessions based on a target session length in metres
 * @param sessionLengthMetres target length in metres for each session in the generated week
 * @returns string representing the generated swim sessions in SwimDSL format
 */
export function generateWeekProgramme(
  settings: GeneratorSettings
): string[] {
  const {
    startDate,
    weeks,
    trainingDays,
    phase,
    focus,
    distance,
    baselineTime,
    poolLength,
    distanceUnit,
    pace,
    strokes,
    equipment,
  } = settings;

  const trainingDates = getTrainingDates(
    startDate,
    weeks,
    trainingDays
  );

  const sessionPlan = buildSessionPlan(trainingDates.length, focus, phase);

  const programmes: string[] = [];

  for (let i = 0; i < sessionPlan.length; i++) {
    const plan = sessionPlan[i];
    if (!plan) {
      continue;
    }

    const sessionDate = trainingDates[i];

    const totalVolume = roundToPool(
      distance * plan.factor,
      poolLength
    );

    const warmupVolume = chooseWarmupVolume(totalVolume);
    const pullVolume = roundToPool(totalVolume * 0.12, poolLength);
    const cooldownVolume = chooseCooldownVolume(totalVolume);
    const mainVolume =
      totalVolume -
      warmupVolume -
      pullVolume -
      cooldownVolume;

    const mainItems: SwimItem[] =
      plan.type === "volume"
        ? generateVolumeMainSet(mainVolume, settings)
        : plan.type === "threshold"
        ? generateThresholdMainSet(mainVolume, settings)
        : plan.type === "speed"
        ? generateSpeedMainSet(mainVolume, poolLength)
        : generateMixedMainSet(mainVolume, settings);

    const allItems: SwimItem[] = [
      ...generateWarmup(warmupVolume, settings),
      ...generatePullSet(pullVolume, settings),
      ...mainItems,
      ...generateCooldown(cooldownVolume, poolLength),
    ];

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

    for (const item of allItems) {
      lines.push(itemToSwimDsl(item));
    }

    programmes.push(lines.join("\n"));
  }

  return programmes;
}
