import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Avatar,
  Pagination,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Download,
  Email,
  Phone,
} from "@mui/icons-material";

interface SimpleCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  joinDate: string;
  lastOrderDate?: string;
}

const Customers: React.FC = () => {
  // Mock data
  const mockCustomers: SimpleCustomer[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-234-567-8900",
      address: "123 Main St",
      city: "New York",
      totalOrders: 15,
      totalSpent: 1299.99,
      status: "active",
      joinDate: "2023-06-15",
      lastOrderDate: "2024-01-10",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1-234-567-8901",
      address: "456 Oak Ave",
      city: "Los Angeles",
      totalOrders: 8,
      totalSpent: 649.5,
      status: "active",
      joinDate: "2023-08-22",
      lastOrderDate: "2024-01-05",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1-234-567-8902",
      address: "789 Pine St",
      city: "Chicago",
      totalOrders: 3,
      totalSpent: 189.99,
      status: "inactive",
      joinDate: "2023-12-01",
      lastOrderDate: "2023-12-15",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1-234-567-8903",
      address: "321 Elm St",
      city: "Houston",
      totalOrders: 22,
      totalSpent: 2199.99,
      status: "vip",
      joinDate: "2023-03-10",
      lastOrderDate: "2024-01-12",
    },
  ];

  const [customers] = useState<SimpleCustomer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<SimpleCustomer | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view">("view");

  // Get unique cities for filter
  const cities = Array.from(
    new Set(customers.map((customer) => customer.city))
  );

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = !selectedStatus || customer.status === selectedStatus;
    const matchesCity = !selectedCity || customer.city === selectedCity;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleOpenDialog = (
    mode: "add" | "edit" | "view",
    customer?: SimpleCustomer
  ) => {
    setDialogMode(mode);
    setSelectedCustomer(customer || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      console.log("Delete customer:", customerId);
    }
  };

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
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "vip":
        return "primary";
      case "blocked":
        return "error";
      default:
        return "default";
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
        <Typography variant="h4">Customers</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => console.log("Export customers")}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog("add")}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      {/* Customer Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {customers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Active Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {customers.filter((c) => c.status === "active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                VIP Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {customers.filter((c) => c.status === "vip").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                $
                {customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => console.log("Advanced filters")}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Order</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getInitials(customer.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Joined{" "}
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <Email sx={{ fontSize: 14 }} />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Phone sx={{ fontSize: 14 }} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{customer.address}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.city}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {customer.totalOrders}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    ${customer.totalSpent.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.status}
                    color={getStatusColor(customer.status)}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {customer.lastOrderDate
                      ? new Date(customer.lastOrderDate).toLocaleDateString()
                      : "Never"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog("view", customer)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Customer">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog("edit", customer)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Customer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredCustomers.length / rowsPerPage)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Customer Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add"
            ? "Add Customer"
            : dialogMode === "edit"
              ? "Edit Customer"
              : "Customer Details"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={selectedCustomer?.name || ""}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                defaultValue={selectedCustomer?.email || ""}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                defaultValue={selectedCustomer?.phone || ""}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                defaultValue={selectedCustomer?.city || ""}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                defaultValue={selectedCustomer?.address || ""}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                defaultValue={selectedCustomer?.status || "active"}
                disabled={dialogMode === "view"}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Join Date"
                type="date"
                defaultValue={selectedCustomer?.joinDate || ""}
                disabled={dialogMode === "view"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {dialogMode === "view" && selectedCustomer && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Total Orders"
                    value={selectedCustomer.totalOrders}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Total Spent"
                    value={`$${selectedCustomer.totalSpent.toFixed(2)}`}
                    disabled
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === "view" ? "Close" : "Cancel"}
          </Button>
          {dialogMode !== "view" && (
            <Button variant="contained" onClick={handleCloseDialog}>
              {dialogMode === "add" ? "Add Customer" : "Update Customer"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
