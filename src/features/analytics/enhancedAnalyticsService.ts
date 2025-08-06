import apiService from "../../services/api";

// Enhanced Analytics Service for Ginkgo Retail - Business Intelligence & Reporting
class EnhancedAnalyticsService {
  // Executive Dashboard Analytics
  async getExecutiveDashboard(filters: {
    dateFrom: string;
    dateTo: string;
    locationIds?: string[];
    comparisonPeriod?: {
      dateFrom: string;
      dateTo: string;
    };
  }): Promise<{
    kpiSummary: {
      totalRevenue: number;
      revenueGrowth: number;
      totalOrders: number;
      orderGrowth: number;
      averageOrderValue: number;
      aovGrowth: number;
      customerCount: number;
      customerGrowth: number;
      grossMargin: number;
      marginGrowth: number;
    };
    channelPerformance: Array<{
      channel: "online" | "pos" | "marketplace" | "mobile";
      revenue: number;
      revenueGrowth: number;
      orders: number;
      orderGrowth: number;
      conversionRate: number;
      customerAcquisitionCost: number;
    }>;
    topMetrics: {
      topProducts: Array<{
        productId: string;
        productName: string;
        revenue: number;
        units: number;
        growth: number;
      }>;
      topCategories: Array<{
        categoryId: string;
        categoryName: string;
        revenue: number;
        growth: number;
        margin: number;
      }>;
      topLocations: Array<{
        locationId: string;
        locationName: string;
        revenue: number;
        growth: number;
        profitability: number;
      }>;
    };
    forecastData: {
      revenueProjection: Array<{
        period: string;
        projected: number;
        confidence: number;
      }>;
      inventoryNeeds: Array<{
        productId: string;
        currentStock: number;
        projectedDemand: number;
        recommendedOrder: number;
      }>;
    };
  }> {
    return await apiService.post("/analytics/executive-dashboard", filters);
  }

