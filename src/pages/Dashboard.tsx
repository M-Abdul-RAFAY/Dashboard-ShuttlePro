import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchDashboardMetrics } from "../features/analytics/analyticsSlice";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "primary",
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {isPositive ? (
                  <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                ) : isNegative ? (
                  <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                ) : null}
                <Typography
                  variant="body2"
                  sx={{
                    color: isPositive
                      ? "success.main"
                      : isNegative
                        ? "error.main"
                        : "text.secondary",
                  }}
                >
                  {Math.abs(change)}% {changeLabel}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: `${color}.main`,
              color: `${color}.contrastText`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dashboardMetrics, loading } = useAppSelector(
    (state) => state.analytics
  );
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  // Mock data for demonstration
  const mockMetrics = {
    totalRevenue: 145250,
    totalOrders: 1456,
    totalCustomers: 892,
    inventoryValue: 285600,
  };

  const recentOrders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customer: "John Doe",
      total: 299.99,
      status: "completed",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customer: "Jane Smith",
      total: 149.5,
      status: "processing",
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customer: "Bob Johnson",
      total: 89.99,
      status: "shipped",
    },
  ];

  const lowStockItems = [
    { name: "Wireless Headphones", stock: 5, threshold: 10 },
    { name: "Smart Watch", stock: 3, threshold: 15 },
    { name: "Phone Case", stock: 8, threshold: 20 },
  ];

  const getStatusColor = (
    status: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome back, {user?.name || "User"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${mockMetrics.totalRevenue.toLocaleString()}`}
            change={15.2}
            changeLabel="vs last month"
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={mockMetrics.totalOrders.toLocaleString()}
            change={8.7}
            changeLabel="vs last month"
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={mockMetrics.totalCustomers.toLocaleString()}
            change={12.3}
            changeLabel="vs last month"
            icon={<People />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Inventory Value"
            value={`$${mockMetrics.inventoryValue.toLocaleString()}`}
            change={-3.2}
            changeLabel="vs last month"
            icon={<Inventory />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Orders
              </Typography>
              <List>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <ShoppingCart />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={order.orderNumber}
                        secondary={order.customer}
                      />
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="bold">
                          ${order.total.toFixed(2)}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Low Stock Alerts
              </Typography>
              <List>
                {lowStockItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "warning.main" }}>
                          <Warning />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.stock} remaining (threshold: ${item.threshold})`}
                      />
                      <Box sx={{ textAlign: "right" }}>
                        <LinearProgress
                          variant="determinate"
                          value={(item.stock / item.threshold) * 100}
                          color={item.stock <= 5 ? "error" : "warning"}
                          sx={{ width: 60, mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {Math.round((item.stock / item.threshold) * 100)}%
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < lowStockItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Today's Summary
              </Typography>
              <Box sx={{ space: 2 }}>
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "success.light",
                    color: "success.contrastText",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Sales Today
                      </Typography>
                      <Typography variant="h6">$12,450</Typography>
                    </Box>
                    <CheckCircle />
                  </Box>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "info.light",
                    color: "info.contrastText",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Orders Today
                      </Typography>
                      <Typography variant="h6">156</Typography>
                    </Box>
                    <ShoppingCart />
                  </Box>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "secondary.light",
                    color: "secondary.contrastText",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        New Customers
                      </Typography>
                      <Typography variant="h6">23</Typography>
                    </Box>
                    <People />
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Status
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Payment Gateway"
                    secondary="All systems operational"
                  />
                  <Chip label="Online" color="success" size="small" />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Inventory Sync"
                    secondary="Last updated 5 minutes ago"
                  />
                  <Chip label="Synced" color="success" size="small" />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "warning.main" }}>
                      <Warning />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email Service"
                    secondary="Minor delays in delivery"
                  />
                  <Chip label="Degraded" color="warning" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
