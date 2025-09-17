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

SwimDSL is currently under active development and has not yet been hosted. To
run the program from source, execute the following:

```bash
git clone --recurse-submodules https://github.com/hazzery/SwimDsl.git
cd SwimDsl
npm i
npm run dev
```

Once the Vite development server has started, type `o` and press `Enter` to
open the web app in a new tab in your default browser. Alternatively,
navigate to `https://localhost:5173`.

## How can I learn SwimDSL?

The SwimDSL editor has a tutorial swim programme, which shows off how to use
the language. You can access this programme by clicking the question mark icon
in the top right-hand corner of the screen. Reading through this tutorial
should show you all you need to know about writing swim programmes with
SwimDSL.

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
- Usage of gear such as fins or kick-boards
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

The linter highlights occurrences of the following issues to help prevent users
from writing malformed programmes.

- Syntax Error
- Invalid stroke name
- Invalid stroke type
- Invalid gear name
- Invalid distance unit
- Undefined pace name
- Incompatible gear and stroke type combination
- Invalid duration
