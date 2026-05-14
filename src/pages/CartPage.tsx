import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Feedback';
import { formatPrice } from '@/utils/format';

export const CartPage = () => {
  const { items, subtotal, totalSavings } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBag size={48} strokeWidth={1.5} />}
          title="Tu carrito está dormido"
          description="Añade productos para empezar tu compra."
          action={
            <Link to="/productos">
              <Button variant="clay">Ver productos</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-bark-700 sm:text-4xl">Tu carrito</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-sage-100 bg-cream-50 p-4 sm:p-6">
            {items.map((item) => (
              <CartItem key={`${item.product_id}:${item.variant_id ?? 'novariant'}`} item={item} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {totalSavings > 0 && (
            <div className="rounded-2xl border-2 border-clay-200 bg-clay-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-clay-700">
                <Sparkles size={14} /> ESTÁS AHORRANDO
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-clay-700">
                {formatPrice(totalSavings)}
              </p>
              <p className="text-xs text-clay-600">Gracias a las Ofertas Lazy aplicadas</p>
            </div>
          )}
          <CartSummary subtotal={subtotal} showTotal={false} />
          <Button fullWidth size="lg" variant="clay" onClick={() => navigate('/checkout')}>
            Ir al checkout
          </Button>
          <Link to="/productos" className="block text-center text-sm text-bark-400 hover:text-sage-700 transition">
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};
