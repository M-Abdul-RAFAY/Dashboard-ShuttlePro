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

class OrderService {
  // Order Management
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
    items: Array<Omit<OrderItem, 'id' | 'product' | 'variant'>>;
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

  async cancelOrder(id: string, reason: string): Promise<Order> {
    return await apiService.post<Order>(`/orders/${id}/cancel`, { reason });
  }

  // Order Verification
  async sendSmsVerification(orderId: string, phoneNumber: string): Promise<{
    success: boolean;
    verificationId: string;
  }> {
    return await apiService.post(`/orders/${orderId}/verify/sms`, { phoneNumber });
  }

  async verifySmsCode(orderId: string, verificationId: string, code: string): Promise<{
    success: boolean;
    verified: boolean;
  }> {
    return await apiService.post(`/orders/${orderId}/verify/sms/confirm`, {
      verificationId,
      code
    });
  }

  async initiateIvrVerification(orderId: string, phoneNumber: string): Promise<{
    success: boolean;
    callId: string;
  }> {
    return await apiService.post(`/orders/${orderId}/verify/ivr`, { phoneNumber });
  }

  // Order Routing & Allocation
  async getOptimalFulfillmentLocation(orderId: string): Promise<{
    locationId: string;
    locationName: string;
    distance: number;
    estimatedDeliveryTime: string;
    shippingCost: number;
    stockAvailability: boolean;
  }[]> {
    return await apiService.get(`/orders/${orderId}/optimal-locations`);
  }

  async allocateOrderToLocation(orderId: string, locationId: string): Promise<{
    success: boolean;
    fulfillmentId: string;
  }> {
    return await apiService.post(`/orders/${orderId}/allocate`, { locationId });
  }

  async splitOrder(orderId: string, splitConfig: Array<{
    locationId: string;
    items: Array<{ orderItemId: string; quantity: number }>;
  }>): Promise<{
    parentOrderId: string;
    childOrders: Array<{
      orderId: string;
      locationId: string;
      items: OrderItem[];
    }>;
  }> {
    return await apiService.post(`/orders/${orderId}/split`, { splitConfig });
  }

  // Fulfillment Management
  async createFulfillment(orderId: string, fulfillmentData: {
    locationId: string;
    items: Array<{ orderItemId: string; quantity: number }>;
    trackingNumber?: string;
    carrier?: string;
    notifyCustomer?: boolean;
  }): Promise<Fulfillment> {
    return await apiService.post<Fulfillment>(`/orders/${orderId}/fulfillments`, fulfillmentData);
  }

  async updateFulfillment(
    orderId: string,
    fulfillmentId: string,
    data: Partial<Fulfillment>
  ): Promise<Fulfillment> {
    return await apiService.put<Fulfillment>(
      `/orders/${orderId}/fulfillments/${fulfillmentId}`,
      data
    );
  }

  async scanAndShip(fulfillmentId: string, scannedItems: Array<{
    orderItemId: string;
    scannedBarcode: string;
    quantity: number;
  }>): Promise<{
    success: boolean;
    verifiedItems: Array<{ orderItemId: string; verified: boolean; expectedBarcode: string }>;
    readyToShip: boolean;
  }> {
    return await apiService.post(`/fulfillments/${fulfillmentId}/scan-ship`, { scannedItems });
  }

  async generateShippingLabel(fulfillmentId: string): Promise<{
    labelUrl: string;
    trackingNumber: string;
    carrier: string;
    cost: number;
  }> {
    return await apiService.post(`/fulfillments/${fulfillmentId}/shipping-label`);
  }

  // Returns Management
  async createReturn(orderId: string, returnData: {
    items: Array<{
      orderItemId: string;
      quantity: number;
      reason: string;
      condition: 'new' | 'used' | 'damaged';
    }>;
    returnMethod: 'pickup' | 'drop_off' | 'mail';
    refundMethod: 'original' | 'store_credit' | 'exchange';
    notes?: string;
  }): Promise<{
    returnId: string;
    returnNumber: string;
    refundAmount: number;
    returnLabel?: string;
  }> {
    return await apiService.post(`/orders/${orderId}/returns`, returnData);
  }

