import React, {useState} from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// import {TextField} from "@mui/material";
import {modifyProgram, ModificationParameters} from "../logic/programmeModification.ts";



interface ModificationDialogProps {
  swimdslProgramme: string;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModificationDialog(
  {
      swimdslProgramme,
      selectedFile,
    setSelectedFile,
 }: ModificationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [modificationParameters, setModificationParameters] = useState<ModificationParameters>({
    group: '',
    paces: [],
    duration: '',
    volume: '',
  })

  const [addPace, setAddPace] = useState('')

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modificationParameters.paces.length === 0) {
      alert("Please add at least one pace");
      return;
    }
    modifyProgram(swimdslProgramme, selectedFile, setSelectedFile, modificationParameters);
    console.log(JSON.stringify(modificationParameters, null, 2));
    handleClose();
  }

  return (
    <>
      {/* The trigger button is kept inside the component */}
      <Button color="inherit" onClick={handleOpen}>
        Modify Programme
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Modification Details</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="modification-form">
            <FormControl>
              <RadioGroup
                row
                aria-label="Basic RadioGroup"
                name="GroupSize"
                value={modificationParameters.group}
                defaultValue={'group'}
                onChange={(e) => {
                  setModificationParameters(prev => ({ ...prev, group: e.target.value }));
                }}
              >
                <FormControlLabel value={'individual'} control={<Radio />} label="Individual"></FormControlLabel>
                <FormControlLabel value={'group'} control={<Radio />} label="Group"></FormControlLabel>
              </RadioGroup>
            </FormControl>
            <Stack direction="column" spacing={2}>
              <FormControl>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Add Pace"
                    name="addPace"
                    type="text"
                    value={addPace}
                    onChange = {(e) => {
                      setAddPace(e.target.value);
                    }}
                  />
                  <Button onClick={() => {
                    // 1. Add the current text to the array
                    setModificationParameters(prev => ({
                      ...prev,
                      paces: [...prev.paces, addPace]
                    }));
                    setAddPace('');
                  }} color="inherit">
                    Add Pace
                  </Button>
                </Stack>

              </FormControl>
              <TextField
                label="Swimmer Paces (m:ss/100m)"
                name="swimmerPaces"
                type="text"
                value={modificationParameters.paces.join(",")}
                aria-readonly={true}
              />

              <TextField
                label="Session Duration (mins)"
                name="sessionDuration"
                type="number"
                value={modificationParameters.duration}
                onChange={(e) => {
                  setModificationParameters(prev => ({ ...prev, duration: e.target.value }));
                }}
              />
              <TextField
                label="Session Volume (meters)"
                name="sessionVolume"
                type="number"
                value={modificationParameters.volume}
                onChange={(e) => {
                  setModificationParameters(prev => ({ ...prev, volume: e.target.value }));
                }}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="modification-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
