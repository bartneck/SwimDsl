/**
 * Rewriting a programme for the swimmers who are going to swim it.
 *
 * One programme is turned into one variant per pace given in the
 * modification dialog. Each variant keeps the shape of the original, has its
 * intervals recalculated for that swimmer's pace, and has its volume fitted
 * to the session's duration and volume by
 * {@link "./programmeAdjustment.ts"}.
 */

import { newFile } from "./filePersistence.ts";
import {
  describeAdjustment,
  fitProgramme,
  measureIntervalRatios,
  parseTarget,
  withoutAdjustmentSummary,
  type AdjustmentSummary,
  type FitMethod,
  type SessionTargets,
} from "./programmeAdjustment.ts";
import { getPoolLength, parseProgramme } from "./programmeParsing.ts";
import { timeToSeconds } from "./swimTime.ts";

export { getIntervalTime, getRestTime } from "./swimTime.ts";

/** The details collected by the modification dialog. */
export interface ModificationParameters {
  group: string;
  paces: string[];
  /** The session duration in minutes, as typed. Empty when unconstrained. */
  duration: string;
  /** The session volume in metres, as typed. Empty when unconstrained. */
  volume: string;
  /**
   * Whether the sets of the programme are resized to fit the session, or the
   * programme is simply stopped where the session runs out.
   */
  fit: FitMethod;
}

/** One pace's version of a programme. */
export interface ModifiedProgramme {
  /** The pace the programme was written for, as `m:ss` per 100 metres. */
  pace: string;
  /** The SwimDSL source of the rewritten programme. */
  source: string;
  summary: AdjustmentSummary;
}

/**
 * Rewrite a programme once for each pace it should be swum at.
 *
 * @param programme The SwimDSL source of the original programme.
 * @param parameters The details collected by the modification dialog.
 * @returns One rewritten programme per pace, in the order the paces were
 *   given.
 */
export function modifiedProgrammes(
  programme: string,
  parameters: ModificationParameters,
): ModifiedProgramme[] {
  const source = withoutAdjustmentSummary(programme);
  const poolLength = getPoolLength(source);
  const elements = parseProgramme(source, poolLength);
  const intervalRatios = measureIntervalRatios(elements, poolLength);

  const targets: SessionTargets = {
    durationSeconds: parseTarget(parameters.duration, 60),
    volumeMetres: parseTarget(parameters.volume, 1),
  };

  return parameters.paces.map(pace => {
    const fitted = fitProgramme(
      elements,
      intervalRatios,
      timeToSeconds(pace),
      targets,
      poolLength,
      parameters.fit,
    );

    return {
      pace,
      source: describeAdjustment(fitted.summary, targets) + "\n" + fitted.source,
      summary: fitted.summary,
    };
  });
}

/**
 * Rewrite a programme for each of the given paces and save the results as
 * new files.
 *
 * @param program The SwimDSL source of the original programme.
 * @param selectedFile The file the original programme was loaded from.
 * @param setSelectedFile Selects a file in the editor.
 * @param modificationParams The details collected by the modification dialog.
 */
export function modifyProgram(
  program: string,
  selectedFile: string,
  setSelectedFile: (selectedFile: string) => void,
  modificationParams: ModificationParameters,
): void {
  for (const modified of modifiedProgrammes(program, modificationParams)) {
    newFile(
      selectedFile,
      setSelectedFile,
      `${modified.pace} (${selectedFile})`,
      modified.source,
    );
  }
}
