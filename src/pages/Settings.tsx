import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Tab,
  Tabs,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Store,
  Notifications,
  Security,
  Payment,
  Inventory,
  Save,
  Edit,
} from "@mui/icons-material";

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@ginkgoretail.com",
    phone: "+1-234-567-8900",
    role: "Store Manager",
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Ginkgo Retail Store",
    address: "123 Main Street, City, State 12345",
    phone: "+1-234-567-8900",
    email: "store@ginkgoretail.com",
    currency: "USD",
    taxRate: 8.5,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    customerMessages: false,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    // Implementation for saving profile
  };

  const handleSaveStore = () => {
    console.log("Saving store settings:", storeSettings);
    // Implementation for saving store settings
  };

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications);
    // Implementation for saving notification settings
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="settings tabs"
          >
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Store />} label="Store" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Payment />} label="Payment" />
            <Tab icon={<Inventory />} label="Inventory" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Profile Information
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="h6">{profileData.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.role}
                </Typography>
                <Button size="small" startIcon={<Edit />} sx={{ mt: 1 }}>
                  Change Photo
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role}
                  disabled
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Store Tab */}
        <TabPanel value={activeTab} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Store Configuration
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store Name"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store Email"
                  value={storeSettings.email}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      email: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Store Address"
                  multiline
                  rows={3}
                  value={storeSettings.address}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      address: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store Phone"
                  value={storeSettings.phone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      phone: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={storeSettings.currency}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      currency: e.target.value,
                    })
                  }
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      taxRate: Number(e.target.value),
                    })
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveStore}
              >
                Save Store Settings
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={2}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Notification Preferences
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive important updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.emailNotifications}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications on your device"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.pushNotifications}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        pushNotifications: e.target.checked,
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Low Stock Alerts"
                  secondary="Get notified when products are running low"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.lowStockAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        lowStockAlerts: e.target.checked,
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Order Updates"
                  secondary="Notifications for new and updated orders"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.orderUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        orderUpdates: e.target.checked,
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Customer Messages"
                  secondary="Notifications for customer inquiries"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.customerMessages}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        customerMessages: e.target.checked,
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveNotifications}
              >
                Save Notification Settings
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={3}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Security Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Change Password
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Current Password"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="New Password"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="Confirm New Password"
                        />
                      </Grid>
                    </Grid>
                    <Button variant="outlined" sx={{ mt: 2 }}>
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body1">Enable 2FA</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add an extra layer of security to your account
                        </Typography>
                      </Box>
                      <Chip label="Not Enabled" color="warning" />
                    </Box>
                    <Button variant="outlined" sx={{ mt: 2 }}>
                      Setup 2FA
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Payment Tab */}
        <TabPanel value={activeTab} index={4}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Payment Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Payment Methods
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Cash Payments"
                      secondary="Accept cash payments"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Enabled" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Credit/Debit Cards"
                      secondary="Accept card payments"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Enabled" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Digital Wallets"
                      secondary="Apple Pay, Google Pay, etc."
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Disabled" color="error" />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={activeTab} index={5}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Inventory Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Low Stock Threshold"
                  type="number"
                  defaultValue={10}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Inventory Tracking Method"
                  defaultValue="fifo"
                >
                  <MenuItem value="fifo">FIFO (First In, First Out)</MenuItem>
                  <MenuItem value="lifo">LIFO (Last In, First Out)</MenuItem>
                  <MenuItem value="average">Average Cost</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-reorder when stock is low"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Track product variants separately"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" startIcon={<Save />}>
                Save Inventory Settings
              </Button>
            </Box>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Settings;
