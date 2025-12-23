import CodeIcon from "@mui/icons-material/Code";
import HelpIcon from "@mui/icons-material/Help";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

import PanelPage from "../types/PanelPage";

interface SidePanelItem {
  page: PanelPage | null;
  icon: React.ReactElement;
  label: string;
}

const sideBarItems: SidePanelItem[] = [
  {
    page: null,
    icon: <VisibilityOffIcon />,
    label: "Hide panel",
  },
  {
    page: PanelPage.RENDER,
    icon: <ImageIcon />,
    label: "Show render",
  },
  {
    page: PanelPage.TUTORIAL,
    icon: <HelpIcon />,
    label: "Show tutorial",
  },
  {
    page: PanelPage.SWIML_XML,
    icon: <CodeIcon />,
    label: "Show swiML XML",
  },
];

interface SidePaneSwitcherProps {
  activePanelPage: PanelPage | null;
  setPanelPage: React.Dispatch<React.SetStateAction<PanelPage | null>>;
}

/**
 * A GUI element to change the page shown in the side panel.
 *
 * @param setPanelPage - A function which takes a PanelPage enumeration and sets
 *    the side panel to show the corresponding page.
 * @param activePanelPage - The PanelPage enumeration of the currently active
 *    side panel page.
 *
 * @returns A React element used to switch the currently active side panel page.
 */
function SidePaneSwitcher({
  setPanelPage,
  activePanelPage,
}: SidePaneSwitcherProps): React.ReactElement {
  return (
    <Paper>
      {sideBarItems.map(({ icon, page, label }, index) => (
        <Tooltip title={label} key={index}>
          <span>
            <Button
              onClick={() => {
                setPanelPage(page);
              }}
              disabled={activePanelPage === page}
              color="inherit"
            >
              {icon}
            </Button>
          </span>
        </Tooltip>
      ))}
    </Paper>
  );
}

export default SidePaneSwitcher;
