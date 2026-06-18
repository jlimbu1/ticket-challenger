export interface Product {
  id: string;
  name: string;
  artist: string;
  album: string;
  description: string;
  price: number;
  imageUrl: string;
  category: "vinyl" | "apparel" | "accessory" | "collectible";
  tags: string[];
  inStock: boolean;
  releaseYear?: number;
  label?: string;
  tracklist?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  shippingInfo: ShippingInfo;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone?: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export type ThemeVariant = "primary" | "secondary" | "danger";

export type SizeVariant = "sm" | "md" | "lg";

export interface GothicComponentProps {
  className?: string;
  children?: React.ReactNode;
}