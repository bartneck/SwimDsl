import Box from "@mui/material/Box";
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

  return (
    <Box maxHeight="100vh" overflow="auto" borderLeft="1px solid">
      <RawHtml rawHtml={htmlContent} />
    </Box>
  );
}

export default ProgrammeRender;
