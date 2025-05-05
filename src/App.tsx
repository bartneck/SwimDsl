import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CodeMirror from '@uiw/react-codemirror';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { swimdsl } from 'codemirror-lang-swimdsl';

import './App.css';
import { example_programme } from "./example_programme";

function App() {
  const [value, setValue] = React.useState(example_programme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const onChange = React.useCallback((val: string, _viewUpdate: any) => {
    setValue(val);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            App Bar
          </Typography>
        </Toolbar>
      </AppBar>
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
          Right Half
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