  async processReturn(returnId: string, processData: {
    receivedItems: Array<{
      orderItemId: string;
      receivedQuantity: number;
      condition: 'new' | 'used' | 'damaged';
      restockable: boolean;
    }>;
    refundAmount: number;
    refundToOriginal: boolean;
    storeCreditAmount?: number;
  }): Promise<{
    success: boolean;
    refundId?: string;
    storeCreditId?: string;
  }> {
    return await apiService.post(`/returns/${returnId}/process`, processData);
  }

  // Order Tracking
  async getOrderTracking(orderId: string): Promise<{
    orderId: string;
    status: string;
    timeline: Array<{
      status: string;
      timestamp: string;
      location?: string;
      description: string;
    }>;
    estimatedDelivery?: string;
    actualDelivery?: string;
    fulfillments: Array<{
      fulfillmentId: string;
      trackingNumber?: string;
      carrier?: string;
      status: string;
      items: OrderItem[];
    }>;
  }> {
    return await apiService.get(`/orders/${orderId}/tracking`);
  }

  async updateTrackingStatus(
    fulfillmentId: string,
    status: string,
    location?: string,
    timestamp?: string
  ): Promise<{ success: boolean }> {
    return await apiService.post(`/fulfillments/${fulfillmentId}/tracking`, {
      status,
      location,
      timestamp: timestamp || new Date().toISOString()
    });
  }

