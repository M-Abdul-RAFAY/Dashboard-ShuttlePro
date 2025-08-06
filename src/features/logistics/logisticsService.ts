import apiService from "../../services/api";
import type { ShippingMethod, Address } from "../../types";

class LogisticsService {
  // Shipping Methods & Rates
  async getShippingMethods(filters?: {
    destinationZip?: string;
    weight?: number;
    value?: number;
    serviceType?: "standard" | "express" | "overnight";
  }): Promise<ShippingMethod[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return await apiService.get<ShippingMethod[]>(
      `/logistics/shipping-methods?${params}`
    );
  }

  async calculateShippingRates(data: {
    origin: Address;
    destination: Address;
    packages: Array<{
      weight: number;
      dimensions: { length: number; width: number; height: number };
      value: number;
    }>;
    serviceTypes?: string[];
  }): Promise<
    Array<{
      carrier: string;
      service: string;
      cost: number;
      estimatedDays: number;
      estimatedDelivery: string;
      packageType: string;
    }>
  > {
    return await apiService.post("/logistics/calculate-rates", data);
  }

  async validateAddress(address: Partial<Address>): Promise<{
    valid: boolean;
    corrected?: Address;
    suggestions?: Address[];
    errors: string[];
  }> {
    return await apiService.post("/logistics/validate-address", { address });
  }

  // Order Fulfillment
  async createShipment(data: {
    orderId: string;
    fulfillmentId: string;
    carrier: string;
    service: string;
    packages: Array<{
      weight: number;
      dimensions: { length: number; width: number; height: number };
      items: Array<{
        orderItemId: string;
        quantity: number;
      }>;
    }>;
    shipFrom: Address;
    shipTo: Address;
    insurance?: boolean;
    signatureRequired?: boolean;
    saturdayDelivery?: boolean;
  }): Promise<{
    shipmentId: string;
    trackingNumber: string;
    labelUrl: string;
    cost: number;
    estimatedDelivery: string;
  }> {
    return await apiService.post("/logistics/shipments", data);
  }

  async getShipmentTracking(trackingNumber: string): Promise<{
    trackingNumber: string;
    carrier: string;
    status:
      | "pending"
      | "in_transit"
      | "out_for_delivery"
      | "delivered"
      | "exception"
      | "returned";
    estimatedDelivery: string;
    actualDelivery?: string;
    events: Array<{
      timestamp: string;
      status: string;
      location: string;
      description: string;
    }>;
    currentLocation?: {
      city: string;
      state: string;
      country: string;
    };
  }> {
    return await apiService.get(`/logistics/tracking/${trackingNumber}`);
  }

  async updateShipmentTracking(trackingNumber: string): Promise<{
    updated: boolean;
    newStatus: string;
    events: Array<{
      timestamp: string;
      status: string;
      location: string;
      description: string;
    }>;
  }> {
    return await apiService.post(
      `/logistics/tracking/${trackingNumber}/update`
    );
  }

  // Route Optimization
  async optimizeDeliveryRoute(data: {
    startLocation: Address;
    endLocation?: Address;
    deliveries: Array<{
      orderId: string;
      address: Address;
      timeWindow?: {
        start: string;
        end: string;
      };
      priority: "low" | "medium" | "high";
      estimatedDuration: number; // minutes
    }>;
    vehicleConstraints?: {
      capacity: number;
      maxDistance: number;
      workingHours: number;
    };
  }): Promise<{
    optimizedRoute: Array<{
      orderId: string;
      sequence: number;
      estimatedArrival: string;
      estimatedDeparture: string;
      drivingTime: number;
      distance: number;
    }>;
    totalDistance: number;
    totalTime: number;
    fuel: number;
    cost: number;
  }> {
    return await apiService.post("/logistics/route-optimization", data);
  }

  async getDeliveryZones(locationId: string): Promise<
    Array<{
      id: string;
      name: string;
      zipCodes: string[];
      deliveryFee: number;
      freeDeliveryThreshold?: number;
      estimatedDays: number;
      isActive: boolean;
    }>
  > {
    return await apiService.get(
      `/logistics/delivery-zones?locationId=${locationId}`
    );
  }

