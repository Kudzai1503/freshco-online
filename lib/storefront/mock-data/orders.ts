import type {
  CheckoutDraft,
  CustomerProfile,
  FulfillmentMethod,
  Order,
  OrderTrackingEvent,
} from "@/lib/storefront/types";

export const pickupLocationLabel = "FreshCo Avondale Pickup Hub";

export const fulfillmentOptions: ReadonlyArray<{
  method: FulfillmentMethod;
  label: string;
  fee: number;
  etaLabel: string;
  description: string;
}> = [
  {
    method: "standard_delivery",
    label: "Standard delivery",
    fee: 4.5,
    etaLabel: "Arrives in 2 to 4 hours",
    description: "Reliable neighborhood delivery for your daily essentials.",
  },
  {
    method: "express_delivery",
    label: "Express delivery",
    fee: 9.5,
    etaLabel: "Arrives in 45 to 90 minutes",
    description: "Priority dispatch when you need your order fast.",
  },
  {
    method: "pickup",
    label: "Pickup at store",
    fee: 0,
    etaLabel: "Ready for pickup in about 45 minutes",
    description: `Collect your order from ${pickupLocationLabel}.`,
  },
] as const;

export function getFulfillmentOption(method: FulfillmentMethod) {
  return fulfillmentOptions.find((option) => option.method === method) ?? fulfillmentOptions[0];
}

export function buildTrackingTimeline(
  createdAt: string,
  fulfillmentMethod: FulfillmentMethod,
): OrderTrackingEvent[] {
  const baseTimeline: OrderTrackingEvent[] = [
    {
      status: "confirmed",
      label: "Order confirmed",
      description: "We have received your order and started preparing it.",
      timestamp: createdAt,
      completed: true,
    },
    {
      status: "packed",
      label: "Packed",
      description: "Your items are being packed and quality checked.",
      timestamp: createdAt,
      completed: false,
    },
  ];

  if (fulfillmentMethod === "pickup") {
    return [
      ...baseTimeline,
      {
        status: "ready_for_pickup",
        label: "Ready for pickup",
        description: `Your order will be ready at ${pickupLocationLabel}.`,
        timestamp: createdAt,
        completed: false,
      },
      {
        status: "picked_up",
        label: "Picked up",
        description: "The order has been collected from the store.",
        timestamp: createdAt,
        completed: false,
      },
    ];
  }

  return [
    ...baseTimeline,
    {
      status: "out_for_delivery",
      label: "Out for delivery",
      description: "Your rider is on the way with your order.",
      timestamp: createdAt,
      completed: false,
    },
    {
      status: "delivered",
      label: "Delivered",
      description: "Your order has been delivered successfully.",
      timestamp: createdAt,
      completed: false,
    },
  ];
}

export const defaultCustomerProfile: CustomerProfile = {
  firstName: "Tariro",
  lastName: "Moyo",
  email: "tariro@freshco.demo",
  phone: "+263 77 123 4567",
  preferredDepartment: "fruits",
};

export const defaultCheckoutDraft: CheckoutDraft = {
  email: defaultCustomerProfile.email,
  firstName: defaultCustomerProfile.firstName,
  lastName: defaultCustomerProfile.lastName,
  phone: defaultCustomerProfile.phone,
  addressLine1: "12 Baines Avenue",
  addressLine2: "Apartment 4B",
  city: "Harare",
  deliveryNotes: "Call on arrival. Leave at reception if needed.",
  paymentMethod: "card",
  fulfillmentMethod: "standard_delivery",
  pickupLocation: pickupLocationLabel,
};

export const seedOrders: Order[] = [];
