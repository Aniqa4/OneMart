export type DeliveryLocation = "inside" | "outside" | "";

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  deliveryLocation: DeliveryLocation;
}

export const DELIVERY_OPTIONS = [
  { value: "inside" as const, label: "Inside Dhaka", charge: 70 },
  { value: "outside" as const, label: "Outside Dhaka", charge: 120 },
];
