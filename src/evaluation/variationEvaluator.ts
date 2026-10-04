export interface SessionVariation {
  date: string;
  structure: string;
  strokes: string[];
  intensities: string[];
  equipment: string[];
}

export interface VariationResult {
  totalSessions: number;
  uniqueSessions: number;
  uniqueSessionPercentage: number;

  uniqueStructures: number;
  structuralVariationPercentage: number;

  strokeVariety: number;
  intensityVariety: number;
  equipmentVariety: number;
}

export interface BetweenProgrammeVariation {
  totalProgrammes: number;
  totalSessions: number;
  uniqueSessionInstances: number;
  totalSessionPositions: number;
  variationPercentage: number;
}

export function evaluateVariation(sessions: SessionVariation[]): VariationResult {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      uniqueSessions: 0,
      uniqueSessionPercentage: 0,
      uniqueStructures: 0,
      structuralVariationPercentage: 0,
      strokeVariety: 0,
      intensityVariety: 0,
      equipmentVariety: 0,
    };
  }

  const uniqueStructures = new Set(
    sessions.map((session) => session.structure)
  );

  const uniqueSessionSignatures = new Set(
    sessions.map((session) =>
      JSON.stringify({
        structure: session.structure,
        strokes: [...session.strokes].sort(),
        intensities: [...session.intensities].sort(),
        equipment: [...session.equipment].sort(),
      })
    )
  );

  const allStrokes = new Set(sessions.flatMap((session) => session.strokes));
  const allIntensities = new Set(
    sessions.flatMap((session) => session.intensities)
  );
  const allEquipment = new Set(
    sessions.flatMap((session) => session.equipment)
  );

  return {
    totalSessions: sessions.length,
    uniqueSessions: uniqueSessionSignatures.size,
    uniqueSessionPercentage: (uniqueSessionSignatures.size / sessions.length) * 100,
    uniqueStructures: uniqueStructures.size,
    structuralVariationPercentage: (uniqueStructures.size / sessions.length) * 100,
    strokeVariety: allStrokes.size,
    intensityVariety: allIntensities.size,
    equipmentVariety: allEquipment.size,
  };
}

export function extractSessionVariation(source: string, date: string): SessionVariation {
  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const swimmingLines = lines.filter(
    (line) =>
      !line.startsWith("set ") &&
      !line.startsWith("pace ") &&
      !line.startsWith("--") &&
      !line.startsWith("//")
  );

  const strokes = new Set<string>();
  const intensities = new Set<string>();
  const equipment = new Set<string>();

  for (const line of swimmingLines) {
    const strokeMatches = line.match(
      /\b(Freestyle|Backstroke|Breaststroke|Butterfly)\b/g
    );

    strokeMatches?.forEach((stroke) => strokes.add(stroke));

    const intensityMatches = line.match(
      /@\s*(easy|endurance|threshold|racePace|max)\b/gi
    );

    intensityMatches?.forEach((intensity) =>
      intensities.add(intensity.toLowerCase())
    );

    const equipmentMatches = line.match(
      /\b(Kickboard|Fins|Pull Buoy|Paddles|Snorkel)\b/g
    );

    equipmentMatches?.forEach((item) => equipment.add(item));
  }

  // Remove metadata and pace definitions.
  const structure = swimmingLines
    .filter(
      (line) =>
        !line.startsWith("set ") &&
        !line.startsWith("pace ")
    )
    .join("\n");

  return {
    date,
    structure,
    strokes: [...strokes],
    intensities: [...intensities],
    equipment: [...equipment],
  };
}

export function evaluateBetweenProgrammeVariation(programmes: SessionVariation[][]): BetweenProgrammeVariation {
  if (programmes.length === 0) {
    return {
      totalProgrammes: 0,
      totalSessions: 0,
      uniqueSessionInstances: 0,
      totalSessionPositions: 0,
      variationPercentage: 0,
    };
  }

  const sessionCount = programmes[0]?.length ?? 0;

  if (sessionCount === 0) {
    return {
      totalProgrammes: programmes.length,
      totalSessions: 0,
      uniqueSessionInstances: 0,
      totalSessionPositions: 0,
      variationPercentage: 0,
    };
  }

  let uniqueSessionInstances = 0;

  for (let sessionIndex = 0; sessionIndex < sessionCount; sessionIndex++) {
    const signatures = new Set<string>();

    for (const programme of programmes) {
      const session = programme[sessionIndex];

      if (!session) {
        continue;
      }

      signatures.add(
        JSON.stringify({
          structure: session.structure,
          strokes: [...session.strokes].sort(),
          intensities: [...session.intensities].sort(),
          equipment: [...session.equipment].sort(),
        })
      );
    }

    uniqueSessionInstances += signatures.size;
  }

  const totalSessionPositions =
    sessionCount * programmes.length;

  const variationPercentage =
    totalSessionPositions === 0
      ? 0
      : (uniqueSessionInstances / totalSessionPositions) * 100;

  return {
    totalProgrammes: programmes.length,
    totalSessions: sessionCount,
    uniqueSessionInstances,
    totalSessionPositions,
    variationPercentage,
  };
}
