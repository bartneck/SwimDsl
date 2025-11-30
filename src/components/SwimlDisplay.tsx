import { xml } from "@codemirror/lang-xml";
import { useTheme } from "@mui/material/styles";
import CodeMirror from "@uiw/react-codemirror";
import React from "react";

interface SwimlDisplayProps {
  xmlContent: string;
}

/**
 * The SwimlDisplay component is a SidePanel page which displays the raw swiML
 * XML document that has been generated from the current SwimDSL document.
 *
 * @returns A React element used to show generated swiML XML.
 */
function SwimlDisplay({ xmlContent }: SwimlDisplayProps): React.ReactElement {
  const theme = useTheme();
  return (
    <CodeMirror
      readOnly
      value={xmlContent}
      height={`calc(100vh - ${theme.mixins.toolbar.minHeight}px)`}
      width="100%"
      theme={theme.palette.mode}
      extensions={[xml()]}
    />
  );
}

export default SwimlDisplay;
