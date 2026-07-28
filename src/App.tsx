import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CodeMirror from "@uiw/react-codemirror";
import { compileSwimDsl, swimdsl } from "codemirror-lang-swimdsl";
import React from "react";

import NavBar from "./components/NavBar";
import ProgrammeRender from "./components/ProgrammeRender";
import SidePaneSwitcher from "./components/SidePanelSwitcher";
import SwimlDisplay from "./components/SwimlDisplay";
import TutorialPane from "./components/TutorialPane";
import PanelPage from "./types/PanelPage";
import FileSelector from "./components/FileSelector.tsx";

/**
 * The App compoent is the primary component of the SwimDSL web editor.
 * It contains all of the NavBar, SideBar, code editor, and the live render
 * (coming soon).
 *
 * @returns The react element used to render the application.
 */
function App(): React.ReactElement {
  // localStorage.clear();
  const [selectedFile, setSelectedFile] = React.useState("");
  const [swimdslProgramme, setSwimdslProgramme] = React.useState("");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [panelPage, setPanelPage] = React.useState<PanelPage | null>(
    PanelPage.RENDER,
  );
  const [selectorOpen, setSelectorOpen] = React.useState(true);
  const [swimlXml, setSwimlXml] = React.useState("");
  const [htmlString, setHtmlString] = React.useState("");
  const renderNode = React.useRef<HTMLIFrameElement>(null);
  const compiler = React.useMemo(() => compileSwimDsl(setSwimlXml), []);
  const languageSupport = React.useMemo(() => swimdsl(), []);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  const handleSelectFile = (newKey: string) => {
    // save the current programme under the OLD key first
    if (selectedFile) {
      localStorage.setItem(selectedFile, swimdslProgramme);
    }
    // then switch to the new file and load its value
    setSelectedFile(newKey);
    setSwimdslProgramme(localStorage.getItem(newKey) ?? "");
  }

  const handleProgrammeChange = React.useCallback((value: string) => {
    setSwimdslProgramme(value);
    if (selectedFile) {
      localStorage.setItem(selectedFile, value);
    }
  }, [selectedFile]);

  // const onChange = React.useCallback((val: string) => {
  //   setSwimdslProgramme(val);
  // }, []);

  /**
   * Renders the content for the currently selected side panel.
   *
   * @param panelPage - The side panel page to display.
   * @returns A React element containing the content for the requested panel.
   */
  function showPanel(panelPage: PanelPage): React.ReactElement {
    switch (panelPage) {
      case PanelPage.TUTORIAL:
        return <TutorialPane />;

      case PanelPage.RENDER:
        return (
          <ProgrammeRender
            xmlString={swimlXml}
            htmlString={htmlString}
            setHtmlString={setHtmlString}
            nodeRef={renderNode}
          />
        );

      case PanelPage.SWIML_XML:
        return <SwimlDisplay xmlContent={swimlXml} />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <NavBar
          swimdslProgramme={swimdslProgramme}
          setSwimdslProgramme={setSwimdslProgramme}
          handleSelectFile={handleSelectFile}
          swimlXml={swimlXml}
          htmlString={htmlString}
          renderNode={renderNode}
        >
          <SidePaneSwitcher
            activePanelPage={panelPage}
            setPanelPage={setPanelPage}
            selectorOpen={selectorOpen}
            setSelectorOpen={setSelectorOpen}
          />
        </NavBar>
        <Box
          sx={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          <Box
            sx={{
              width: panelPage !== null ? "50%" : "100%",
              minWidth: 0,
              minHeight: 0,
            }}
            borderRight="1px solid"
          >
            <CodeMirror
              value={swimdslProgramme}
              style={{ height: "100%" }}
              width="100%"
              height="100%"
              theme={prefersDarkMode ? "dark" : "light"}
              extensions={[languageSupport, compiler]}
              onChange={handleProgrammeChange}
            />
          </Box>
          {panelPage !== null && (
            <Box
              sx={{
                width: "50%",
                overflow: "hidden",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              {showPanel(panelPage)}
            </Box>
          )}
          <FileSelector handleSelectFile={handleSelectFile} selectedFile={selectedFile} selectorOpen={selectorOpen}/>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export { App as default };
