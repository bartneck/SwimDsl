import React from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";

interface FileSelectorProps {
  selectorOpen: boolean;
  selectedFile: string;
  handleSelectFile: (key: string, saveOldFile: boolean) => void;
}
type ContextMenuPosition = {
  mouseX: number;
  mouseY: number;
} | null;




export default function FileSelector
({
  selectorOpen,
  selectedFile,
  handleSelectFile
}: FileSelectorProps):React.ReactElement {

  const [contextMenu, setContextMenu] = React.useState<ContextMenuPosition>(null);
  const [targetKey, setTargetKey] = React.useState("");
  const allKeys = Object.keys(localStorage);

  const handleContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();

    setTargetKey(key);
    handleSelectFile(key, true);
    setContextMenu(
      // contextMenu === null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 } : null // if already open, close it (toggle-ish behavior on repeat right-clicks)
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
      handleSelectFile(key, true);
      setContextMenu({ mouseX: e.clientX + 2, mouseY: e.clientY - 6 });
    } else {
      setContextMenu(null); // right-clicked empty space, just close
    }
  };

  const handleClose = () => {
    setContextMenu(null);
    setTargetKey("");
  }

  const handleDelete = (key: string) => {
    if (key === "") return;
    console.log("Deleting " + key);
    console.log("Selected file: " + selectedFile);
    localStorage.removeItem(key);
    if (key === selectedFile) {
      handleSelectFile("", false);
    }
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
            handleSelectFile(itemId??"", true)
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
        {/*<MenuItem onClick={() => { handleRename(targetKey); handleClose(); }}>*/}
        {/*  Rename*/}
        {/*</MenuItem>*/}
        <MenuItem onClick={() => { handleDelete(targetKey); handleClose(); }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}
