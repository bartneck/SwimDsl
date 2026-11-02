# Programme generation

The programme generator creates a dated sequence of swim sessions from a
training schedule, target distance, swimmer pace, and training preferences.
Each session is returned as editable SwimDSL source. This reduces the amount
of manual programme writing while keeping the result available for review,
rendering, modification, and export in the existing editor.

This document describes the current implementation and its assumptions.
For user instructions, see the [README](../README.md#how-can-i-generate-swim-programmes).
For measurements and reproduction instructions, see the
[evaluation guide](evaluation.md).

## Code structure

| File | Responsibility |
| --- | --- |
| [GenerateDialog.tsx](../src/components/GenerateDialog.tsx) | Collects settings, checks the form, calls the generator, and saves sessions in the browser. |
| [sessionGenerator.ts](../src/logic/sessionGenerator.ts) | Defines settings and internal sets, plans dates and session types, builds sets, and serialises SwimDSL. |
| [filePersistence.ts](../src/logic/filePersistence.ts) | Saves and selects programmes using `localStorage`. |
| [NavBar.tsx](../src/components/NavBar.tsx) | Makes the Generate dialog available in the toolbar. |
| [runEvaluation.ts](../scripts/runEvaluation.ts) | Runs generation experiments and writes evaluation results. |
| [src/evaluation](../src/evaluation) | Parses generated source and calculates evaluation metrics. |

The main entry point is `generateProgrammes(settings: GeneratorSettings):
string[]`. It returns one source string per session in date order. It does
not access React or browser storage, so evaluation scripts can call it
independently of the web app. `getWeekProgressionFactor` is also exported.

## Settings and defaults

`GeneratorSettings` is defined in `sessionGenerator.ts`. The dialog currently
starts with these values; the evaluation runner has its own configuration.

| Setting | Dialog default | Purpose |
| --- | --- | --- |
| `startDate` | Current local date | First day of the scheduling window. |
| `weeks` | 4 | Number of seven-day periods to schedule. |
| `trainingDays` | Monday, Wednesday, Friday | Weekdays on which sessions are created. |
| `phase` | `base` | Scales the session volume. Other choices are `build`, `peak`, and `taper`. |
| `focus` | `mixed` | Chooses the repeating pattern of session types. Other choices are `speed` and `endurance`. |
| `distance` | 3000 | Nominal session distance before phase, progression, and random scaling. |
| `baselineTime` | `1:30` | Current 100m Freestyle time used to estimate sendoffs. |
| `poolLength`, `distanceUnit` | 25, `metres` | Pool length for rounding and distance unit for output and timing conversion. |
| `pace` | Easy 65%, endurance 72%, threshold 88%, race pace 95%, max 100% | Named efforts and numeric effort ranges. |
| `strokes` | Freestyle 60%, Backstroke 20%, Breaststroke 15%, Butterfly 5% | Weights for stroke selection. |
| `equipment` | Empty | Equipment available for relevant templates. |
| `weeklyRampPercent` | 16 | Spread of the weekly volume multiplier across the plan. |

The pool selector offers 25 metres, 50 metres, and 50 yards. Target distance
buttons offer 1500, 2000, 3000, 4000, and 5000. Training day values passed to
the generator are lowercase weekday names.

## Generation process

### 1. Schedule dates

`getTrainingDates` walks the interval from `startDate` through the following
`weeks * 7` days, excluding the end of that interval. It keeps dates whose
weekday appears in `trainingDays`. Dates use local calendar arithmetic and
are formatted as `YYYY-MM-DD`.

For an integer number of weeks and valid settings, each selected weekday
occurs once per week. Four weeks with three selected days therefore produces
12 sessions. Weeks are measured from the start date; the plan does not first
align to a Monday.

### 2. Assign session types and volume factors

`buildSessionPlan` cycles through a fixed pattern for the chosen focus:

| Focus | Repeating session pattern |
| --- | --- |
| Speed | Speed, speed, mixed |
| Endurance | Volume, volume, threshold |
| Mixed | Volume, threshold, mixed, speed |

The pattern continues across week boundaries. Phase affects volume using
these implementation constants:

| Phase | Volume multiplier |
| --- | --- |
| Base | 1.0 |
| Build | 0.9 |
| Peak | 0.5 |
| Taper | 0.3 |

`getWeekProgressionFactor` spreads the ramp symmetrically around 1. With a
16% ramp, the first and final weekly factors are 0.92 and 1.08. Taper reverses
this order. A single-week plan uses a factor of 1.

The volume budget for each session is:

```text
roundToPool(distance * phaseFactor * weekFactor * randomFactor)
```

`randomFactor` is at least 0.97 and less than 1.03. `roundToPool` rounds to
the nearest pool length, with a minimum of one length. The ramp describes
the multiplier spread relative to the nominal distance, rather than an exact
percentage increase relative to the first week's actual volume.

### 3. Allocate volume

The session budget is divided into warm-up, pull, main set, and cooldown.

| Session budget | Warm-up budget | Cooldown budget |
| --- | --- | --- |
| Up to 2500 | 300 | 200 |
| Above 2500, up to 3500 | 400 | 300 |
| Above 3500, up to 4500 | 500 | 400 |
| Above 4500 | 600 | 400 |

Pull receives 12% of the session budget, rounded to the pool length. The main
set receives the remainder after the other three allocations. These are
template budgets; the generated distance is not reconciled back to them.

### 4. Build sets

The internal `SwimItem` type is either a `SwimSet` or a `SwimGroup`. Sets hold
distance, repetitions, stroke, effort, rest, equipment, and optional details.
Groups contain items and can apply repetitions and descriptions recursively.

Warm-ups randomly choose a standard swim/kick template, a stroke rotation,
or an effort build. Pull sets choose a repeated distance and suitable
equipment. The main-set builders use different structures:

- `generateVolumeMainSet`: aerobic repetitions, an effort build, and an
  endurance finish.
- `generateThresholdMainSet`: aerobic preparation, threshold repetitions,
  and a short aerobic finish.
- `generateSpeedMainSet`: aerobic preparation and a repeated distance ladder
  from 100 down to one pool length (template steps round to whole lengths).
- `generateMixedMainSet`: aerobic and threshold work followed by alternating
  stronger/easier swims of one pool length.

`generateCooldown` adds an easy swim. Template distances and repetition
counts are selected or rounded with minimum counts, so actual volume can
exceed the budget, especially for short sessions.

### 5. Serialise SwimDSL

`setToLine` serialises individual sets. `itemToLines` handles nested groups,
indentation, and group modifiers. The output begins with pool settings,
title, date, description, and enabled named pace definitions, followed by
the sets in warm-up → pull → main → cooldown order. These sections are not
currently labelled with SwimDSL section headers.

`renderRest` writes fixed rest as `with`, swimmer-count rest as `in-out`, and
sendoffs as `on`. A positive sendoff is emitted for repeated sets or sets
inside a group; it is omitted for a standalone single swim.

## Timing and selection assumptions

Sendoffs use the baseline Freestyle time, multiplied by a stroke ratio:
Freestyle 1.0, Backstroke and Butterfly 1.15, and Breaststroke 1.5.
`swimTimeSeconds` then estimates time using:

```text
strokeTimePer100 * (distance / 100) ^ exponent
```

Distances in yards are converted to metres using 1 yard = 0.9144 metres
before timing calculations. The baseline remains a time for 100 metres,
including when generating yard sessions. Output distances and target labels
use the selected unit.

The exponent is 1.06 when the linear time estimate is at most 160 seconds,
otherwise 1.025. `calculateSendoff` adds a template-specific rest ratio,
rounds to the nearest five seconds, and enforces a 45-second minimum.
`calculateAfterStop` rounds fixed rest to five seconds with a 20-second
minimum. Effort percentages do not directly scale these swim-time estimates.

`getStrokeDistribution` filters positive stroke weights for random selection.
Some templates instead use `pickStroke`, which chooses a preferred stroke
whenever its weight is positive, then tries a restricted fallback pool.
If the restricted fallback pool is empty, selection uses all enabled strokes.
Warm-ups also use enabled strokes. A 0% stroke is excluded, but positive
weights do not specify exact distance shares.

`pickEquipment` selects at most one available item from the relevant category:
kick uses Kickboard or Fins; pull uses Pull Buoy, Paddles, or Snorkel. Speed
templates may use Fins. Equipment labels are written directly into the DSL,
so compatibility with the language's accepted names must be checked when
adding or changing an option. The pull builder currently does not explicitly
set a `Pull` stroke modifier.

Random choices use `Math.random()` for templates, strokes, distances,
equipment, and volume variation. There is no seed setting or guarantee that
two runs with identical inputs return identical source.

## Settings guarantees

A pace set to 0% is omitted from definitions and is never used by a set or
numeric effort range. A template that requests a disabled zone uses the
nearest enabled zone in this order: easy, endurance, threshold, racePace, max.
Ties prefer the lower zone. This is based on zone order, rather than the
numerical gap between user-defined percentages. If only one zone is enabled,
all efforts use that zone; an effort range may then have identical endpoints.
The dialog requires at least one positive pace, and direct generator calls
with no enabled pace or stroke throw an error.

In the supported 25- and 50-length pools, every swim distance is a positive
whole number of lengths. A 75-distance template step rounds to 100 in a
50-length pool, while a 25-distance step becomes 50. The mixed main set uses
one-length fast/easier swims and calculates repetitions using their combined
distance. Rounding can change the shape of the ladder and actual session
volume; the target remains approximate.

## Browser integration

`handleGenerate` collects the dialog state and calls `generateProgrammes`.
It saves each returned string under an unused `Generated Session N` key in
`localStorage`, skipping occupied names. These are browser-local records;
the user can export source through the existing editor controls.

`saveGeneratedProgrammes` saves the entire batch without changing selection,
then the handler opens the first saved session through `handleSelectFile`.
The selected filename and editor content therefore refer to the same session.
Existing keys, including empty sessions, are preserved. Editor changes are
saved under the selected key, and switching files saves the outgoing content
before loading the incoming session. Reloading resets the active selection;
select a saved session to reopen its stored content.

## Input validation

[`generatorValidation.ts`](../src/logic/generatorValidation.ts) provides the
same validation rules to the dialog and `generateProgrammes`:

- Weeks must be an integer from 1 to 12.
- Baseline time must use `m:ss` or `mm:ss`, with seconds from 00 to 59 and a
  total time greater than zero. For example, `1:30` is valid; `1:99` and
  `0:00` are rejected. Surrounding whitespace is ignored.
- Each pace must be a finite percentage from 0 to 100 inclusive. Decimal
  percentages are accepted. At least one pace must be above zero.
- The start date must be a real calendar date in `YYYY-MM-DD` form, and at
  least one valid training weekday must be selected.
- Stroke percentages must be finite values from 0 to 100 and total 100%.
- Pool length and target distance must be finite and positive. Weekly
  progression must be a finite value from 0 to 40%.

The dialog retains raw text for week and pace inputs so clearing a field
produces a validation error rather than silently becoming zero. It shows
field-level messages for the date, weeks, baseline time, and individual
paces, plus an error summary. Generate remains disabled until all errors
are resolved, and the handler also checks validity before generating or
saving anything. Direct generator calls throw an error containing the
validation messages before planning sessions.

Run `npm run test -- --run` for validation regression tests covering invalid
inputs and accepted boundaries. These tests exercise both the shared
validator and rejection by direct generator calls.

## Current limitations

- **Approximate distances:** independent template rounding and minimum
  repetitions can cause substantial deviations from the nominal target.
  Small budgets can leave little or negative main-set allocation, while
  templates still produce their minimum repetitions.
- **Output checks:** generation does not run a final parser/linter check or
  catch storage errors in the dialog. New templates should be checked in
  the editor as well as through the evaluation runner.

These are implementation constraints, not guarantees of training quality.
The evaluation measures generated structure and metrics; it does not
validate physiological effectiveness.

## Maintenance and verification

| Change | Main location |
| --- | --- |
| Dialog defaults, controls, and validation | State initialisers, input controls, and `isFormValid` in `GenerateDialog.tsx` |
| Shared input rules and error messages | `generatorValidation.ts` |
| Dates and weekday rules | `getTrainingDates` |
| Focus patterns and phase factors | `buildSessionPlan` and `getPhaseFactor` |
| Weekly progression | `getWeekProgressionFactor` |
| Volume allocation | `chooseWarmupVolume`, `chooseCooldownVolume`, and `generateProgrammes` |
| Workout templates | `generateWarmup`, `generatePullSet`, the four main-set builders, and `generateCooldown` |
| Timing assumptions | `STROKE_PACE_RATIO`, timing constants, `swimTimeSeconds`, and rest helpers |
| Stroke and equipment rules | `getStrokeDistribution`, `pickStroke`, equipment categories, and `pickEquipment` |
| Output syntax | `formatIntensity`, `renderLength`, `renderRest`, `setToLine`, and `itemToLines` |

After changing generation logic, run `npm run lint` and `npm run build`, then
follow the [evaluation guide](evaluation.md). Check representative generated
sessions in the editor for parser/linter diagnostics, rendering, file
selection, and export. Include single-week plans, taper, restricted strokes,
zero-valued paces, and each supported pool option when checking affected rules.

The evaluation runner has independent settings and expected phase factors;
review these when changing the generator's assumptions. Its load evaluator
also uses fixed intensity weights. For reproducible automated regression
tests, control the random source rather than comparing unseeded runs.

Generator regression checks run with `npm run test -- --run`. They cover
all nonempty combinations of enabled paces, tie-breaking, each stroke enabled
alone across warm-up templates and session types, supported pool/unit options,
yard sendoffs, and rejection of all-disabled settings. Random choices are
controlled in these tests, and generated source is checked with the SwimDSL
parser.
