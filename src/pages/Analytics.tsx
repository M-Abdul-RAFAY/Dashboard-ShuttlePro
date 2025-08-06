import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
} from "@mui/icons-material";

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

const Analytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState("30days");

  // Mock analytics data
  const metrics = {
    totalRevenue: 145250,
    totalOrders: 1456,
    totalCustomers: 892,
    inventoryValue: 285600,
  };

  const topProducts = [
    { name: "Wireless Headphones", revenue: 15420, units: 156, growth: 12.5 },
    { name: "Smart Watch", revenue: 12890, units: 89, growth: 8.3 },
    { name: "Phone Case", revenue: 8760, units: 324, growth: -2.1 },
    { name: "Bluetooth Speaker", revenue: 7850, units: 67, growth: 15.2 },
    { name: "USB Cable", revenue: 3240, units: 189, growth: 5.8 },
  ];

  const salesData = [
    { period: "Week 1", sales: 12450, orders: 156 },
    { period: "Week 2", sales: 15230, orders: 189 },
    { period: "Week 3", sales: 18760, orders: 223 },
    { period: "Week 4", sales: 16890, orders: 201 },
  ];

  const categoryPerformance = [
    { category: "Electronics", revenue: 89500, percentage: 62 },
    { category: "Accessories", revenue: 32100, percentage: 22 },
    { category: "Clothing", revenue: 15800, percentage: 11 },
    { category: "Books", revenue: 7850, percentage: 5 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Analytics</Typography>
        <TextField
          select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="7days">Last 7 Days</MenuItem>
          <MenuItem value="30days">Last 30 Days</MenuItem>
          <MenuItem value="90days">Last 90 Days</MenuItem>
          <MenuItem value="1year">Last Year</MenuItem>
        </TextField>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change={15.2}
            changeLabel="vs last period"
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders.toLocaleString()}
            change={8.7}
            changeLabel="vs last period"
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers.toLocaleString()}
            change={12.3}
            changeLabel="vs last period"
            icon={<People />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Inventory Value"
            value={`$${metrics.inventoryValue.toLocaleString()}`}
            change={-3.2}
            changeLabel="vs last period"
            icon={<Inventory />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sales Trend
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Orders</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesData.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell>{row.period}</TableCell>
                        <TableCell align="right">
                          ${row.sales.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{row.orders}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Top Performing Products
              </Typography>
              {topProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                    borderBottom:
                      index < topProducts.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.units} units sold
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight="bold">
                      ${product.revenue.toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${product.growth > 0 ? "+" : ""}${product.growth}%`}
                      color={product.growth > 0 ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Category Performance
              </Typography>
              {categoryPerformance.map((category, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{category.category}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ${category.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={category.percentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {category.percentage}% of total revenue
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Key Insights
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
                  <Typography variant="body2" fontWeight="medium">
                    📈 Revenue Growth
                  </Typography>
                  <Typography variant="caption">
                    Sales increased by 15.2% compared to last period
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    ⚠️ Inventory Alert
                  </Typography>
                  <Typography variant="caption">
                    12 products are running low on stock
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "info.light",
                    color: "info.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    🎯 Best Seller
                  </Typography>
                  <Typography variant="caption">
                    Wireless Headphones topped sales this period
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "secondary.light",
                    color: "secondary.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    👥 Customer Growth
                  </Typography>
                  <Typography variant="caption">
                    156 new customers acquired this month
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
