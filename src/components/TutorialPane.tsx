import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "@emotion/react";
import React from "react";

import { swimdsl } from "codemirror-lang-swimdsl";

import { example_programme } from "../example_programme";

/**
 * The TutorialPane component is a SidePanel page which displays a second
 * CodeMirror editor, pre-filled with a tutorial swim programme explaining
 * to users how to use the SwimDSL language.
 *
 * @returns A React emelemnt used to render the tutorial programme.
 */
function TutorialPane(): React.ReactElement {
  const [value, setValue] = React.useState(example_programme);

  const theme = useTheme();

  return (
    <CodeMirror
      value={value}
      height={`calc(100vh - ${theme.mixins.toolbar.minHeight}px)`}
      width="100%"
      theme={theme.palette.mode}
      extensions={[swimdsl()]}
      onChange={(textContent: string) => {
        setValue(textContent);
      }}
    />
  );
}

export default TutorialPane;
