import apiService from "../../services/api";
import type {
  Customer,
  FilterOptions,
  PaginatedResponse,
  Order,
  Address,
} from "../../types";

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: Array<{
    field: string;
    operator: "equals" | "greater_than" | "less_than" | "contains" | "in_range";
    value: string | number | Array<string | number>;
  }>;
  customerCount: number;
  estimatedValue: number;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  type: "points" | "tiers" | "cashback" | "hybrid";
  rules: {
    pointsPerDollar: number;
    tierThresholds: Array<{
      tier: string;
      minimumSpend: number;
      benefits: string[];
    }>;
    redemptionRules: Array<{
      pointsRequired: number;
      rewardValue: number;
      rewardType: "discount" | "product" | "shipping";
    }>;
  };
  isActive: boolean;
}

interface PersonalizationProfile {
  customerId: string;
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    communicationChannels: Array<"email" | "sms" | "push" | "mail">;
  };
  behaviorData: {
    averageOrderValue: number;
    purchaseFrequency: number;
    preferredPaymentMethod: string;
    seasonalTrends: Array<{
      season: string;
      categoryPreference: string;
      spendingIncrease: number;
    }>;
  };
  recommendations: Array<{
    productId: string;
    confidence: number;
    reason: string;
  }>;
}

class EnhancedCRMService {
  // Basic Customer Management
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

  // 360-degree Customer View
  async getComprehensiveCustomerProfile(customerId: string): Promise<{
    customer: Customer;
    purchaseHistory: {
      orders: Order[];
      totalSpent: number;
      averageOrderValue: number;
      orderFrequency: number;
      lastPurchase: string;
      favoriteProducts: Array<{
        productId: string;
        productName: string;
        purchaseCount: number;
        totalSpent: number;
      }>;
    };
    engagementData: {
      emailOpens: number;
      emailClicks: number;
      websiteVisits: number;
      supportTickets: number;
      reviewsSubmitted: number;
      socialMediaInteractions: number;
    };
    loyaltyData: {
      currentPoints: number;
      tierLevel: string;
      pointsEarned: number;
      pointsRedeemed: number;
      nextTierRequirement: number;
    };
    riskAssessment: {
      churnProbability: number;
      lifetimeValue: number;
      fraudRiskScore: number;
      creditRating?: string;
    };
    preferences: PersonalizationProfile;
  }> {
    return await apiService.get(
      `/customers/${customerId}/comprehensive-profile`
    );
  }

