import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Order, FilterOptions } from "../../types";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: FilterOptions;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Mock async thunks - replace with actual service calls
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters: FilterOptions, { rejectWithValue }) => {
    try {
      // Mock implementation
      return {
        data: [] as Order[],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      // Mock implementation
      return {} as Order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters } = ordersSlice.actions;
export default ordersSlice.reducer;
