import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CodeMirror from "@uiw/react-codemirror";
import { swimdsl } from "codemirror-lang-swimdsl";
import React from "react";

import NavBar from "./components/NavBar";
import { example_programme } from "./example_programme";
import ProgrammeRender from "./components/ProgrammeRender";

/**
 * The App compoent is the primary component of the SwimDSL web editor.
 * It contains all of the NavBar, the code editor, and the live rener
 * (coming soon).
 *
 * @returns The react element used to render the application.
 */
function App(): React.ReactElement {
  const [value, setValue] = React.useState(example_programme);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  const onChange = React.useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar fileContent={value} setFileContent={setValue} />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "50%", height: "100%" }}>
          <CodeMirror
            value={value}
            height="100vh"
            width="100%"
            theme={prefersDarkMode ? "dark" : "light"}
            extensions={[swimdsl()]}
            onChange={onChange}
          />
        </Box>
        <Box sx={{ width: "50%", height: "100%" }}>
          <ProgrammeRender />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
