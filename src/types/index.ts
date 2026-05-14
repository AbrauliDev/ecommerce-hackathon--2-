export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string | null;
  color_hex: string | null;
  size: string | null;
  stock: number;
  image_url: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  // Ofertas
  discount_price: number | null;
  discount_starts_at: string | null;
  discount_ends_at: string | null;
  is_featured_offer: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category | null;
  variants?: ProductVariant[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimated_days: string | null;
  is_active: boolean;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_method_id: string | null;
  shipping_address: ShippingAddress;
  customer_email: string;
  customer_name: string;
  created_at: string;
  items?: OrderItem[];
  shipping_method?: ShippingMethod | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  variant_id: string | null;
  variant_label: string | null;
}

// Estado del carrito (cliente)
export interface CartItem {
  product_id: string;
  variant_id: string | null;        // null si el producto no tiene variantes
  variant_label: string | null;     // snapshot "Verde Salvia · M"
  name: string;
  price: number;                    // precio final (con descuento si aplica)
  original_price: number;           // precio sin descuento (para mostrar tachado)
  has_discount: boolean;
  quantity: number;
  image_url: string | null;
  stock: number;
}
