import apiService from "../../services/api";

// E-commerce Integration Service for Ginkgo Retail - Multi-Platform Integration
class EcommerceIntegrationService {
  // Shopify Integration
  async connectShopifyStore(data: {
    shopDomain: string;
    accessToken: string;
    webhookEndpoint?: string;
    syncSettings: {
      inventorySync: boolean;
      orderSync: boolean;
      productSync: boolean;
      customerSync: boolean;
      realTimeUpdates: boolean;
    };
  }): Promise<{
    integrationId: string;
    status: "connected" | "failed";
    shopInfo: {
      shopName: string;
      domain: string;
      primaryDomain: string;
      currency: string;
      timezone: string;
      planName: string;
    };
    syncCapabilities: {
      products: boolean;
      inventory: boolean;
      orders: boolean;
      customers: boolean;
      fulfillment: boolean;
    };
    initialSyncStatus: {
      products: number;
      inventory: number;
      orders: number;
      customers: number;
    };
  }> {
    return await apiService.post("/ecommerce/shopify/connect", data);
  }

  async syncShopifyProducts(
    integrationId: string,
    options?: {
      fullSync?: boolean;
      productIds?: string[];
      collection?: string;
      vendor?: string;
      lastSyncDate?: string;
    }
  ): Promise<{
    syncId: string;
    status: "in_progress" | "completed" | "failed";
    summary: {
      totalProducts: number;
      newProducts: number;
      updatedProducts: number;
      errors: number;
    };
    errors?: Array<{
      shopifyProductId: string;
      error: string;
      details: string;
    }>;
  }> {
    return await apiService.post(
      `/ecommerce/shopify/${integrationId}/sync-products`,
      options
    );
  }

  async syncShopifyInventory(
    integrationId: string,
    options?: {
      locationId?: string;
      productIds?: string[];
      direction: "from_shopify" | "to_shopify" | "bidirectional";
    }
  ): Promise<{
    syncId: string;
    status: "in_progress" | "completed" | "failed";
    summary: {
      totalVariants: number;
      updatedVariants: number;
      conflicts: number;
      errors: number;
    };
    conflicts?: Array<{
      productVariantId: string;
      shopifyInventory: number;
      systemInventory: number;
      resolution: "shopify_wins" | "system_wins" | "manual_review";
    }>;
  }> {
    return await apiService.post(
      `/ecommerce/shopify/${integrationId}/sync-inventory`,
      options
    );
  }

  async processShopifyOrders(
    integrationId: string,
    options?: {
      orderIds?: string[];
      status?: string[];
      createdAfter?: string;
      fulfillmentRequired?: boolean;
    }
  ): Promise<{
    processedOrders: Array<{
      shopifyOrderId: string;
      systemOrderId: string;
      status: "imported" | "updated" | "error";
      fulfillmentMethod: "ship_from_warehouse" | "ship_from_store" | "pickup";
      allocatedLocation?: string;
    }>;
    summary: {
      totalOrders: number;
      imported: number;
      updated: number;
      errors: number;
    };
  }> {
    return await apiService.post(
      `/ecommerce/shopify/${integrationId}/process-orders`,
      options
    );
  }

  // WooCommerce Integration
  async connectWooCommerceStore(data: {
    siteUrl: string;
    consumerKey: string;
    consumerSecret: string;
    webhookSecret?: string;
    syncSettings: {
      inventorySync: boolean;
      orderSync: boolean;
      productSync: boolean;
      customerSync: boolean;
      realTimeUpdates: boolean;
    };
  }): Promise<{
    integrationId: string;
    status: "connected" | "failed";
    storeInfo: {
      storeName: string;
      version: string;
      currency: string;
      timezone: string;
      baseLocation: string;
    };
    capabilities: {
      restApi: boolean;
      webhooks: boolean;
      productSync: boolean;
      orderSync: boolean;
    };
  }> {
    return await apiService.post("/ecommerce/woocommerce/connect", data);
  }

  // Amazon Marketplace Integration
  async connectAmazonMarketplace(data: {
    marketplaceId: string;
    merchantId: string;
    accessKeyId: string;
    secretKey: string;
    mwsAuthToken: string;
    region: string;
    syncSettings: {
      inventorySync: boolean;
      orderSync: boolean;
      pricingSync: boolean;
      fulfillmentByAmazon: boolean;
    };
  }): Promise<{
    integrationId: string;
    status: "connected" | "failed";
    marketplaceInfo: {
      marketplaceName: string;
      countryCode: string;
      currency: string;
      defaultLanguage: string;
    };
    sellerInfo: {
      sellerId: string;
      sellerName: string;
      marketplaceParticipations: string[];
    };
    fulfillmentCapabilities: {
      fba: boolean;
      fbm: boolean;
      multiChannelFulfillment: boolean;
    };
  }> {
    return await apiService.post("/ecommerce/amazon/connect", data);
  }

