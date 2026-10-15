export type TrainingPhase = "base" | "build" | "peak" | "taper";

export interface PhaseMetrics {
  phase: TrainingPhase;
  phaseFactor: number;
  totalProgrammes: number;
  totalSessions: number;
  totalVolume: number;
  averageSessionVolume: number;
  reductionFromBase: number;
}

export interface PeriodisationResult {
  phases: PhaseMetrics[];
  expectedVolumeOrder: TrainingPhase[];
  observedVolumeOrder: TrainingPhase[];
  volumeOrderMatches: boolean;
  expectedFactors: Record<TrainingPhase, number>;
}

const EXPECTED_PHASE_FACTORS: Record<TrainingPhase, number> = {
  base: 1.0,
  build: 0.9,
  peak: 0.5,
  taper: 0.3,
};

const EXPECTED_VOLUME_ORDER: TrainingPhase[] = [
  "base",
  "build",
  "peak",
  "taper",
];

export function getExpectedPhaseFactor(phase: TrainingPhase): number {
  return EXPECTED_PHASE_FACTORS[phase];
}

export function evaluatePeriodisation(phases: PhaseMetrics[]): PeriodisationResult {
  const observedVolumeOrder = [...phases]
    .sort(
      (a, b) =>
        b.averageSessionVolume -
        a.averageSessionVolume
    )
    .map((phase) => phase.phase);

    return {
    phases,
    expectedVolumeOrder: EXPECTED_VOLUME_ORDER,
    observedVolumeOrder,
    volumeOrderMatches:
      EXPECTED_VOLUME_ORDER.every(
        (phase, index) =>
          observedVolumeOrder[index] === phase
      ),
    expectedFactors: EXPECTED_PHASE_FACTORS,
  };
}
