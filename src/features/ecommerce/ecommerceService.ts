import apiService from "../../services/api";
import type {
  Product,
  Category,
  Order,
  FilterOptions,
  PaginatedResponse,
} from "../../types";

class EcommerceService {
  // Storefront Management
  async getStorefrontConfig(): Promise<{
    id: string;
    name: string;
    domain: string;
    logo: string;
    favicon: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      layout: "classic" | "modern" | "minimal";
    };
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
      ogImage: string;
    };
    features: {
      wishlist: boolean;
      reviews: boolean;
      multiCurrency: boolean;
      guestCheckout: boolean;
      socialLogin: boolean;
      liveChat: boolean;
    };
    paymentMethods: string[];
    shippingZones: Array<{
      name: string;
      countries: string[];
      methods: string[];
    }>;
    isOnline: boolean;
    maintenanceMode: boolean;
  }> {
    return await apiService.get("/ecommerce/storefront/config");
  }

  async updateStorefrontConfig(config: {
    name?: string;
    domain?: string;
    logo?: string;
    favicon?: string;
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
      layout?: "classic" | "modern" | "minimal";
    };
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      ogImage?: string;
    };
    features?: {
      wishlist?: boolean;
      reviews?: boolean;
      multiCurrency?: boolean;
      guestCheckout?: boolean;
      socialLogin?: boolean;
      liveChat?: boolean;
    };
  }): Promise<{ success: boolean }> {
    return await apiService.put("/ecommerce/storefront/config", config);
  }

  async toggleStorefront(isOnline: boolean): Promise<{ success: boolean }> {
    return await apiService.post("/ecommerce/storefront/toggle", { isOnline });
  }

  async setMaintenanceMode(
    enabled: boolean,
    message?: string
  ): Promise<{ success: boolean }> {
    return await apiService.post("/ecommerce/storefront/maintenance", {
      enabled,
      message,
    });
  }

  // Product Catalog Management
  async getStorefrontProducts(
    filters: FilterOptions & {
      featured?: boolean;
      onSale?: boolean;
      inStock?: boolean;
      categorySlug?: string;
      priceMin?: number;
      priceMax?: number;
      tags?: string[];
    }
  ): Promise<
    PaginatedResponse<
      Product & {
        seo: {
          slug: string;
          metaTitle: string;
          metaDescription: string;
        };
        visibility: "visible" | "hidden" | "catalog_only";
        featured: boolean;
        onSale: boolean;
        salePrice?: number;
        availableQuantity: number;
      }
    >
  > {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    return await apiService.get(`/ecommerce/products?${params}`);
  }

  async updateProductVisibility(
    productId: string,
    data: {
      visibility: "visible" | "hidden" | "catalog_only";
      featured?: boolean;
      onSale?: boolean;
      salePrice?: number;
      saleStartDate?: string;
      saleEndDate?: string;
    }
  ): Promise<{ success: boolean }> {
    return await apiService.put(
      `/ecommerce/products/${productId}/visibility`,
      data
    );
  }

  async updateProductSeo(
    productId: string,
    seo: {
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    }
  ): Promise<{ success: boolean }> {
    return await apiService.put(`/ecommerce/products/${productId}/seo`, seo);
  }

  // Category Management
  async getStorefrontCategories(): Promise<
    Array<
      Category & {
        seo: {
          slug: string;
          metaTitle: string;
          metaDescription: string;
        };
        visibility: "visible" | "hidden";
        productCount: number;
        featuredProducts: Product[];
      }
    >
  > {
    return await apiService.get("/ecommerce/categories");
  }

  async updateCategorySeo(
    categoryId: string,
    seo: {
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    }
  ): Promise<{ success: boolean }> {
    return await apiService.put(`/ecommerce/categories/${categoryId}/seo`, seo);
  }

  // Shopping Cart & Checkout
  async createCart(sessionId?: string): Promise<{
    cartId: string;
    sessionId: string;
    expiresAt: string;
  }> {
    return await apiService.post("/ecommerce/cart", { sessionId });
  }

  async getCart(cartId: string): Promise<{
    id: string;
    items: Array<{
      id: string;
      productId: string;
      variantId: string;
      quantity: number;
      unitPrice: number;
      total: number;
      product: {
        name: string;
        image: string;
        slug: string;
      };
      variant: {
        name: string;
        options: Array<{ name: string; value: string }>;
      };
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    discounts: Array<{
      code: string;
      type: "percentage" | "fixed";
      amount: number;
      description: string;
    }>;
    availableShippingMethods: Array<{
      id: string;
      name: string;
      cost: number;
      estimatedDays: number;
    }>;
  }> {
    return await apiService.get(`/ecommerce/cart/${cartId}`);
  }

  async addToCart(
    cartId: string,
    item: {
      productVariantId: string;
      quantity: number;
    }
  ): Promise<{
    success: boolean;
    cartItem: {
      id: string;
      quantity: number;
      unitPrice: number;
      total: number;
    };
    cartTotals: {
      subtotal: number;
      total: number;
      itemCount: number;
    };
  }> {
    return await apiService.post(`/ecommerce/cart/${cartId}/items`, item);
  }

  async updateCartItem(
    cartId: string,
    itemId: string,
    data: {
      quantity: number;
    }
  ): Promise<{
    success: boolean;
    cartTotals: {
      subtotal: number;
      total: number;
      itemCount: number;
    };
  }> {
    return await apiService.put(
      `/ecommerce/cart/${cartId}/items/${itemId}`,
      data
    );
  }

  async removeFromCart(
    cartId: string,
    itemId: string
  ): Promise<{
    success: boolean;
    cartTotals: {
      subtotal: number;
      total: number;
      itemCount: number;
    };
  }> {
    return await apiService.delete(`/ecommerce/cart/${cartId}/items/${itemId}`);
  }

  async applyDiscount(
    cartId: string,
    code: string
  ): Promise<{
    success: boolean;
    discount?: {
      code: string;
      type: "percentage" | "fixed";
      amount: number;
      description: string;
    };
    error?: string;
    cartTotals: {
      subtotal: number;
      discount: number;
      total: number;
    };
  }> {
    return await apiService.post(`/ecommerce/cart/${cartId}/discount`, {
      code,
    });
  }

  async removeDiscount(
    cartId: string,
    code: string
  ): Promise<{
    success: boolean;
    cartTotals: {
      subtotal: number;
      discount: number;
      total: number;
    };
  }> {
    return await apiService.delete(
      `/ecommerce/cart/${cartId}/discount/${code}`
    );
  }

  // Checkout Process
  async initiateCheckout(
    cartId: string,
    data: {
      customer?: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
      };
      shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
      };
      billingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
      };
      shippingMethodId: string;
      paymentMethodId: string;
      specialInstructions?: string;
    }
  ): Promise<{
    checkoutId: string;
    order: Order;
    paymentIntent?: {
      id: string;
      clientSecret: string;
      amount: number;
    };
  }> {
    return await apiService.post(`/ecommerce/checkout/${cartId}`, data);
  }

  async processPayment(
    checkoutId: string,
    paymentData: {
      paymentMethodId: string;
      paymentIntentId?: string;
      billingDetails?: {
        name: string;
        email: string;
        address: {
          line1: string;
          line2?: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
        };
      };
    }
  ): Promise<{
    success: boolean;
    order?: Order;
    paymentStatus: "succeeded" | "requires_action" | "failed";
    clientSecret?: string;
    error?: string;
  }> {
    return await apiService.post(
      `/ecommerce/checkout/${checkoutId}/payment`,
      paymentData
    );
  }

  // Wishlist Management
  async getWishlist(
    customerId?: string,
    sessionId?: string
  ): Promise<{
    id: string;
    items: Array<{
      id: string;
      productId: string;
      variantId: string;
      addedAt: string;
      product: {
        name: string;
        image: string;
        slug: string;
        price: number;
        onSale: boolean;
        salePrice?: number;
        inStock: boolean;
      };
      variant: {
        name: string;
        options: Array<{ name: string; value: string }>;
      };
    }>;
  }> {
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId);
    if (sessionId) params.append("sessionId", sessionId);

    return await apiService.get(`/ecommerce/wishlist?${params}`);
  }

  async addToWishlist(data: {
    productVariantId: string;
    customerId?: string;
    sessionId?: string;
  }): Promise<{
    success: boolean;
    wishlistItem: {
      id: string;
      addedAt: string;
    };
  }> {
    return await apiService.post("/ecommerce/wishlist", data);
  }

  async removeFromWishlist(itemId: string): Promise<{ success: boolean }> {
    return await apiService.delete(`/ecommerce/wishlist/${itemId}`);
  }

  // Product Reviews
  async getProductReviews(
    productId: string,
    filters?: {
      rating?: number;
      verified?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    reviews: Array<{
      id: string;
      rating: number;
      title: string;
      comment: string;
      customerName: string;
      verified: boolean;
      helpful: number;
      createdAt: string;
    }>;
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Array<{
        rating: number;
        count: number;
        percentage: number;
      }>;
    };
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get(
      `/ecommerce/products/${productId}/reviews?${params}`
    );
  }

  async submitReview(
    productId: string,
    review: {
      orderId: string;
      rating: number;
      title: string;
      comment: string;
    }
  ): Promise<{
    success: boolean;
    reviewId: string;
    requiresApproval: boolean;
  }> {
    return await apiService.post(
      `/ecommerce/products/${productId}/reviews`,
      review
    );
  }

  async markReviewHelpful(
    reviewId: string
  ): Promise<{ success: boolean; helpfulCount: number }> {
    return await apiService.post(`/ecommerce/reviews/${reviewId}/helpful`);
  }

  // Platform Integrations
  async syncWithShopify(data: {
    apiKey: string;
    apiSecret: string;
    shopDomain: string;
    webhookEndpoint: string;
  }): Promise<{
    success: boolean;
    syncedProducts: number;
    syncedOrders: number;
    syncedCustomers: number;
    webhooksConfigured: boolean;
  }> {
    return await apiService.post("/ecommerce/integrations/shopify/sync", data);
  }

  async syncWithWooCommerce(data: {
    siteUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }): Promise<{
    success: boolean;
    syncedProducts: number;
    syncedOrders: number;
    syncedCustomers: number;
  }> {
    return await apiService.post(
      "/ecommerce/integrations/woocommerce/sync",
      data
    );
  }

  async getIntegrationStatus(): Promise<
    Array<{
      platform: "shopify" | "woocommerce" | "amazon" | "ebay" | "etsy";
      connected: boolean;
      lastSync?: string;
      status: "active" | "error" | "paused";
      syncStats?: {
        products: number;
        orders: number;
        customers: number;
      };
      errors?: string[];
    }>
  > {
    return await apiService.get("/ecommerce/integrations/status");
  }

  // SEO & Marketing
  async generateSitemap(): Promise<{ success: boolean; sitemapUrl: string }> {
    return await apiService.post("/ecommerce/seo/sitemap/generate");
  }

  async getSeoAnalytics(): Promise<{
    totalPages: number;
    indexedPages: number;
    averagePageSpeed: number;
    mobileUsability: number;
    topKeywords: Array<{
      keyword: string;
      position: number;
      clicks: number;
      impressions: number;
    }>;
    topPages: Array<{
      page: string;
      clicks: number;
      impressions: number;
      ctr: number;
    }>;
  }> {
    return await apiService.get("/ecommerce/seo/analytics");
  }

  async createAbandonedCartCampaign(data: {
    name: string;
    delayHours: number;
    emailTemplateId: string;
    discountCode?: string;
    active: boolean;
  }): Promise<{
    campaignId: string;
    name: string;
    active: boolean;
  }> {
    return await apiService.post("/ecommerce/marketing/abandoned-cart", data);
  }

  async getAbandonedCarts(filters?: {
    dateFrom?: string;
    dateTo?: string;
    minValue?: number;
    status?: "pending" | "contacted" | "recovered" | "expired";
  }): Promise<
    Array<{
      cartId: string;
      customerEmail?: string;
      value: number;
      lastActivity: string;
      status: "pending" | "contacted" | "recovered" | "expired";
      items: Array<{
        productName: string;
        quantity: number;
        price: number;
      }>;
      recoveryEmailSent?: string;
    }>
  > {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return await apiService.get(
      `/ecommerce/marketing/abandoned-carts?${params}`
    );
  }

  // Analytics
  async getEcommerceAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
  }): Promise<{
    revenue: number;
    orders: number;
    averageOrderValue: number;
    conversionRate: number;
    cartAbandonmentRate: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      revenue: number;
      quantity: number;
      orders: number;
    }>;
    topCategories: Array<{
      categoryId: string;
      categoryName: string;
      revenue: number;
      orders: number;
    }>;
    trafficSources: Array<{
      source: string;
      sessions: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }>;
    customerMetrics: {
      newCustomers: number;
      returningCustomers: number;
      customerLifetimeValue: number;
      retentionRate: number;
    };
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });
    return await apiService.get(`/ecommerce/analytics?${params}`);
  }
}

export default new EcommerceService();
