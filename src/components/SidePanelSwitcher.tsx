import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

import PanelPage from "../types/PanelPage";

interface SidePanelItem {
  page: PanelPage | null;
  icon: React.ReactElement;
  label: string;
  status: string;
  tooltip: string;
}

const hiddenPanelItem: SidePanelItem = {
  page: null,
  icon: <VisibilityOffRoundedIcon />,
  label: "Hide",
  status: "Hidden",
  tooltip: "Hide right panel",
};

const sideBarItems: SidePanelItem[] = [
  hiddenPanelItem,
  {
    page: PanelPage.RENDER,
    icon: <ImageRoundedIcon />,
    label: "Preview",
    status: "Render preview",
    tooltip: "Show rendered preview",
  },
  {
    page: PanelPage.TUTORIAL,
    icon: <HelpOutlineRoundedIcon />,
    label: "Guide",
    status: "Tutorial guide",
    tooltip: "Show tutorial guide",
  },
  {
    page: PanelPage.SWIML_XML,
    icon: <CodeRoundedIcon />,
    label: "XML",
    status: "swiML XML",
    tooltip: "Show generated swiML XML",
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
  const activePanelItem =
    sideBarItems.find(({ page }) => page === activePanelPage) ?? hiddenPanelItem;

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        justifyContent: "flex-end",
        px: 1,
        py: 0.75,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Box sx={{ px: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255, 255, 255, 0.72)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Right panel
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#ffffff", fontWeight: 700, lineHeight: 1.2 }}
        >
          {activePanelItem.status}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {sideBarItems.map(({ icon, page, label, tooltip }) => {
          const selected = activePanelPage === page;

          return (
            <Tooltip title={tooltip} key={label}>
              <Button
                onClick={() => {
                  setPanelPage(page);
                }}
                color="inherit"
                variant={selected ? "contained" : "text"}
                startIcon={icon}
                aria-pressed={selected}
                sx={{
                  minWidth: 0,
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  lineHeight: 1,
                  border: "1px solid",
                  borderColor: selected
                    ? "rgba(255, 255, 255, 0.92)"
                    : "rgba(255, 255, 255, 0.14)",
                  backgroundColor: selected
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.04)",
                  color: selected ? "#0f172a" : "#ffffff",
                  boxShadow: selected
                    ? "0 12px 24px rgba(15, 23, 42, 0.18)"
                    : "none",
                  "&:hover": {
                    backgroundColor: selected
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.14)",
                    borderColor: "rgba(255, 255, 255, 0.28)",
                  },
                }}
              >
                {label}
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
}

export default SidePaneSwitcher;
