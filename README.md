# SwimDSL

Welcome to the SwimDSL project repository.

## What is SwimDSL?

The SwimDSL project involves both a custom domain specific language for
specifying swimming programmes, and a web editor specifically designed to
support users in writing their swim programmes with the SwimDSL language.

## Why SwimDSL?

SwimDSL is an attempt to extend swiML's mission to standardise the
communication of swimming programmes. You can find more information about the
swiML project [here](https://www.swiml.org).

## How can I use SwimDSL?

SwimDSL has been hosted with GitHub pages. It can currently be found at
<https://bartneck.github.io/SwimDsl>.

## What about running it locally?

To run the program from source, execute the following:

```bash
git clone --recurse-submodules https://github.com/bartneck/SwimDsl.git
cd SwimDsl
npm i
npm run dev
```

Once the Vite development server has started, type `o` and press `Enter` to
open the web app in a new tab in your default browser. Alternatively,
navigate to `http://localhost:5173`.

During install, the `prepare` script refreshes the upstream swiML XSLT and SEF
assets used for rendering. SwimDSL intentionally uses the stylesheet URL
emitted by the upstream transform directly rather than vendoring a local copy
of `swiML.css`.

### I did something wrong and it doesn't run

If `npm run dev` runs without error, but you get a blank page in your browser,
with a console message "Uncaught Error: Unrecognized extension value in
extension set" then npm has managed to download two separate copies of one of
the `@codemirror/*` dependencies. This is caused because the
`codemirror-swimdsl` submodule is its own npm package, living inside another
npm package which it shares dependencies with. We ideally should never run `npm
i` inside the `codemirror-swimdsl` subdirectory as this seems to create the
issue. The solution is to remove both the `codemirror-swimdsl/node_modules` and
`node_modules/codemirror-lang-swimdsl` directories. Then run `npm i` inside the
top level directory.

## How can I learn SwimDSL?

The SwimDSL editor has a tutorial swim programme, which shows off how to use
the language. You can access this programme by clicking the question mark icon
in the top right-hand corner of the screen. Reading through this tutorial
should show you all you need to know about writing swim programmes with
SwimDSL.

## How can I generate swim programmes?

Click **Generate** in the top toolbar to create a training plan with a
separate SwimDSL programme for each session. In the **Generate Programmes**
dialog:

1. Choose your pool size, start date, number of weeks, and training days.
2. Select a training phase (**Base**, **Build**, **Peak**, or **Taper**) and
   focus (**Speed**, **Endurance**, or **Mixed**).
3. Adjust **Weekly Progression** to increase volume across the plan, or
   decrease it during a taper. This setting is disabled for a single week.
4. Choose an approximate **Target Distance** per session and enter your
   current 100m Freestyle time in `mm:ss` format under **Starting Performance**.
   This baseline stays in metres even for yard sessions; yard distances are
   converted when estimating sendoffs (`on` times).
5. Configure the named pace percentages, set the stroke distribution to a
   total of 100%, and select any available equipment.
   A 0% pace or stroke is excluded. Keep at least one pace enabled; disabled
   paces use the nearest enabled effort level, preferring the lower level on a tie.
6. Click **Generate Programmes** to create the sessions.

For example, four weeks with Monday, Wednesday, and Friday selected produces
12 sessions. Each session includes pool settings, a title, a date, named
paces, and swim instructions covering warm-up, pull, main set, and cooldown.
Distances vary with the training phase, weekly progression, and pool length;
all swim distances are whole pool lengths in the selected unit. Positive
stroke percentages guide selection rather than guarantee an exact split.

Sessions are saved in your browser as **Generated Session 1**,
**Generated Session 2**, and so on. Existing filenames are skipped, so
generating another plan keeps earlier sessions. Use the file selector to
switch between sessions, review and edit their instructions, and export
the programmes you want to keep.

See the [programme generation guide](docs/programme-generation.md) for the
implementation, design assumptions, limitations, and maintenance notes.

## How can I run the generator evaluation?

After installing the project dependencies, run this command from the repository
root using Node.js 22.18.0 or later:

```bash
npx --no-install jiti scripts/runEvaluation.ts
```

The evaluation measures volume, intensity, progression, variation, training
load, responsiveness, and periodisation. Results are saved to
`evaluation-results/baseline-evaluation.json`, overwriting the previous run.

See the [evaluation guide](docs/evaluation.md) for the experiment configuration,
metric descriptions, and guidance on interpreting and reproducing results.

## How can I automatically modify existing swim programmes in SwimDSL?

From an existing programme, simply click the **Modify Programme** button in the top bar.
From there a dialog will show with options for swimmer paces, desired distance or duration, and an optional additional distance or duration limit. Once these fields have
been filled you can click the **Create Programmes** button in the bottom right and a new programme will be made for each pace given. These programmes will adjust the existing original programme to fit the given pace and target distance/duration as specified by the user.

More in-depth instructions can be found in the swimDSL tutorial swim programme.
Futher details on the implementation, design, and limitations see the [programme adjustment guide](docs/programme-adjustment.md)

## How does SwimDSL work?

The SwimDSL editor is powered by a JavaScript package called
[CodeMirror](https://codemirror.net/). CodeMirror provides SwimDSL with a code
editor capable of generating a syntax tree which it can use to provide syntax
highlighting, code completions, and linting. The `codemirror-swimdsl`
subdirectory provides language support for SwimDSL inside CodeMirror,
enabling all of SwimDSL's intelligent lint rules and auto-completions.

## What can be modelled with the SwimDSL language?

The SwimDSL language is currently capable of modelling the following concepts:

- Stroke name in full, short, and abbreviated form (e.g. Freestyle, Free, and
  FR)
- Swimming intensity with a percentage of perceived rate of exertion
- Rest from start of instruction (e.g. on 0:40)
- Rest from end of instruction (e.g. rest 1:00)
- Named intensities, e.g. easy, medium, and max
- Stroke types (pull, kick, and drill)
- Usage of equipment such as fins or kick-boards
- Repeating an instruction an arbitrary number of times
- Grouping instructions into a single block, allowing for repetition of
  multiple instructions
- Arbitrary text to add further description to particular instructions
- Pool length and distance units

## What features does SwimDSL editor support?

Currently, the SwimDSL editor supports the following features. This list will
grow as the project develops.

- Syntax highlighting
- Linting of syntax and semantic errors.
- Auto-completion of some keywords and defined paces
- Source file export
- Source file import
- Swim programme generation across multiple weeks, with configurable training
  days, phase, focus, volume progression, paces, strokes, and equipment
- Modification of swim sessions to suit different swimmer paces and desired 
  distances and durations
- Saving and browser storage of SwimDSL programmes.

The linter highlights occurrences of the following issues to help prevent users
from writing malformed programmes.

- Syntax Error
- Invalid stroke name
- Invalid stroke type
- Invalid equipment name
- Invalid distance unit
- Undefined pace name
- Incompatible equipment and stroke type combination
- Invalid duration
