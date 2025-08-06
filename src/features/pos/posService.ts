import apiService from "../../services/api";
import type {
  PosSession,
  PosTransaction,
  Product,
  ProductVariant,
  Customer,
  PaymentMethod,
} from "../../types";

class PosService {
  // Session Management
  async startSession(data: {
    locationId: string;
    cashFloat: number;
    employeeId: string;
    registerId: string;
  }): Promise<PosSession> {
    return await apiService.post<PosSession>("/pos/sessions", data);
  }

  async getCurrentSession(): Promise<PosSession | null> {
    return await apiService.get<PosSession | null>("/pos/sessions/current");
  }

  async endSession(
    sessionId: string,
    data: {
      cashCountExpected: number;
      cashCountActual: number;
      notes?: string;
    }
  ): Promise<{
    session: PosSession;
    variance: number;
    summary: {
      totalSales: number;
      totalTransactions: number;
      averageTransaction: number;
      paymentMethods: Array<{
        method: string;
        count: number;
        amount: number;
      }>;
    };
  }> {
    return await apiService.post(`/pos/sessions/${sessionId}/end`, data);
  }

  async getSessionHistory(filters?: {
    locationId?: string;
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    sessions: PosSession[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get(`/pos/sessions/history?${params}`);
  }

  // Product Search & Barcode Scanning
  async searchProducts(
    query: string,
    locationId?: string
  ): Promise<
    Array<{
      product: Product;
      variant: ProductVariant;
      availableQuantity: number;
      price: number;
      discountedPrice?: number;
    }>
  > {
    const params = new URLSearchParams();
    params.append("q", query);
    if (locationId) params.append("locationId", locationId);

    return await apiService.get(`/pos/products/search?${params}`);
  }

  async scanBarcode(
    barcode: string,
    locationId?: string
  ): Promise<{
    found: boolean;
    product?: Product;
    variant?: ProductVariant;
    availableQuantity?: number;
    price?: number;
    discountedPrice?: number;
  }> {
    const params = new URLSearchParams();
    params.append("barcode", barcode);
    if (locationId) params.append("locationId", locationId);

    return await apiService.get(`/pos/barcode/scan?${params}`);
  }

  async getProductsByCategory(
    categoryId: string,
    locationId?: string
  ): Promise<
    Array<{
      product: Product;
      variant: ProductVariant;
      availableQuantity: number;
      price: number;
      discountedPrice?: number;
    }>
  > {
    const params = new URLSearchParams();
    if (locationId) params.append("locationId", locationId);

    return await apiService.get(
      `/pos/products/category/${categoryId}?${params}`
    );
  }

  // Customer Management
  async searchCustomers(query: string): Promise<
    Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      loyaltyPoints: number;
      tier: string;
      totalSpent: number;
    }>
  > {
    return await apiService.get(
      `/pos/customers/search?q=${encodeURIComponent(query)}`
    );
  }

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    return await apiService.get<Customer | null>(
      `/pos/customers/phone/${phone}`
    );
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    return await apiService.get<Customer | null>(
      `/pos/customers/email/${email}`
    );
  }

