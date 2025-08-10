import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import HelpIcon from "@mui/icons-material/Help";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import { Toolbar } from "@mui/material";

function SideBar(): React.ReactElement {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" anchor="right">
        <Toolbar/>
        <List>
          {[HelpIcon, ImageIcon].map((Icon, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <Icon />
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
