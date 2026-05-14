import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import type { CartItem, Product, ProductVariant } from '@/types';
import { getCurrentPrice, isOfferActive } from '@/utils/pricing';

const STORAGE_KEY = 'lazy_cart_v2';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; product: Product; variant: ProductVariant | null; quantity?: number }
  | { type: 'REMOVE'; key: string }
  | { type: 'UPDATE_QTY'; key: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

/**
 * Clave única que identifica un item en el carrito:
 * - Si tiene variante: `productId:variantId`
 * - Si no: solo `productId`
 *
 * Así dos variantes diferentes del mismo producto se cuentan por separado.
 */
const itemKey = (productId: string, variantId: string | null) =>
  variantId ? `${productId}:${variantId}` : productId;

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD':
      return { items: action.items };

    case 'ADD': {
      const { product, variant, quantity = 1 } = action;
      const key = itemKey(product.id, variant?.id ?? null);

      const stock = variant ? variant.stock : product.stock;
      const finalPrice = getCurrentPrice(product);
      const hasDiscount = isOfferActive(product);

      const existing = state.items.find(
        (i) => itemKey(i.product_id, i.variant_id) === key,
      );

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stock);
        return {
          items: state.items.map((i) =>
            itemKey(i.product_id, i.variant_id) === key
              ? { ...i, quantity: newQty }
              : i,
          ),
        };
      }

      const variantLabel = variant
        ? [variant.color, variant.size].filter(Boolean).join(' · ')
        : null;

      return {
        items: [
          ...state.items,
          {
            product_id: product.id,
            variant_id: variant?.id ?? null,
            variant_label: variantLabel,
            name: product.name,
            price: finalPrice,
            original_price: product.price,
            has_discount: hasDiscount,
            quantity: Math.min(quantity, stock),
            image_url: variant?.image_url || product.image_url,
            stock,
          },
        ],
      };
    }

    case 'REMOVE':
      return {
        items: state.items.filter(
          (i) => itemKey(i.product_id, i.variant_id) !== action.key,
        ),
      };

    case 'UPDATE_QTY':
      return {
        items: state.items
          .map((i) =>
            itemKey(i.product_id, i.variant_id) === action.key
              ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock)) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };

    case 'CLEAR':
      return { items: [] };

    default:
      return state;
  }
};

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  originalSubtotal: number; // suma de original_price * qty (para mostrar ahorro)
  totalSavings: number;
  addToCart: (product: Product, variant: ProductVariant | null, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getItemKey: (productId: string, variantId: string | null) => string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        dispatch({ type: 'LOAD', items: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const originalSubtotal = state.items.reduce(
    (acc, i) => acc + i.original_price * i.quantity,
    0,
  );
  const totalSavings = Math.max(0, originalSubtotal - subtotal);

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    subtotal,
    originalSubtotal,
    totalSavings,
    addToCart: (product, variant, quantity) =>
      dispatch({ type: 'ADD', product, variant, quantity }),
    removeFromCart: (key) => dispatch({ type: 'REMOVE', key }),
    updateQuantity: (key, quantity) =>
      dispatch({ type: 'UPDATE_QTY', key, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    getItemKey: itemKey,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
