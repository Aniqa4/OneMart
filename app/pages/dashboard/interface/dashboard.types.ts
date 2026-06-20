export type Section = "profile" | "orders" | "security";

export const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-blue-100 text-blue-700",
  cancelled:  "bg-red-100 text-red-700",
  pending:    "bg-gray-100 text-gray-600",
};
