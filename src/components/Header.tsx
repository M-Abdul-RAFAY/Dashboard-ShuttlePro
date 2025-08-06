import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../store";
import { toggleSidebar, setTheme } from "../store/uiSlice";
import { logout } from "../features/auth/authSlice";

const Header: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const currentTheme = useAppSelector((state) => state.ui.theme);
  const notifications = useAppSelector((state) => state.ui.notifications);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(currentTheme === "light" ? "dark" : "light"));
  };

  const unreadNotifications = notifications.filter((n) => !n.autoHide).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
    >
      <Toolbar sx={{ height: theme.custom.header.height }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Ginkgo Retail
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {currentTheme === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>

          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={unreadNotifications} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton color="inherit">
            <Settings />
          </IconButton>

          {/* User Menu */}
          <IconButton color="inherit" onClick={handleMenuOpen} sx={{ ml: 1 }}>
            {user?.avatar ? (
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Avatar /> {user?.name || "User"}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Avatar>
                <AccountCircle />
              </Avatar>
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <Avatar>
                <Settings />
              </Avatar>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Avatar>
                <Logout />
              </Avatar>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
