import type { Role } from "@/types";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  MapPin,
  Bell,
  User,
  LayoutDashboard,
  Boxes,
  Warehouse,
  Truck,
  ReceiptText,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  ClipboardList,
  ArrowLeftRight,
  History,
  TrendingUp,
  Gauge,
  ShieldAlert,
  Timer,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const CUSTOMER_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Profile", href: "/profile", icon: User },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Brands", href: "/brands", icon: Boxes },
  { label: "Warehouses", href: "/warehouses", icon: Warehouse },
  { label: "Inventory", href: "/inventory", icon: ClipboardList },
  { label: "Orders", href: "/orders", icon: ReceiptText },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Drivers", href: "/drivers", icon: Truck },
  { label: "Deliveries", href: "/deliveries", icon: MapPin },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const WAREHOUSE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: ClipboardList },
  { label: "Restocking", href: "/restocking", icon: Boxes },
  { label: "Transfers", href: "/transfers", icon: ArrowLeftRight },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const DELIVERY_NAV: NavItem[] = [
  { label: "Deliveries", href: "/dashboard", icon: Truck },
  { label: "History", href: "/history", icon: History },
];

export const AI_NAV: NavItem[] = [
  { label: "AI Dashboard", href: "/insights", icon: Sparkles },
  { label: "Demand Forecast", href: "/demand-forecast", icon: TrendingUp },
  { label: "ETA Prediction", href: "/eta-prediction", icon: Timer },
  { label: "Inventory Health", href: "/inventory-health", icon: Gauge },
  { label: "Fraud Detection", href: "/fraud-detection", icon: ShieldAlert },
  { label: "Recommendations", href: "/recommendations", icon: ClipboardList },
];

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  customer: CUSTOMER_NAV,
  admin: ADMIN_NAV,
  warehouse: WAREHOUSE_NAV,
  delivery: DELIVERY_NAV,
  ai_operator: AI_NAV,
};
