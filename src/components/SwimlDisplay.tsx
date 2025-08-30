import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import "../resources/swiml.css";

/**
 * The SwimlDisplay component is a SidePanel page which displays the raw swiML
 * XML document that has been generated from the current SwimDSL document.
 *
 * @returns A React element used to show generated swiML XML.
 */
function SwimlDisplay(): React.ReactElement {
  const [xmlContent, setXmlContent] = useState("");

  useEffect(() => {
    fetch("/example.html")
      .then((response) => response.text())
      .then(setXmlContent)
      .catch(console.error);
  }, []);

  return <Box overflow="clip">{xmlContent}</Box>;
}

export default SwimlDisplay;
