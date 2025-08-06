import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Customer, FilterOptions } from "../../types";

interface CustomersState {
  customers: Customer[];
  currentCustomer: Customer | null;
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

const initialState: CustomersState = {
  customers: [],
  currentCustomer: null,
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
    sortBy: "firstName",
    sortOrder: "asc",
  },
};

// Mock async thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (filters: FilterOptions, { rejectWithValue }) => {
    try {
      return {
        data: [] as Customer[],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
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
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters } = customersSlice.actions;
export default customersSlice.reducer;
