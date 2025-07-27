import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { useEffect, useState } from "react";

import RawHtml from "./RawHtml";
import "../resources/swiml.css";

function ProgrammeRender(): React.ReactElement {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/example.html")
      .then((response) => response.text())
      .then(setHtmlContent)
      .catch(console.error);
  }, []);

  function downloadPdf() {
    const blob = new Blob(["This is a PDF file"], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "SwimProgramme.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Box maxHeight="100vh" overflow="auto" borderLeft="1px solid">
      <RawHtml rawHtml={htmlContent} />
      <Fab
        onClick={downloadPdf}
        color="primary"
        sx={{ position: "absolute", right: 50, bottom: 50 }}
      >
        <PictureAsPdfIcon fontSize="large" />
      </Fab>
    </Box>
  );
}

export default ProgrammeRender;
