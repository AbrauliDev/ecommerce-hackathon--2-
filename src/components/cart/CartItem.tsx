import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart, getItemKey } = useCart();
  const key = getItemKey(item.product_id, item.variant_id);

  return (
    <div className="flex gap-4 border-b border-sage-100 py-5 last:border-b-0">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100">
        {item.image_url && (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-bark-700">{item.name}</h3>
            {item.variant_label && (
              <p className="text-xs text-bark-400 mt-0.5">{item.variant_label}</p>
            )}
          </div>
          <button
            onClick={() => removeFromCart(key)}
            className="rounded-lg p-1 text-bark-400 hover:bg-red-50 hover:text-red-700 transition"
            aria-label="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-1 flex items-baseline gap-2 text-sm">
          <span className="text-bark-400">{formatPrice(item.price)} c/u</span>
          {item.has_discount && (
            <span className="text-xs text-bark-400/60 line-through">
              {formatPrice(item.original_price)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-sage-200 bg-cream-50">
            <button
              onClick={() => updateQuantity(key, item.quantity - 1)}
              className="rounded-l-full px-2.5 py-1.5 text-bark-600 hover:bg-sage-100 disabled:opacity-40 transition"
              disabled={item.quantity <= 1}
              aria-label="Disminuir"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-medium text-bark-700">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(key, item.quantity + 1)}
              className="rounded-r-full px-2.5 py-1.5 text-bark-600 hover:bg-sage-100 disabled:opacity-40 transition"
              disabled={item.quantity >= item.stock}
              aria-label="Aumentar"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="font-display text-lg font-semibold text-bark-700">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};
