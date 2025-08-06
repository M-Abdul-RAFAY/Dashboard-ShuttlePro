import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  PointOfSale,
  Analytics,
  LocalShipping,
  StoreMallDirectory,
  Settings,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "../store";
import { setSidebarOpen } from "../store/uiSlice";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <Inventory />,
    children: [
      {
        id: "products",
        label: "Products",
        icon: <Inventory />,
        path: "/products",
      },
      {
        id: "categories",
        label: "Categories",
        icon: <Inventory />,
        path: "/categories",
      },
      {
        id: "stock-levels",
        label: "Stock Levels",
        icon: <Inventory />,
        path: "/stock-levels",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart />,
    path: "/orders",
  },
  {
    id: "customers",
    label: "Customers",
    icon: <People />,
    path: "/customers",
  },
  {
    id: "pos",
    label: "Point of Sale",
    icon: <PointOfSale />,
    path: "/pos",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <Analytics />,
    path: "/analytics",
  },
  {
    id: "logistics",
    label: "Logistics",
    icon: <LocalShipping />,
    children: [
      {
        id: "shipping",
        label: "Shipping",
        icon: <LocalShipping />,
        path: "/shipping",
      },
      {
        id: "fulfillment",
        label: "Fulfillment",
        icon: <LocalShipping />,
        path: "/fulfillment",
      },
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: <StoreMallDirectory />,
    children: [
      {
        id: "storefront",
        label: "Storefront",
        icon: <StoreMallDirectory />,
        path: "/storefront",
      },
      {
        id: "integrations",
        label: "Integrations",
        icon: <StoreMallDirectory />,
        path: "/integrations",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings />,
    path: "/settings",
  },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      const isOpen = openItems.includes(item.id);
      if (isOpen) {
        setOpenItems(openItems.filter((id) => id !== item.id));
      } else {
        setOpenItems([...openItems, item.id]);
      }
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        dispatch(setSidebarOpen(false));
      }
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.id);
    const active = item.path ? isActive(item.path) : false;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: sidebarCollapsed ? "center" : "initial",
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
              backgroundColor: active
                ? theme.palette.action.selected
                : "transparent",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarCollapsed ? "auto" : 3,
                justifyContent: "center",
                color: active ? theme.palette.primary.main : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                opacity: sidebarCollapsed ? 0 : 1,
                color: active ? theme.palette.primary.main : "inherit",
              }}
            />
            {hasChildren &&
              !sidebarCollapsed &&
              (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && !sidebarCollapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerWidth = sidebarCollapsed
    ? theme.custom.sidebar.collapsedWidth
    : theme.custom.sidebar.width;

  const drawer = (
    <Box sx={{ overflow: "auto", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" noWrap component="div">
          {sidebarCollapsed ? "GR" : "Ginkgo Retail"}
        </Typography>
      </Box>
      <Divider />

      <List>{menuItems.map((item) => renderMenuItem(item))}</List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(setSidebarOpen(false))}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: theme.custom.sidebar.width,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