  async syncAmazonInventory(
    integrationId: string,
    options: {
      sku?: string[];
      fulfillmentNetwork?: "FBA" | "FBM" | "ALL";
      updateQuantity: boolean;
      updatePrice: boolean;
    }
  ): Promise<{
    feedId: string;
    status: "submitted" | "in_progress" | "done" | "error";
    summary: {
      totalItems: number;
      successfulUpdates: number;
      errors: number;
    };
    errors?: Array<{
      sku: string;
      errorCode: string;
      errorDescription: string;
    }>;
  }> {
    return await apiService.post(
      `/ecommerce/amazon/${integrationId}/sync-inventory`,
      options
    );
  }

  // eBay Integration
  async connectEbayStore(data: {
    userToken: string;
    devId: string;
    appId: string;
    certId: string;
    environment: "sandbox" | "production";
    syncSettings: {
      inventorySync: boolean;
      orderSync: boolean;
      listingSync: boolean;
      pricingSync: boolean;
    };
  }): Promise<{
    integrationId: string;
    status: "connected" | "failed";
    userInfo: {
      userId: string;
      userName: string;
      email: string;
      storeUrl?: string;
    };
    capabilities: {
      fixedPriceListings: boolean;
      auctionListings: boolean;
      storeCategories: boolean;
      promotions: boolean;
    };
  }> {
    return await apiService.post("/ecommerce/ebay/connect", data);
  }

