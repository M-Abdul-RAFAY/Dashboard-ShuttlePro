import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Assessment,
  Store,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToGinkgo = () => {
    navigate("/ginkgo-dashboard");
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Retail Management Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Welcome to your comprehensive retail management system
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                    $12,450
                  </Typography>
                  <Typography color="textSecondary">Today's Sales</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    156
                  </Typography>
                  <Typography color="textSecondary">Orders Today</Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    1,284
                  </Typography>
                  <Typography color="textSecondary">
                    Active Customers
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: "info.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    98.5%
                  </Typography>
                  <Typography color="textSecondary">In Stock Rate</Typography>
                </Box>
                <Inventory sx={{ fontSize: 40, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Dashboard Sections */}
      <Grid container spacing={3}>
        {/* Ginkgo Retail Dashboard Access */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
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
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Ginkgo Retail Management System
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  Access the comprehensive retail management dashboard with
                  advanced features:
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Advanced Inventory Management with Multi-Channel Sync
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Comprehensive Order Management System (OMS)
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Unified POS with Omnichannel Capabilities
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • E-commerce Integration (Shopify, Amazon, eBay)
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Advanced Analytics & Business Intelligence
                  </Typography>
                  <Typography variant="body1">
                    • Supply Chain & Logistics Management
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={handleNavigateToGinkgo}
                  startIcon={<Assessment />}
                >
                  Launch Ginkgo Dashboard
                </Button>
              </Box>
              <Store sx={{ fontSize: 80, opacity: 0.3 }} />
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/products")}
                  startIcon={<Inventory />}
                >
                  Manage Products
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/orders")}
                  startIcon={<ShoppingCart />}
                >
                  View Orders
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/customers")}
                  startIcon={<People />}
                >
                  Customer Management
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/pos")}
                  startIcon={<Store />}
                >
                  Point of Sale
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/analytics")}
                  startIcon={<Assessment />}
                >
                  Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Today, 2:30 PM - New order #1234 received
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Today, 1:15 PM - Inventory updated for 23 products
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Today, 12:45 PM - Customer John Doe registered
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Today, 11:30 AM - Payment processed for order #1233
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Today, 10:15 AM - Shipping label generated
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">POS System</Typography>
                    <Typography variant="body2" color="success.main">
                      Online
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    color="success"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Inventory Sync</Typography>
                    <Typography variant="body2" color="success.main">
                      98%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={98}
                    color="success"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      E-commerce Integration
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    color="warning"
                  />
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Analytics Processing
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      100%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    color="success"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
