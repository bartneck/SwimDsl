type SessionType = "volume" | "threshold" | "speed" | "mixed";

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

interface Session {
  label: string;
  type: SessionType;
  items: SwimItem[];
  totalDistance: number;
}

const POOL_LENGTH = 25;

const STROKES = ["Freestyle", "Backstroke", "Breaststroke"];
const STROKE_WEIGHTS = [0.60, 0.25, 0.15];

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

/**
 * Rounds the distance to the nearest pool length, ensuring it's at least one pool length.
 * @param distance distance in metres to round
 * @returns rounded distance that is a multiple of the pool length
 */
function roundToPool(distance: number): number {
  return Math.max(POOL_LENGTH, Math.round(distance / POOL_LENGTH) * POOL_LENGTH);
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
 * Determines the number of sessions to generate based on the target session length.
 * @param sessionLength target session length in metres
 * @returns number of sessions to generate for the week
 */
function getSessionCount(sessionLength: number): number {
  if (sessionLength <= 2000) return 5;
  if (sessionLength <= 3000) return 6;
  if (sessionLength <= 4000) return 8;
  if (sessionLength <= 5000) return 9;
  return 10;
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

/**
 * Resolves an intensity zone to either a specific percentage or a range of percentages based on predefined pace definitions
 * @param zone intensity zone name
 * @returns object containing either intensityPercent or intensityZone
 */
function resolveIntensity(zone: string): Partial<Pick<SwimSet, "intensityZone" | "intensityPercent" | "intensityPercentEnd">> {
  const ranges: Record<string, { start: number; end: number }> = {
    descend: { start: 70, end: 90 },
  };
  const range = ranges[zone];
  return range
    ? { intensityPercent: range.start, intensityPercentEnd: range.end }
    : { intensityZone: zone };
}

/**
 * Builds a session plan with a mix of session types based on the number of sessions.
 * @param count number of sessions to generate
 * @returns array of session plans with label, type, and volume factor
 */
function buildSessionPlan(count: number): { label: string; type: SessionType; factor: number }[] {
  const pattern: SessionType[] = [
    "volume",
    "threshold",
    "mixed",
    "speed",
    "volume",
    "threshold",
    "mixed",
    "speed",
    "volume",
    "mixed",
  ];

  return Array.from({ length: count }, (_, i) => ({
    label:  `Session ${i + 1}`,
    type:   pattern[i % pattern.length]!,
    factor: 0.95 + Math.random() * 0.1,
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
function makeLapSet(laps: number, stroke: string, opts: Partial<Omit<SwimSet, "kind" | "repetitions" | "distance" | "stroke" | "laps">> = {}): SwimSet {
  return {
    kind: "set",
    repetitions: 1,
    distance: laps * POOL_LENGTH,
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
function generateWarmup(warmupVolume: number): SwimItem[] {
  const template = pickRandom(["standard", "stroke-focus", "progressive", "build-kick"]);
  const sets: SwimItem[] = [];

  if (template === "standard") {
    // Easy swim, drill/kick, activation 25s underwater
    const mainDist = warmupVolume >= 500 ? 400 : warmupVolume >= 400 ? 300 : 200;
    sets.push(makeSet(1, mainDist, "Freestyle", { intensityZone: "easy", sendoffSeconds: 0 }));
    const rem = warmupVolume - mainDist;

    if (rem >= 200) {
      sets.push(makeSet(2, 50, "Freestyle", { strokeModifier: "Drill", intensityZone: "easy", sendoffSeconds: calculateSendoff(50, 0.5) }));
      sets.push(makeSet(2, 50, "Freestyle", { strokeModifier: "Kick",  intensityZone: "easy", sendoffSeconds: calculateSendoff(50, 0.5), equipment: ["Board"] }));
    } else if (rem >= 100) {
      sets.push(makeSet(2, 50, "Freestyle", { strokeModifier: "Drill", intensityZone: "easy", sendoffSeconds: calculateSendoff(50, 0.5) }));
    }
    if (warmupVolume >= 400) {
      sets.push(makeSet(2, 25, "Freestyle", { underwater: true, intensityZone: "aerobic", restKind: "with", sendoffSeconds: 20 }));
    }
  } else if (template === "stroke-focus") {
    // IM-style rotation through strokes, no equipment
    const strokeOrder = ["Freestyle", "Backstroke", "Breaststroke"];
    const distPer = roundToPool(warmupVolume / 3);
    for (const stroke of strokeOrder) {
      sets.push(makeSet(1, distPer, stroke, { intensityZone: "easy", sendoffSeconds: 0 }));
    }
  } else if (template === "progressive") {
    // Single continuous swim building from easy to aerobic
    const mainDist = warmupVolume >= 400
      ? roundToPool(warmupVolume * 0.75)
      : warmupVolume;
    sets.push(makeSet(1, mainDist, "Freestyle", {
      ...resolveIntensity("descend"),
      sendoffSeconds: 0,
      description: "build from easy to aerobic",
    }));
    const rem = warmupVolume - mainDist;
    if (rem >= 100) {
      sets.push(makeSet(Math.round(rem / 50), 50, "Freestyle", {
        strokeModifier: "Drill",
        intensityZone: "easy",
        sendoffSeconds: calculateSendoff(50, 0.4),
      }));
    }
  } else {
    // build-kick: easy swim, kick set building pace, then short sprint activation
    const mainDist = warmupVolume >= 500 ? 300 : 200;
    sets.push(makeSet(1, mainDist, "Freestyle", { intensityZone: "easy", sendoffSeconds: 0 }));
    const kickReps = warmupVolume >= 400 ? 4 : 2;
    sets.push(makeSet(kickReps, 50, "Freestyle", {
      strokeModifier: "Kick",
      ...resolveIntensity("descend"),
      sendoffSeconds: calculateSendoff(50, 0.6),
      equipment: ["Board"],
    }));

    if (warmupVolume >= 400) {
      sets.push(makeSet(4, 25, "Freestyle", {
        intensityZone: "aerobic",
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
function generatePullSet(volume: number): SwimItem[] {
  const distOptions = [100, 150, 200, 300];
  const setDist = pickRandom(distOptions.filter(d => volume / d >= 3) as number[]) ?? 100;
  const reps = Math.max(3, Math.round(volume / setDist));

  const equipVariants: string[][] = [
    ["PullBuoy"],
    ["PullBuoy", "Pads"],
    ["PullBuoy", "Snorkel"],
  ];

  const equipment = pickRandom(equipVariants);
  const hasSnorkel = equipment.includes("Snorkel");

  return [makeSet(reps, setDist, "Freestyle", {
    intensityZone: "aerobic",
    restKind: "on",
    sendoffSeconds: calculateSendoff(setDist, 0.25),
    equipment,
    ...(!hasSnorkel && { breatheEvery: pickRandom([3, 5]) }),
  })];
}

/**
 * Generates the main sets for a volume-focused session based on the provided main volume.
 * @param mainVolume total main set volume in metres
 * @returns array of SwimSet objects representing the main sets for a volume-focused session
 */
function generateVolumeMainSet(mainVolume: number): SwimItem[] {
  const sets: SwimItem[] = [];

  // 55% of total workout is easy aerobic swimming
  const a1Volume = Math.floor(mainVolume * 0.55);
  const a1Stroke = pickWeighted(STROKES, STROKE_WEIGHTS);
  const maxDist = a1Stroke === "Breaststroke" ? 200 : 500;
  const a1Dist = pickRandom([200, 300, 400, 500].filter(d => d <= maxDist && a1Volume / d >= 3) as number[]) ?? 200;// choose distance only if at least 3 reps can be done
  const a1Reps = Math.max(3, Math.round(a1Volume / a1Dist));

  sets.push(makeSet(a1Reps, a1Dist, a1Stroke, {
    intensityZone: "aerobic",
    restKind: "on",
    sendoffSeconds: calculateSendoff(a1Dist, 0.25, a1Stroke),
    ...(a1Stroke === "Freestyle" && { breatheEvery: pickRandom([3, 5]) }),
  }));

  // Slightly harder aerobic work, 30% of total volume
  const a2Volume = Math.floor(mainVolume * 0.30);
  const a2Dist = pickRandom([100, 150, 200].filter(d => a2Volume / d >= 3) as number[]) ?? 100;
  const a2Reps = Math.max(2, Math.round(a2Volume / a2Dist));

  sets.push(makeSet(a2Reps, a2Dist, "Freestyle", {
    intensityZone: "steady",
    restKind: "on",
    sendoffSeconds: calculateSendoff(a2Dist, 0.30),
  }));

  // 15% descend
  const ltVolume = Math.floor(mainVolume * 0.15);
  const ltDist = pickRandom([50, 75, 100].filter(d => ltVolume / d >= 2)) ?? 50;
  const ltReps = Math.max(2, Math.round(ltVolume / ltDist));
  const ltSendoff = calculateSendoff(ltDist, 0.35);

  sets.push(makeSet(ltReps, ltDist, "Freestyle", {
    ...resolveIntensity("descend"),
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
function generateThresholdMainSet(mainVolume: number): SwimItem[] {
  const sets: SwimSet[] = [];

  // Aerobic base before threshold, 35% of total volume
  const a2Volume = Math.floor(mainVolume * 0.35);
  const a2Dist = pickRandom([100, 150, 200].filter(d => a2Volume / d >= 3) as number[]) ?? 100;
  const a2Reps = Math.max(3, Math.round(a2Volume / a2Dist));
  const a2Stroke = pickWeighted(STROKES, STROKE_WEIGHTS);

  sets.push(makeSet(a2Reps, a2Dist, a2Stroke, {
    intensityZone: "steady",
    restKind: "on",
    sendoffSeconds: calculateSendoff(a2Dist, 0.28, a2Stroke),
  }));

  // Primary threshold set, 45% of total volume
  const ltVolume = Math.floor(mainVolume * 0.45);
  const ltDist = pickRandom([100, 150, 200].filter(d => ltVolume / d >= 3) as number[]) ?? 100;
  const ltReps = Math.max(3, Math.round(ltVolume / ltDist));
  const ltStroke = pickWeighted(["Freestyle", "Backstroke"], [0.70, 0.30]);
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
    intensityZone: "steady",
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
function generateSpeedMainSet(mainVolume: number): SwimItem[] {
  const sets: SwimItem[] = [];

  // Light aerobic before sprint, 35% of total volume
  const a1Volume   = Math.floor(mainVolume * 0.35);
  const a1Rounded  = roundToPool(a1Volume);
  const a1LapCount = a1Rounded / POOL_LENGTH;
  const TIDY_LAPS  = new Set([2, 4, 6, 8, 10, 12]);
  // If the aerobic volume can be neatly expressed as a whole number of laps, do that for simplicity and better pacing. Otherwise, do a distance-based set.
  if (TIDY_LAPS.has(a1LapCount)) {
    sets.push(makeLapSet(a1LapCount, "Freestyle", {
      intensityZone: "aerobic",
      sendoffSeconds: 0,
    }));
  } else {
    const a1Reps = Math.max(3, Math.round(a1Volume / 100));
    sets.push(makeSet(a1Reps, 100, "Freestyle", {
      intensityZone: "aerobic",
      restKind: "on",
      sendoffSeconds: calculateSendoff(100, 0.25),
    }));
  }

  // Descending distance speed set
  const speedVolume = mainVolume * 0.65;
  const descSets: { dist: number; zone: string }[] = [
    { dist: 100, zone: "steady" },
    { dist: 75,  zone: "race" },
    { dist: 50,  zone: "sprint" },
    { dist: 25,  zone: "sprint" },
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
function generateMixedMainSet(mainVolume: number): SwimItem[] {
  const sets: SwimItem[] = [];

  // Aerobic block
  const a1Volume = Math.floor(mainVolume * 0.40);
  const a1Dist = pickRandom([150, 200, 300].filter(d => a1Volume / d >= 3) as number[]) ?? 200;
  const a1Reps = Math.max(3, Math.round(a1Volume / a1Dist));
  const a1Stroke = pickWeighted(STROKES, STROKE_WEIGHTS);
  const a1RestRatio = a1Stroke === "Breaststroke" ? 0.50 : 0.28;

  sets.push(makeSet(a1Reps, a1Dist, a1Stroke, {
    intensityZone: "aerobic",
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
      makeSet(1, 25, "Freestyle",  { intensityZone: "sprint",  restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
      makeSet(1, 25, "Backstroke", { intensityZone: "aerobic", restKind: "in-out", inOutCount: 2, sendoffSeconds: 0 }),
    ],
    { repetitions: spReps, description: "fast/easy alternating" }
  ));

  return sets;
}

function generateCooldown(cooldownVolume: number): SwimItem[] {
  const useTimed = Math.random() < 0.25;
  const stroke = Math.random() < 0.4 ? "Backstroke" : "Freestyle";

  if (useTimed) {
    const estimatedSeconds = Math.round((cooldownVolume / 100) * pacePer100(stroke));
    const mins = Math.max(3, Math.round(estimatedSeconds / 60));
    return [makeTimedSet(mins * 60, stroke, {
      intensityZone: "easy",
    })];
  }

  return [makeSet(1, roundToPool(cooldownVolume), stroke, {
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

/**
 * Recursively calculates the total volume of a SwimItem
 * @param item SwimItem object to calculate volume for
 * @returns total volume in metres represented by the SwimItem
 */
function itemVolume(item: SwimItem): number {
  if (item.kind === "set") {
    if (item.durationSeconds != null) return 0;

    return item.repetitions * item.distance;
  }
  const reps = item.repetitions ?? 1;
  return reps * item.items.reduce((sum, child) => sum + itemVolume(child), 0);
}

/**
 * Main function to generate a week of swim sessions based on a target session length in metres
 * @param sessionLengthMetres target length in metres for each session in the generated week
 * @returns string representing the generated swim sessions in SwimDSL format
 */
export function generateWeekProgramme(sessionLengthMetres: number): string {
  const sessions: Session[] = [];

  const sessionCount = getSessionCount(sessionLengthMetres); // number of sessions to generate based on user input of session length
  const sessionPlan = buildSessionPlan(sessionCount); // session plans with label, type, and factor

  for (const plan of sessionPlan) {
    const totalVolume = roundToPool(sessionLengthMetres * plan.factor);

    const warmupVolume = chooseWarmupVolume(totalVolume);
    const pullVolume = roundToPool(totalVolume * 0.12);
    const cooldownVolume = chooseCooldownVolume(totalVolume);
    const mainVolume = totalVolume - warmupVolume - pullVolume - cooldownVolume;

    // generate main set based on session type
    const mainItems: SwimItem[] =
      plan.type === "volume" ? generateVolumeMainSet(mainVolume)
      : plan.type === "threshold" ? generateThresholdMainSet(mainVolume)
      : plan.type === "speed" ? generateSpeedMainSet(mainVolume)
      : generateMixedMainSet(mainVolume);

    const allItems: SwimItem[] = [
      ...generateWarmup(warmupVolume),
      ...generatePullSet(pullVolume),
      ...mainItems,
      ...generateCooldown(cooldownVolume),
    ];

    // Total volume of the session
    const actualTotal = allItems.reduce((sum, item) => sum + itemVolume(item), 0);

    sessions.push({
      label: plan.label,
      type: plan.type,
      items: allItems,
      totalDistance: actualTotal,
    });
  }

  // Declare items at the top of the file
  const lines: string[] = [
    `set PoolLength ${POOL_LENGTH}`,
    `set LengthUnit "metres"`,
    `set Title "Generated Base Phase Week"`,
    `set Description "Adaptive base phase week. Target session length: ${sessionLengthMetres}m"`,
    "",
    "pace easy = 65%",
    "pace aerobic = 72%",
    "pace steady = 78%",
    "pace threshold = 88%",
    "pace race = 95%",
    "pace sprint = 100%",
    "",
  ];

  // Render each session with a header and its items in SwimDSL format
  for (const session of sessions) {
    lines.push(`> ${session.label} — ${session.type} (${session.totalDistance}m)`);
    for (const item of session.items) {
      lines.push(itemToSwimDsl(item));
    }
    lines.push("");
  }

  return lines.join("\n");
}
