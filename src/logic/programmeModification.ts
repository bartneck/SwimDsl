
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

  const averageDistanceTimes = new Map<string, number[]>();
  let totalDistance = 0;
  const totalTime = 0;

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

    if (distance && originalTime) {
      const times = averageDistanceTimes.get(distance);
      if (times) {
        times.push(timeToSeconds(originalTime));
      } else {
        averageDistanceTimes.set(distance, []);
      }
    }

    totalDistance += Number(distance);

    return { instruction, distance, originalTime };
  });

  let averageTime: number;
  // Average the times
  for (const [distance, times] of averageDistanceTimes)
  {
    averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    averageDistanceTimes.set(distance, [averageTime])
  }


  const newProgrammes = new Map<string, string>();


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
        const baseTotalSecs = timeToSeconds(baseTotalTime);
        const originalSecs = timeToSeconds(item.originalTime);

        const ratio = originalSecs / (averageDistanceTimes.get(item.distance)?.[0] ?? originalSecs);
        // const offset = originalSecs - (averageDistanceTimes.get(item.distance)?.[0] ?? originalSecs);

        // 3. Apply the offset to the new base time
        const finalModifiedSecs = baseTotalSecs * ratio;
        // const finalModifiedSecs = baseTotalSecs + (offset);

        const finalModifiedTime = secondsToTime(finalModifiedSecs);

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

