import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Store and theme
import { store } from "./store";
import { lightTheme, darkTheme } from "./themes";
import { useAppSelector, useAppDispatch } from "./store";
import { initializeFromStorage } from "./store/uiSlice";

// Layout components
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GinkgoRetailDashboard from "./pages/GinkgoRetailDashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import POS from "./pages/POS";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  // Simple test component to verify React is working
  const TestComponent = () => (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h1>🎉 React App is Working!</h1>
      <p>Theme: {theme}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Test route for debugging */}
          <Route path="/test" element={<TestComponent />} />
          
          {/* Simple test route */}
          <Route path="/simple" element={<div>Simple Route Working!</div>} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - temporarily removing AuthGuard for testing */}
          <Route
            path="/"
            element={<Layout />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="ginkgo-dashboard"
              element={<GinkgoRetailDashboard />}
            />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="pos" element={<POS />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all route */}
          <Route
            path="*"
            element={<TestComponent />}
          />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: currentTheme.palette.background.paper,
            color: currentTheme.palette.text.primary,
          },
        }}
      />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
