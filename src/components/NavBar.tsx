import { useState } from "react";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  AppBar,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import {
  downloadPdf,
  downloadSwimdsl,
  downloadSwimlXml,
  downloadHtml,
  uploadFile,
} from "../logic/fileIo";

import { generateWeekProgramme } from "../logic/sessionGenerator";

import { newFile } from "../logic/filePersistence";

interface FileMenuItem {
  text: string;
  icon: React.ReactElement;
  onclick: () => void | Promise<void>;
}

interface NavBarProps {
  swimdslProgramme: string;
  setSwimdslProgramme: React.Dispatch<React.SetStateAction<string>>;
  setNewProgrammeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  swimlXml: string;
  htmlString: string;
  renderNode: React.RefObject<HTMLIFrameElement | null>;
  children?: React.ReactNode;
  setSelectedFile: (selectedFile: string) => void;
}

/**
 * The NavBar component sits at the top of the viewport to provide additional
 * functionality such as file export and file import.
 *
 * @param swimdslProgramme - The UTF-8 text contents of the code editor.
 * @param setSwimdslProgramme - A function which takes UTF-8 text and replaces the
 *    contents of the code editor with the given text.
 * @param setNewProgrammeOpen - A function which takes a boolean and sets the state of the new programme modal.
 * @param children - React nodes to place on the right hand side of the NavBar.
 *    Currently used to display the SidePanelSwitcher.
 *
 * @returns The react element used to render the Navigation bar.
 */
function NavBar({
  swimdslProgramme,
  setSwimdslProgramme,
  setNewProgrammeOpen,
  setSelectedFile,
  swimlXml,
  htmlString,
  renderNode,
  children,
}: NavBarProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [sessionLength, setSessionLength] = React.useState<number>(3000);
  const [phase, setPhase] = useState("base");
  const [focus, setFocus] = useState("speed");
  const [sessions, setSessions] = useState(10);
  const [paceValues, setPaceValues] = useState({
    easy: 65,
    endurance: 72,
    threshold: 88,
    racePace: 95,
    max: 100,
  });
  const [selectedStrokes, setSelectedStrokes] = useState([
    "Freestyle",
    "Backstroke",
    "Breaststroke",
    "Butterfly",
  ]);

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const open = Boolean(anchorEl);

  function openFileMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeFileMenu() {
    setAnchorEl(null);
  }

  function newProgramme() {
    setNewProgrammeOpen(true);
  }

  function handleGenerate() {
    const settings = {
      phase,
      focus,
      sessions,
      distance: sessionLength,
      pace: paceValues,
      strokes: selectedStrokes,
      equipment: selectedEquipment,
    };

    console.log("Generator settings:", settings);
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
          <DialogTitle>Generate Programmes</DialogTitle>

          <DialogContent>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the training requirements for your programme.
            </Typography>

            {/* Training Phase */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Training Phase
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Phase</InputLabel>
              <Select value={phase} label="Phase" onChange={(e) => setPhase(e.target.value)} >
                <MenuItem value="base">Base</MenuItem>
                <MenuItem value="build">Build</MenuItem>
                <MenuItem value="peak">Peak</MenuItem>
                <MenuItem value="recovery">Recovery</MenuItem>
              </Select>
            </FormControl>

            {/* Training Focus */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Training Focus
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Focus</InputLabel>
              <Select value={focus} label="Focus" onChange={(e) => setFocus(e.target.value)} >
                <MenuItem value="speed">Speed</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            {/* Number of Sessions */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Number of Sessions
            </Typography>

            <TextField fullWidth type="number" value={sessions} onChange={(e) => setSessions(Number(e.target.value))} inputProps={{ min: 1, max: 20 }} sx={{ mb: 3 }}/>

            {/* Target Distance */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Target Distance
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
              {[1500, 2000, 3000, 4000, 5000].map((val) => (
                <Chip key={val} label={`${val} m`} clickable color={sessionLength === val ? "primary" : "default"} onClick={() => setSessionLength(val)} />
              ))}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
              This is the approximate distance for each generated session
            </Typography>

            {/* Pace Definitions */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Pace Definitions
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {[
                { key: "easy", label: "Easy" },
                { key: "endurance", label: "Endurance" },
                { key: "threshold", label: "Threshold" },
                { key: "racePace", label: "Race Pace" },
                { key: "max", label: "Max" }, ].map((pace) => (
                <TextField
                  key={pace.key}
                  label={pace.label}
                  type="number"
                  value={paceValues[pace.key as keyof typeof paceValues]}
                  onChange={(e) => setPaceValues({
                     ...paceValues,
                     [pace.key]: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 100 }}
                  fullWidth
                />
              ))}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
              Enter 0% to exclude a pace from the generated programme
            </Typography>

            {/* Strokes */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Strokes
            </Typography>

            <FormGroup sx={{ mb: 3 }}>
              {["Freestyle", "Backstroke", "Breaststroke", "Butterfly"].map(
                (stroke) => (
                  <FormControlLabel
                    key={stroke}
                    control={
                      <Checkbox
                        checked={selectedStrokes.includes(stroke)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStrokes([...selectedStrokes, stroke]);
                          } else {
                            setSelectedStrokes( selectedStrokes.filter((s) => s !== stroke) );
                          }
                        }}
                      />
                    }
                    label={stroke}
                  />
                )
              )}
            </FormGroup>

            {/* Equipment */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Equipment
            </Typography>

            <FormGroup>
              {["Pull Buoy", "Fins", "Paddles", "Kickboard", "Snorkel"].map(
                (equipment) => (
                <FormControlLabel
                  key={equipment}
                  control={
                    <Checkbox
                      checked={selectedEquipment.includes(equipment)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEquipment([ ...selectedEquipment, equipment, ]);
                        } else {
                          setSelectedEquipment( selectedEquipment.filter((item) => item !== equipment) );
                        }
                      }}
                    />
                  }
                  label={equipment}
                /> )
              )}
            </FormGroup>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} variant="contained">
              Generate Programmes
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ ml: "auto" }}>{children}</Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
