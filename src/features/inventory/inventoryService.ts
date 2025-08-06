import apiService from "../../services/api";
import type {
  Product,
  Category,
  InventoryLevel,
  FilterOptions,
  PaginatedResponse,
} from "../../types";

class InventoryService {
  // Products
  async getProducts(
    filters: FilterOptions
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return await apiService.get<PaginatedResponse<Product>>(
      `/inventory/products?${params}`
    );
  }

  async getProduct(id: string): Promise<Product> {
    return await apiService.get<Product>(`/inventory/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return await apiService.post<Product>("/inventory/products", productData);
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product> {
    return await apiService.put<Product>(
      `/inventory/products/${id}`,
      productData
    );
  }

  async deleteProduct(id: string): Promise<void> {
    return await apiService.delete<void>(`/inventory/products/${id}`);
  }

  async bulkUpdateProducts(
    updates: Array<{ id: string; data: Partial<Product> }>
  ): Promise<Product[]> {
    return await apiService.post<Product[]>("/inventory/products/bulk-update", {
      updates,
    });
  }

  async importProducts(
    file: File
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    return await apiService.upload<{
      success: number;
      failed: number;
      errors: string[];
    }>("/inventory/products/import", file);
  }

  async exportProducts(filters?: FilterOptions): Promise<void> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    return await apiService.download(
      `/inventory/products/export?${params}`,
      "products.csv"
    );
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await apiService.get<Category[]>("/inventory/categories");
  }

  async getCategory(id: string): Promise<Category> {
    return await apiService.get<Category>(`/inventory/categories/${id}`);
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    return await apiService.post<Category>(
      "/inventory/categories",
      categoryData
    );
  }

  async updateCategory(
    id: string,
    categoryData: Partial<Category>
  ): Promise<Category> {
    return await apiService.put<Category>(
      `/inventory/categories/${id}`,
      categoryData
    );
  }

  async deleteCategory(id: string): Promise<void> {
    return await apiService.delete<void>(`/inventory/categories/${id}`);
  }

  // Inventory Levels
  async getInventoryLevels(locationId?: string): Promise<InventoryLevel[]> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get<InventoryLevel[]>(`/inventory/levels${params}`);
  }

  async getInventoryLevel(
    variantId: string,
    locationId: string
  ): Promise<InventoryLevel> {
    return await apiService.get<InventoryLevel>(
      `/inventory/levels/${variantId}/${locationId}`
    );
  }

  async updateInventoryLevel(
    id: string,
    data: Partial<InventoryLevel>
  ): Promise<InventoryLevel> {
    return await apiService.put<InventoryLevel>(
      `/inventory/levels/${id}`,
      data
    );
  }

  async adjustInventory(
    variantId: string,
    locationId: string,
    adjustment: number,
    reason: string
  ): Promise<InventoryLevel> {
    return await apiService.post<InventoryLevel>("/inventory/adjust", {
      variantId,
      locationId,
      adjustment,
      reason,
    });
  }

  async bulkAdjustInventory(
    adjustments: Array<{
      variantId: string;
      locationId: string;
      adjustment: number;
      reason: string;
    }>
  ): Promise<InventoryLevel[]> {
    return await apiService.post<InventoryLevel[]>("/inventory/bulk-adjust", {
      adjustments,
    });
  }

  async transferStock(
    fromLocationId: string,
    toLocationId: string,
    items: Array<{ variantId: string; quantity: number }>
  ): Promise<{ transferId: string }> {
    return await apiService.post<{ transferId: string }>(
      "/inventory/transfer",
      {
        fromLocationId,
        toLocationId,
        items,
      }
    );
  }

  async getLowStockItems(threshold?: number): Promise<InventoryLevel[]> {
    const params = threshold ? `?threshold=${threshold}` : "";
    return await apiService.get<InventoryLevel[]>(
      `/inventory/low-stock${params}`
    );
  }

  async getStockMovements(
    variantId?: string,
    locationId?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<
    Array<{
      id: string;
      variantId: string;
      locationId: string;
      type: "adjustment" | "sale" | "transfer" | "return";
      quantity: number;
      reason?: string;
      createdAt: string;
      userId: string;
    }>
  > {
    const params = new URLSearchParams();
    if (variantId) params.append("variantId", variantId);
    if (locationId) params.append("locationId", locationId);
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);

    return await apiService.get(`/inventory/movements?${params}`);
  }

  // Barcode scanning
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      return await apiService.get<Product>(`/inventory/barcode/${barcode}`);
    } catch {
      // Return null if product not found
      return null;
    }
  }

  // Stock alerts
  async getStockAlerts(): Promise<
    Array<{
      id: string;
      type: "low_stock" | "out_of_stock" | "overstock";
      productVariant: { id: string; name: string; sku: string };
      location: { id: string; name: string };
      currentStock: number;
      threshold: number;
      severity: "low" | "medium" | "high" | "critical";
      createdAt: string;
    }>
  > {
    return await apiService.get("/inventory/alerts");
  }

  async dismissAlert(alertId: string): Promise<void> {
    return await apiService.post(`/inventory/alerts/${alertId}/dismiss`);
  }

  // Inventory reports
  async getInventoryReport(
    dateFrom: string,
    dateTo: string,
    locationId?: string
  ): Promise<{
    totalValue: number;
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
    topMovingProducts: Array<{
      product: Product;
      totalMovement: number;
      direction: "in" | "out";
    }>;
    slowMovingProducts: Array<{
      product: Product;
      daysSinceLastMovement: number;
    }>;
  }> {
    const params = new URLSearchParams();
    params.append("dateFrom", dateFrom);
    params.append("dateTo", dateTo);
    if (locationId) params.append("locationId", locationId);

    return await apiService.get(`/inventory/reports?${params}`);
  }

  async getStockValuation(locationId?: string): Promise<{
    totalValue: number;
    totalCost: number;
    totalMargin: number;
    items: Array<{
      productVariant: { id: string; name: string; sku: string };
      quantity: number;
      cost: number;
      value: number;
    }>;
  }> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get(`/inventory/valuation${params}`);
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
