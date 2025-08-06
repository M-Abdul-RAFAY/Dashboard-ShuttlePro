import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PosSession, PosTransaction } from "../../types";

interface PosState {
  currentSession: PosSession | null;
  transactions: PosTransaction[];
  cart: Array<{
    productVariantId: string;
    quantity: number;
    price: number;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: PosState = {
  currentSession: null,
  transactions: [],
  cart: [],
  loading: false,
  error: null,
};

export const startPosSession = createAsyncThunk(
  "pos/startSession",
  async (_cashFloat: number, { rejectWithValue }) => {
    try {
      return {} as PosSession;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find(
        (i) => i.productVariantId === item.productVariantId
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productVariantId !== action.payload
      );
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startPosSession.fulfilled, (state, action) => {
      state.currentSession = action.payload;
    });
  },
});

export const { clearError, addToCart, removeFromCart, clearCart } =
  posSlice.actions;
export default posSlice.reducer;
