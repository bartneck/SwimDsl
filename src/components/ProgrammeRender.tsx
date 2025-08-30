import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import RawHtml from "./RawHtml";
import "../resources/swiml.css";

/**
 * The ProgrammeRender component is a SidePanel page which renders the HTML
 * generated from the current SwimDSL document.
 *
 * @returns A React element used to render the generated HTML.
 */
function ProgrammeRender(): React.ReactElement {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/example.html")
      .then((response) => response.text())
      .then(setHtmlContent)
      .catch(console.error);
  }, []);

  return (
    <Box maxHeight="100vh" overflow="auto">
      <RawHtml rawHtml={htmlContent} />
    </Box>
  );
}

export default ProgrammeRender;
