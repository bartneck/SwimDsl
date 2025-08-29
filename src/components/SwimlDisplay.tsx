import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import "../resources/swiml.css";

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
