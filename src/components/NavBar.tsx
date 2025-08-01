import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

interface NavBarProps {
  fileContent: string;
  setFileContent: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * The NavBar component sits at the top of the viewport to provide additional
 * functionality such as file export and file import.
 *
 * @param fileContent The UTF-8 text contents of the code editor.
 * @param setFileContent A function which takes UTF-8 text and replaces the
 *    contents of the code editor with the given text.
 *
 * @returns The react element used to render the Navigation bar.
 */
function NavBar({
  fileContent,
  setFileContent,
}: NavBarProps): React.ReactElement {
  function downloadFile() {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "SwimProgramme.swim";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function uploadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".swim";

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileText = e.target?.result;
          if (typeof fileText === "string") {
            setFileContent(fileText);
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }

  function newProgramme() {
    window.open("/", "_blank").focus();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          SwimDSL
        </Typography>
        <Button
          onClick={newProgramme}
          variant="contained"
          sx={{ marginLeft: "2em" }}
        >
          <AddIcon />
          New Programme
        </Button>
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button onClick={downloadFile} variant="contained" size="small">
            Export
            <FileDownloadIcon />
          </Button>
          <Button onClick={uploadFile} variant="contained" size="small">
            Import
            <FileUploadIcon />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
