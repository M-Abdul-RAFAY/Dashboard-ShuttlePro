import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ShippingMethod } from "../../types";

interface LogisticsState {
  shippingMethods: ShippingMethod[];
  loading: boolean;
  error: string | null;
}

const initialState: LogisticsState = {
  shippingMethods: [],
  loading: false,
  error: null,
};

export const fetchShippingMethods = createAsyncThunk(
  "logistics/fetchShippingMethods",
  async (_, { rejectWithValue }) => {
    try {
      return [] as ShippingMethod[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const logisticsSlice = createSlice({
  name: "logistics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShippingMethods.fulfilled, (state, action) => {
      state.shippingMethods = action.payload;
    });
  },
});

export const { clearError } = logisticsSlice.actions;
export default logisticsSlice.reducer;