  async createQuickCustomer(data: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }): Promise<Customer> {
    return await apiService.post<Customer>("/pos/customers/quick", data);
  }

  // Cart & Pricing
  async calculateCart(data: {
    items: Array<{
      productVariantId: string;
      quantity: number;
    }>;
    customerId?: string;
    discountCodes?: string[];
    locationId: string;
  }): Promise<{
    items: Array<{
      productVariantId: string;
      productName: string;
      variantName: string;
      quantity: number;
      unitPrice: number;
      discountedPrice?: number;
      lineTotal: number;
      discounts: Array<{
        type: "percentage" | "fixed" | "loyalty";
        amount: number;
        description: string;
      }>;
    }>;
    subtotal: number;
    discounts: Array<{
      code?: string;
      type: "percentage" | "fixed" | "loyalty";
      amount: number;
      description: string;
    }>;
    tax: number;
    total: number;
    loyaltyPointsEarned?: number;
    availableDiscounts: Array<{
      code: string;
      type: "percentage" | "fixed";
      amount: number;
      description: string;
      applicable: boolean;
      reason?: string;
    }>;
  }> {
    return await apiService.post("/pos/cart/calculate", data);
  }

  async applyDiscount(data: {
    type: "percentage" | "fixed" | "loyalty_redemption";
    value: number;
    code?: string;
    reason: string;
    managerApproval?: boolean;
  }): Promise<{
    applied: boolean;
    discount: {
      type: string;
      amount: number;
      description: string;
    };
    requiresApproval: boolean;
  }> {
    return await apiService.post("/pos/cart/discount", data);
  }

  // Payment Processing
  async processPayment(data: {
    sessionId: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      unitPrice: number;
      discounts?: Array<{ type: string; amount: number }>;
    }>;
    customerId?: string;
    payments: Array<{
      method: PaymentMethod;
      amount: number;
      cardNumber?: string;
      transactionId?: string;
      authCode?: string;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    discounts: Array<{ type: string; amount: number; description: string }>;
    loyaltyPointsUsed?: number;
    loyaltyPointsEarned?: number;
    receiptEmail?: string;
    notes?: string;
  }): Promise<{
    transaction: PosTransaction;
    receiptId: string;
    loyaltyUpdate?: {
      pointsAdded: number;
      newBalance: number;
      tierStatus: string;
    };
    paymentResults: Array<{
      method: string;
      success: boolean;
      transactionId?: string;
      error?: string;
    }>;
  }> {
    return await apiService.post("/pos/transactions", data);
  }

  async processRefund(data: {
    originalTransactionId: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      refundAmount: number;
    }>;
    refundMethod: PaymentMethod;
    reason: string;
    managerApproval?: boolean;
  }): Promise<{
    refund: {
      id: string;
      amount: number;
      method: string;
      status: "pending" | "completed" | "failed";
    };
    loyaltyAdjustment?: {
      pointsDeducted: number;
      newBalance: number;
    };
    inventoryRestocked: boolean;
  }> {
    return await apiService.post("/pos/refunds", data);
  }

  async processExchange(data: {
    originalTransactionId: string;
    returnItems: Array<{
      productVariantId: string;
      quantity: number;
    }>;
    newItems: Array<{
      productVariantId: string;
      quantity: number;
      unitPrice: number;
    }>;
    priceDifference: number;
    paymentMethod?: PaymentMethod;
  }): Promise<{
    exchange: {
      id: string;
      priceDifference: number;
      paymentRequired: boolean;
      refundAmount?: number;
    };
    newTransaction?: PosTransaction;
  }> {
    return await apiService.post("/pos/exchanges", data);
  }

  // Receipt Management
  async getReceipt(receiptId: string): Promise<{
    id: string;
    transactionId: string;
    receiptNumber: string;
    timestamp: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    payments: Array<{
      method: string;
      amount: number;
    }>;
    customer?: {
      name: string;
      email?: string;
      loyaltyNumber?: string;
    };
    location: {
      name: string;
      address: string;
      phone: string;
    };
  }> {
    return await apiService.get(`/pos/receipts/${receiptId}`);
  }

  async emailReceipt(
    receiptId: string,
    email: string
  ): Promise<{ success: boolean }> {
    return await apiService.post(`/pos/receipts/${receiptId}/email`, { email });
  }

  async printReceipt(
    receiptId: string,
    printerId?: string
  ): Promise<{ success: boolean }> {
    return await apiService.post(`/pos/receipts/${receiptId}/print`, {
      printerId,
    });
  }

  // Inventory Integration
  async checkInventory(
    productVariantId: string,
    locationId: string
  ): Promise<{
    available: number;
    reserved: number;
    incoming: number;
    lastUpdated: string;
  }> {
    return await apiService.get(
      `/pos/inventory/${productVariantId}?locationId=${locationId}`
    );
  }

  async reserveInventory(data: {
    items: Array<{
      productVariantId: string;
      quantity: number;
    }>;
    locationId: string;
    expiresAt?: string;
  }): Promise<{
    reservationId: string;
    success: boolean;
    unavailableItems: Array<{
      productVariantId: string;
      requested: number;
      available: number;
    }>;
  }> {
    return await apiService.post("/pos/inventory/reserve", data);
  }

  async releaseInventoryReservation(
    reservationId: string
  ): Promise<{ success: boolean }> {
    return await apiService.delete(
      `/pos/inventory/reservations/${reservationId}`
    );
  }

  // Omnichannel Features
  async processOnlineOrderPickup(
    orderId: string,
    data: {
      verificationMethod: "email" | "phone" | "order_number";
      verificationValue: string;
      items?: Array<{
        orderItemId: string;
        pickupQuantity: number;
      }>;
    }
  ): Promise<{
    success: boolean;
    pickupTransaction?: PosTransaction;
    remainingItems?: Array<{
      orderItemId: string;
      productName: string;
      remainingQuantity: number;
    }>;
  }> {
    return await apiService.post(`/pos/orders/${orderId}/pickup`, data);
  }

  async processOnlineOrderReturn(
    orderId: string,
    data: {
      items: Array<{
        orderItemId: string;
        returnQuantity: number;
        condition: "new" | "used" | "damaged";
        reason: string;
      }>;
      refundMethod: PaymentMethod;
    }
  ): Promise<{
    returnId: string;
    refundAmount: number;
    restockedItems: Array<{
      productVariantId: string;
      quantity: number;
      restocked: boolean;
    }>;
  }> {
    return await apiService.post(`/pos/orders/${orderId}/return`, data);
  }

  // Analytics & Reporting
  async getSessionAnalytics(sessionId: string): Promise<{
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    itemsSold: number;
    discountsGiven: number;
    refundsProcessed: number;
    hourlyBreakdown: Array<{
      hour: number;
      sales: number;
      transactions: number;
    }>;
    topProducts: Array<{
      productName: string;
      quantitySold: number;
      revenue: number;
    }>;
    paymentMethodBreakdown: Array<{
      method: string;
      count: number;
      amount: number;
      percentage: number;
    }>;
  }> {
    return await apiService.get(`/pos/sessions/${sessionId}/analytics`);
  }

  async getDailySales(
    locationId: string,
    date: string
  ): Promise<{
    date: string;
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    sessionsCount: number;
    topEmployee: {
      name: string;
      sales: number;
      transactions: number;
    };
    hourlyTrends: Array<{
      hour: number;
      sales: number;
      transactions: number;
    }>;
  }> {
    return await apiService.get(
      `/pos/analytics/daily?locationId=${locationId}&date=${date}`
    );
  }

  // Staff Management
  async getStaffPerformance(filters: {
    locationId?: string;
    employeeId?: string;
    dateFrom: string;
    dateTo: string;
  }): Promise<
    Array<{
      employeeId: string;
      employeeName: string;
      totalSales: number;
      totalTransactions: number;
      averageTransaction: number;
      hoursWorked: number;
      salesPerHour: number;
      discountsGiven: number;
      refundsProcessed: number;
      customerSatisfaction?: number;
    }>
  > {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/pos/staff/performance?${params}`);
  }
}

export default new PosService();
