import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Alert,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
  LocalShipping,
  Analytics,
  Warning,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Refresh,
  FilterList,
  Download,
  Notifications,
  Store,
  Language,
  CreditCard,
  Assessment,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { enhancedAnalyticsService } from "../features/analytics/enhancedAnalyticsService";
import { enhancedPosService } from "../features/pos/enhancedPosService";
import { ecommerceIntegrationService } from "../features/ecommerce/ecommerceIntegrationService";
import { enhancedLogisticsService } from "../features/logistics/enhancedLogisticsService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GinkgoRetailDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  // Load real-time dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await enhancedAnalyticsService.getRealTimeDashboard();
        setRealTimeData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Ginkgo Retail Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Ginkgo Retail Management System
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button startIcon={<FilterList />}>Filter</Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} /> Export Data
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Notifications sx={{ mr: 1 }} /> Notifications
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Assessment sx={{ mr: 1 }} /> Custom Reports
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Critical Alerts */}
      {realTimeData?.alerts?.filter(
        (alert: any) => alert.severity === "critical"
      ).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography fontWeight="bold">Critical Issues Detected</Typography>
          {realTimeData.alerts
            .filter((alert: any) => alert.severity === "critical")
            .map((alert: any, index: number) => (
              <Typography key={index} variant="body2">
                • {alert.message}
              </Typography>
            ))}
        </Alert>
      )}

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    $
                    {realTimeData?.currentMetrics?.currentSales?.toLocaleString() ||
                      "0"}
                  </Typography>
                  <Typography color="textSecondary">Today's Sales</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <TrendingUp />
                </Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <ArrowUpward sx={{ color: "success.main", fontSize: 16 }} />
                <Typography variant="body2" color="success.main">
                  +12.5% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {realTimeData?.currentMetrics?.onlineVisitors || 0}
                  </Typography>
                  <Typography color="textSecondary">Active Sessions</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <People />
                </Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {realTimeData?.currentMetrics?.activeSessions || 0} POS •{" "}
                  {realTimeData?.currentMetrics?.onlineVisitors || 0} Online
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {realTimeData?.currentMetrics?.ordersPendingFulfillment ||
                      0}
                  </Typography>
                  <Typography color="textSecondary">Pending Orders</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <ShoppingCart />
                </Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {realTimeData?.currentMetrics?.inventoryAlerts || 0} inventory
                  alerts
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(
                      (1 -
                        (realTimeData?.currentMetrics?.cartAbandonment || 0) /
                          100) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                  <Typography color="textSecondary">Conversion Rate</Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <Analytics />
                </Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Cart abandonment:{" "}
                  {realTimeData?.currentMetrics?.cartAbandonment || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different dashboard views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<Analytics />} label="Executive Overview" />
          <Tab icon={<Store />} label="Sales & POS" />
          <Tab icon={<Inventory />} label="Inventory" />
          <Tab icon={<Language />} label="E-commerce" />
          <Tab icon={<LocalShipping />} label="Logistics" />
          <Tab icon={<People />} label="Customer 360" />
        </Tabs>
      </Paper>

      {/* Executive Overview Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {/* Sales Trends Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Performance Trends
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Interactive sales chart would be rendered here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performers */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performers Today
                </Typography>
                <List dense>
                  {realTimeData?.topPerformers?.products
                    ?.slice(0, 5)
                    .map((product: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Chip
                            label={index + 1}
                            size="small"
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={product.productName}
                          secondary={`$${product.sales?.toLocaleString()} • ${product.units} units`}
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Goal Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Goals Progress
                </Typography>
                {realTimeData?.goalProgress?.map((goal: any, index: number) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{goal.metric}</Typography>
                      <Typography variant="body2">
                        {goal.current?.toLocaleString()} /{" "}
                        {goal.target?.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.percentage}
                      color={goal.onTrack ? "success" : "warning"}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* System Health */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Health & Alerts
                </Typography>
                <List dense>
                  {realTimeData?.alerts
                    ?.slice(0, 5)
                    .map((alert: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {alert.severity === "critical" ? (
                            <Warning color="error" />
                          ) : alert.severity === "high" ? (
                            <Warning color="warning" />
                          ) : (
                            <CheckCircle color="success" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={alert.message}
                          secondary={`${alert.type} • ${alert.timestamp}`}
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Sales & POS Tab */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  POS Sessions Today
                </Typography>
                <Typography variant="h4" color="primary">
                  {realTimeData?.currentMetrics?.activeSessions || 0}
                </Typography>
                <Typography color="textSecondary">
                  Active sessions across all locations
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Omnichannel Performance
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">In-Store Sales</Typography>
                    <Typography variant="body2">65%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Online Sales</Typography>
                    <Typography variant="body2">30%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={30}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">BOPIS Orders</Typography>
                    <Typography variant="body2">5%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={5} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Real-Time Transaction Feed
                </Typography>
                <Box sx={{ height: 300, overflow: "auto" }}>
                  <List>
                    {[...Array(10)].map((_, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <CreditCard />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Transaction #${1000 + index}`}
                          secondary={`$${(Math.random() * 200 + 50).toFixed(2)} • Store ${Math.floor(Math.random() * 5) + 1} • ${new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()}`}
                        />
                        <Chip label="Completed" color="success" size="small" />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Inventory Tab */}
      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Alerts
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {realTimeData?.currentMetrics?.inventoryAlerts || 0}
                </Typography>
                <Typography color="textSecondary">
                  Items requiring attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Auto-Reorder Suggestions
                </Typography>
                <Typography variant="h3" color="info.main">
                  23
                </Typography>
                <Typography color="textSecondary">
                  Products below reorder point
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Value
                </Typography>
                <Typography variant="h3" color="success.main">
                  $2.1M
                </Typography>
                <Typography color="textSecondary">
                  Total inventory value
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Multi-Location Inventory Status
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Real-time inventory grid would be rendered here showing
                    stock levels across all locations
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* E-commerce Tab */}
      <TabPanel value={currentTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Channel Integration Status
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Shopify"
                      secondary="Connected • Last sync: 2 min ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Amazon"
                      secondary="Connected • Last sync: 5 min ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="eBay"
                      secondary="API rate limit exceeded"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cross-Platform Performance
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Shopify</Typography>
                    <Typography variant="body2">$12,450</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Amazon</Typography>
                    <Typography variant="body2">$8,320</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={50}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">eBay</Typography>
                    <Typography variant="body2">$3,180</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={20} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Universal Product Listings Management
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Product listing management interface would be rendered here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Logistics Tab */}
      <TabPanel value={currentTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Orders in Transit
                </Typography>
                <Typography variant="h3" color="primary">
                  156
                </Typography>
                <Typography color="textSecondary">
                  Shipments tracking
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  On-Time Delivery
                </Typography>
                <Typography variant="h3" color="success.main">
                  94.2%
                </Typography>
                <Typography color="textSecondary">This month</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route Efficiency
                </Typography>
                <Typography variant="h3" color="info.main">
                  87%
                </Typography>
                <Typography color="textSecondary">Optimized routes</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Carbon Footprint
                </Typography>
                <Typography variant="h3" color="warning.main">
                  2.3t
                </Typography>
                <Typography color="textSecondary">CO2 this month</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Supply Chain Visibility
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Real-time supply chain tracking map would be rendered here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Customer 360 Tab */}
      <TabPanel value={currentTab} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h3" color="primary">
                  15,428
                </Typography>
                <Typography color="textSecondary">
                  <ArrowUpward sx={{ fontSize: 16, color: "success.main" }} />
                  +2.3% this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer LTV
                </Typography>
                <Typography variant="h3" color="success.main">
                  $485
                </Typography>
                <Typography color="textSecondary">
                  Average lifetime value
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Loyalty Members
                </Typography>
                <Typography variant="h3" color="info.main">
                  8,762
                </Typography>
                <Typography color="textSecondary">
                  57% of total customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Journey Analytics
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Customer journey flow diagram would be rendered here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default GinkgoRetailDashboard;
