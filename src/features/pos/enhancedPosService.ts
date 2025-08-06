import { apiService } from "../../services/api";
import {
  Customer,
  Product,
  ProductVariant,
  PosSession,
  PosTransaction,
  PaymentMethod,
} from "../../types";
import posService from "./posService";

// Enhanced POS Service for Ginkgo Retail - Advanced Omnichannel Features
class EnhancedPosService {
  // Unified Omnichannel Checkout
  async processUnifiedCheckout(data: {
    locationId: string;
    employeeId: string;
    sessionId: string;
    customer?: Customer;
    items: Array<{
      productVariantId: string;
      quantity: number;
      price: number;
      source:
        | "physical_store"
        | "online_reservation"
        | "mobile_scan"
        | "curbside_pickup";
      fulfillmentMethod:
        | "immediate"
        | "ship_home"
        | "store_pickup"
        | "curbside"
        | "ship_to_store";
    }>;
    paymentMethods: Array<{
      type: PaymentMethod;
      amount: number;
      cardLast4?: string;
      authorizationCode?: string;
      giftCardNumber?: string;
      loyaltyPointsUsed?: number;
    }>;
    shippingAddress?: {
      name: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      deliveryInstructions?: string;
    };
    fulfillmentPreferences: {
      preferredDeliveryDate?: string;
      deliveryTimeWindow?: string;
      specialInstructions?: string;
      contactMethod: "sms" | "email" | "phone";
    };
    loyaltyProgram?: {
      memberId: string;
      pointsToEarn: number;
      pointsToRedeem: number;
      tierBenefitsApplied: string[];
    };
    promotions?: Array<{
      promoCode: string;
      discountType: "percentage" | "fixed" | "bogo" | "free_shipping";
      discountValue: number;
    }>;
  }): Promise<{
    transaction: PosTransaction;
    fulfillmentPlan: Array<{
      orderLineId: string;
      fulfillmentMethod: string;
      estimatedCompletion: string;
      trackingInfo?: string;
      pickupInstructions?: string;
    }>;
    loyaltyUpdate?: {
      pointsEarned: number;
      pointsRedeemed: number;
      newBalance: number;
      tierLevel: string;
      nextTierProgress: number;
    };
    receiptOptions: {
      printed: boolean;
      digital: boolean;
      emailSent: boolean;
      smsLink?: string;
    };
  }> {
    return await apiService.post("/pos/unified-checkout", data);
  }

  // Buy Online Pickup In Store (BOPIS) Management
  async processBOPISOrder(
    orderId: string,
    data: {
      verificationMethod:
        | "email"
        | "phone"
        | "order_number"
        | "qr_code"
        | "id_verification";
      verificationValue: string;
      customerPresent: boolean;
      items?: Array<{
        orderItemId: string;
        pickupQuantity: number;
        condition: "perfect" | "minor_damage" | "return_requested";
      }>;
      alternativeContact?: {
        name: string;
        relationship: string;
        idVerified: boolean;
        contactInfo: string;
      };
      substitutions?: Array<{
        originalItemId: string;
        substitutedItemId: string;
        priceAdjustment: number;
        customerApproved: boolean;
      }>;
    }
  ): Promise<{
    success: boolean;
    pickupTransaction?: PosTransaction;
    partialPickup: boolean;
    remainingItems?: Array<{
      orderItemId: string;
      productName: string;
      remainingQuantity: number;
      newEstimatedAvailability?: string;
    }>;
    refundIssued?: {
      amount: number;
      method: string;
      referenceNumber: string;
      processingTime: string;
    };
    loyaltyPointsAdjustment?: {
      pointsAdded: number;
      pointsDeducted: number;
      newBalance: number;
    };
  }> {
    return await apiService.post(`/pos/bopis/${orderId}/pickup`, data);
  }

