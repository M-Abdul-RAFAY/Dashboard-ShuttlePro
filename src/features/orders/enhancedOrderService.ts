import apiService from "../../services/api";
import type {
  Order,
  FilterOptions,
  PaginatedResponse,
  Fulfillment,
  Customer,
  OrderItem,
  ShippingMethod,
  Address,
} from "../../types";

class EnhancedOrderService {
  // Basic Order Management
  async getOrders(filters: FilterOptions): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    return await apiService.get<PaginatedResponse<Order>>(`/orders?${params}`);
  }

  async getOrder(id: string): Promise<Order> {
    return await apiService.get<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    customerId?: string;
    customer: Partial<Customer>;
    items: Array<Omit<OrderItem, "id" | "product" | "variant">>;
    shipping: {
      addressId?: string;
      address?: Address;
      methodId: string;
    };
    billing?: {
      addressId?: string;
      address?: Address;
    };
    notes?: string;
    tags?: string[];
    channel: string;
  }): Promise<Order> {
    return await apiService.post<Order>("/orders", orderData);
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    return await apiService.put<Order>(`/orders/${id}`, orderData);
  }

  async deleteOrder(id: string): Promise<void> {
    return await apiService.delete<void>(`/orders/${id}`);
  }

  // Advanced Order Management System (OMS) Features for Ginkgo Retail

  // Automated Order Verification (SMS & IVR)
  async initiateOrderVerification(data: {
    orderId: string;
    verificationMethod: "sms" | "ivr" | "email" | "whatsapp";
    customerContact: string;
    verificationCode?: string;
    attempts?: number;
  }): Promise<{
    verificationId: string;
    method: string;
    estimatedDeliveryTime: number;
    maxAttempts: number;
  }> {
    return await apiService.post("/orders/verification/initiate", data);
  }

  async confirmOrderVerification(
    verificationId: string,
    verificationCode: string
  ): Promise<{
    success: boolean;
    orderId: string;
    verifiedAt: string;
    nextStep: "payment" | "inventory_check" | "fulfillment";
  }> {
    return await apiService.post(
      `/orders/verification/${verificationId}/confirm`,
      {
        verificationCode,
      }
    );
  }

  async resendVerification(
    verificationId: string,
    newMethod?: "sms" | "ivr" | "email"
  ): Promise<{
    success: boolean;
    newVerificationId?: string;
    cooldownPeriod: number;
  }> {
    return await apiService.post(
      `/orders/verification/${verificationId}/resend`,
      {
        newMethod,
      }
    );
  }

  // Intelligent Order Routing based on proximity to fulfillment centers
  async calculateOrderRouting(
    orderId: string,
    options?: {
      prioritizeSpeed?: boolean;
      prioritizeCost?: boolean;
      maxFulfillmentCenters?: number;
      excludeLocations?: string[];
    }
  ): Promise<{
    orderId: string;
    selectedFulfillmentCenter: any;
    alternativeCenters: any[];
    estimatedFulfillmentTime: number;
    shippingCost: number;
    routingReason: string;
  }> {
    return await apiService.post(
      `/orders/${orderId}/calculate-routing`,
      options
    );
  }

  async applyOrderRouting(
    orderId: string,
    routingResult: any
  ): Promise<{
    success: boolean;
    fulfillmentInstructions: Array<{
      locationId: string;
      items: OrderItem[];
      priority: number;
      estimatedProcessingTime: number;
    }>;
  }> {
    return await apiService.post(
      `/orders/${orderId}/apply-routing`,
      routingResult
    );
  }

  // Split Order Functionality - Break parent orders into smaller shipments
  async analyzeSplitOrderOptions(orderId: string): Promise<{
    canSplit: boolean;
    splitRecommendations: Array<{
      splitType: "by_location" | "by_supplier" | "by_shipping_speed" | "mixed";
      splitCount: number;
      estimatedSavings: number;
      deliveryImpact: {
        fastestDelivery: string;
        slowestDelivery: string;
      };
      cost: {
        shippingCost: number;
        packagingCost: number;
        processingCost: number;
      };
    }>;
    unavailableItems: Array<{
      orderItem: OrderItem;
      availableQuantity: number;
      nextAvailableDate: string;
    }>;
  }> {
    return await apiService.get(`/orders/${orderId}/split-analysis`);
  }

  async executeSplitOrder(data: {
    parentOrderId: string;
    splitOrders: Array<{
      fulfillmentLocationId: string;
      items: Array<{
        orderItemId: string;
        quantity: number;
      }>;
      estimatedShipDate: string;
      shippingMethod: ShippingMethod;
    }>;
  }): Promise<{
    splitOrders: Array<{
      id: string;
      trackingNumber?: string;
      items: OrderItem[];
      fulfillmentLocation: any;
      estimatedDelivery: string;
    }>;
    originalOrderStatus: string;
    totalShippingCost: number;
  }> {
    return await apiService.post("/orders/split", data);
  }

  // Scan & Ship Feature - Barcode verification during dispatch
  async initiateScanAndShip(
    orderId: string,
    fulfillmentLocationId: string
  ): Promise<{
    sessionId: string;
    orderItems: Array<{
      orderItem: OrderItem;
      expectedBarcodes: string[];
      pickingLocation: string;
      specialInstructions?: string;
    }>;
    packagingRequirements: {
      suggestedBoxSize: string;
      fragileItems: boolean;
      hazardousItems: boolean;
    };
  }> {
    return await apiService.post(`/orders/${orderId}/scan-ship/initiate`, {
      fulfillmentLocationId,
    });
  }

  async processScanAndShip(
    sessionId: string,
    data: {
      orderId: string;
      fulfillmentLocationId: string;
      scannedItems: Array<{
        orderItemId: string;
        scannedBarcode: string;
        scannedQuantity: number;
        packageId?: string;
      }>;
      packageDetails: {
        weight: number;
        dimensions: { length: number; width: number; height: number };
        carrier: string;
        serviceType: string;
      };
    }
  ): Promise<{
    success: boolean;
    verificationResults: Array<{
      orderItemId: string;
      scannedCorrectly: boolean;
      discrepancies?: Array<{
        type: "wrong_product" | "wrong_quantity" | "damaged_item";
        message: string;
      }>;
    }>;
    shippingLabel?: {
      trackingNumber: string;
      labelUrl: string;
      carrier: string;
    };
    completedAt?: string;
  }> {
    return await apiService.post(
      `/orders/scan-ship/${sessionId}/process`,
      data
    );
  }

  async completeScanAndShip(
    sessionId: string,
    finalPackageData: {
      finalWeight: number;
      actualDimensions: { length: number; width: number; height: number };
      carrierPickupScheduled: boolean;
      qualityCheckPassed: boolean;
      packedBy: string;
    }
  ): Promise<{
    success: boolean;
    trackingNumber: string;
    shippingCost: number;
    estimatedDelivery: string;
    order: Order;
  }> {
    return await apiService.post(
      `/orders/scan-ship/${sessionId}/complete`,
      finalPackageData
    );
  }

  // Real-time Order Tracking
  async getDetailedOrderTracking(orderId: string): Promise<{
    order: Order;
    currentStatus: string;
    timeline: Array<{
      timestamp: string;
      status: string;
      location?: string;
      description: string;
      carrier?: string;
    }>;
    fulfillments: Array<{
      id: string;
      trackingNumber?: string;
      carrier?: string;
      currentLocation?: string;
      estimatedDelivery: string;
      items: OrderItem[];
    }>;
    nextUpdate?: string;
  }> {
    return await apiService.get(`/orders/${orderId}/detailed-tracking`);
  }

  // Enhanced Returns Management
  async initiateReturn(
    orderId: string,
    data: {
      items: Array<{
        orderItemId: string;
        quantity: number;
        reason:
          | "damaged"
          | "wrong_item"
          | "not_as_described"
          | "changed_mind"
          | "defective";
        condition: "unopened" | "opened" | "damaged" | "missing_parts";
        photos?: string[];
      }>;
      returnMethod: "ship_back" | "drop_off" | "exchange_in_store";
      customerNotes?: string;
    }
  ): Promise<{
    returnId: string;
    returnLabel?: {
      labelUrl: string;
      trackingNumber: string;
      carrier: string;
    };
    refundAmount: number;
    restockingFee: number;
    estimatedProcessingDays: number;
    instructions: string[];
  }> {
    return await apiService.post(`/orders/${orderId}/returns`, data);
  }

  async processReturn(
    returnId: string,
    data: {
      receivedItems: Array<{
        orderItemId: string;
        quantityReceived: number;
        condition: "excellent" | "good" | "fair" | "poor" | "damaged";
        restockable: boolean;
        notes?: string;
      }>;
      inspectedBy: string;
      refundApproved: boolean;
      refundAmount?: number;
    }
  ): Promise<{
    success: boolean;
    refundProcessed: boolean;
    refundAmount: number;
    restockedItems: Array<{
      orderItemId: string;
      quantity: number;
      locationId: string;
    }>;
    damagedItems: Array<{
      orderItemId: string;
      quantity: number;
      disposalMethod: string;
    }>;
  }> {
    return await apiService.post(`/orders/returns/${returnId}/process`, data);
  }

  // Order Fulfillment from Stores - Enable direct shipping from brick-and-mortar locations
  async enableStorePickup(
    orderId: string,
    storeId: string
  ): Promise<{
    success: boolean;
    pickupCode: string;
    estimatedReadyTime: string;
    storeInstructions: string[];
    customerNotification: {
      email: boolean;
      sms: boolean;
      message: string;
    };
  }> {
    return await apiService.post(`/orders/${orderId}/store-pickup`, {
      storeId,
    });
  }

  async fulfillFromStore(data: {
    orderId: string;
    storeId: string;
    items: Array<{
      orderItemId: string;
      fulfillQuantity: number;
      alternativeProduct?: {
        productVariantId: string;
        reason: "out_of_stock" | "damaged" | "customer_preference";
        priceDifference: number;
      };
    }>;
    fulfilledBy: string;
    customerPresent: boolean;
    idVerified?: boolean;
  }): Promise<{
    success: boolean;
    fulfillmentId: string;
    shipDirectly?: {
      trackingNumber: string;
      carrier: string;
      estimatedDelivery: string;
    };
    itemsNotFulfilled: Array<{
      orderItemId: string;
      reason: string;
      nextAction: string;
    }>;
  }> {
    return await apiService.post("/orders/fulfill-from-store", data);
  }

  // Multi-vendor Order Management
  async routeToVendors(orderId: string): Promise<{
    vendorOrders: Array<{
      vendorId: string;
      vendorName: string;
      items: OrderItem[];
      dropshipOrder?: {
        id: string;
        trackingNumber?: string;
      };
      estimatedFulfillment: string;
    }>;
    coordinationRequired: boolean;
    estimatedDeliveryRange: {
      earliest: string;
      latest: string;
    };
  }> {
    return await apiService.post(`/orders/${orderId}/route-vendors`);
  }

  async getVendorOrderStatus(orderId: string): Promise<{
    vendorStatuses: Array<{
      vendorId: string;
      vendorName: string;
      status:
        | "pending"
        | "accepted"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
      items: Array<{
        orderItem: OrderItem;
        vendorSku: string;
        status: string;
        trackingNumber?: string;
      }>;
      estimatedShipDate?: string;
      actualShipDate?: string;
    }>;
    overallStatus: string;
    coordinationStatus: "in_sync" | "delayed" | "issues";
  }> {
    return await apiService.get(`/orders/${orderId}/vendor-status`);
  }

  // Advanced Order Analytics
  async getAdvancedOrderAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    channel?: string;
    customerId?: string;
  }): Promise<{
    orderMetrics: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      fulfillmentRate: number;
      onTimeDeliveryRate: number;
      returnRate: number;
    };
    channelPerformance: Array<{
      channel: string;
      orders: number;
      revenue: number;
      conversionRate: number;
    }>;
    fulfillmentMetrics: {
      averageProcessingTime: number;
      averageShippingTime: number;
      splitOrderRate: number;
      storePickupRate: number;
    };
    topPerformingProducts: Array<{
      product: any;
      quantity: number;
      revenue: number;
      growth: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/orders/advanced-analytics?${params}`);
  }

  async generateOrderReport(
    reportType: "fulfillment" | "returns" | "vendor" | "financial",
    data: {
      dateFrom: string;
      dateTo: string;
      locationId?: string;
      format: "pdf" | "excel" | "csv";
      includeDetails: boolean;
    }
  ): Promise<{
    reportId: string;
    downloadUrl: string;
    generatedAt: string;
    recordCount: number;
  }> {
    return await apiService.post(`/orders/reports/${reportType}`, data);
  }

  // Integration Features
  async syncWithShippingCarriers(): Promise<{
    carriers: Array<{
      name: string;
      status: "connected" | "error" | "pending";
      lastSync: string;
      ordersUpdated: number;
    }>;
    totalOrdersUpdated: number;
  }> {
    return await apiService.post("/orders/sync-carriers");
  }

  async integrateWithMarketplace(data: {
    marketplace: "amazon" | "ebay" | "etsy" | "walmart" | "shopify" | "custom";
    credentials: Record<string, string>;
    syncSettings: {
      autoImportOrders: boolean;
      autoExportTracking: boolean;
      inventorySync: boolean;
    };
  }): Promise<{
    success: boolean;
    integrationId: string;
    testResults: {
      connectionTest: boolean;
      orderImportTest: boolean;
      inventorySyncTest: boolean;
    };
  }> {
    return await apiService.post("/orders/marketplace-integration", data);
  }

  // Workflow Automation
  async configureOrderAutomation(data: {
    locationId: string;
    rules: Array<{
      trigger:
        | "order_placed"
        | "payment_received"
        | "inventory_allocated"
        | "shipped";
      conditions: Array<{
        field: string;
        operator: "equals" | "greater_than" | "less_than" | "contains";
        value: any;
      }>;
      actions: Array<{
        type:
          | "send_notification"
          | "update_status"
          | "create_fulfillment"
          | "route_order";
        parameters: Record<string, any>;
      }>;
    }>;
  }): Promise<{
    automationId: string;
    rulesActivated: number;
    estimatedProcessingImprovement: number;
  }> {
    return await apiService.post("/orders/configure-automation", data);
  }

  // Performance Monitoring
  async getOrderPerformanceMetrics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
  }): Promise<{
    fulfillmentMetrics: {
      averagePickTime: number;
      averagePackTime: number;
      averageShipTime: number;
      orderAccuracy: number;
      onTimeShipment: number;
    };
    qualityMetrics: {
      returnRate: number;
      damageRate: number;
      customerSatisfaction: number;
      firstCallResolution: number;
    };
    efficiencyMetrics: {
      ordersPerHour: number;
      costPerOrder: number;
      automationRate: number;
      errorRate: number;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/orders/performance-metrics?${params}`);
  }
}

const enhancedOrderService = new EnhancedOrderService();
export default enhancedOrderService;
