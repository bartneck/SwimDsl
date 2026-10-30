import { useMemo, useState } from "react";
import React from "react";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  generateProgrammes,
  GeneratorSettings,
} from "../logic/sessionGenerator";

import { newFile } from "../logic/filePersistence";

interface GenerateDialogProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  setSwimdslProgramme: React.Dispatch<React.SetStateAction<string>>;
}

function GenerateDialog({
  setSelectedFile,
  setSwimdslProgramme,
}: GenerateDialogProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const today = new Date();

  const localToday =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [poolLength, setPoolLength] = useState(25);

  const [distanceUnit, setDistanceUnit] =
    useState<"metres" | "yards">("metres");

  const [startDate, setStartDate] = useState<string>(localToday);

  const [weeks, setWeeks] = useState(4);

  const [trainingDays, setTrainingDays] = useState<string[]>([
    "monday",
    "wednesday",
    "friday",
  ]);

  const [phase, setPhase] =
    useState<GeneratorSettings["phase"]>("base");

  const [focus, setFocus] =
    useState<GeneratorSettings["focus"]>("mixed");

  const [sessionLength, setSessionLength] = useState<number>(3000);

  const [baselineTime, setBaselineTime] = useState("1:30");

  const [paceValues, setPaceValues] = useState({
    easy: 65,
    endurance: 72,
    threshold: 88,
    racePace: 95,
    max: 100,
  });

  const strokes = [
    "Freestyle",
    "Backstroke",
    "Breaststroke",
    "Butterfly",
  ] as const;

  type Stroke = (typeof strokes)[number];

  const [strokePercentages, setStrokePercentages] = useState<
    Record<Stroke, number>
  >({
    Freestyle: 60,
    Backstroke: 20,
    Breaststroke: 15,
    Butterfly: 5,
  });

  const totalStrokePercentage = Object.values(
    strokePercentages
  ).reduce((sum, value) => sum + value, 0);

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const [weeklyRampPercent, setWeeklyRampPercent] = useState(16);

  const isFormValid = useMemo(() => {
    return (
      poolLength > 0 &&
      startDate.trim() !== "" &&
      weeks > 0 &&
      trainingDays.length > 0 &&
      sessionLength > 0 &&
      /^\d{1,2}:\d{2}$/.test(baselineTime.trim()) &&
      totalStrokePercentage === 100
    );
  }, [
    poolLength,
    startDate,
    weeks,
    trainingDays,
    sessionLength,
    baselineTime,
    totalStrokePercentage,
  ]);

  function handleOpen(): void {
    setOpen(true);
  }

  function handleClose(): void {
    setOpen(false);
  }

  function handleGenerate(): void {
    const settings: GeneratorSettings = {
      startDate,
      weeks,
      trainingDays,
      phase,
      focus,
      distance: sessionLength,
      baselineTime,
      poolLength,
      distanceUnit,
      pace: paceValues,
      strokes: strokePercentages,
      equipment: selectedEquipment,
      weeklyRampPercent,
    };

    const programmes = generateProgrammes(settings);

    programmes.forEach((programme, index) => {
      let counter = index + 1;
      let fileName = `Generated Programme ${counter}`;

      while (localStorage.getItem(fileName)) {
        counter++;
        fileName = `Generated Programme ${counter}`;
      }

      newFile(
        fileName,
        setSelectedFile,
        fileName,
        programme
      );

      if (index === 0) {
        setSelectedFile(fileName);
        setSwimdslProgramme(programme);
      }
    });

    handleClose();
  }

  return (
    <>
      <Button
        color="inherit"
        onClick={handleOpen}
      >
        Generate
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Programmes</DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Choose the training requirements for your programme.
          </Typography>

          {/* Pool Size */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Pool Size</InputLabel>

            <Select
              value={`${poolLength}-${distanceUnit}`}
              label="Pool Size"
              onChange={(e) => {
                const [length, unit] = e.target.value.split("-");

                setPoolLength(Number(length));
                setDistanceUnit(
                  unit as "metres" | "yards"
                );
              }}
            >
              <MenuItem value="25-metres">
                25 metres
              </MenuItem>

              <MenuItem value="50-metres">
                50 metres
              </MenuItem>

              <MenuItem value="50-yards">
                50 yards
              </MenuItem>
            </Select>
          </FormControl>

          {/* Start Date */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Start Date
          </Typography>

          <TextField
            fullWidth
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{ mb: 3 }}
          />

          {/* Number of Weeks */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Number of Weeks
          </Typography>

          <TextField
            fullWidth
            type="number"
            value={weeks}
            onChange={(e) => {
              setWeeks(Number(e.target.value));
            }}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 12,
              },
            }}
            sx={{ mb: 3 }}
          />

          {/* Training Days */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Training Days
          </Typography>

          <FormGroup sx={{ mb: 1 }}>
            {[
              { value: "monday", label: "Monday" },
              { value: "tuesday", label: "Tuesday" },
              { value: "wednesday", label: "Wednesday" },
              { value: "thursday", label: "Thursday" },
              { value: "friday", label: "Friday" },
              { value: "saturday", label: "Saturday" },
              { value: "sunday", label: "Sunday" },
            ].map((day) => (
              <FormControlLabel
                key={day.value}
                control={
                  <Checkbox
                    checked={trainingDays.includes(day.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTrainingDays([
                          ...trainingDays,
                          day.value,
                        ]);
                      } else {
                        setTrainingDays(
                          trainingDays.filter(
                            (d) => d !== day.value
                          )
                        );
                      }
                    }}
                  />
                }
                label={day.label}
              />
            ))}
          </FormGroup>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 3,
            }}
          >
            {trainingDays.length} session
            {trainingDays.length !== 1 ? "s" : ""} per week ·{" "}
            {trainingDays.length * weeks} total session
            {trainingDays.length * weeks !== 1 ? "s" : ""}
          </Typography>

          {/* Training Phase */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Training Phase
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Phase</InputLabel>

            <Select
              value={phase}
              label="Phase"
              onChange={(e) => {
                setPhase(
                  e.target.value
                );
              }}
            >
              <MenuItem value="base">Base</MenuItem>
              <MenuItem value="build">Build</MenuItem>
              <MenuItem value="peak">Peak</MenuItem>
              <MenuItem value="taper">Taper</MenuItem>
            </Select>
          </FormControl>

          {/* Training Focus */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Training Focus
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Focus</InputLabel>

            <Select
              value={focus}
              label="Focus"
              onChange={(e) => {
                setFocus(
                  e.target.value
                );
              }}
            >
              <MenuItem value="speed">Speed</MenuItem>
              <MenuItem value="endurance">
                Endurance
              </MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
            </Select>
          </FormControl>

          {/* Weekly Progression */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Weekly Progression
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            {phase === "taper"
              ? `Volume eases off by ${weeklyRampPercent}% from the first week to the last`
              : `Volume ramps up by ${weeklyRampPercent}% from the first week to the last`}
          </Typography>

          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">
                Ramp
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {weeklyRampPercent}%
              </Typography>
            </Stack>

            <Slider
              value={weeklyRampPercent}
              onChange={(_, value) => {
                if (typeof value === "number") {
                  setWeeklyRampPercent(value);
                }
              }}
              min={0}
              max={40}
              step={2}
              valueLabelDisplay="auto"
              disabled={weeks <= 1}
            />
          </Stack>

          {/* Target Distance */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Target Distance
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            This is the approximate distance for each
            generated session
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {[1500, 2000, 3000, 4000, 5000].map(
              (val) => (
                <Chip
                  key={val}
                  label={`${val} m`}
                  clickable
                  color={
                    sessionLength === val
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    setSessionLength(val);
                  }}
                />
              )
            )}
          </Stack>

          {/* Starting Performance */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Starting Performance
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Enter your approximate current time for 100m
            Freestyle (mm:ss)
          </Typography>

          <TextField
            fullWidth
            label="Current 100m Freestyle Time"
            value={baselineTime}
            onChange={(e) => {
              setBaselineTime(e.target.value);
            }}
            sx={{ mb: 3 }}
          />

          {/* Pace Definitions */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Pace Definitions
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Enter 0% to exclude a pace from the generated
            programme
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {[
              { key: "easy", label: "Easy" },
              { key: "endurance", label: "Endurance" },
              { key: "threshold", label: "Threshold" },
              { key: "racePace", label: "Race Pace" },
              { key: "max", label: "Max" },
            ].map((pace) => (
              <TextField
                key={pace.key}
                label={pace.label}
                type="number"
                value={
                  paceValues[
                    pace.key as keyof typeof paceValues
                  ]
                }
                onChange={(e) => {
                  setPaceValues({
                    ...paceValues,
                    [pace.key]: Number(
                      e.target.value
                    ),
                  });
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            ))}
          </Stack>

          {/* Stroke Distribution */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Stroke Distribution
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Set the percentage of the programme for each
            stroke
          </Typography>

          <Stack spacing={2} sx={{ mb: 1 }}>
            {strokes.map((stroke) => (
              <Stack key={stroke} spacing={0.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">
                    {stroke}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {strokePercentages[stroke]}%
                  </Typography>
                </Stack>

                <Slider
                  value={strokePercentages[stroke]}
                  onChange={(_, value) => {
                    if (typeof value === "number") {
                      setStrokePercentages({
                        ...strokePercentages,
                        [stroke]: value,
                      });
                    }
                  }}
                  min={0}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                />
              </Stack>
            ))}
          </Stack>

          <Typography
            variant="caption"
            color={
              totalStrokePercentage === 100
                ? "text.secondary"
                : "error"
            }
            sx={{
              display: "block",
              mb: 3,
            }}
          >
            Total: {totalStrokePercentage}%
            {totalStrokePercentage !== 100 &&
              " — percentages must add up to 100%"}
          </Typography>

          {/* Equipment */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Equipment
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 2,
            }}
          >
            Set the equipment you want to use in the
            programmes
          </Typography>

          <FormGroup>
            {[
              "Pull Buoy",
              "Fins",
              "Paddles",
              "Kickboard",
              "Snorkel",
            ].map((equipment) => (
              <FormControlLabel
                key={equipment}
                control={
                  <Checkbox
                    checked={selectedEquipment.includes(
                      equipment
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEquipment([
                          ...selectedEquipment,
                          equipment,
                        ]);
                      } else {
                        setSelectedEquipment(
                          selectedEquipment.filter(
                            (item) =>
                              item !== equipment
                          )
                        );
                      }
                    }}
                  />
                }
                label={equipment}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={!isFormValid}
          >
            Generate Programmes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GenerateDialog;
