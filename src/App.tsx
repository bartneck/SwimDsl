import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CodeMirror from "@uiw/react-codemirror";
import { swimdsl } from "codemirror-lang-swimdsl";
import React from "react";
import { Toolbar } from "@mui/material";

import NavBar from "./components/NavBar";
import ProgrammeRender from "./components/ProgrammeRender";
import SideBar from "./components/SideBar";
import { example_programme } from "./example_programme";

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
      <Toolbar />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "50%" }}>
          <CodeMirror
            value={value}
            maxHeight={`calc(100vh - ${theme.mixins.toolbar.minHeight}px)`}
            width="100%"
            theme={prefersDarkMode ? "dark" : "light"}
            extensions={[swimdsl()]}
            onChange={onChange}
          />
        </Box>
        <Box sx={{ width: "50%" }}>
          <ProgrammeRender />
        </Box>
      </Box>
      <SideBar />
    </ThemeProvider>
  );
}

export default App;
