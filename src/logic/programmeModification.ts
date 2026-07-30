
// TYPES
import {newFile} from "./filePersistence.ts";

export interface ModificationParameters {
  group: string;
  paces: string[]; // This is where the type definition goes!
  duration: string;
  volume: string;
}

// MAIN ALGORITHM

export function modifyProgram(
  program: string,
  selectedFile: string,
  setSelectedFile: (selectedFile: string) => void,
  modificationParams: ModificationParameters,
  // Want type of session. i.e. sprint/distance/aerobic
  // Want average 100m time.
  // Maybe need to change the output style
): void {
  // const numPrograms = 3;
  // const hundredTimes = ["1:30", "1:45", "2:00"]
  const hundredTimes = modificationParams.paces;

  const instructions =
    program
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

  // STEP 1: Parse instructions ONCE to find all the original intervals and distances
  const parsedInstructions = instructions.map(instruction => {
    const distance = getDistance(instruction);
    let originalTime: string | null = null;
    let timeIndex = -1;

    if (instruction.toLowerCase().includes("on")) {
      timeIndex = instruction.indexOf("on") + "on".length + 1;
      originalTime = wordAt(instruction, timeIndex);
    }

    return { instruction, distance, originalTime };
  });

  const newProgrammes = new Map<string, string>();

  // for (const pace of hundredTimes) {
  //   const newInstructions: string[] = []
  //   for (let instruction of instructions) {
  //     const distance = getDistance(instruction);
  //     if (instruction.toLowerCase().includes("on")) {
  //       const timeIndex = instruction.indexOf("on") + ("on".length) + 1;
  //       const intervalTime = wordAt(instruction, timeIndex);
  //       const intervalSwimTime = getIntervalTime(distance, pace);
  //       const modifiedTime = addTimes(intervalSwimTime, getRestTime(intervalSwimTime, "endurance")); // This should become the swimmers new interval time i.e. intervalSwimTime + intervalRestTime
  //
  //       instruction = instruction.replace(intervalTime, modifiedTime);
  //     }
  //     newInstructions.push(instruction);
  //   }

  // STEP 2: Loop through your new paces
  for (const pace of hundredTimes) {
    const newInstructions: string[] = [];

    for (const item of parsedInstructions) {
      let modifiedInstruction = item.instruction;

      if (item.originalTime) {
        // 1. Get the standard baseline swim time for this distance at the NEW pace
        const baseSwimTime = getIntervalTime(item.distance, pace);
        const baseTotalTime = addTimes(baseSwimTime, getRestTime(baseSwimTime, "endurance"));

        // 2. PRESERVE DIFFERENCES: Calculate the offset
        // Find the difference between a standard 100m at this pace vs what the original text had
        const standardOriginalBase = getIntervalTime(item.distance, pace);

        const baseTimeSecs = timeToSeconds(baseSwimTime);
        const baseTotalSecs = timeToSeconds(baseTotalTime);
        // const standardOriginalBaseSecs = timeToSeconds(standardOriginalBase);
        const originalSecs = timeToSeconds(item.originalTime);

        const offsetSecs = originalSecs - baseTimeSecs;

        const timeOffset: string = subtractTimes(item.originalTime, standardOriginalBase); // e.g., +15 seconds for a slower lane

        // 3. Apply the offset to the new base time
        // const finalModifiedTime = addTimes(baseTotalTime, timeOffset);

        const finalModifiedSecs = baseTotalSecs + offsetSecs;
        const finalModifiedTime = secondsToTime(finalModifiedSecs);

        console.log("[original, standard base, offset, modified]", item.originalTime, standardOriginalBase, timeOffset, finalModifiedTime);
        // 4. Swap the time out
        modifiedInstruction = modifiedInstruction.replace(item.originalTime, finalModifiedTime);
      }

      newInstructions.push(modifiedInstruction);
    }
    newProgrammes.set(pace+" ("+selectedFile+")", newInstructions.join("\n"));
  }
  // Returns the modified programmes as a string.
  for (const [key, value] of newProgrammes) {
    console.log(key, value);
    console.log(selectedFile);
    newFile(selectedFile, setSelectedFile, key, value);
  }
  // window.location.reload();
}




// HELPER FUNCTIONS

function getDistance(
  instruction: string
): string {
  const xIndex = instruction.toLowerCase().indexOf(" x ");
  if (xIndex !== -1) {
    return wordAt(instruction, xIndex + 3); // skip past " x "
  }
  return wordAt(instruction, 0);
}

export function getIntervalTime(
  distance: string,
  pace: string,
): string {
  const completionTime = timeToSeconds(pace) * (Number(distance)/100); // TODO: need to factor in the distance, e.g. 50m can be completed at a faster pace than 100m
  return secondsToTime(Math.floor(completionTime));
}

export function getRestTime(
  interval: string,
  sessionType: string,
): string {
  if (sessionType === "endurance") {
    return "0:15";
  } else {
    // Speed session
    return addTimes(interval, interval);
  }
}


// HELPER HELPER FUNCTIONS

function wordAt(
  str: string,
  start: number
): string {
  const end = str.indexOf(" ", start);
  return end === -1
    ? str.slice(start)        // no space found, go to end of string
    : str.slice(start, end);  // slice up to the space
}

function timeToSeconds(
  time: string
): number {
  const [mins = 0, secs = 0] = time.split(":").map(Number);
  return mins * 60 + secs;
}

function secondsToTime(
  total: number
): string {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function addTimes(
  a: string,
  b: string
): string {
  return secondsToTime(timeToSeconds(a) + timeToSeconds(b));
}

function subtractTimes(
  a: string,
  b: string
): string {
  return secondsToTime(timeToSeconds(a) - timeToSeconds(b));
}

