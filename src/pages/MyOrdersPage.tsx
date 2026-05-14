import { useOrders } from '@/hooks/useOrders';
import { PageSpinner, EmptyState, Badge } from '@/components/ui/Feedback';
import { formatPrice, formatDate, statusBadge } from '@/utils/format';
import { Package } from 'lucide-react';

export const MyOrdersPage = () => {
  const { orders, loading } = useOrders();

  if (loading) return <PageSpinner />;
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<Package size={48} strokeWidth={1.5} />}
          title="Aún no tienes pedidos"
          description="Cuando hagas tu primera compra aparecerá aquí."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-bark-700 sm:text-4xl">Mis pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const badge = statusBadge(order.status);
          return (
            <div key={order.id} className="rounded-2xl border border-sage-100 bg-cream-50 p-6 transition hover:border-sage-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-bark-400">Pedido</p>
                  <p className="font-mono text-sm font-medium text-bark-700">#{order.id.slice(0, 8)}</p>
                  <p className="mt-1 text-xs text-bark-400">{formatDate(order.created_at)}</p>
                </div>
                <Badge className={badge.classes}>{badge.label}</Badge>
              </div>

              {order.items && order.items.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm text-bark-600">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>
                        {it.quantity} × {it.product_name}
                        {it.variant_label && (
                          <span className="text-bark-400"> ({it.variant_label})</span>
                        )}
                      </span>
                      <span className="font-medium">{formatPrice(it.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex justify-between border-t border-sage-100 pt-4">
                <span className="text-sm text-bark-400">Total</span>
                <span className="font-display text-xl font-bold text-sage-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
