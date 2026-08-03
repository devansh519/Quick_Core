// Global cross-cutting types. Feature-specific types live in features/*/types.

export type Role = "customer" | "admin" | "warehouse" | "delivery" | "ai_operator";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

// Order/inventory/delivery status unions — shared across placeholder data
// and future real API responses (kept intentionally narrow to match the
// domain colors defined in the Design System).
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type InventoryStatus = "healthy" | "low" | "critical" | "overstock";

export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "en_route"
  | "delivered"
  | "failed";
