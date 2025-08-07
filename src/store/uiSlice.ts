import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoHide?: boolean;
  duration?: number;
}

interface UiState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  loading: boolean;
  notifications: Notification[];
  currentLocation: string | null;
  language: string;
  breadcrumbs: Array<{ label: string; path: string }>;
}

const initialState: UiState = {
  theme: "light",
  sidebarOpen: true,
  sidebarCollapsed: false,
  loading: false,
  notifications: [],
  currentLocation: null,
  language: "en",
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("ginkgo_theme", action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setCurrentLocation: (state, action: PayloadAction<string | null>) => {
      state.currentLocation = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem("ginkgo_language", action.payload);
    },
    setBreadcrumbs: (
      state,
      action: PayloadAction<Array<{ label: string; path: string }>>
    ) => {
      state.breadcrumbs = action.payload;
    },
    initializeFromStorage: (state) => {
      const savedTheme = localStorage.getItem("ginkgo_theme") as
        | "light"
        | "dark"
        | null;
      const savedLanguage = localStorage.getItem("ginkgo_language");

      if (savedTheme) {
        state.theme = savedTheme;
      }
      if (savedLanguage) {
        state.language = savedLanguage;
      }
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setCurrentLocation,
  setLanguage,
  setBreadcrumbs,
  initializeFromStorage,
} = uiSlice.actions;

export default uiSlice.reducer;
