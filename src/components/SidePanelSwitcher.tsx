import CodeIcon from "@mui/icons-material/Code";
import HelpIcon from "@mui/icons-material/Help";
import ImageIcon from "@mui/icons-material/Image";
import { Button, Icon, Paper, Tooltip } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import PanelPage from "../types/PanelPage";

interface SidePanelItem {
  page: PanelPage;
  icon: React.ReactElement;
  label: string;
}

const sideBarItems: SidePanelItem[] = [
  {
    page: PanelPage.NONE,
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
  activePanelPage: PanelPage;
  setPanelPage: React.Dispatch<React.SetStateAction<PanelPage>>;
}

function SidePaneSwitcher({
  setPanelPage,
  activePanelPage,
}: SidePaneSwitcherProps): React.ReactElement {
  return (
    <Paper>
      {sideBarItems.map(({ icon, page, label }, index) => (
        <Tooltip title={label}>
          <Button
            key={index}
            onClick={() => {
              setPanelPage(page);
            }}
            disabled={activePanelPage === page}
            color="inherit"
          >
            {icon}
          </Button>
        </Tooltip>
      ))}
    </Paper>
  );
}

export default SidePaneSwitcher;