  // Analytics & Reporting
  async getOrderAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    channel?: string;
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    fulfillmentRate: number;
    averageFulfillmentTime: number;
    returnRate: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      quantitySold: number;
      revenue: number;
    }>;
    channelBreakdown: Array<{
      channel: string;
      orders: number;
      revenue: number;
      percentage: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/orders/analytics?${params}`);
  }

  async getShippingMethods(
    destinationZip: string,
    totalWeight: number,
    totalValue: number
  ): Promise<ShippingMethod[]> {
    return await apiService.get(`/shipping/methods?zip=${destinationZip}&weight=${totalWeight}&value=${totalValue}`);
  }

  async calculateShippingCost(
    shippingMethodId: string,
    items: Array<{ productVariantId: string; quantity: number }>,
    destinationAddress: Address
  ): Promise<{
    cost: number;
    estimatedDelivery: string;
    carrier: string;
  }> {
    return await apiService.post("/shipping/calculate", {
      shippingMethodId,
      items,
      destinationAddress
    });
  }

  // Bulk Operations
  async bulkUpdateOrders(
    orderIds: string[],
    updates: Partial<Order>
  ): Promise<{ updated: number; failed: number; errors: string[] }> {
    return await apiService.post("/orders/bulk-update", { orderIds, updates });
  }

  async exportOrders(filters?: FilterOptions): Promise<void> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }
    return await apiService.download(`/orders/export?${params}`, "orders.csv");
  }

  // Advanced Order Management System (OMS) Features for Ginkgo Retail

  // Automated Order Verification (SMS & IVR)
  async initiateOrderVerification(data: {
    orderId: string;
    verificationMethod: 'sms' | 'ivr' | 'email' | 'whatsapp';
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

  async confirmOrderVerification(verificationId: string, verificationCode: string): Promise<{
    success: boolean;
    orderId: string;
    verifiedAt: string;
    nextStep: 'payment' | 'inventory_check' | 'fulfillment';
  }> {
    return await apiService.post(`/orders/verification/${verificationId}/confirm`, {
      verificationCode,
    });
  }

  async resendVerification(verificationId: string, newMethod?: 'sms' | 'ivr' | 'email'): Promise<{
    success: boolean;
    newVerificationId?: string;
    cooldownPeriod: number;
  }> {
    return await apiService.post(`/orders/verification/${verificationId}/resend`, {
      newMethod,
    });
  }

  // Intelligent Order Routing
  async calculateOrderRouting(orderId: string, options?: {
    prioritizeSpeed?: boolean;
    prioritizeCost?: boolean;
    maxFulfillmentCenters?: number;
    excludeLocations?: string[];
  }): Promise<{
    orderId: string;
    selectedFulfillmentCenter: any;
    alternativeCenters: any[];
    estimatedFulfillmentTime: number;
    shippingCost: number;
    routingReason: string;
  }> {
    return await apiService.post(`/orders/${orderId}/calculate-routing`, options);
  }

  async applyOrderRouting(orderId: string, routingResult: any): Promise<{
    success: boolean;
    fulfillmentInstructions: Array<{
      locationId: string;
      items: OrderItem[];
      priority: number;
      estimatedProcessingTime: number;
    }>;
  }> {
    return await apiService.post(`/orders/${orderId}/apply-routing`, routingResult);
  }

  // Split Order Functionality
  async analyzeSplitOrderOptions(orderId: string): Promise<{
    canSplit: boolean;
    splitRecommendations: Array<{
      splitType: 'by_location' | 'by_supplier' | 'by_shipping_speed' | 'mixed';
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

  // Scan & Ship Feature
  async initiateScanAndShip(orderId: string, fulfillmentLocationId: string): Promise<{
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

  async processScanAndShip(sessionId: string, data: {
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
  }): Promise<{
    success: boolean;
    verificationResults: Array<{
      orderItemId: string;
      scannedCorrectly: boolean;
      discrepancies?: Array<{
        type: 'wrong_product' | 'wrong_quantity' | 'damaged_item';
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
    return await apiService.post(`/orders/scan-ship/${sessionId}/process`, data);
  }

  async completeScanAndShip(sessionId: string, finalPackageData: {
    finalWeight: number;
    actualDimensions: { length: number; width: number; height: number };
    carrierPickupScheduled: boolean;
    qualityCheckPassed: boolean;
    packedBy: string;
  }): Promise<{
    success: boolean;
    trackingNumber: string;
    shippingCost: number;
    estimatedDelivery: string;
    order: Order;
  }> {
    return await apiService.post(`/orders/scan-ship/${sessionId}/complete`, finalPackageData);
  }

  // Enhanced Order Tracking
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

  // Returns and Exchanges Management
  async initiateReturn(orderId: string, data: {
    items: Array<{
      orderItemId: string;
      quantity: number;
      reason: 'damaged' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'defective';
      condition: 'unopened' | 'opened' | 'damaged' | 'missing_parts';
      photos?: string[];
    }>;
    returnMethod: 'ship_back' | 'drop_off' | 'exchange_in_store';
    customerNotes?: string;
  }): Promise<{
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

  async processReturn(returnId: string, data: {
    receivedItems: Array<{
      orderItemId: string;
      quantityReceived: number;
      condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
      restockable: boolean;
      notes?: string;
    }>;
    inspectedBy: string;
    refundApproved: boolean;
    refundAmount?: number;
  }): Promise<{
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

  // Order Fulfillment from Stores
  async enableStorePickup(orderId: string, storeId: string): Promise<{
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
    return await apiService.post(`/orders/${orderId}/store-pickup`, { storeId });
  }

  async fulfillFromStore(data: {
    orderId: string;
    storeId: string;
    items: Array<{
      orderItemId: string;
      fulfillQuantity: number;
      alternativeProduct?: {
        productVariantId: string;
        reason: 'out_of_stock' | 'damaged' | 'customer_preference';
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
      status: 'pending' | 'accepted' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
    coordinationStatus: 'in_sync' | 'delayed' | 'issues';
  }> {
    return await apiService.get(`/orders/${orderId}/vendor-status`);
  }

  // Advanced Order Analytics
  async getOrderAnalytics(filters: {
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
    return await apiService.get(`/orders/analytics?${params}`);
  }

  async generateOrderReport(reportType: 'fulfillment' | 'returns' | 'vendor' | 'financial', data: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    format: 'pdf' | 'excel' | 'csv';
    includeDetails: boolean;
  }): Promise<{
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
      status: 'connected' | 'error' | 'pending';
      lastSync: string;
      ordersUpdated: number;
    }>;
    totalOrdersUpdated: number;
  }> {
    return await apiService.post("/orders/sync-carriers");
  }

  async integrateWithMarketplace(data: {
    marketplace: 'amazon' | 'ebay' | 'etsy' | 'walmart' | 'shopify' | 'custom';
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
}
}

export default new OrderService();