  async createDeliveryZone(data: {
    locationId: string;
    name: string;
    zipCodes: string[];
    deliveryFee: number;
    freeDeliveryThreshold?: number;
    estimatedDays: number;
  }): Promise<{
    id: string;
    name: string;
    zipCodes: string[];
    deliveryFee: number;
    freeDeliveryThreshold?: number;
    estimatedDays: number;
  }> {
    return await apiService.post("/logistics/delivery-zones", data);
  }

  // Local Delivery Management
  async scheduleLocalDelivery(data: {
    orderId: string;
    deliveryDate: string;
    timeSlot: {
      start: string;
      end: string;
    };
    specialInstructions?: string;
    requiresSignature: boolean;
    contactlessDelivery: boolean;
  }): Promise<{
    deliveryId: string;
    scheduledDate: string;
    timeSlot: { start: string; end: string };
    driverId?: string;
    estimatedCost: number;
  }> {
    return await apiService.post("/logistics/local-delivery", data);
  }

  async assignDriver(
    deliveryId: string,
    driverId: string
  ): Promise<{
    success: boolean;
    driver: {
      id: string;
      name: string;
      phone: string;
      vehicle: string;
      currentLocation?: { lat: number; lng: number };
    };
  }> {
    return await apiService.post(
      `/logistics/deliveries/${deliveryId}/assign-driver`,
      { driverId }
    );
  }

  async getDriverLocation(driverId: string): Promise<{
    driverId: string;
    location: { lat: number; lng: number };
    timestamp: string;
    speed: number;
    heading: number;
    accuracy: number;
  }> {
    return await apiService.get(`/logistics/drivers/${driverId}/location`);
  }

  async updateDeliveryStatus(
    deliveryId: string,
    data: {
      status:
        | "scheduled"
        | "en_route"
        | "attempting"
        | "delivered"
        | "failed"
        | "returned";
      location?: { lat: number; lng: number };
      notes?: string;
      photo?: string;
      signature?: string;
      deliveredTo?: string;
    }
  ): Promise<{
    success: boolean;
    delivery: {
      id: string;
      status: string;
      updatedAt: string;
      proofOfDelivery?: {
        photo?: string;
        signature?: string;
        deliveredTo?: string;
      };
    };
  }> {
    return await apiService.put(
      `/logistics/deliveries/${deliveryId}/status`,
      data
    );
  }

  // Pickup Management
  async schedulePickup(data: {
    orderId: string;
    locationId: string;
    pickupDate: string;
    timeSlot: {
      start: string;
      end: string;
    };
    customerPhone: string;
    specialInstructions?: string;
  }): Promise<{
    pickupId: string;
    pickupNumber: string;
    scheduledDate: string;
    timeSlot: { start: string; end: string };
    location: {
      name: string;
      address: Address;
      phone: string;
      instructions?: string;
    };
  }> {
    return await apiService.post("/logistics/pickups", data);
  }

  async updatePickupStatus(
    pickupId: string,
    data: {
      status: "scheduled" | "ready" | "picked_up" | "no_show" | "cancelled";
      verificationMethod?: "email" | "phone" | "id";
      verificationValue?: string;
      notes?: string;
    }
  ): Promise<{
    success: boolean;
    pickup: {
      id: string;
      status: string;
      updatedAt: string;
    };
  }> {
    return await apiService.put(`/logistics/pickups/${pickupId}/status`, data);
  }

  async getPickupQueue(
    locationId: string,
    date?: string
  ): Promise<
    Array<{
      pickupId: string;
      pickupNumber: string;
      orderId: string;
      customerName: string;
      customerPhone: string;
      timeSlot: { start: string; end: string };
      status: string;
      items: Array<{
        productName: string;
        quantity: number;
      }>;
      specialInstructions?: string;
    }>
  > {
    const params = new URLSearchParams();
    params.append("locationId", locationId);
    if (date) params.append("date", date);

    return await apiService.get(`/logistics/pickup-queue?${params}`);
  }