  // Ship from Store Fulfillment
  async processShipFromStore(
    orderId: string,
    data: {
      items: Array<{
        orderItemId: string;
        quantity: number;
        locationId: string;
      }>;
      shippingMethod: "standard" | "expedited" | "overnight" | "same_day";
      packagingOptions: {
        giftWrap: boolean;
        giftMessage?: string;
        sustainablePackaging: boolean;
        signatureRequired: boolean;
      };
      employeeId: string;
    }
  ): Promise<{
    shipment: {
      shipmentId: string;
      trackingNumber: string;
      carrier: string;
      estimatedDelivery: string;
      shippingCost: number;
    };
    inventoryAdjustments: Array<{
      productVariantId: string;
      quantityReserved: number;
      quantityShipped: number;
      locationId: string;
    }>;
    packingSlip: {
      packingSlipId: string;
      printableUrl: string;
    };
    notifications: {
      customerNotified: boolean;
      trackingEmailSent: boolean;
      smsNotificationSent: boolean;
    };
  }> {
    return await apiService.post(`/pos/ship-from-store/${orderId}`, data);
  }

  // Endless Aisle - Cross-Location Inventory
  async searchEndlessAisle(query: {
    searchTerm?: string;
    categoryId?: string;
    barcode?: string;
    currentLocationId: string;
    includeOnlineInventory: boolean;
    maxDistance?: number; // miles
  }): Promise<{
    products: Array<{
      product: Product;
      variant: ProductVariant;
      availability: Array<{
        locationId: string;
        locationName: string;
        address: string;
        distance: number;
        currentStock: number;
        incomingStock: number;
        estimatedAvailability: string;
        fulfillmentOptions: Array<{
          method: "pickup" | "ship_to_customer" | "transfer_to_store";
          estimatedTime: string;
          cost: number;
        }>;
      }>;
      onlineAvailability?: {
        inStock: boolean;
        estimatedShipDate: string;
        shippingOptions: Array<{
          method: string;
          cost: number;
          estimatedDelivery: string;
        }>;
      };
    }>;
    alternativeSuggestions: Array<{
      product: Product;
      variant: ProductVariant;
      similarity: number;
      reason: string;
    }>;
  }> {
    return await apiService.post("/pos/endless-aisle/search", query);
  }

  // Advanced Customer Profile Management
  async getUnifiedCustomerProfile(customerId: string): Promise<{
    customer: Customer & {
      preferences: {
        communicationChannels: string[];
        favoriteCategories: string[];
        brandLoyalties: string[];
        seasonalPatterns: Array<{
          season: string;
          topCategories: string[];
          averageSpend: number;
        }>;
      };
      purchaseHistory: {
        totalOrders: number;
        totalSpent: number;
        averageOrderValue: number;
        lastPurchaseDate: string;
        frequentlyBoughtTogether: Array<{
          productId: string;
          productName: string;
          frequency: number;
        }>;
      };
      loyaltyProfile: {
        currentPoints: number;
        tierLevel: string;
        tierBenefits: string[];
        pointsEarnedThisYear: number;
        pointsExpiringSoon: Array<{
          points: number;
          expirationDate: string;
        }>;
        availableRewards: Array<{
          rewardId: string;
          description: string;
          pointsCost: number;
          category: string;
        }>;
      };
      recentActivity: Array<{
        type: "purchase" | "return" | "inquiry" | "loyalty_redemption";
        date: string;
        channel: "online" | "pos" | "phone" | "email";
        details: string;
        amount?: number;
      }>;
      riskFactors: {
        returnRate: number;
        fraudScore: number;
        creditRisk: "low" | "medium" | "high";
        notes: string[];
      };
    };
    recommendedActions: Array<{
      action:
        | "upsell"
        | "cross_sell"
        | "loyalty_offer"
        | "retention_offer"
        | "vip_treatment";
      description: string;
      expectedValue: number;
      priority: "high" | "medium" | "low";
    }>;
    personalizedOffers: Array<{
      offerId: string;
      offerType:
        | "discount"
        | "free_shipping"
        | "loyalty_bonus"
        | "early_access";
      description: string;
      value: number;
      validUntil: string;
      conditions: string[];
    }>;
  }> {
    return await apiService.get(`/pos/customers/${customerId}/unified-profile`);
  }

