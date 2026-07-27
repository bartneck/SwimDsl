import React from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface FileSelectorProps {
  selectedFile: string;
  handleSelectFile: (key: string) => void;
}


export default function FileSelector
({
  selectedFile,
  handleSelectFile
}: FileSelectorProps):React.ReactElement {
  const allKeys = Object.keys(localStorage);
  console.log(allKeys);

  // Set the code editor text to the local storage value.
  // Need to add a MUI drawer.
  return(
    <>
      <SimpleTreeView
        selectedItems={selectedFile}
        onSelectedItemsChange={(_event, itemId) => {
          handleSelectFile(itemId??"")
        }}
      >
        {allKeys.map(key => <TreeItem key={key} itemId={key} label={key}/>)}
      </SimpleTreeView>
    </>
  )
}
