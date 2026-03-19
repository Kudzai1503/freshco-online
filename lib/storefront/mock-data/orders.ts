import type {
  CheckoutDraft,
  CustomerProfile,
  DeliverySlot,
  FulfillmentMethod,
  Order,
  OrderTrackingEvent,
  SubstitutionPreference,
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

export const deliverySlots: ReadonlyArray<{
  value: DeliverySlot;
  label: string;
  description: string;
}> = [
  {
    value: "today-9-12",
    label: "Today · 9:00 AM to 12:00 PM",
    description: "Morning doorstep delivery for fresh essentials.",
  },
  {
    value: "today-12-3",
    label: "Today · 12:00 PM to 3:00 PM",
    description: "Midday delivery timed for lunch-hour receiving.",
  },
  {
    value: "today-4-7",
    label: "Today · 4:00 PM to 7:00 PM",
    description: "Evening slot for after-work grocery drop-off.",
  },
  {
    value: "tomorrow-9-12",
    label: "Tomorrow · 9:00 AM to 12:00 PM",
    description: "Next-day morning delivery for planned orders.",
  },
] as const;

export const substitutionOptions: ReadonlyArray<{
  value: SubstitutionPreference;
  label: string;
  description: string;
}> = [
  {
    value: "best_match",
    label: "Choose the best match",
    description: "Use a close replacement if something is unavailable.",
  },
  {
    value: "contact_me",
    label: "Contact me first",
    description: "Call or message before swapping any item.",
  },
  {
    value: "no_substitutions",
    label: "No substitutions",
    description: "Only deliver exactly what is available in the cart.",
  },
] as const;

export function getDeliverySlot(slot: DeliverySlot) {
  return deliverySlots.find((entry) => entry.value === slot) ?? deliverySlots[0];
}

export function getSubstitutionOption(preference: SubstitutionPreference) {
  return (
    substitutionOptions.find((entry) => entry.value === preference) ?? substitutionOptions[0]
  );
}

export function buildTrackingTimeline(
  createdAt: string,
  fulfillmentMethod: FulfillmentMethod,
): OrderTrackingEvent[] {
  const baseTimeline: OrderTrackingEvent[] = [
    {
      status: "placed",
      label: "Placed",
      description: "Your order has been submitted successfully.",
      timestamp: createdAt,
      completed: true,
    },
    {
      status: "confirmed",
      label: "Confirmed",
      description: "We have reviewed your basket and confirmed the order.",
      timestamp: createdAt,
      completed: false,
    },
    {
      status: "preparing",
      label: "Preparing",
      description: "FreshCo is picking your items and preparing substitutions if needed.",
      timestamp: createdAt,
      completed: false,
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
  firstName: "Kudzai",
  lastName: "Damba",
  email: "kudzai.damba@freshco.co.zw",
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
  orderNotes: "",
  paymentMethod: "card",
  fulfillmentMethod: "standard_delivery",
  deliverySlot: "today-12-3",
  substitutionPreference: "best_match",
  ageConfirmation: false,
  pickupLocation: pickupLocationLabel,
};

export const seedOrders: Order[] = [];