  // Advanced Return Management with AI-Powered Fraud Detection
  async processIntelligentReturn(data: {
    originalTransactionId?: string;
    orderNumber?: string;
    customerId?: string;
    items: Array<{
      productVariantId: string;
      quantity: number;
      originalPrice: number;
      condition:
        | "unopened"
        | "opened_good"
        | "opened_fair"
        | "damaged"
        | "defective";
      reason:
        | "defective"
        | "damaged"
        | "wrong_item"
        | "not_as_described"
        | "changed_mind"
        | "gift_return";
      hasReceipt: boolean;
      serialNumber?: string;
    }>;
    refundMethod:
      | "original_payment"
      | "store_credit"
      | "exchange"
      | "loyalty_points";
    customerProvidedInfo: {
      purchaseDate?: string;
      purchaseLocation?: string;
      giftReceipt: boolean;
    };
    employeeAssessment: {
      itemConditionVerified: boolean;
      packaging: "original" | "partial" | "none";
      accessories: "complete" | "partial" | "missing";
      notes: string;
    };
  }): Promise<{
    approved: boolean;
    riskAssessment: {
      fraudScore: number;
      riskLevel: "low" | "medium" | "high";
      flaggedFactors: string[];
      manualReviewRequired: boolean;
    };
    refundDetails?: {
      refundAmount: number;
      refundMethod: string;
      storeCredit?: {
        creditNumber: string;
        amount: number;
        expiresAt: string;
      };
      processingTime: string;
    };
    inventoryImpact: Array<{
      productVariantId: string;
      action: "restock" | "damage_out" | "vendor_return" | "liquidation";
      restockLocation?: string;
      qualityAssessmentRequired: boolean;
    }>;
    customerImpact: {
      loyaltyPointsAdjustment: number;
      returnHistoryUpdated: boolean;
      futureReturnLimitations?: string[];
    };
    exchangeOptions?: Array<{
      productVariantId: string;
      productName: string;
      priceDifference: number;
      availability: "in_stock" | "order_required" | "unavailable";
    }>;
  }> {
    return await apiService.post("/pos/intelligent-returns", data);
  }

  // Clienteling and Personal Shopping
  async createPersonalShoppingSession(data: {
    customerId: string;
    employeeId: string;
    sessionType: "in_store" | "virtual" | "appointment";
    preferences: {
      budget?: {
        min: number;
        max: number;
      };
      occasions: string[];
      stylePreferences: string[];
      sizeInfo: {
        clothing?: string;
        shoes?: string;
        accessories?: string;
      };
    };
    appointmentDetails?: {
      scheduledDate: string;
      duration: number;
      location: string;
      services: string[];
    };
  }): Promise<{
    sessionId: string;
    personalizedRecommendations: Array<{
      productId: string;
      productName: string;
      reason: string;
      confidence: number;
      price: number;
      availability: {
        inStore: boolean;
        online: boolean;
        canOrder: boolean;
      };
    }>;
    stylingBoard: {
      boardId: string;
      shareableLink: string;
      items: Array<{
        productId: string;
        position: number;
        notes: string;
      }>;
    };
    followUpPlan: {
      scheduledContacts: Array<{
        method: "email" | "phone" | "text";
        timing: string;
        content: string;
      }>;
      nextAppointment?: {
        suggestedDate: string;
        purpose: string;
      };
    };
  }> {
    return await apiService.post("/pos/personal-shopping", data);
  }

  // Real-time Inventory Synchronization
  async synchronizeOmnichannelInventory(locationId: string): Promise<{
    syncId: string;
    status: "completed" | "in_progress" | "failed";
    summary: {
      totalProductsProcessed: number;
      discrepanciesFound: number;
      autoResolvedDiscrepancies: number;
      manualReviewRequired: number;
    };
    discrepancies: Array<{
      productVariantId: string;
      productName: string;
      posQuantity: number;
      systemQuantity: number;
      onlineReserved: number;
      difference: number;
      suggestedAction: "auto_adjust" | "manual_review" | "physical_count";
      lastUpdateSource: "pos" | "online" | "warehouse" | "manual";
    }>;
    channelInventory: {
      totalAvailable: number;
      onlineAllocated: number;
      storeAllocated: number;
      reserved: number;
      pendingOrders: number;
    };
  }> {
    return await apiService.post(`/pos/inventory/sync/${locationId}`);
  }

