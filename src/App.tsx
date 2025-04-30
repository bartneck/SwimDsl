import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CodeMirror from '@uiw/react-codemirror';
import { swimdsl } from 'codemirror-lang-swimdsl';

import './App.css';

function App() {
  const [value, setValue] = React.useState("console.log('hello world!');");
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
    console.log('val:', val);
    setValue(val);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CodeMirror
        value={value}
        height="850px"
        width="900px"
        theme={prefersDarkMode ? "dark" : "light"}
        extensions={[swimdsl()]}
        onChange={onChange}
      />;
    </ThemeProvider>
  );

}

export default App;
