import apiService from "../../services/api";
import type {
  Product,
  Category,
  InventoryLevel,
  FilterOptions,
  PaginatedResponse,
  StockTransfer,
  Location,
  ProductVariant,
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

  // Advanced Inventory Features
  async barcodeSearch(barcode: string): Promise<ProductVariant | null> {
    return await apiService.get<ProductVariant | null>(
      `/inventory/barcode/${barcode}`
    );
  }

  async createStockTransfer(transferData: {
    fromLocationId: string;
    toLocationId: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      reason?: string;
    }>;
    notes?: string;
  }): Promise<StockTransfer> {
    return await apiService.post<StockTransfer>(
      "/inventory/transfers",
      transferData
    );
  }

  async getStockTransfers(filters?: {
    status?: string;
    fromLocationId?: string;
    toLocationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<StockTransfer[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiService.get<StockTransfer[]>(
      `/inventory/transfers?${params}`
    );
  }

  async approveStockTransfer(transferId: string): Promise<StockTransfer> {
    return await apiService.post<StockTransfer>(
      `/inventory/transfers/${transferId}/approve`
    );
  }

  async completeStockTransfer(
    transferId: string,
    items: Array<{
      productVariantId: string;
      transferredQuantity: number;
    }>
  ): Promise<StockTransfer> {
    return await apiService.post<StockTransfer>(
      `/inventory/transfers/${transferId}/complete`,
      { items }
    );
  }

  async getLocations(): Promise<Location[]> {
    return await apiService.get<Location[]>("/inventory/locations");
  }

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    return await apiService.post<Location>(
      "/inventory/locations",
      locationData
    );
  }

  async updateLocation(
    id: string,
    locationData: Partial<Location>
  ): Promise<Location> {
    return await apiService.put<Location>(
      `/inventory/locations/${id}`,
      locationData
    );
  }

  async syncInventoryAcrossChannels(
    locationId: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiService.post(`/inventory/locations/${locationId}/sync`);
  }

  async reserveStock(
    items: Array<{
      productVariantId: string;
      locationId: string;
      quantity: number;
      reservationReason: string;
      expiresAt?: string;
    }>
  ): Promise<{ reservationId: string; success: boolean }> {
    return await apiService.post("/inventory/reserve", { items });
  }

  async releaseReservation(
    reservationId: string
  ): Promise<{ success: boolean }> {
    return await apiService.delete(`/inventory/reservations/${reservationId}`);
  }

  async getInventoryAlerts(locationId?: string): Promise<
    Array<{
      id: string;
      type: "low_stock" | "out_of_stock" | "overstock" | "expired";
      productVariant: ProductVariant;
      location: Location;
      currentLevel: number;
      threshold: number;
      severity: "low" | "medium" | "high" | "critical";
      createdAt: string;
    }>
  > {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get(`/inventory/alerts${params}`);
  }

  async createReorderReport(locationId?: string): Promise<{
    items: Array<{
      productVariant: ProductVariant;
      currentStock: number;
      reorderPoint: number;
      suggestedOrderQuantity: number;
      leadTime: number;
      averageDemand: number;
    }>;
    totalItems: number;
    estimatedCost: number;
  }> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get(`/inventory/reorder-report${params}`);
  }

  async generatePurchaseOrder(
    supplierId: string,
    items: Array<{
      productVariantId: string;
      quantity: number;
      unitCost: number;
    }>
  ): Promise<{ purchaseOrderId: string; totalCost: number }> {
    return await apiService.post("/inventory/purchase-orders", {
      supplierId,
      items,
    });
  }

  // Advanced Inventory Features for Ginkgo Retail

  // Multi-channel Inventory Synchronization
  async syncInventoryWithChannels(data: {
    locationId: string;
    channels: Array<{
      channelType:
        | "shopify"
        | "woocommerce"
        | "amazon"
        | "ebay"
        | "marketplace";
      channelId: string;
      syncRules: {
        reserveBuffer: number;
        maxQuantityToSync: number;
        autoSync: boolean;
      };
    }>;
  }): Promise<{
    success: boolean;
    syncedChannels: number;
    errors: Array<{ channel: string; error: string }>;
  }> {
    return await apiService.post("/inventory/sync-channels", data);
  }

  // Inventory Buffer Management for Physical Store Customers
  async setInventoryBuffer(data: {
    productVariantId: string;
    locationId: string;
    bufferPercentage: number;
    reason: string;
  }): Promise<{ success: boolean; newAvailableQuantity: number }> {
    return await apiService.post("/inventory/set-buffer", data);
  }

  // Real-time Inventory Tracking
  async getRealtimeInventory(
    productVariantId: string,
    locationId?: string
  ): Promise<{
    productVariant: ProductVariant;
    locations: Array<{
      location: Location;
      onHand: number;
      reserved: number;
      available: number;
      incoming: number;
      buffer: number;
      lastUpdated: string;
    }>;
    totalAvailable: number;
    totalReserved: number;
  }> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get(
      `/inventory/realtime/${productVariantId}${params}`
    );
  }

  // Advanced Barcode Scanning with Batch Processing
  async batchBarcodeSearch(barcodes: string[]): Promise<
    Array<{
      barcode: string;
      found: boolean;
      productVariant?: ProductVariant;
      inventoryLevels?: Array<{
        location: Location;
        quantity: number;
        available: number;
      }>;
    }>
  > {
    return await apiService.post("/inventory/batch-barcode-search", {
      barcodes,
    });
  }

  // Automated Reorder Management
  async getAutomatedReorderSuggestions(locationId?: string): Promise<{
    urgentItems: Array<{
      productVariant: ProductVariant;
      currentStock: number;
      reorderPoint: number;
      suggestedQuantity: number;
      leadTimeDays: number;
      priority: "critical" | "high" | "medium";
      supplier: { id: string; name: string };
    }>;
    totalEstimatedCost: number;
    deliverySchedule: Array<{
      supplierId: string;
      supplierName: string;
      itemCount: number;
      estimatedDelivery: string;
      totalCost: number;
    }>;
  }> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return await apiService.get(`/inventory/auto-reorder-suggestions${params}`);
  }

  async executeAutomatedReorder(data: {
    locationId: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      maxUnitCost: number;
    }>;
    autoApprove: boolean;
  }): Promise<{
    purchaseOrders: Array<{
      id: string;
      supplierId: string;
      itemCount: number;
      totalCost: number;
      status: "pending" | "approved" | "sent";
    }>;
    totalCost: number;
  }> {
    return await apiService.post("/inventory/execute-auto-reorder", data);
  }

  // Multi-location Inventory Control
  async transferInventoryBetweenLocations(data: {
    fromLocationId: string;
    toLocationId: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      reason: string;
    }>;
    urgency: "low" | "medium" | "high" | "urgent";
    requestedBy: string;
    notes?: string;
  }): Promise<{
    transferId: string;
    estimatedTransitTime: number;
    trackingNumber?: string;
  }> {
    return await apiService.post("/inventory/inter-location-transfer", data);
  }

  async getTransferStatus(transferId: string): Promise<{
    transfer: StockTransfer;
    timeline: Array<{
      timestamp: string;
      status: string;
      location?: string;
      notes?: string;
      updatedBy: string;
    }>;
    estimatedDelivery?: string;
  }> {
    return await apiService.get(`/inventory/transfers/${transferId}/status`);
  }

  // Advanced Product Catalog Management
  async bulkUpdateProductCatalog(data: {
    updates: Array<{
      productId: string;
      variants?: Array<{
        id?: string;
        sku: string;
        price: number;
        cost: number;
        attributes: Record<string, string>;
      }>;
      categories?: string[];
      tags?: string[];
      seoData?: {
        title: string;
        description: string;
        keywords: string[];
      };
    }>;
    publishToChannels?: string[];
  }): Promise<{
    processed: number;
    successful: number;
    failed: number;
    errors: Array<{
      productId: string;
      error: string;
    }>;
  }> {
    return await apiService.post("/inventory/bulk-catalog-update", data);
  }

  // Inventory Forecasting and Demand Planning
  async getInventoryForecast(data: {
    productVariantId: string;
    locationId?: string;
    forecastDays: number;
    includeSeasonal: boolean;
  }): Promise<{
    productVariant: ProductVariant;
    currentStock: number;
    forecastData: Array<{
      date: string;
      predictedDemand: number;
      suggestedStock: number;
      confidence: number;
    }>;
    recommendations: {
      reorderPoint: number;
      maxStock: number;
      safetyStock: number;
    };
  }> {
    return await apiService.post("/inventory/forecast", data);
  }

  // Advanced Stock Alerts and Notifications
  async configureStockAlerts(data: {
    productVariantId: string;
    locationId: string;
    alertRules: {
      lowStockThreshold: number;
      criticalStockThreshold: number;
      overstockThreshold: number;
      expiryWarningDays?: number;
    };
    notifications: {
      email: string[];
      sms: string[];
      slack?: string;
      pushNotification: boolean;
    };
  }): Promise<{ success: boolean; alertId: string }> {
    return await apiService.post("/inventory/configure-alerts", data);
  }

  async getStockAlertHistory(
    alertId?: string,
    locationId?: string
  ): Promise<
    Array<{
      id: string;
      alertType:
        | "low_stock"
        | "critical_stock"
        | "overstock"
        | "expiry_warning";
      productVariant: ProductVariant;
      location: Location;
      triggeredAt: string;
      resolvedAt?: string;
      currentLevel: number;
      threshold: number;
      actionsTaken: Array<{
        action: string;
        timestamp: string;
        userId: string;
      }>;
    }>
  > {
    const params = new URLSearchParams();
    if (alertId) params.append("alertId", alertId);
    if (locationId) params.append("locationId", locationId);
    return await apiService.get(`/inventory/alert-history?${params}`);
  }

  // Inventory Audit and Compliance
  async startInventoryAudit(data: {
    locationId: string;
    auditType: "full" | "cycle" | "spot_check";
    productCategories?: string[];
    auditedBy: string;
    notes?: string;
  }): Promise<{
    auditId: string;
    itemsToAudit: number;
    estimatedDuration: number;
  }> {
    return await apiService.post("/inventory/start-audit", data);
  }

  async submitAuditCounts(
    auditId: string,
    counts: Array<{
      productVariantId: string;
      countedQuantity: number;
      condition: "good" | "damaged" | "expired";
      notes?: string;
    }>
  ): Promise<{
    discrepancies: Array<{
      productVariant: ProductVariant;
      expectedQuantity: number;
      countedQuantity: number;
      variance: number;
      suggestedAction: "adjust" | "recount" | "investigate";
    }>;
  }> {
    return await apiService.post(`/inventory/audits/${auditId}/submit-counts`, {
      counts,
    });
  }

  async finalizeAudit(
    auditId: string,
    approvedAdjustments: Array<{
      productVariantId: string;
      adjustmentQuantity: number;
      reason: string;
    }>
  ): Promise<{
    success: boolean;
    adjustmentsMade: number;
    totalVariance: number;
    auditReport: {
      accuracy: number;
      totalItemsAudited: number;
      discrepanciesFound: number;
    };
  }> {
    return await apiService.post(`/inventory/audits/${auditId}/finalize`, {
      approvedAdjustments,
    });
  }

  // Integration with External Systems
  async syncWithERP(data: {
    erpSystem: "sap" | "oracle" | "dynamics" | "netsuite" | "custom";
    syncType: "full" | "incremental" | "products_only" | "inventory_only";
    locationId?: string;
  }): Promise<{
    success: boolean;
    recordsSynced: number;
    errors: Array<{
      recordId: string;
      error: string;
    }>;
    syncDuration: number;
  }> {
    return await apiService.post("/inventory/erp-sync", data);
  }

  async exportInventoryForAccounting(data: {
    locationId?: string;
    dateFrom: string;
    dateTo: string;
    format: "csv" | "excel" | "json" | "xml";
    includeMovements: boolean;
    includeValuation: boolean;
  }): Promise<{
    downloadUrl: string;
    recordCount: number;
    totalValue: number;
  }> {
    return await apiService.post("/inventory/export-accounting", data);
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
