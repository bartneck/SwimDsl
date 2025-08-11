import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import HelpIcon from "@mui/icons-material/Help";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import { Toolbar } from "@mui/material";

import PanelPage from "../types/PanelPage";

interface SideBarItem {
  page: PanelPage;
  icon: React.ReactElement;
  label: string;
}

const sideBarItems: SideBarItem[] = [
  {
    page: PanelPage.RENDER,
    icon: <ImageIcon />,
    label: "Render",
  },
  {
    page: PanelPage.TUTORIAL,
    icon: <HelpIcon />,
    label: "Tutorial",
  },
];

interface SideBarProps {
  activePanelPage: PanelPage;
  setPanelPage: React.Dispatch<React.SetStateAction<PanelPage>>;
}

function SideBar({
  activePanelPage,
  setPanelPage,
}: SideBarProps): React.ReactElement {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" anchor="right">
        <Toolbar />
        <List>
          {sideBarItems.map(({ icon, page, label }, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  setPanelPage(page);
                }}
                selected={activePanelPage === page}
                sx={{ minHeight: 48 }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  {icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default SideBar;