  // Returns & Exchanges
  async createReturnShipment(data: {
    originalOrderId: string;
    returnItems: Array<{
      orderItemId: string;
      quantity: number;
      reason: string;
    }>;
    returnMethod: "pickup" | "drop_off" | "mail";
    returnAddress?: Address;
    prepaidLabel: boolean;
  }): Promise<{
    returnId: string;
    returnNumber: string;
    returnLabel?: string;
    instructions: string;
    trackingNumber?: string;
    estimatedRefund: number;
  }> {
    return await apiService.post("/logistics/returns", data);
  }

  async processReturnReceiving(
    returnId: string,
    data: {
      receivedItems: Array<{
        orderItemId: string;
        receivedQuantity: number;
        condition: "new" | "used" | "damaged";
        notes?: string;
      }>;
      totalRefundAmount: number;
      restockItems: boolean;
      photos?: string[];
    }
  ): Promise<{
    success: boolean;
    processedItems: Array<{
      orderItemId: string;
      refundAmount: number;
      restocked: boolean;
    }>;
    totalRefund: number;
  }> {
    return await apiService.post(
      `/logistics/returns/${returnId}/receive`,
      data
    );
  }

  // Analytics & Reporting
  async getShippingAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    carrier?: string;
  }): Promise<{
    totalShipments: number;
    totalCost: number;
    averageCost: number;
    onTimeDeliveryRate: number;
    damageRate: number;
    carrierPerformance: Array<{
      carrier: string;
      shipments: number;
      cost: number;
      onTimeRate: number;
      damageRate: number;
    }>;
    serviceTypeBreakdown: Array<{
      service: string;
      shipments: number;
      cost: number;
      averageDeliveryTime: number;
    }>;
    geographicBreakdown: Array<{
      region: string;
      shipments: number;
      cost: number;
      averageDeliveryTime: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/logistics/analytics/shipping?${params}`);
  }

  async getDeliveryAnalytics(filters: {
    dateFrom: string;
    dateTo: string;
    locationId?: string;
    driverId?: string;
  }): Promise<{
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageDeliveryTime: number;
    customerSatisfaction: number;
    driverPerformance: Array<{
      driverId: string;
      driverName: string;
      deliveries: number;
      successRate: number;
      averageTime: number;
      customerRating: number;
    }>;
    timeSlotEfficiency: Array<{
      timeSlot: string;
      deliveries: number;
      successRate: number;
    }>;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return await apiService.get(`/logistics/analytics/delivery?${params}`);
  }

  // Carrier Integration
  async getCarrierServices(): Promise<
    Array<{
      carrierId: string;
      carrierName: string;
      services: Array<{
        serviceId: string;
        serviceName: string;
        type: "ground" | "express" | "overnight" | "international";
        estimatedDays: number;
        features: string[];
      }>;
      isActive: boolean;
    }>
  > {
    return await apiService.get("/logistics/carriers");
  }

  async syncCarrierRates(carrierId: string): Promise<{
    success: boolean;
    updatedServices: number;
    errors: string[];
  }> {
    return await apiService.post(`/logistics/carriers/${carrierId}/sync-rates`);
  }

  // Bulk Operations
  async bulkCreateShipments(
    shipments: Array<{
      orderId: string;
      fulfillmentId: string;
      carrier: string;
      service: string;
      packageInfo: {
        weight: number;
        dimensions: { length: number; width: number; height: number };
      };
    }>
  ): Promise<{
    successful: Array<{
      orderId: string;
      shipmentId: string;
      trackingNumber: string;
      labelUrl: string;
    }>;
    failed: Array<{
      orderId: string;
      error: string;
    }>;
  }> {
    return await apiService.post("/logistics/shipments/bulk", { shipments });
  }

  async exportShippingData(filters: {
    dateFrom: string;
    dateTo: string;
    format: "csv" | "excel";
    includeTracking?: boolean;
  }): Promise<void> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });

    const filename = `shipping-data.${filters.format}`;
    return await apiService.download(`/logistics/export?${params}`, filename);
  }
}

export default new LogisticsService();
