import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import RawHtml from "./RawHtml";

interface ProgrammeRenderProps {
  xmlString: string;
}

const emptyXml =
  '<?xml version="1.0" encoding="UTF-8"?><program xmlns="https://github.com/bartneck/swiML"/>';

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
      .then((response) => {
        SaxonJS.transform(
          {
            stylesheetText: response,
            sourceText: emptyXml,
          },
          "async",
        )
          .then((result) => {
            setSefData(result.stylesheetInternal);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (Object.keys(sefData).length === 0) return;

    SaxonJS.transform(
      {
        stylesheetInternal: sefData,
        sourceText: xmlString,
        destination: "serialized",
      },
      "async",
    )
      .then((result) => {
        setHtmlContent(result.principalResult);
      })
      .catch(console.error);
  }, [sefData, xmlString]);

  return (
    <Box maxHeight="100vh" overflow="scroll">
      <RawHtml rawHtml={htmlContent} />
    </Box>
  );
}

export default ProgrammeRender;
