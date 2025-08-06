// Application Configuration

export const config = {
  app: {
    name: "Ginkgo Retail",
    version: "1.0.0",
    description: "Complete Retail Management System",
    url: process.env.VITE_APP_URL || "http://localhost:5173",
  },

  api: {
    baseUrl: process.env.VITE_API_BASE_URL || "http://localhost:3001/api",
    timeout: 30000,
    version: "v1",
  },

  auth: {
    tokenKey: "ginkgo_auth_token",
    refreshTokenKey: "ginkgo_refresh_token",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },

  storage: {
    prefix: "ginkgo_",
    keys: {
      theme: "theme",
      language: "language",
      userPreferences: "user_preferences",
      cartItems: "cart_items",
    },
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    limitOptions: [10, 20, 50, 100],
  },

  currency: {
    default: "USD",
    supported: ["USD", "EUR", "GBP", "CAD", "AUD"],
    symbol: "$",
  },

  inventory: {
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    autoReorderEnabled: true,
    bufferPercentage: 20,
  },

  orders: {
    autoConfirmation: true,
    confirmationTimeout: 60 * 60 * 1000, // 1 hour
    cancelationWindow: 24 * 60 * 60 * 1000, // 24 hours
  },

  pos: {
    defaultCashFloat: 100,
    receiptPrinter: {
      enabled: true,
      paperWidth: 80, // mm
    },
    barcodeScanner: {
      enabled: true,
      continuous: false,
    },
  },

  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: true,
    sms: false,
  },

  features: {
    multiLocation: true,
    multiCurrency: true,
    barcode: true,
    analytics: true,
    loyalty: true,
    marketplace: true,
  },

  theme: {
    defaultMode: "light",
    primaryColor: "#1976d2",
    secondaryColor: "#dc004e",
  },

  map: {
    provider: "google", // google, mapbox, openstreet
    apiKey: process.env.VITE_MAP_API_KEY,
    defaultCenter: {
      lat: 40.7128,
      lng: -74.006,
    },
    defaultZoom: 12,
  },

  social: {
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID,
    },
    facebook: {
      appId: process.env.VITE_FACEBOOK_APP_ID,
    },
  },

  analytics: {
    google: {
      measurementId: process.env.VITE_GA_MEASUREMENT_ID,
    },
  },

  development: {
    enableReduxDevtools: process.env.NODE_ENV === "development",
    enableLogger: process.env.NODE_ENV === "development",
    mockApi: process.env.VITE_MOCK_API === "true",
  },
} as const;

export default config;
