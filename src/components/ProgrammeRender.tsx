import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import RawHtml from "./RawHtml";
import { processSefJson, transformXml } from "../logic/xslTransformation";

interface ProgrammeRenderProps {
  xmlString: string;
}

/**
 * The ProgrammeRender component is a SidePanel page which renders the HTML
 * generated from the current SwimDSL document.
 *
 * @param xmlString The swiML XML which should be rendered.
 *
 * @returns A React element used to render the generated HTML.
 */
function ProgrammeRender({
  xmlString,
}: ProgrammeRenderProps): React.ReactElement {
  const [sefData, setSefData] = useState({});
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("./swiML.sef.json")
      .then((response) => response.text())
      .then(processSefJson)
      .then(setSefData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (Object.keys(sefData).length === 0) return;

    transformXml(xmlString, sefData).then(setHtmlContent).catch(console.error);
  }, [sefData, xmlString]);

  return (
    <Box maxHeight="100vh" overflow="scroll">
      <RawHtml rawHtml={htmlContent} />
    </Box>
  );
}

export default ProgrammeRender;