  // Customer Analytics
  async getCustomerAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    segmentId?: string;
    loyaltyTier?: string;
  }): Promise<{
    customerLifetimeValue: {
      average: number;
      median: number;
      distribution: Array<{
        range: string;
        count: number;
        percentage: number;
      }>;
      topCustomers: Array<{
        customerId: string;
        customerName: string;
        lifetimeValue: number;
        totalOrders: number;
        averageOrderValue: number;
      }>;
    };
    segmentAnalysis: Array<{
      segmentId: string;
      segmentName: string;
      customerCount: number;
      revenue: number;
      averageOrderValue: number;
      frequency: number;
      churnRate: number;
      profitability: number;
    }>;
    acquisitionAnalysis: {
      newCustomers: number;
      acquisitionChannels: Array<{
        channel: string;
        customers: number;
        cost: number;
        costPerAcquisition: number;
        lifetimeValue: number;
        roi: number;
      }>;
      cohortAnalysis: Array<{
        cohort: string;
        month0: number;
        month1: number;
        month3: number;
        month6: number;
        month12: number;
      }>;
    };
    retentionMetrics: {
      overallRetentionRate: number;
      churnRate: number;
      repeatPurchaseRate: number;
      timeToSecondPurchase: number;
      winbackCampaignSuccess: number;
      atRiskCustomers: Array<{
        customerId: string;
        customerName: string;
        lastPurchase: string;
        lifetimeValue: number;
        churnProbability: number;
      }>;
    };
    loyaltyProgram: {
      memberCount: number;
      memberGrowth: number;
      pointsRedeemed: number;
      pointsExpired: number;
      tierDistribution: Array<{
        tier: string;
        memberCount: number;
        averageSpend: number;
        engagementScore: number;
      }>;
      programROI: number;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/analytics/customer-analytics?${params}`);
  }

  // Inventory Analytics
  async getInventoryAnalytics(filters: {
    locationId?: string;
    categoryId?: string;
    vendorId?: string;
    dateFrom: string;
    dateTo: string;
  }): Promise<{
    inventoryPerformance: {
      totalSKUs: number;
      activeProducts: number;
      slowMovingProducts: number;
      outOfStockProducts: number;
      overstockedProducts: number;
      totalInventoryValue: number;
      inventoryTurnover: number;
      averageDaysToSell: number;
    };
    categoryAnalysis: Array<{
      categoryId: string;
      categoryName: string;
      inventoryValue: number;
      turnoverRate: number;
      grossMargin: number;
      outOfStockRate: number;
      growth: number;
    }>;
    vendorPerformance: Array<{
      vendorId: string;
      vendorName: string;
      products: number;
      inventoryValue: number;
      turnoverRate: number;
      fillRate: number;
      averageLeadTime: number;
      qualityScore: number;
    }>;
    abc_analysis: {
      classA: {
        products: number;
        inventoryValue: number;
        salesContribution: number;
      };
      classB: {
        products: number;
        inventoryValue: number;
        salesContribution: number;
      };
      classC: {
        products: number;
        inventoryValue: number;
        salesContribution: number;
      };
    };
    forecastAccuracy: {
      overallAccuracy: number;
      byCategory: Array<{
        categoryName: string;
        forecastAccuracy: number;
        bias: number;
      }>;
      byProduct: Array<{
        productId: string;
        productName: string;
        forecastAccuracy: number;
        actualVsForecast: number;
      }>;
    };
    stockoutAnalysis: {
      totalStockouts: number;
      lostSales: number;
      topStockoutProducts: Array<{
        productId: string;
        productName: string;
        stockoutDays: number;
        lostSales: number;
        impactScore: number;
      }>;
    };
    deadStockAnalysis: {
      totalDeadStock: number;
      deadStockValue: number;
      liquidationRecommendations: Array<{
        productId: string;
        productName: string;
        ageInDays: number;
        quantityOnHand: number;
        value: number;
        recommendedAction: "markdown" | "liquidation" | "return_vendor";
      }>;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/analytics/inventory-analytics?${params}`);
  }

  // Sales Performance Analytics
  async getSalesAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    employeeId?: string;
    granularity: "hourly" | "daily" | "weekly" | "monthly";
  }): Promise<{
    salesOverview: {
      totalSales: number;
      salesGrowth: number;
      totalTransactions: number;
      transactionGrowth: number;
      averageTransactionValue: number;
      conversionRate: number;
      returnsRate: number;
      grossProfit: number;
      profitMargin: number;
    };
    trendAnalysis: Array<{
      period: string;
      sales: number;
      transactions: number;
      averageValue: number;
      growth: number;
    }>;
    channelBreakdown: Array<{
      channel: "online" | "pos" | "mobile" | "phone";
      sales: number;
      percentage: number;
      growth: number;
      conversionRate: number;
      averageOrderValue: number;
    }>;
    locationPerformance: Array<{
      locationId: string;
      locationName: string;
      sales: number;
      growth: number;
      transactions: number;
      conversionRate: number;
      salesPerSquareFoot: number;
      ranking: number;
    }>;
    employeePerformance: Array<{
      employeeId: string;
      employeeName: string;
      sales: number;
      transactions: number;
      averageTransactionValue: number;
      conversionRate: number;
      customerSatisfaction: number;
      commissionEarned: number;
    }>;
    productPerformance: {
      topSellers: Array<{
        productId: string;
        productName: string;
        unitsSold: number;
        revenue: number;
        growth: number;
        margin: number;
      }>;
      fastMovers: Array<{
        productId: string;
        productName: string;
        velocityScore: number;
        stockDays: number;
        reorderSuggestion: number;
      }>;
      underperformers: Array<{
        productId: string;
        productName: string;
        unitsSold: number;
        expectedUnits: number;
        variance: number;
        recommendedAction: string;
      }>;
    };
    seasonalTrends: Array<{
      period: string;
      salesIndex: number;
      patterns: Array<{
        category: string;
        seasonality: number;
        peakPeriod: string;
      }>;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/analytics/sales-analytics?${params}`);
  }

  // Financial Analytics
  async getFinancialAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationIds?: string[];
    includeForecasting: boolean;
  }): Promise<{
    profitLoss: {
      revenue: number;
      costOfGoodsSold: number;
      grossProfit: number;
      grossMargin: number;
      operatingExpenses: {
        labor: number;
        rent: number;
        utilities: number;
        marketing: number;
        other: number;
        total: number;
      };
      operatingIncome: number;
      operatingMargin: number;
      netIncome: number;
      netMargin: number;
    };
    cashFlow: {
      operatingCashFlow: number;
      investingCashFlow: number;
      financingCashFlow: number;
      netCashFlow: number;
      cashPosition: number;
      burnRate: number;
      runwayMonths: number;
    };
    keyRatios: {
      currentRatio: number;
      quickRatio: number;
      debtToEquity: number;
      assetTurnover: number;
      returnOnAssets: number;
      returnOnEquity: number;
      inventoryTurnover: number;
      accountsReceivableTurnover: number;
    };
    budgetVariance: Array<{
      category: string;
      budgeted: number;
      actual: number;
      variance: number;
      variancePercentage: number;
      explanation: string;
    }>;
    forecasting: {
      revenueProjection: Array<{
        month: string;
        projected: number;
        confidence: number;
        scenario: "optimistic" | "realistic" | "pessimistic";
      }>;
      expenseProjection: Array<{
        category: string;
        projected: number;
        driverMetric: string;
      }>;
      profitabilityForecast: {
        projectedGrossMargin: number;
        projectedOperatingMargin: number;
        projectedNetMargin: number;
        breakEvenPoint: number;
      };
    };
    locationProfitability: Array<{
      locationId: string;
      locationName: string;
      revenue: number;
      directCosts: number;
      allocatedCosts: number;
      profit: number;
      profitMargin: number;
      roi: number;
    }>;
  }> {
    return await apiService.post("/analytics/financial-analytics", filters);
  }

  // Marketing Analytics
  async getMarketingAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    campaignId?: string;
    channel?: string;
  }): Promise<{
    campaignPerformance: Array<{
      campaignId: string;
      campaignName: string;
      channel: string;
      impressions: number;
      clicks: number;
      clickThroughRate: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
      cost: number;
      roas: number; // Return on Ad Spend
      customerAcquisitionCost: number;
    }>;
    channelAttribution: Array<{
      channel: string;
      firstTouchAttribution: number;
      lastTouchAttribution: number;
      linearAttribution: number;
      timeDecayAttribution: number;
      dataDecayAttribution: number;
    }>;
    customerJourney: Array<{
      touchpointSequence: string[];
      customerCount: number;
      conversionRate: number;
      averageValue: number;
      timeToConversion: number;
    }>;
    loyaltyProgram: {
      enrollmentRate: number;
      engagementRate: number;
      pointsRedemptionRate: number;
      memberLifetimeValue: number;
      memberRetentionRate: number;
      programROI: number;
    };
    emailMarketing: {
      sendVolume: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      unsubscribeRate: number;
      revenuePerEmail: number;
      listGrowthRate: number;
    };
    socialMedia: {
      reach: number;
      engagement: number;
      followerGrowth: number;
      mentions: number;
      sentiment: number;
      socialCommerce: number;
    };
    contentPerformance: Array<{
      contentId: string;
      contentType: string;
      views: number;
      engagement: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/analytics/marketing-analytics?${params}`);
  }

  // Operational Analytics
  async getOperationalAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    departmentId?: string;
  }): Promise<{
    fulfillmentMetrics: {
      orderFulfillmentRate: number;
      averageFulfillmentTime: number;
      onTimeDeliveryRate: number;
      perfectOrderRate: number;
      returnRate: number;
      damageRate: number;
      bopisAccuracy: number;
      shipFromStoreAccuracy: number;
    };
    staffProductivity: {
      salesPerEmployee: number;
      transactionsPerEmployee: number;
      averageTransactionTime: number;
      customerServiceRating: number;
      utilization: number;
      trainingCompletionRate: number;
      turnoverRate: number;
    };
    inventoryOperations: {
      stockAccuracy: number;
      cycleCountVariance: number;
      receivingAccuracy: number;
      pickingAccuracy: number;
      averageReceivingTime: number;
      inventoryAdjustments: number;
      shrinkageRate: number;
    };
    customerService: {
      averageResponseTime: number;
      firstCallResolution: number;
      customerSatisfactionScore: number;
      netPromoterScore: number;
      complaintResolutionTime: number;
      serviceTicketVolume: number;
    };
    systemPerformance: {
      posUptime: number;
      posTransactionSpeed: number;
      websiteUptime: number;
      pageLoadTime: number;
      checkoutAbandonmentRate: number;
      systemErrorRate: number;
    };
    complianceMetrics: {
      taxCompliance: number;
      dataPrivacyCompliance: number;
      paymentSecurityCompliance: number;
      auditReadiness: number;
      policyAdherence: number;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/analytics/operational-analytics?${params}`);
  }

  // Advanced Reporting
  async generateCustomReport(reportConfig: {
    reportName: string;
    description?: string;
    dateRange: {
      from: string;
      to: string;
    };
    filters: {
      locations?: string[];
      products?: string[];
      categories?: string[];
      customers?: string[];
      employees?: string[];
    };
    metrics: Array<{
      category:
        | "sales"
        | "inventory"
        | "customer"
        | "financial"
        | "operational";
      metric: string;
      aggregation: "sum" | "average" | "count" | "min" | "max";
      displayName?: string;
    }>;
    dimensions: Array<{
      field: string;
      displayName?: string;
      groupBy?: boolean;
    }>;
    visualization: {
      chartType: "line" | "bar" | "pie" | "table" | "heatmap" | "scatter";
      layout: "single" | "dashboard" | "comparison";
    };
    schedule?: {
      frequency: "daily" | "weekly" | "monthly";
      recipients: string[];
      format: "pdf" | "excel" | "csv";
    };
  }): Promise<{
    reportId: string;
    data: any[];
    metadata: {
      totalRecords: number;
      executionTime: number;
      generatedAt: string;
    };
    exportOptions: {
      pdfUrl?: string;
      excelUrl?: string;
      csvUrl?: string;
    };
    schedule?: {
      nextRun: string;
      status: "active" | "paused";
    };
  }> {
    return await apiService.post("/analytics/custom-report", reportConfig);
  }

  // Real-time Dashboard Data
  async getRealTimeDashboard(): Promise<{
    currentMetrics: {
      activeSessions: number;
      currentSales: number;
      onlineVisitors: number;
      cartAbandonment: number;
      inventoryAlerts: number;
      ordersPendingFulfillment: number;
    };
    hourlyTrends: Array<{
      hour: string;
      sales: number;
      transactions: number;
      visitors: number;
    }>;
    topPerformers: {
      products: Array<{
        productName: string;
        sales: number;
        units: number;
      }>;
      locations: Array<{
        locationName: string;
        sales: number;
        transactions: number;
      }>;
      employees: Array<{
        employeeName: string;
        sales: number;
        transactions: number;
      }>;
    };
    alerts: Array<{
      type: "inventory" | "sales" | "system" | "customer";
      severity: "low" | "medium" | "high" | "critical";
      message: string;
      timestamp: string;
      actionRequired: boolean;
    }>;
    goalProgress: Array<{
      metric: string;
      current: number;
      target: number;
      percentage: number;
      onTrack: boolean;
    }>;
  }> {
    return await apiService.get("/analytics/real-time-dashboard");
  }

  // Data Export and Integration
  async exportData(exportConfig: {
    dataType: "sales" | "inventory" | "customers" | "orders" | "analytics";
    format: "csv" | "excel" | "json" | "xml";
    dateRange?: {
      from: string;
      to: string;
    };
    filters?: Record<string, any>;
    includeHeaders: boolean;
    destination?: {
      type: "download" | "email" | "ftp" | "cloud_storage";
      target?: string;
    };
  }): Promise<{
    exportId: string;
    status: "pending" | "processing" | "completed" | "failed";
    downloadUrl?: string;
    fileSize?: number;
    recordCount?: number;
    estimatedTime?: number;
  }> {
    return await apiService.post("/analytics/export", exportConfig);
  }
}

const enhancedAnalyticsService = new EnhancedAnalyticsService();
export { enhancedAnalyticsService };
export default enhancedAnalyticsService;
