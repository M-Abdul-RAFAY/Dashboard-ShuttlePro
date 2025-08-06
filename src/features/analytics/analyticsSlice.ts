import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardMetrics, SalesData } from "../../types";

interface AnalyticsState {
  dashboardMetrics: DashboardMetrics | null;
  salesData: SalesData[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardMetrics: null,
  salesData: [],
  loading: false,
  error: null,
};

export const fetchDashboardMetrics = createAsyncThunk(
  "analytics/fetchDashboardMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return {} as DashboardMetrics;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardMetrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
