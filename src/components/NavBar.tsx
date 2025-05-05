import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { SetStateAction } from 'react';

interface NavBarProps {
  fileContent: string,
  setFileContent: React.Dispatch<SetStateAction<string>>,
}

function NavBar({ fileContent, setFileContent }: NavBarProps) {
  function downloadFile() {
    // Make URL for text content of the code editor.
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Create temporary <a> element to download the file.
    const link = document.createElement("a");
    link.href = url;
    link.download = "SwimProgramme.swim";
    document.body.appendChild(link);
    link.click();

    // Remove temporary <a> element
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function uploadFile() {
    // Create a hidden input element
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

    // Programmatically click the input to open the file dialog
    input.click();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          App Bar
        </Typography>
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            onClick={downloadFile}
            variant="contained"
            size="small"
            sx={{
              ml: "auto",
              minWidth: "40px",
              minHeight: "40px",
              padding: 0,
            }}
          >
            <FileDownloadIcon />
          </Button>
          <Button
            onClick={uploadFile}
            variant="contained"
            size="small"
            sx={{
              ml: "auto",
              minWidth: "40px",
              minHeight: "40px",
              padding: 0,
            }}
          >
            <FileUploadIcon />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
