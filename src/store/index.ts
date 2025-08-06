import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import reducers
import authReducer from "../features/auth/authSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import ordersReducer from "../features/orders/ordersSlice";
import customersReducer from "../features/crm/customersSlice";
import posReducer from "../features/pos/posSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import logisticsReducer from "../features/logistics/logisticsSlice";
import ecommerceReducer from "../features/ecommerce/ecommerceSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    orders: ordersReducer,
    customers: customersReducer,
    pos: posReducer,
    analytics: analyticsReducer,
    logistics: logisticsReducer,
    ecommerce: ecommerceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for typed useSelector and useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
