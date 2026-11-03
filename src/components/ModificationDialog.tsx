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
import {parseTarget} from "../logic/programmeAdjustment.ts";
import {FitGoal, FitMethod} from "../logic/programmeTypes.ts";

/** A pace per 100m, written as `m:ss`. */
const PACE_PATTERN = /^\d+:[0-5]\d$/;

/** What may be typed into the distance field: whole metres. */
const METRES_PATTERN = /^\d*$/;

/** The most digits a duration can have, enough for `hh:mm:ss`. */
const DURATION_DIGITS = 6;

/**
 * Lay out the digits typed into the duration field, filling from the right as
 * more digits are typed: one or two digits are minutes, three or four are
 * `h:mm` and five or six are `h:mm:ss`.
 *
 * @param typed The raw field value, which may still hold old colons.
 * @returns The duration written as `mm`, `h:mm` or `h:mm:ss`.
 */
function formatDuration(typed: string): string {
  const digits = typed.replace(/\D/g, '').slice(0, DURATION_DIGITS);
  if (digits.length <= 2) return digits;

  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= 2) {
    groups.unshift(digits.slice(Math.max(0, end - 2), end));
  }
  return groups.join(':');
}

/**
 * Turn a duration laid out by formatDuration into the form parseTarget reads,
 * which takes a lone `h:mm` to be `m:ss`.
 *
 * @param duration The duration as shown in the field.
 * @returns The duration as minutes or `h:mm:ss`.
 */
function durationTarget(duration: string): string {
  return duration.split(':').length === 2 ? `${duration}:00` : duration;
}

/**
 * Write a number of seconds out in words, such as `1 h 30 min`.
 *
 * @param total The duration in seconds.
 * @returns The duration in hours, minutes and seconds, skipping any that are zero.
 */
function describeDuration(total: number): string {
  const parts = [
    [Math.floor(total / 3600), 'h'],
    [Math.floor(total / 60) % 60, 'min'],
    [total % 60, 's'],
  ] as const;
  return parts.filter(([amount]) => amount > 0).map(([amount, unit]) => `${amount} ${unit}`).join(' ');
}

/**
 * Check a session target typed into the dialog.
 *
 * @param value The raw field value.
 * @param scale What one unit of the field is worth, as for parseTarget.
 * @param required Whether the field must be filled in.
 * @returns Why the target can't be used, or an empty string when it is fine.
 */
function targetError(value: string, scale: number, required: boolean): string {
  if (value === '') return required ? 'Required' : '';
  if (value.split(':').slice(1).some(part => Number(part) >= 60)) {
    return 'Minutes and seconds must be less than 60';
  }
  return parseTarget(value, scale) === null ? 'Must be greater than 0' : '';
}


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
  // The duration as shown, which differs from the one submitted when it is h:mm.
  const [durationInput, setDurationInput] = useState('');

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

  // A missing target is only reported once the user has tried to submit.
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const durationError = targetError(modificationParameters.duration, 60, !byDistance && submitAttempted);
  const volumeError = targetError(modificationParameters.volume, 1, byDistance && submitAttempted);

  // Echo the duration back in words, so it is clear how the digits were read.
  const durationSeconds = parseTarget(modificationParameters.duration, 60);
  const durationHelp = durationError !== '' ? durationError
    : durationSeconds !== null ? describeDuration(durationSeconds)
    : 'e.g. 45 for 45 min, 130 for 1 h 30 min';

  const durationField = (
    <TextField
      label={byDistance ? "Time Limit (h:mm:ss, optional)" : "Target Session Duration (h:mm:ss)"}
      name="sessionDuration"
      value={durationInput}
      onChange={(e) => {
        const duration = formatDuration(e.target.value);
        setDurationInput(duration);
        setModificationParameters(prev => ({ ...prev, duration: durationTarget(duration) }));
      }}
      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
      error={durationError !== ''}
      helperText={durationHelp}
    />
  );
  const volumeField = (
    <TextField
      label={byDistance ? "Target Session Distance (metres)" : "Distance Limit (metres, optional)"}
      name="sessionVolume"
      value={modificationParameters.volume}
      onChange={(e) => {
        const volume = e.target.value;
        if (METRES_PATTERN.test(volume)) {
          setModificationParameters(prev => ({ ...prev, volume }));
        }
      }}
      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
      error={volumeError !== ''}
      helperText={volumeError}
    />
  );

  const handleOpen = () => {
    setSubmitAttempted(false);
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (modificationParameters.paces.length === 0) {
      alert("Please add at least one pace");
      return;
    }
    if (targetError(modificationParameters.duration, 60, !byDistance) !== ''
      || targetError(modificationParameters.volume, 1, byDistance) !== '') {
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
                    label={byDistance ? "Adjust the sets to fit target distance" : "Adjust the sets to fit target duration"}
                  ></FormControlLabel>
                  <FormControlLabel
                    value={'trim'}
                    control={<Radio />}
                    label={byDistance ? "Cut off remaining session when the distance is reached" : "Cut off remaining session when the duration is reached"}
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