  // Advanced Analytics and Business Intelligence
  async getOmnichannelAnalytics(filters: {
    locationId?: string;
    dateFrom: string;
    dateTo: string;
    includeOnlineMetrics: boolean;
    granularity: "hourly" | "daily" | "weekly" | "monthly";
  }): Promise<{
    salesPerformance: {
      totalRevenue: number;
      posRevenue: number;
      onlineRevenue: number;
      bopisRevenue: number;
      shipFromStoreRevenue: number;
      crossChannelCustomers: number;
      averageOrderValue: {
        pos: number;
        online: number;
        omnichannel: number;
      };
    };
    customerBehavior: {
      newCustomers: number;
      returningCustomers: number;
      channelPreferences: Array<{
        channel: string;
        percentage: number;
        averageOrderValue: number;
      }>;
      crossChannelJourney: Array<{
        touchpoint: string;
        conversionRate: number;
        averageValue: number;
      }>;
    };
    operationalMetrics: {
      fulfillmentPerformance: {
        bopisFulfillmentTime: number;
        shipFromStoreTime: number;
        accuracyRate: number;
        customerSatisfaction: number;
      };
      inventoryTurnover: {
        storeInventoryTurns: number;
        onlineInventoryTurns: number;
        deadStockItems: number;
        fastMovingItems: number;
      };
      staffProductivity: {
        transactionsPerEmployee: number;
        salesPerEmployee: number;
        customerServiceRating: number;
      };
    };
    trendAnalysis: Array<{
      period: string;
      metrics: {
        revenue: number;
        transactions: number;
        customers: number;
        trending: "up" | "down" | "stable";
      };
    }>;
    predictiveInsights: {
      forecastedRevenue: number;
      expectedCustomerGrowth: number;
      inventoryNeeds: Array<{
        productId: string;
        recommendedStock: number;
        confidence: number;
      }>;
      staffingRecommendations: Array<{
        date: string;
        recommendedStaff: number;
        reason: string;
      }>;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    return await apiService.get(`/pos/omnichannel-analytics?${params}`);
  }

  // Mobile POS and Clienteling
  async getMobilePosFunctionality(): Promise<{
    capabilities: {
      barcodeScan: boolean;
      paymentProcessing: boolean;
      inventoryLookup: boolean;
      customerLookup: boolean;
      linebusting: boolean;
      endlessAisle: boolean;
    };
    configuration: {
      offlineMode: boolean;
      syncInterval: number;
      maxOfflineTransactions: number;
      securitySettings: {
        pinRequired: boolean;
        biometricEnabled: boolean;
        sessionTimeout: number;
      };
    };
  }> {
    return await apiService.get("/pos/mobile/capabilities");
  }

  // Gift Card and Store Credit Management
  async processGiftCard(data: {
    action: "purchase" | "redeem" | "reload" | "check_balance";
    cardNumber?: string;
    amount?: number;
    recipientEmail?: string;
    purchaserInfo?: {
      name: string;
      email: string;
      message?: string;
    };
    redeemItems?: Array<{
      productVariantId: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<{
    success: boolean;
    giftCard?: {
      cardNumber: string;
      balance: number;
      issuedDate: string;
      expirationDate?: string;
      status: "active" | "inactive" | "expired";
    };
    transaction?: PosTransaction;
    deliveryInfo?: {
      method: "email" | "physical" | "digital";
      deliveryDate: string;
      trackingInfo?: string;
    };
  }> {
    return await apiService.post("/pos/gift-cards", data);
  }
}

const enhancedPosService = new EnhancedPosService();
export { enhancedPosService };
export default enhancedPosService;
