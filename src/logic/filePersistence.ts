

function newFile(key: string, value: string): void {
  if (localStorage.getItem(key)) {
    console.log(key, " already exist");
  } else {
    localStorage.setItem(key, value);
  }
}

function handleDelete(key: string, selectedFile: string, setSelectedFile: (newFile: string)=>void, setSwimdslProgramme:(swimdslProgramme: string)=>void):void {
  if (key === "") return;
  console.log("Deleting " + key);
  console.log("Selected file: " + selectedFile);
  localStorage.removeItem(key);
  // if (key === selectedFile) {
  //   handleSelectFile("", false);
  // }
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
  newFile,
  handleDelete,
  handleSelectFile,
};
