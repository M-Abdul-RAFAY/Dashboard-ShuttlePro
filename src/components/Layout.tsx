import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useAppSelector } from "../store";

// Layout components
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  const sidebarWidth = sidebarCollapsed
    ? theme.custom.sidebar.collapsedWidth
    : theme.custom.sidebar.width;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          marginLeft: isMobile ? 0 : sidebarOpen ? `${sidebarWidth}px` : 0,
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Header />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${theme.custom.header.height}px`,
            backgroundColor: theme.palette.background.default,
            minHeight: `calc(100vh - ${theme.custom.header.height}px)`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
