import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import React from "react";

import {
  downloadPdf,
  downloadSwimdsl,
  downloadSwimlXml,
  downloadHtml,
  uploadFile,
} from "../logic/fileIo";

interface FileMenuItem {
  text: string;
  icon: React.ReactElement;
  onclick: () => void | Promise<void>;
}

interface NavBarProps {
  swimdslProgramme: string;
  setSwimdslProgramme: React.Dispatch<React.SetStateAction<string>>;
  swimlXml: string;
  htmlString: string;
  renderNode: React.RefObject<HTMLIFrameElement | null>;
  children?: React.ReactNode;
}

function SwimDslLogo(): React.ReactElement {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
        >
          Swim Programme Editor
        </Typography>
        <Typography
          component="div"
          sx={{
            color: "#ffffff",
            fontSize: { xs: "1.2rem", sm: "1.45rem" },
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          SwimDSL
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * The NavBar component sits at the top of the viewport to provide additional
 * functionality such as file export and file import.
 *
 * @param swimdslProgramme - The UTF-8 text contents of the code editor.
 * @param setSwimdslProgramme - A function which takes UTF-8 text and replaces the
 *    contents of the code editor with the given text.
 * @param children - React nodes to place on the right hand side of the NavBar.
 *    Currently used to display the SidePanelSwitcher.
 *
 * @returns The react element used to render the Navigation bar.
 */
function NavBar({
  swimdslProgramme,
  setSwimdslProgramme,
  swimlXml,
  htmlString,
  renderNode,
  children,
}: NavBarProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function openFileMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeFileMenu() {
    setAnchorEl(null);
  }

  function newProgramme() {
    window.open("./", "_blank")?.focus();
  }

  function runFileAction(action: () => void | Promise<void>) {
    closeFileMenu();
    void action();
  }

  const fileMenuOptions: FileMenuItem[] = [
    {
      text: "New Programme",
      icon: <AddIcon fontSize="small" />,
      onclick: newProgramme,
    },
    {
      text: "Open",
      icon: <UploadFileIcon fontSize="small" />,
      onclick: () => {
        uploadFile(setSwimdslProgramme);
      },
    },
    {
      text: "Save As",
      icon: <SaveAsIcon fontSize="small" />,
      onclick: () => {
        downloadSwimdsl(swimdslProgramme);
      },
    },
    {
      text: "Export swiML XML",
      icon: <CodeIcon fontSize="small" />,
      onclick: () => {
        downloadSwimlXml(swimlXml);
      },
    },
    {
      text: "Export HTML",
      icon: <CodeIcon fontSize="small" />,
      onclick: () => {
        downloadHtml(htmlString);
      },
    },
    {
      text: "Export as PDF",
      icon: <PictureAsPdfIcon fontSize="small" />,
      onclick: () => {
        if (renderNode.current === null) return;

        downloadPdf(renderNode.current);
      },
    },
  ];

  return (
    <AppBar
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background:
          "linear-gradient(135deg, #082f49 0%, #0f4c81 38%, #1d4ed8 100%)",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.2)",
      }}
      position="static"
    >
      <Toolbar
        sx={{
          gap: 1.5,
          py: 1.25,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <SwimDslLogo />

        <Button
          id="file-menu-button"
          onClick={openFileMenu}
          color="inherit"
          variant="contained"
          startIcon={<FolderOpenRoundedIcon />}
          endIcon={
            <KeyboardArrowDownRoundedIcon
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          }
          aria-controls={open ? "file-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          sx={{
            px: 2,
            py: 1,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 700,
            backgroundColor: alpha("#ffffff", open ? 0.3 : 0.18),
            boxShadow: "0 12px 24px rgba(8, 47, 73, 0.24)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            "&:hover": {
              backgroundColor: alpha("#ffffff", 0.28),
              boxShadow: "0 16px 28px rgba(8, 47, 73, 0.26)",
            },
          }}
        >
          File
        </Button>

        <Menu
          id="file-menu"
          open={open}
          anchorEl={anchorEl}
          onClose={closeFileMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            list: {
              "aria-labelledby": "file-menu-button",
            },
            paper: {
              elevation: 0,
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
              },
            },
          }}
        >
          {fileMenuOptions.map(({ text, icon, onclick }, index) => (
            <MenuItem
              onClick={() => {
                runFileAction(onclick);
              }}
              key={index}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        <Box
          sx={{
            ml: { md: "auto" },
            display: "flex",
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
