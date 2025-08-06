import { createSlice } from "@reduxjs/toolkit";

interface EcommerceState {
  storefront: {
    isOnline: boolean;
    maintenanceMode: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EcommerceState = {
  storefront: {
    isOnline: true,
    maintenanceMode: false,
  },
  loading: false,
  error: null,
};

const ecommerceSlice = createSlice({
  name: "ecommerce",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleStorefront: (state) => {
      state.storefront.isOnline = !state.storefront.isOnline;
    },
    toggleMaintenanceMode: (state) => {
      state.storefront.maintenanceMode = !state.storefront.maintenanceMode;
    },
  },
});

export const { clearError, toggleStorefront, toggleMaintenanceMode } =
  ecommerceSlice.actions;
export default ecommerceSlice.reducer;