  // Advanced Customer Segmentation
  async createCustomerSegment(
    segmentData: Omit<
      CustomerSegment,
      "id" | "customerCount" | "estimatedValue"
    >
  ): Promise<CustomerSegment> {
    return await apiService.post<CustomerSegment>(
      "/customers/segments",
      segmentData
    );
  }

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return await apiService.get<CustomerSegment[]>("/customers/segments");
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
    return await apiService.get<PaginatedResponse<Customer>>(
      `/customers/segments/${segmentId}/customers?${params}`
    );
  }

  async updateSegmentCriteria(
    segmentId: string,
    criteria: CustomerSegment["criteria"]
  ): Promise<CustomerSegment> {
    return await apiService.put<CustomerSegment>(
      `/customers/segments/${segmentId}`,
      { criteria }
    );
  }

  // Communication Tools
  async sendBulkEmail(data: {
    segmentIds?: string[];
    customerIds?: string[];
    subject: string;
    content: string;
    templateId?: string;
    personalization?: Record<string, string>;
    scheduledSendTime?: string;
  }): Promise<{
    campaignId: string;
    recipientCount: number;
    estimatedDeliveryTime: string;
    previewUrl: string;
  }> {
    return await apiService.post("/customers/communications/email", data);
  }

  async sendSMSCampaign(data: {
    segmentIds?: string[];
    customerIds?: string[];
    message: string;
    includedShortUrl?: string;
    scheduledSendTime?: string;
  }): Promise<{
    campaignId: string;
    recipientCount: number;
    estimatedCost: number;
    characterCount: number;
  }> {
    return await apiService.post("/customers/communications/sms", data);
  }

  async createAutomatedCampaign(data: {
    name: string;
    trigger:
      | "welcome"
      | "abandoned_cart"
      | "post_purchase"
      | "birthday"
      | "anniversary"
      | "win_back";
    segmentIds: string[];
    messageSequence: Array<{
      delayDays: number;
      channel: "email" | "sms" | "push";
      subject?: string;
      content: string;
      templateId?: string;
    }>;
    isActive: boolean;
  }): Promise<{
    automationId: string;
    estimatedReach: number;
    projectedRevenue: number;
  }> {
    return await apiService.post("/customers/communications/automation", data);
  }

  // Loyalty Program Management
  async createLoyaltyProgram(
    programData: Omit<LoyaltyProgram, "id">
  ): Promise<LoyaltyProgram> {
    return await apiService.post<LoyaltyProgram>(
      "/customers/loyalty/programs",
      programData
    );
  }

  async getLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    return await apiService.get<LoyaltyProgram[]>(
      "/customers/loyalty/programs"
    );
  }

  async enrollCustomerInLoyalty(
    customerId: string,
    programId: string
  ): Promise<{
    success: boolean;
    currentPoints: number;
    tierLevel: string;
    welcomeBonus: number;
  }> {
    return await apiService.post(`/customers/${customerId}/loyalty/enroll`, {
      programId,
    });
  }

  async processLoyaltyTransaction(data: {
    customerId: string;
    transactionType: "earn" | "redeem" | "adjust";
    points: number;
    orderId?: string;
    reason: string;
    expirationDate?: string;
  }): Promise<{
    success: boolean;
    newBalance: number;
    tierLevel: string;
    nextTierProgress: number;
  }> {
    return await apiService.post("/customers/loyalty/transaction", data);
  }

  async getLoyaltyHistory(
    customerId: string,
    filters?: {
      dateFrom?: string;
      dateTo?: string;
      transactionType?: "earn" | "redeem" | "adjust";
    }
  ): Promise<
    Array<{
      id: string;
      type: "earn" | "redeem" | "adjust";
      points: number;
      balance: number;
      orderId?: string;
      reason: string;
      createdAt: string;
      expiresAt?: string;
    }>
  > {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiService.get(
      `/customers/${customerId}/loyalty/history?${params}`
    );
  }

  // Customer Service Integration
  async createSupportTicket(data: {
    customerId: string;
    subject: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    category: "order" | "product" | "account" | "technical" | "billing";
    orderId?: string;
    attachments?: string[];
  }): Promise<{
    ticketId: string;
    ticketNumber: string;
    estimatedResolutionTime: number;
    assignedAgent?: string;
  }> {
    return await apiService.post("/customers/support/tickets", data);
  }

  async updateSupportTicket(
    ticketId: string,
    data: {
      status?:
        | "open"
        | "in_progress"
        | "waiting_customer"
        | "resolved"
        | "closed";
      priority?: "low" | "medium" | "high" | "urgent";
      assignedAgent?: string;
      response?: string;
      internalNotes?: string;
    }
  ): Promise<{
    success: boolean;
    ticket: {
      id: string;
      status: string;
      updatedAt: string;
    };
    notificationSent: boolean;
  }> {
    return await apiService.put(`/customers/support/tickets/${ticketId}`, data);
  }

  async getCustomerSupportHistory(customerId: string): Promise<
    Array<{
      ticketId: string;
      ticketNumber: string;
      subject: string;
      status: string;
      priority: string;
      createdAt: string;
      resolvedAt?: string;
      resolutionTime?: number;
      satisfactionRating?: number;
    }>
  > {
    return await apiService.get(`/customers/${customerId}/support/history`);
  }

  // Personalization Engine
  async generateProductRecommendations(
    customerId: string,
    options?: {
      category?: string;
      maxResults?: number;
      includeCrossSell?: boolean;
      includeUpsell?: boolean;
    }
  ): Promise<{
    recommendations: Array<{
      productId: string;
      productName: string;
      confidence: number;
      reason:
        | "frequently_bought"
        | "similar_customers"
        | "browsing_history"
        | "seasonal";
      price: number;
      discountAvailable?: number;
    }>;
    crossSellOpportunities: Array<{
      productId: string;
      productName: string;
      bundleDiscount: number;
      reason: string;
    }>;
    personalizedOffers: Array<{
      offerId: string;
      type: "discount" | "free_shipping" | "bundle" | "loyalty_bonus";
      value: number;
      expiresAt: string;
      conditions: string[];
    }>;
  }> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get(
      `/customers/${customerId}/recommendations?${params}`
    );
  }

  async updateCustomerPreferences(
    customerId: string,
    preferences: {
      categories?: string[];
      brands?: string[];
      priceRange?: { min: number; max: number };
      communicationPreferences?: {
        email: boolean;
        sms: boolean;
        push: boolean;
        mail: boolean;
      };
      privacySettings?: {
        allowPersonalization: boolean;
        allowThirdPartySharing: boolean;
        allowMarketingCommunications: boolean;
      };
    }
  ): Promise<{
    success: boolean;
    updatedPreferences: PersonalizationProfile;
  }> {
    return await apiService.put(
      `/customers/${customerId}/preferences`,
      preferences
    );
  }

  // Customer Analytics
  async getCustomerInsights(filters: {
    dateFrom: string;
    dateTo: string;
    segmentId?: string;
    tierLevel?: string;
  }): Promise<{
    customerMetrics: {
      totalCustomers: number;
      newCustomers: number;
      returningCustomers: number;
      churnRate: number;
      averageLifetimeValue: number;
      averageOrderValue: number;
    };
    segmentPerformance: Array<{
      segmentId: string;
      segmentName: string;
      customerCount: number;
      totalRevenue: number;
      averageOrderValue: number;
      conversionRate: number;
    }>;
    loyaltyMetrics: {
      totalMembers: number;
      pointsIssued: number;
      pointsRedeemed: number;
      redemptionRate: number;
      averagePointsPerCustomer: number;
    };
    communicationMetrics: {
      emailOpensRate: number;
      emailClickRate: number;
      smsDeliveryRate: number;
      smsResponseRate: number;
      campaignROI: number;
    };
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      totalSpent: number;
      orderCount: number;
      lastPurchase: string;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/customers/insights?${params}`);
  }

  async generateCustomerReport(
    reportType: "segmentation" | "loyalty" | "communication" | "lifetime_value",
    data: {
      dateFrom: string;
      dateTo: string;
      segmentIds?: string[];
      format: "pdf" | "excel" | "csv";
      includeDetails: boolean;
    }
  ): Promise<{
    reportId: string;
    downloadUrl: string;
    generatedAt: string;
    recordCount: number;
  }> {
    return await apiService.post(`/customers/reports/${reportType}`, data);
  }

  // Customer Retention and Win-back
  async identifyChurnRisk(options?: {
    riskThreshold?: number;
    daysSinceLastPurchase?: number;
    minimumOrderCount?: number;
  }): Promise<{
    atRiskCustomers: Array<{
      customerId: string;
      customerName: string;
      churnProbability: number;
      daysSinceLastPurchase: number;
      lifetimeValue: number;
      recommendedActions: Array<{
        action: "send_offer" | "personal_outreach" | "loyalty_bonus" | "survey";
        priority: number;
        expectedImpact: number;
      }>;
    }>;
    retentionCampaignSuggestions: Array<{
      campaignType:
        | "discount_offer"
        | "exclusive_access"
        | "loyalty_reward"
        | "personal_consultation";
      targetCustomerCount: number;
      estimatedCost: number;
      projectedRevenue: number;
      roi: number;
    }>;
  }> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get(`/customers/churn-analysis?${params}`);
  }

  async executeWinBackCampaign(data: {
    customerId: string;
    campaignType:
      | "discount_offer"
      | "exclusive_access"
      | "loyalty_reward"
      | "personal_consultation";
    offerDetails: {
      discountPercentage?: number;
      freeShipping?: boolean;
      loyaltyPoints?: number;
      exclusiveProductIds?: string[];
    };
    personalMessage?: string;
    expirationDays: number;
  }): Promise<{
    campaignId: string;
    offerCode?: string;
    expiresAt: string;
    trackingUrl: string;
    estimatedValue: number;
  }> {
    return await apiService.post("/customers/win-back-campaign", data);
  }

  // Integration with External Systems
  async syncWithEmailMarketingPlatform(data: {
    platform:
      | "mailchimp"
      | "constant_contact"
      | "sendgrid"
      | "campaign_monitor";
    apiKey: string;
    syncSettings: {
      autoSyncNewCustomers: boolean;
      syncPurchaseHistory: boolean;
      syncSegments: boolean;
      bidirectionalSync: boolean;
    };
  }): Promise<{
    success: boolean;
    integrationId: string;
    customersSynced: number;
    segmentsSynced: number;
  }> {
    return await apiService.post(
      "/customers/integrations/email-marketing",
      data
    );
  }

  async exportCustomerData(data: {
    segmentIds?: string[];
    customerIds?: string[];
    fields: string[];
    format: "csv" | "excel" | "json";
    includeOrderHistory: boolean;
    includePII: boolean;
  }): Promise<{
    exportId: string;
    downloadUrl: string;
    recordCount: number;
    estimatedFileSize: string;
  }> {
    return await apiService.post("/customers/export", data);
  }
}

const enhancedCRMService = new EnhancedCRMService();
export default enhancedCRMService;