  // Universal Product Listing Management
  async createUniversalListing(data: {
    productVariantId: string;
    channels: Array<{
      platform: "shopify" | "amazon" | "ebay" | "woocommerce";
      integrationId: string;
      platformSpecific: {
        // Shopify specific
        productType?: string;
        vendor?: string;
        collections?: string[];
        // Amazon specific
        browseNodes?: string[];
        searchTerms?: string[];
        bulletPoints?: string[];
        // eBay specific
        categoryId?: string;
        listingType?: "FixedPriceItem" | "Auction";
        duration?: number;
      };
    }>;
    listingDetails: {
      title: string;
      description: string;
      price: number;
      compareAtPrice?: number;
      sku: string;
      barcode?: string;
      weight?: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: "cm" | "in";
      };
      images: Array<{
        url: string;
        altText?: string;
        position: number;
      }>;
      inventory: {
        trackQuantity: boolean;
        quantity?: number;
        continueSellingOutOfStock: boolean;
      };
      seo: {
        metaTitle?: string;
        metaDescription?: string;
        handle?: string;
      };
    };
    scheduling?: {
      publishAt?: string;
      unpublishAt?: string;
      timezone: string;
    };
  }): Promise<{
    listingId: string;
    channelResults: Array<{
      platform: string;
      status: "success" | "failed" | "pending";
      platformListingId?: string;
      platformUrl?: string;
      error?: string;
    }>;
    summary: {
      totalChannels: number;
      successfulListings: number;
      failedListings: number;
      pendingListings: number;
    };
  }> {
    return await apiService.post("/ecommerce/universal-listing", data);
  }

  // Order Aggregation and Management
  async getAggregatedOrders(filters: {
    dateFrom?: string;
    dateTo?: string;
    status?: string[];
    platform?: string[];
    fulfillmentStatus?: string[];
    paymentStatus?: string[];
    customerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    orders: Array<{
      orderId: string;
      platformOrderId: string;
      platform: string;
      orderNumber: string;
      customerInfo: {
        customerId?: string;
        email: string;
        name: string;
        phone?: string;
      };
      orderDate: string;
      status: string;
      paymentStatus: string;
      fulfillmentStatus: string;
      items: Array<{
        productVariantId: string;
        sku: string;
        name: string;
        quantity: number;
        price: number;
        platformProductId?: string;
      }>;
      totals: {
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
      };
      shippingAddress: {
        name: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
      fulfillmentInfo?: {
        method: string;
        carrier?: string;
        trackingNumber?: string;
        estimatedDelivery?: string;
      };
    }>;
    pagination: {
      total: number;
      offset: number;
      limit: number;
      hasMore: boolean;
    };
    summary: {
      totalOrders: number;
      totalValue: number;
      pendingFulfillment: number;
      shippedOrders: number;
      platformBreakdown: Array<{
        platform: string;
        orderCount: number;
        revenue: number;
      }>;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    return await apiService.get(`/ecommerce/orders/aggregated?${params}`);
  }

  // Inventory Synchronization Across Platforms
  async synchronizeMultiChannelInventory(data: {
    productVariantIds?: string[];
    locationId: string;
    strategy: "master_system" | "platform_priority" | "manual_resolution";
    conflictResolution: "highest_wins" | "lowest_wins" | "manual_review";
    excludePlatforms?: string[];
  }): Promise<{
    syncId: string;
    status: "in_progress" | "completed" | "failed";
    summary: {
      totalVariants: number;
      syncedVariants: number;
      conflicts: number;
      errors: number;
    };
    platformResults: Array<{
      platform: string;
      integrationId: string;
      status: "success" | "failed" | "partial";
      syncedItems: number;
      errors: number;
    }>;
    conflicts: Array<{
      productVariantId: string;
      sku: string;
      platformInventories: Array<{
        platform: string;
        quantity: number;
        lastUpdated: string;
      }>;
      resolution: "auto_resolved" | "manual_required";
      finalQuantity?: number;
    }>;
  }> {
    return await apiService.post(
      "/ecommerce/inventory/multi-channel-sync",
      data
    );
  }

  // Pricing Management Across Channels
  async manageCrossPlatformPricing(data: {
    productVariantIds: string[];
    pricingStrategy:
      | "uniform"
      | "platform_specific"
      | "competitive"
      | "margin_based";
    rules: Array<{
      platform: string;
      adjustment: {
        type: "percentage" | "fixed" | "formula";
        value: number;
        reason: string;
      };
      minimumMargin?: number;
      maximumDiscount?: number;
    }>;
    competitivePricing?: {
      enabled: boolean;
      competitors: string[];
      updateFrequency: "hourly" | "daily" | "weekly";
      pricingPosition: "lowest" | "match" | "premium";
    };
  }): Promise<{
    pricingUpdateId: string;
    status: "pending" | "in_progress" | "completed" | "failed";
    summary: {
      totalProducts: number;
      updatedProducts: number;
      errors: number;
    };
    platformUpdates: Array<{
      platform: string;
      products: number;
      avgPriceChange: number;
      errors: Array<{
        sku: string;
        error: string;
      }>;
    }>;
    competitiveAnalysis?: Array<{
      productVariantId: string;
      currentPrice: number;
      competitorPrices: Array<{
        competitor: string;
        price: number;
      }>;
      recommendedPrice: number;
      priceChangePercentage: number;
    }>;
  }> {
    return await apiService.post("/ecommerce/pricing/cross-platform", data);
  }

  // Analytics and Performance Tracking
  async getChannelPerformanceAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    platforms?: string[];
    metrics: string[];
  }): Promise<{
    overallPerformance: {
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      conversionRate: number;
      returnRate: number;
    };
    platformComparison: Array<{
      platform: string;
      revenue: number;
      revenueGrowth: number;
      orders: number;
      orderGrowth: number;
      averageOrderValue: number;
      conversionRate: number;
      customerAcquisitionCost: number;
      customerLifetimeValue: number;
      profitMargin: number;
    }>;
    productPerformance: Array<{
      productVariantId: string;
      sku: string;
      productName: string;
      platformBreakdown: Array<{
        platform: string;
        unitsSold: number;
        revenue: number;
        averagePrice: number;
        conversionRate: number;
      }>;
      totalUnits: number;
      totalRevenue: number;
      bestPerformingPlatform: string;
    }>;
    trendAnalysis: Array<{
      date: string;
      platformMetrics: Array<{
        platform: string;
        revenue: number;
        orders: number;
        traffic: number;
      }>;
    }>;
    channelCannibalization: Array<{
      productVariantId: string;
      impact: "positive" | "negative" | "neutral";
      explanation: string;
      recommendedAction: string;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    return await apiService.get(
      `/ecommerce/analytics/channel-performance?${params}`
    );
  }

  // Integration Health Monitoring
  async getIntegrationHealth(): Promise<{
    integrations: Array<{
      integrationId: string;
      platform: string;
      status: "healthy" | "warning" | "error" | "disconnected";
      lastSync: string;
      errorCount: number;
      dataLag: number; // minutes
      apiQuotaUsage: {
        used: number;
        limit: number;
        resetTime: string;
      };
      capabilities: {
        inventory: boolean;
        orders: boolean;
        products: boolean;
        fulfillment: boolean;
      };
    }>;
    overallHealth: {
      score: number;
      status: "excellent" | "good" | "fair" | "poor";
      criticalIssues: number;
      warnings: number;
    };
    recommendations: Array<{
      priority: "high" | "medium" | "low";
      integrationId?: string;
      issue: string;
      solution: string;
      impact: string;
    }>;
  }> {
    return await apiService.get("/ecommerce/integrations/health");
  }

  // Data Migration and Bulk Operations
  async migrateEcommerceData(migration: {
    source: {
      platform: string;
      credentials: Record<string, string>;
    };
    destination: {
      platform: string;
      integrationId: string;
    };
    dataTypes: Array<"products" | "inventory" | "orders" | "customers">;
    options: {
      batchSize: number;
      dryRun: boolean;
      preserveIds: boolean;
      skipErrors: boolean;
    };
    mapping?: {
      fields: Record<string, string>;
      transformations: Array<{
        field: string;
        transformation: string;
        parameters?: Record<string, unknown>;
      }>;
    };
  }): Promise<{
    migrationId: string;
    status: "pending" | "in_progress" | "completed" | "failed";
    progress: {
      totalItems: number;
      processedItems: number;
      successfulItems: number;
      failedItems: number;
      percentage: number;
    };
    summary: {
      products: { migrated: number; errors: number };
      inventory: { migrated: number; errors: number };
      orders: { migrated: number; errors: number };
      customers: { migrated: number; errors: number };
    };
    errors?: Array<{
      itemType: string;
      sourceId: string;
      error: string;
      suggestions: string[];
    }>;
  }> {
    return await apiService.post("/ecommerce/data-migration", migration);
  }
}

const ecommerceIntegrationService = new EcommerceIntegrationService();
export { ecommerceIntegrationService };
export default ecommerceIntegrationService;
