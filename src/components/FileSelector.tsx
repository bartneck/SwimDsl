import React from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Drawer from "@mui/material/Drawer";

interface FileSelectorProps {
  selectorOpen: boolean;
  selectedFile: string;
  handleSelectFile: (key: string) => void;
}


export default function FileSelector
({
  selectorOpen,
  selectedFile,
  handleSelectFile
}: FileSelectorProps):React.ReactElement {
  const allKeys = Object.keys(localStorage);
  console.log(allKeys);


  return(
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={selectorOpen}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', backgroundColor: "lightgray",
            top: (theme) => theme.mixins.toolbar.minHeight,
            height: (theme) => `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,},
        }}
      >
        <SimpleTreeView
          style={{ marginTop: 10}}
          selectedItems={selectedFile}
          onSelectedItemsChange={(_event, itemId) => {
            handleSelectFile(itemId??"")
          }}
        >
          {allKeys.map(key => <TreeItem key={key} itemId={key} label={key}/>)}
        </SimpleTreeView>
      </Drawer>
    </>
  )
}
