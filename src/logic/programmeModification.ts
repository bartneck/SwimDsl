
// TYPES
import {newFile} from "./filePersistence.ts";

export interface ModificationParameters {
  group: string;
  paces: string[]; // This is where the type definition goes!
  duration: string;
  volume: string;
}

interface TimedInstruction {
  instruction: string;
  perRepSeconds: number;
  reps: number;
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
  const totalDuration = modificationParams.duration;
  const hundredTimes = modificationParams.paces;
  const totalDurationSeconds =
    totalDuration && !isNaN(Number(totalDuration))
      ? Number(totalDuration) * 60
      : Infinity;

  const averageDistanceTimes = new Map<string, number[]>();
  let totalDistance = 0;

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
        averageDistanceTimes.set(distance, [timeToSeconds(originalTime)]);
      }
    }

    totalDistance += Number(distance);

    const reps = getReps(instruction);

    return { instruction, distance, originalTime, reps };
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
    const newInstructions: TimedInstruction[] = [];

    for (const item of parsedInstructions) {
      let modifiedInstruction = item.instruction;
      let perRepSeconds = 0;

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

        // 5. Time this instruction takes up per single repetition
        perRepSeconds = finalModifiedSecs;
      }

      newInstructions.push({ instruction: modifiedInstruction, perRepSeconds, reps: item.reps });
    }

    // STEP 3: Cut the programme off once it would exceed the total session duration
    const cappedInstructions = capInstructionsToDuration(newInstructions, totalDurationSeconds);
    newProgrammes.set(pace+" ("+selectedFile+")", cappedInstructions.join("\n"));
  }
  // Returns the modified programmes as a string.
  for (const [key, value] of newProgrammes) {
    console.log(key, value);
    console.log(selectedFile);
    newFile(selectedFile, setSelectedFile, key, value);
  }
  // window.location.reload();
}




// STEP 3 FUNCTION

// Loops through a pace's instructions, keeping a running total of how long
// they take. Once an instruction's full set of reps would push that total
// past totalDurationSeconds, its rep count is reduced to however many reps
// still fit, rather than dropping the whole instruction, and the programme
// ends there.
function capInstructionsToDuration(
  items: TimedInstruction[],
  totalDurationSeconds: number
): string[] {
  const cappedInstructions: string[] = [];
  let cumulativeSeconds = 0;

  for (const item of items) {
    const totalSeconds = item.perRepSeconds * item.reps;

    if (cumulativeSeconds + totalSeconds <= totalDurationSeconds) {
      cumulativeSeconds += totalSeconds;
      cappedInstructions.push(item.instruction);
      continue;
    }

    const remainingSeconds = totalDurationSeconds - cumulativeSeconds;
    const possibleReps = item.perRepSeconds > 0
      ? Math.floor(remainingSeconds / item.perRepSeconds)
      : 0;

    if (possibleReps > 0) {
      cappedInstructions.push(withReps(item.instruction, possibleReps));
    }

    break;
  }

  return cappedInstructions;
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

function getReps(
  instruction: string
): number {
  const xIndex = instruction.toLowerCase().indexOf(" x ");
  if (xIndex === -1) {
    return 1;
  }
  const reps = Number(wordAt(instruction, 0));
  return Number.isNaN(reps) ? 1 : reps;
}

// Rewrites the leading "N x " repetition count of an instruction to a new
// value, e.g. withReps("4 x 100 Freestyle on 1:30", 2) -> "2 x 100 Freestyle on 1:30"
function withReps(
  instruction: string,
  reps: number
): string {
  const xIndex = instruction.toLowerCase().indexOf(" x ");
  if (xIndex === -1) {
    return instruction;
  }
  const originalRepsWord = wordAt(instruction, 0);
  return String(reps) + instruction.slice(originalRepsWord.length);
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

