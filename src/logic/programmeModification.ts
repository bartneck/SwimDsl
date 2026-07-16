
// TYPES
export interface ModificationParameters {
  group: string;
  paces: string[]; // This is where the type definition goes!
  duration: string;
  volume: string;
}

// MAIN ALGORITHM

export function modifyProgram(
  program: string,
  modificationParams: ModificationParameters,
  // Want type of session. i.e. sprint/distance/aerobic
  // Want average 100m time.
  // Maybe need to change the output style
): string {
  // const numPrograms = 3;
  // const hundredTimes = ["1:30", "1:45", "2:00"]
  const hundredTimes = modificationParams.paces;

  const instructions =
    program
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

  const newProgrammes: string[] = [];

  for (const pace of hundredTimes) {
    const newInstructions: string[] = []
    for (let instruction of instructions) {
      const distance = getDistance(instruction);
      if (instruction.toLowerCase().includes("on")) {
        const timeIndex = instruction.indexOf("on") + ("on".length) + 1;
        const intervalTime = wordAt(instruction, timeIndex);
        const intervalSwimTime = getIntervalTime(distance, pace);
        const modifiedTime = addTimes(intervalSwimTime, getRestTime(intervalSwimTime, "endurance")); // TODO: This should become the swimmers new interval time i.e. intervalSwimTime + intervalRestTime

        instruction = instruction.replace(intervalTime, modifiedTime);
      }
      newInstructions.push(instruction);
    }
    newProgrammes.push(`>--- ${pace} modification ---\n`+newInstructions.join("\n")+"\n");
  }
  // Returns the modified programmes as a string.
  return newProgrammes.join("\n");
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


