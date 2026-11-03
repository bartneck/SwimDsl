/** Saves a batch without changing the active file; returns the first new key. */
function saveGeneratedProgrammes(programmes: string[]): string | undefined {
  let firstFile: string | undefined;
  let counter = 1;

  for (const programme of programmes) {
    while (localStorage.getItem(`Generated Session ${counter}`) !== null) {
      counter++;
    }
    const key = `Generated Session ${counter}`;
    localStorage.setItem(key, programme);
    firstFile ??= key;
    counter++;
  }

  return firstFile;
}

/** Saves a file without overwriting another, numbering the name if it is taken; returns the key used. */
function newFile(key: string, value: string): string {
  let name = key;
  for (let copy = 2; localStorage.getItem(name) !== null; copy++) {
    name = `${key} (${copy})`;
  }
  localStorage.setItem(name, value);
  return name;
}

function handleDelete(key: string, setSelectedFile: (newFile: string)=>void, setSwimdslProgramme:(swimdslProgramme: string)=>void):void {
  if (key === "") return;
  localStorage.removeItem(key);
  setSelectedFile("");
  setSwimdslProgramme("");
}

function handleSelectFile(
  newKey: string,
  selectedFile: string,
  swimdslProgramme: string,
  setSelectedFile: (newFile: string) => void,
  setSwimdslProgramme: (arg: string) => void,
  saveOldFile = true,
):void {
  // save the current programme under the OLD key first
  if (saveOldFile && selectedFile) {
    localStorage.setItem(selectedFile, swimdslProgramme);
  }
  // then switch to the new file and load its value
  setSelectedFile(newKey);
  setSwimdslProgramme(localStorage.getItem(newKey) ?? "");
}

export {
  saveGeneratedProgrammes,
  newFile,
  handleDelete,
  handleSelectFile,
};
