import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Fab from "@mui/material/Fab";
import RawHtml from "./RawHtml";

function ProgrammeRender(): React.ReactElement {
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

  const generatedHtml = `\
<ol>
  <li>
    one
  </li>
  <li>
    two
  </li>
</ol>`;

  return (
    <>
      <RawHtml rawHtml={generatedHtml} />
      <Fab
        onClick={downloadPdf}
        color="primary"
        sx={{ position: "absolute", right: 50, bottom: 50 }}
      >
        <PictureAsPdfIcon fontSize="large" />
      </Fab>
    </>
  );
}

export default ProgrammeRender;
