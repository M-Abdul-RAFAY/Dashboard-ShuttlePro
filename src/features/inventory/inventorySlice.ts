import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Product,
  InventoryLevel,
  Category,
  FilterOptions,
} from "../../types";
import inventoryService from "./inventoryService";

interface InventoryState {
  products: Product[];
  categories: Category[];
  inventoryLevels: InventoryLevel[];
  currentProduct: Product | null;
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

const initialState: InventoryState = {
  products: [],
  categories: [],
  inventoryLevels: [],
  currentProduct: null,
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
    sortBy: "name",
    sortOrder: "asc",
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "inventory/fetchProducts",
  async (filters: FilterOptions, { rejectWithValue }) => {
    try {
      return await inventoryService.getProducts(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "inventory/fetchProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      return await inventoryService.getProduct(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "inventory/createProduct",
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      return await inventoryService.createProduct(productData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "inventory/updateProduct",
  async (
    { id, data }: { id: string; data: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.updateProduct(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "inventory/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await inventoryService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "inventory/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getCategories();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "inventory/createCategory",
  async (categoryData: Partial<Category>, { rejectWithValue }) => {
    try {
      return await inventoryService.createCategory(categoryData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "inventory/updateCategory",
  async (
    { id, data }: { id: string; data: Partial<Category> },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.updateCategory(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "inventory/deleteCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await inventoryService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchInventoryLevels = createAsyncThunk(
  "inventory/fetchInventoryLevels",
  async (locationId?: string, { rejectWithValue }) => {
    try {
      return await inventoryService.getInventoryLevels(locationId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateInventoryLevel = createAsyncThunk(
  "inventory/updateInventoryLevel",
  async (
    { id, data }: { id: string; data: Partial<InventoryLevel> },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.updateInventoryLevel(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const adjustInventory = createAsyncThunk(
  "inventory/adjustInventory",
  async (
    {
      variantId,
      locationId,
      adjustment,
      reason,
    }: {
      variantId: string;
      locationId: string;
      adjustment: number;
      reason: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.adjustInventory(
        variantId,
        locationId,
        adjustment,
        reason
      );
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    updateProductInList: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      })
      // Fetch inventory levels
      .addCase(fetchInventoryLevels.fulfilled, (state, action) => {
        state.inventoryLevels = action.payload;
      })
      // Update inventory level
      .addCase(updateInventoryLevel.fulfilled, (state, action) => {
        const index = state.inventoryLevels.findIndex(
          (il) => il.id === action.payload.id
        );
        if (index !== -1) {
          state.inventoryLevels[index] = action.payload;
        }
      })
      // Adjust inventory
      .addCase(adjustInventory.fulfilled, (state, action) => {
        const index = state.inventoryLevels.findIndex(
          (il) =>
            il.productVariantId === action.payload.productVariantId &&
            il.locationId === action.payload.locationId
        );
        if (index !== -1) {
          state.inventoryLevels[index] = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setFilters,
  clearCurrentProduct,
  updateProductInList,
} = inventorySlice.actions;

// Selectors
export const selectInventory = (state: { inventory: InventoryState }) =>
  state.inventory;
export const selectProducts = (state: { inventory: InventoryState }) =>
  state.inventory.products;
export const selectCurrentProduct = (state: { inventory: InventoryState }) =>
  state.inventory.currentProduct;
export const selectCategories = (state: { inventory: InventoryState }) =>
  state.inventory.categories;
export const selectInventoryLevels = (state: { inventory: InventoryState }) =>
  state.inventory.inventoryLevels;
export const selectInventoryLoading = (state: { inventory: InventoryState }) =>
  state.inventory.loading;
export const selectInventoryError = (state: { inventory: InventoryState }) =>
  state.inventory.error;
export const selectInventoryPagination = (state: {
  inventory: InventoryState;
}) => state.inventory.pagination;
export const selectInventoryFilters = (state: { inventory: InventoryState }) =>
  state.inventory.filters;

export default inventorySlice.reducer;
