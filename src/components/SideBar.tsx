import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import HelpIcon from "@mui/icons-material/Help";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import { Toolbar } from "@mui/material";
import { PanelPage } from "../App";

interface SideBarProps {
  activePanelPage: PanelPage;
  setPanelPage: React.Dispatch<React.SetStateAction<PanelPage>>;
}

function SideBar({
  activePanelPage,
  setPanelPage,
}: SideBarProps): React.ReactElement {
  function showTutorialPane() {
    setPanelPage(PanelPage.TUTORIAL);
  }

  function showRenderPane() {
    setPanelPage(PanelPage.RENDER);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" anchor="right">
        <Toolbar />
        <List>
          {[
            [<HelpIcon />, showTutorialPane],
            [<ImageIcon />, showRenderPane],
          ].map(([listIcon, callback], index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton onClick={callback} sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  {listIcon}
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
