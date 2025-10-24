import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

import {
  downloadPdf,
  downloadSwimdsl,
  downloadSwimlXml,
  uploadFile,
} from "../logic/fileIo";

interface FileMenuItem {
  text: string;
  icon: React.ReactElement;
  onclick: () => void;
}

interface NavBarProps {
  swimdslProgramme: string;
  setSwimdslProgramme: React.Dispatch<React.SetStateAction<string>>;
  swimlXml: string;
  children?: React.ReactNode;
}

/**
 * The NavBar component sits at the top of the viewport to provide additional
 * functionality such as file export and file import.
 *
 * @param swimdslProgramme - The UTF-8 text contents of the code editor.
 * @param setSwimdslProgramme - A function which takes UTF-8 text and replaces the
 *    contents of the code editor with the given text.
 * @param children - React nodes to place on the right hand side of the NavBar.
 *    Currently used to display the SidePanelSwitcher.
 *
 * @returns The react element used to render the Navigation bar.
 */
function NavBar({
  swimdslProgramme,
  setSwimdslProgramme,
  swimlXml,
  children,
}: NavBarProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function openFileMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeFileMenu() {
    setAnchorEl(null);
  }

  function newProgramme() {
    window.open("./", "_blank")?.focus();
  }

  const fileMenuOptions: FileMenuItem[][] = [
    [
      {
        text: "New Programme",
        icon: <AddIcon fontSize="small" />,
        onclick: newProgramme,
      },
    ],
    [
      {
        text: "Open",
        icon: <UploadFileIcon fontSize="small" />,
        onclick: () => {
          uploadFile(setSwimdslProgramme);
        },
      },
      {
        text: "Save As",
        icon: <SaveAsIcon fontSize="small" />,
        onclick: () => {
          downloadSwimdsl(swimdslProgramme);
        },
      },
    ],
    [
      {
        text: "Export swiML XML",
        icon: <CodeIcon fontSize="small" />,
        onclick: () => {
          downloadSwimlXml(swimlXml);
        },
      },
      {
        text: "Export as PDF",
        icon: <PictureAsPdfIcon fontSize="small" />,
        onclick: () => {
          downloadPdf();
        },
      },
    ],
  ];

  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Paper sx={{ paddingX: "1em" }}>
          <Typography variant="h6" component="div">
            SwimDSL
          </Typography>
        </Paper>

        <Button id="basic-button" onClick={openFileMenu} color="inherit">
          File
        </Button>

        <Menu open={open} anchorEl={anchorEl} onClose={closeFileMenu}>
          {fileMenuOptions.map((group, groupIdx) => (
            <>
              {group.map(({ text, icon, onclick }, index) => (
                <MenuItem onClick={onclick} key={index}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{text}</ListItemText>
                </MenuItem>
              ))}
              {groupIdx < fileMenuOptions.length - 1 && <Divider />}
            </>
          ))}
        </Menu>

        <Box sx={{ ml: "auto" }}>{children}</Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
