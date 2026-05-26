import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";

import {
  downloadPdf,
  downloadSwimdsl,
  downloadSwimlXml,
  downloadHtml,
  uploadFile,
} from "../logic/fileIo";

import { generateWeekProgramme } from "../logic/sessionGenerator";

interface FileMenuItem {
  text: string;
  icon: React.ReactElement;
  onclick: () => void | Promise<void>;
}

interface NavBarProps {
  swimdslProgramme: string;
  setSwimdslProgramme: React.Dispatch<React.SetStateAction<string>>;
  swimlXml: string;
  htmlString: string;
  renderNode: React.RefObject<HTMLIFrameElement | null>;
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
  htmlString,
  renderNode,
  children,
}: NavBarProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [sessionLength, setSessionLength] = React.useState<number>(3000);
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

  function handleGenerate() {
    const programme = generateWeekProgramme(sessionLength);
    setSwimdslProgramme(programme);
    setGenerateOpen(false);
  }

  const fileMenuOptions: FileMenuItem[] = [
    {
      text: "New Programme",
      icon: <AddIcon fontSize="small" />,
      onclick: newProgramme,
    },
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
    {
      text: "Export swiML XML",
      icon: <CodeIcon fontSize="small" />,
      onclick: () => {
        downloadSwimlXml(swimlXml);
      },
    },
    {
      text: "Export HTML",
      icon: <CodeIcon fontSize="small" />,
      onclick: () => {
        downloadHtml(htmlString);
      },
    },
    {
      text: "Export as PDF",
      icon: <PictureAsPdfIcon fontSize="small" />,
      onclick: () => {
        if (renderNode.current === null) return;

        downloadPdf(renderNode.current);
      },
    },
  ];

  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      position="static"
    >
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
          {fileMenuOptions.map(({ text, icon, onclick }, index) => (
            <MenuItem onClick={onclick} key={index}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        <Button
          color="inherit"
          startIcon={<AutoFixHighIcon />}
          onClick={() => setGenerateOpen(true)}
        >
          Generate
        </Button>

        <Dialog
          open={generateOpen}
          onClose={() => setGenerateOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Build Training Week</DialogTitle>

          <DialogContent>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generates 10 base phase sessions for a full training week.
              Choose a target training load below.
            </Typography>

            {/* Session display */}
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {sessionLength} m
            </Typography>

            {/* Simple training zone label */}
            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              {sessionLength <= 2000 && "Technique / Recovery"}
              {sessionLength > 2000 && sessionLength <= 3500 && "Club Base"}
              {sessionLength > 3500 && sessionLength <= 5000 && "Aerobic / Threshold"}
              {sessionLength > 5000 && "Performance Volume"}
            </Typography>

            {/* Preset quick select */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
              {[1500, 2000, 3000, 4000, 5000].map((val) => (
                <Chip
                  key={val}
                  label={`${val} m`}
                  clickable
                  color={sessionLength === val ? "primary" : "default"}
                  onClick={() => setSessionLength(val)}
                />
              ))}
            </Stack>

            {/* Slider */}
            <Slider
              value={sessionLength}
              onChange={(_, val) => setSessionLength(val as number)}
              min={1000}
              max={6000}
              step={250}
              marks={[
                { value: 1000, label: "1k" },
                { value: 2000, label: "2k" },
                { value: 3000, label: "3k" },
                { value: 4000, label: "4k" },
                { value: 5000, label: "5k" },
                { value: 6000, label: "6k" },
              ]}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />

            <Typography variant="caption" color="text.secondary">
              Sessions will vary slightly (±15%) to reflect natural training load variation.
            </Typography>

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} variant="contained">
              Generate Week
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ ml: "auto" }}>{children}</Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
