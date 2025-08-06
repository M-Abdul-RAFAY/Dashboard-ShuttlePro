// Core Types for Ginkgo Retail Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = "admin",
  STORE_MANAGER = "store_manager",
  SALES_ASSOCIATE = "sales_associate",
  WAREHOUSE_STAFF = "warehouse_staff",
  CUSTOMER_SERVICE = "customer_service",
  ACCOUNTANT = "accountant",
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  action: string;
}

// Product & Inventory Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: Category;
  brand?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  barcode?: string;
  cost: number;
  price: number;
  weight?: number;
  dimensions?: Dimensions;
  tags: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: VariantOption[];
  price: number;
  cost: number;
  barcode?: string;
  inventory: InventoryLevel[];
  image?: string;
  status: ProductStatus;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  image?: string;
  isActive: boolean;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock",
}

// Inventory Types
export interface InventoryLevel {
  id: string;
  productVariantId: string;
  locationId: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  maxStock: number;
  lastUpdated: string;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: Address;
  isActive: boolean;
  timezone: string;
  settings: LocationSettings;
}

export enum LocationType {
  WAREHOUSE = "warehouse",
  STORE = "store",
  DISTRIBUTION_CENTER = "distribution_center",
}

export interface LocationSettings {
  allowNegativeStock: boolean;
  autoReorder: boolean;
  bufferPercentage: number;
}

export interface StockTransfer {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  items: StockTransferItem[];
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface StockTransferItem {
  productVariantId: string;
  requestedQuantity: number;
  transferredQuantity?: number;
  reason?: string;
}

export enum TransferStatus {
  PENDING = "pending",
  APPROVED = "approved",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer: Customer;
  items: OrderItem[];
  shipping: ShippingDetails;
  billing: BillingDetails;
  payment: PaymentDetails;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  channel: OrderChannel;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  currency: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  fulfillments: Fulfillment[];
}

export interface OrderItem {
  id: string;
  productVariantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  fulfillmentLocationId?: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  REFUNDED = "refunded",
}

export enum FulfillmentStatus {
  UNFULFILLED = "unfulfilled",
  PARTIAL = "partial",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
}

export enum OrderChannel {
  ONLINE = "online",
  POS = "pos",
  PHONE = "phone",
  MARKETPLACE = "marketplace",
}

export interface Fulfillment {
  id: string;
  orderId: string;
  locationId: string;
  items: FulfillmentItem[];
  trackingNumber?: string;
  carrier?: string;
  status: FulfillmentStatus;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface FulfillmentItem {
  orderItemId: string;
  quantity: number;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: Address[];
  defaultAddressId?: string;
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  lifetimeValue: number;
  loyaltyPoints: number;
  tier: CustomerTier;
  tags: string[];
  notes?: string;
  marketing: MarketingPreferences;
  createdAt: string;
  lastOrderAt?: string;
  status: CustomerStatus;
}

export interface Address {
  id: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export enum AddressType {
  SHIPPING = "shipping",
  BILLING = "billing",
  BOTH = "both",
}

export enum CustomerTier {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
  VIP = "vip",
}

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export interface MarketingPreferences {
  emailMarketing: boolean;
  smsMarketing: boolean;
  pushNotifications: boolean;
  postalMail: boolean;
}

// Payment Types
export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  processedAt?: string;
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  DIGITAL_WALLET = "digital_wallet",
  COD = "cod",
  STORE_CREDIT = "store_credit",
}

export enum PaymentStatus {
  PENDING = "pending",
  AUTHORIZED = "authorized",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// Shipping Types
export interface ShippingDetails {
  method: ShippingMethod;
  cost: number;
  estimatedDelivery?: string;
  address: Address;
  trackingNumber?: string;
  carrier?: string;
}

export interface BillingDetails {
  address: Address;
  vatNumber?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  carrier: string;
  isActive: boolean;
}

// Analytics Types
export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  inventoryValue: number;
  lowStockItems: number;
  topSellingProducts: TopProduct[];
  recentOrders: Order[];
  conversionRate: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
}

export interface TopProduct {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  revenue: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface InventoryAlert {
  id: string;
  type: AlertType;
  productVariant: ProductVariant;
  location: Location;
  currentStock: number;
  threshold: number;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export enum AlertType {
  LOW_STOCK = "low_stock",
  OUT_OF_STOCK = "out_of_stock",
  OVERSTOCK = "overstock",
  REORDER_POINT = "reorder_point",
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface FilterOptions {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// POS Types
export interface PosSession {
  id: string;
  locationId: string;
  userId: string;
  cashFloat: number;
  startedAt: string;
  endedAt?: string;
  status: PosSessionStatus;
  transactions: PosTransaction[];
  totalSales: number;
  totalCash: number;
  totalCard: number;
  expectedCash: number;
  actualCash?: number;
  cashDifference?: number;
}

export enum PosSessionStatus {
  ACTIVE = "active",
  CLOSED = "closed",
  SUSPENDED = "suspended",
}

export interface PosTransaction {
  id: string;
  sessionId: string;
  orderId?: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  customer?: Customer;
  createdAt: string;
  refundedAmount?: number;
  isRefunded: boolean;
}

export enum TransactionType {
  SALE = "sale",
  RETURN = "return",
  EXCHANGE = "exchange",
  CASH_OUT = "cash_out",
  CASH_IN = "cash_in",
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export enum NotificationType {
  ORDER_RECEIVED = "order_received",
  LOW_STOCK = "low_stock",
  PAYMENT_FAILED = "payment_failed",
  RETURN_REQUEST = "return_request",
  SYSTEM_ALERT = "system_alert",
}
