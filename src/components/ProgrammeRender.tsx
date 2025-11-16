import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import RawHtml from "./RawHtml";
import { processSefJson, transformXml } from "../logic/xslTransformation";

interface ProgrammeRenderProps {
  xmlString: string;
  htmlString: string;
  setHtmlString: (html: string) => void;
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
  htmlString,
  setHtmlString,
}: ProgrammeRenderProps): React.ReactElement {
  const [sefData, setSefData] = useState({});

  useEffect(() => {
    fetch("./swiML.sef.json")
      .then((response) => response.text())
      .then(processSefJson)
      .then(setSefData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (Object.keys(sefData).length === 0) return;

    transformXml(xmlString, sefData).then(setHtmlString).catch(console.error);
  }, [sefData, xmlString, setHtmlString]);

  return (
    <Box maxHeight="100vh" overflow="scroll">
      <RawHtml rawHtml={htmlString} style={{ fontFamily: "Jetbrains Mono" }} />
    </Box>
  );
}

export default ProgrammeRender;
