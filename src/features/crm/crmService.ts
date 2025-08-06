import apiService from "../../services/api";
import type {
  Customer,
  FilterOptions,
  PaginatedResponse,
  Order,
  Address,
  MarketingPreferences,
} from "../../types";

class CrmService {
  // Customer Management
  async getCustomers(
    filters: FilterOptions
  ): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    return await apiService.get<PaginatedResponse<Customer>>(
      `/customers?${params}`
    );
  }

  async getCustomer(id: string): Promise<Customer> {
    return await apiService.get<Customer>(`/customers/${id}`);
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    return await apiService.post<Customer>("/customers", customerData);
  }

  async updateCustomer(
    id: string,
    customerData: Partial<Customer>
  ): Promise<Customer> {
    return await apiService.put<Customer>(`/customers/${id}`, customerData);
  }

  async deleteCustomer(id: string): Promise<void> {
    return await apiService.delete<void>(`/customers/${id}`);
  }

  // Customer 360 View
  async getCustomer360(customerId: string): Promise<{
    customer: Customer;
    orders: Order[];
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: string;
    favoriteProducts: Array<{
      productId: string;
      productName: string;
      purchaseCount: number;
      lastPurchased: string;
    }>;
    preferredCategories: Array<{
      categoryId: string;
      categoryName: string;
      purchaseCount: number;
    }>;
    loyaltyStats: {
      points: number;
      tier: string;
      nextTierPoints: number;
      rewardsEarned: number;
      rewardsRedeemed: number;
    };
    riskFactors: Array<{
      type: "churn_risk" | "payment_risk" | "fraud_risk";
      score: number;
      description: string;
    }>;
  }> {
    return await apiService.get(`/customers/${customerId}/360-view`);
  }

  async getCustomerOrders(
    customerId: string,
    filters?: { limit?: number; offset?: number; status?: string }
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get(`/customers/${customerId}/orders?${params}`);
  }

  // Customer Segmentation
  async getCustomerSegments(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      criteria: Array<{
        field: string;
        operator: string;
        value: string | number;
      }>;
      customerCount: number;
      totalValue: number;
    }>
  > {
    return await apiService.get("/customers/segments");
  }

  async createCustomerSegment(segmentData: {
    name: string;
    description: string;
    criteria: Array<{
      field: string;
      operator: string;
      value: string | number;
    }>;
  }): Promise<{ id: string; customerCount: number }> {
    return await apiService.post("/customers/segments", segmentData);
  }

  async getSegmentCustomers(
    segmentId: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }
    return await apiService.get(
      `/customers/segments/${segmentId}/customers?${params}`
    );
  }

  // Loyalty Program Management
  async getLoyaltyProgram(): Promise<{
    id: string;
    name: string;
    pointsPerDollar: number;
    tiers: Array<{
      id: string;
      name: string;
      minimumPoints: number;
      benefits: string[];
      discountPercentage: number;
    }>;
    rewards: Array<{
      id: string;
      name: string;
      pointsCost: number;
      type: "discount" | "product" | "experience";
      value: number;
      description: string;
    }>;
  }> {
    return await apiService.get("/loyalty/program");
  }

  async addLoyaltyPoints(
    customerId: string,
    points: number,
    reason: string
  ): Promise<{
    newBalance: number;
    transaction: {
      id: string;
      points: number;
      type: "earned" | "redeemed" | "expired" | "adjusted";
      reason: string;
      timestamp: string;
    };
  }> {
    return await apiService.post(`/customers/${customerId}/loyalty/points`, {
      points,
      reason,
    });
  }

  async redeemLoyaltyReward(
    customerId: string,
    rewardId: string
  ): Promise<{
    success: boolean;
    newBalance: number;
    rewardCode?: string;
    expiresAt?: string;
  }> {
    return await apiService.post(`/customers/${customerId}/loyalty/redeem`, {
      rewardId,
    });
  }

  async getLoyaltyTransactions(customerId: string): Promise<
    Array<{
      id: string;
      points: number;
      type: "earned" | "redeemed" | "expired" | "adjusted";
      reason: string;
      orderId?: string;
      timestamp: string;
      balance: number;
    }>
  > {
    return await apiService.get(
      `/customers/${customerId}/loyalty/transactions`
    );
  }

  // Communication & Marketing
  async sendEmail(data: {
    customerIds?: string[];
    segmentIds?: string[];
    subject: string;
    templateId: string;
    personalizations?: Record<string, string | number | boolean>;
    scheduledAt?: string;
  }): Promise<{
    campaignId: string;
    recipientCount: number;
    scheduledAt?: string;
  }> {
    return await apiService.post("/marketing/email", data);
  }

  async sendSms(data: {
    customerIds?: string[];
    segmentIds?: string[];
    message: string;
    templateId?: string;
    personalizations?: Record<string, string | number | boolean>;
    scheduledAt?: string;
  }): Promise<{
    campaignId: string;
    recipientCount: number;
    scheduledAt?: string;
  }> {
    return await apiService.post("/marketing/sms", data);
  }

  async getCampaigns(filters?: {
    type?: "email" | "sms";
    status?: "draft" | "scheduled" | "sent" | "failed";
    dateFrom?: string;
    dateTo?: string;
  }): Promise<
    Array<{
      id: string;
      name: string;
      type: "email" | "sms";
      status: "draft" | "scheduled" | "sent" | "failed";
      recipients: number;
      openRate?: number;
      clickRate?: number;
      responseRate?: number;
      createdAt: string;
      sentAt?: string;
    }>
  > {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiService.get(`/marketing/campaigns?${params}`);
  }

  async getCampaignAnalytics(campaignId: string): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    timeline: Array<{
      timestamp: string;
      event: "sent" | "delivered" | "opened" | "clicked" | "bounced";
      count: number;
    }>;
  }> {
    return await apiService.get(`/marketing/campaigns/${campaignId}/analytics`);
  }

  // Customer Service
  async createSupportTicket(data: {
    customerId: string;
    subject: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    category: string;
    orderId?: string;
    attachments?: string[];
  }): Promise<{
    ticketId: string;
    ticketNumber: string;
  }> {
    return await apiService.post("/support/tickets", data);
  }

  async getSupportTickets(customerId: string): Promise<
    Array<{
      id: string;
      ticketNumber: string;
      subject: string;
      status: "open" | "pending" | "resolved" | "closed";
      priority: "low" | "medium" | "high" | "urgent";
      createdAt: string;
      updatedAt: string;
      assignedTo?: string;
    }>
  > {
    return await apiService.get(`/customers/${customerId}/support-tickets`);
  }

  async updateSupportTicket(
    ticketId: string,
    data: {
      status?: "open" | "pending" | "resolved" | "closed";
      priority?: "low" | "medium" | "high" | "urgent";
      assignedTo?: string;
      response?: string;
    }
  ): Promise<{ success: boolean }> {
    return await apiService.put(`/support/tickets/${ticketId}`, data);
  }

  // Personalization & Recommendations
  async getProductRecommendations(
    customerId: string,
    context?: "homepage" | "product_page" | "cart" | "email"
  ): Promise<
    Array<{
      productId: string;
      productName: string;
      price: number;
      image: string;
      score: number;
      reason: string;
    }>
  > {
    const params = context ? `?context=${context}` : "";
    return await apiService.get(
      `/customers/${customerId}/recommendations${params}`
    );
  }

  async recordCustomerInteraction(
    customerId: string,
    data: {
      type: "view" | "click" | "purchase" | "wishlist" | "review";
      productId?: string;
      categoryId?: string;
      value?: number;
      metadata?: Record<string, string | number | boolean>;
    }
  ): Promise<{ success: boolean }> {
    return await apiService.post(`/customers/${customerId}/interactions`, data);
  }

  // Customer Analytics
  async getCustomerAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    segmentId?: string;
  }): Promise<{
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    churnRate: number;
    averageLifetimeValue: number;
    averageOrderValue: number;
    customerAcquisitionCost: number;
    retentionRates: {
      thirtyDay: number;
      sixtyDay: number;
      ninetyDay: number;
      oneYear: number;
    };
    segmentBreakdown: Array<{
      segmentName: string;
      customerCount: number;
      totalValue: number;
      averageValue: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/customers/analytics?${params}`);
  }

  // Address Management
  async addCustomerAddress(
    customerId: string,
    address: Partial<Address>
  ): Promise<Address> {
    return await apiService.post<Address>(
      `/customers/${customerId}/addresses`,
      address
    );
  }

  async updateCustomerAddress(
    customerId: string,
    addressId: string,
    address: Partial<Address>
  ): Promise<Address> {
    return await apiService.put<Address>(
      `/customers/${customerId}/addresses/${addressId}`,
      address
    );
  }

  async deleteCustomerAddress(
    customerId: string,
    addressId: string
  ): Promise<void> {
    return await apiService.delete(
      `/customers/${customerId}/addresses/${addressId}`
    );
  }

  async setDefaultAddress(
    customerId: string,
    addressId: string
  ): Promise<{ success: boolean }> {
    return await apiService.post(
      `/customers/${customerId}/addresses/${addressId}/set-default`
    );
  }

  // Marketing Preferences
  async updateMarketingPreferences(
    customerId: string,
    preferences: Partial<MarketingPreferences>
  ): Promise<MarketingPreferences> {
    return await apiService.put<MarketingPreferences>(
      `/customers/${customerId}/marketing-preferences`,
      preferences
    );
  }

  // Bulk Operations
  async bulkUpdateCustomers(
    customerIds: string[],
    updates: Partial<Customer>
  ): Promise<{ updated: number; failed: number; errors: string[] }> {
    return await apiService.post("/customers/bulk-update", {
      customerIds,
      updates,
    });
  }

  async importCustomers(
    file: File
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    return await apiService.upload("/customers/import", file);
  }

  async exportCustomers(filters?: FilterOptions): Promise<void> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }
    return await apiService.download(
      `/customers/export?${params}`,
      "customers.csv"
    );
  }
}

export default new CrmService();
