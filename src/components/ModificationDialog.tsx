import React, {useState} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField, {TextFieldProps} from "@mui/material/TextField";

// import {TextField} from "@mui/material";
import {modifyProgram, ModificationParameters} from "../logic/programmeModification.ts";
import {FitGoal, FitMethod} from "../logic/programmeTypes.ts";

/** A pace per 100m, written as `m:ss`. */
const PACE_PATTERN = /^\d+:[0-5]\d$/;


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
    goal: 'duration',
    duration: '',
    volume: '',
    fit: 'rescale',
  })

  const [paceInput, setPaceInput] = useState('');
  const [paceError, setPaceError] = useState('');

  /**
   * Replace the list of paces, keeping only well-formed, unique ones. Any
   * malformed pace stays in the input box so it can be corrected.
   */
  const setPaces = (entries: string[]) => {
    const paces: string[] = [];
    const invalid: string[] = [];
    for (const entry of entries.map(e => e.trim()).filter(e => e !== '')) {
      if (!PACE_PATTERN.test(entry)) {
        invalid.push(entry);
      } else if (!paces.includes(entry)) {
        paces.push(entry);
      }
    }
    setModificationParameters(prev => ({ ...prev, paces }));
    setPaceInput(invalid.join(' '));
    setPaceError(invalid.length > 0 ? `"${invalid.join('", "')}" is not a pace in the form m:ss` : '');
  };

  const byDistance = modificationParameters.goal === 'distance';

  const durationField = (
    <TextField
      label={byDistance ? "Time Limit (mins, optional)" : "Session Duration (mins)"}
      name="sessionDuration"
      type="number"
      value={modificationParameters.duration}
      onChange={(e) => {
        setModificationParameters(prev => ({ ...prev, duration: e.target.value }));
      }}
    />
  );
  const volumeField = (
    <TextField
      label={byDistance ? "Session Distance (metres)" : "Distance Limit (metres, optional)"}
      name="sessionVolume"
      type="number"
      value={modificationParameters.volume}
      onChange={(e) => {
        setModificationParameters(prev => ({ ...prev, volume: e.target.value }));
      }}
    />
  );

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
            {/* Stack resets its children's margins, so the gap below the title is padding here instead. */}
            <Stack direction="column" spacing={2} sx={{ pt: 2 }}>
              {/* Paces are typed in and become chips, like the recipients of an email. */}
              <Autocomplete
                multiple
                freeSolo
                autoSelect
                options={[]}
                value={modificationParameters.paces}
                onChange={(_, value, reason) => {
                  if (reason === 'removeOption' || reason === 'clear') {
                    setModificationParameters(prev => ({ ...prev, paces: value }));
                  } else {
                    setPaces(value);
                  }
                }}
                inputValue={paceInput}
                onInputChange={(_, value, reason) => {
                  // setPaces decides what is left in the input, so MUI's reset after a change is ignored.
                  if (reason === 'reset') {
                    return;
                  }
                  // Typing a comma or space finishes the current pace.
                  if (reason === 'input' && /[,\s]/.test(value)) {
                    setPaces([...modificationParameters.paces, ...value.split(/[,\s]+/)]);
                    return;
                  }
                  setPaceInput(value);
                  setPaceError('');
                }}
                renderInput={(params) => (
                  <TextField
                    // MUI's input params don't satisfy exactOptionalPropertyTypes, though they are what TextField expects.
                    {...params as TextFieldProps}
                    label="Swimmer Paces (m:ss/100m)"
                    name="swimmerPaces"
                    placeholder={modificationParameters.paces.length === 0 ? "e.g. 1:30, then press Enter" : ""}
                    error={paceError !== ''}
                    helperText={paceError}
                  />
                )}
              />
              <FormControl>
                <FormLabel id="fit-goal-label">Fit the session by</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="fit-goal-label"
                  name="FitGoal"
                  value={modificationParameters.goal}
                  onChange={(e) => {
                    setModificationParameters(prev => ({ ...prev, goal: e.target.value as FitGoal }));
                  }}
                >
                  <FormControlLabel value={'duration'} control={<Radio />} label="Duration"></FormControlLabel>
                  <FormControlLabel value={'distance'} control={<Radio />} label="Distance"></FormControlLabel>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel id="fit-method-label">Fitting the session</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="fit-method-label"
                  name="FitMethod"
                  value={modificationParameters.fit}
                  onChange={(e) => {
                    setModificationParameters(prev => ({ ...prev, fit: e.target.value as FitMethod }));
                  }}
                >
                  <FormControlLabel
                    value={'rescale'}
                    control={<Radio />}
                    label="Adjust the sets to fit"
                  ></FormControlLabel>
                  <FormControlLabel
                    value={'trim'}
                    control={<Radio />}
                    label={byDistance ? "Stop when the distance is reached" : "Stop when the time runs out"}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>

              {/* The field the session is fitted to comes first, and the other is an optional limit. */}
              {byDistance ? volumeField : durationField}
              {byDistance ? durationField : volumeField}
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
