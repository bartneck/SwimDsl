import React from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import {handleDelete, handleSelectFile} from "../logic/filePersistence";

interface FileSelectorProps {
  selectorOpen: boolean;
  selectedFile: string;
  setSelectedFile: (selectedFile: string) => void;
  swimdslProgramme: string;
  setSwimdslProgramme: (swimdslProgramme: string) => void;
}
type ContextMenuPosition = {
  mouseX: number;
  mouseY: number;
} | null;




export default function FileSelector
({
   selectorOpen,
   selectedFile,
   setSelectedFile,
  swimdslProgramme,
  setSwimdslProgramme,
 }: FileSelectorProps):React.ReactElement {

  const [contextMenu, setContextMenu] = React.useState<ContextMenuPosition>(null);
  const [targetKey, setTargetKey] = React.useState("");
  const allKeys = Object.keys(localStorage);

  const handleContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    setTargetKey(key);
    handleSelectFile(key, selectedFile, swimdslProgramme, setSelectedFile, setSwimdslProgramme);
    setContextMenu(
      { mouseX: e.clientX + 2, mouseY: e.clientY - 6 }
    );
  }

  const handleBackdropContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const stack = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
    const hit = stack.find((el) => el.closest('[data-key]'));
    const key = hit?.closest('[data-key]')?.getAttribute('data-key');
    if (key) {
      setTargetKey(key);
      handleSelectFile(key, selectedFile, swimdslProgramme, setSelectedFile, setSwimdslProgramme);
      setContextMenu({ mouseX: e.clientX + 2, mouseY: e.clientY - 6 });
    } else {
      setContextMenu(null); // right-clicked empty space, just close
    }
  };

  const handleClose = () => {
    setContextMenu(null);
    setTargetKey("");
  }

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
          },
        }}
      >
        <Toolbar/>
        <SimpleTreeView
          style={{ marginTop: 10}}
          selectedItems={selectedFile}
          onSelectedItemsChange={(_event, itemId) => {
          handleSelectFile(itemId??"", selectedFile, swimdslProgramme, setSelectedFile, setSwimdslProgramme);
          }}
        >
          {allKeys.map(key => <TreeItem key={key} itemId={key} data-key={key} label={key} onContextMenu={(e) => {
            handleContextMenu(e, key)
          }}/>)}
        </SimpleTreeView>
      </Drawer>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        {...(contextMenu !== null && {
          anchorPosition: { top: contextMenu.mouseY, left: contextMenu.mouseX },
        })}
        slotProps={{
          backdrop: {
            onContextMenu: handleBackdropContextMenu,
          },
          paper: {
            sx: { width: 150 },
          },
        }}
      >
        <MenuItem onClick={() => {
          handleDelete(targetKey, setSelectedFile, setSwimdslProgramme);
          handleClose(); }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}
