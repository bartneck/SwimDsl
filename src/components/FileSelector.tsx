import React from "react";

interface FileSelectorProps {
  handleSelectFile: (key: string) => void;
}


export default function FileSelector
({
  handleSelectFile
}: FileSelectorProps):React.ReactElement {
  const allKeys = Object.keys(localStorage);
  console.log(allKeys);

  // Set the code editor text to the local storage value.
  return(
    <>
      <ul>
        {allKeys.map(key => <li onClick={() => {
          handleSelectFile(key)
        }}>{key}</li>)}
      </ul>
    </>
  )
}
