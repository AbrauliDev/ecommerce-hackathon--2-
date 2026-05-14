import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageSpinner } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { Leaf } from '@/components/ui/Leaf';
import { formatPrice, formatDate } from '@/utils/format';
import type { Order } from '@/types';

export const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('orders')
      .select('*, items:order_items(*), shipping_method:shipping_methods(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setOrder(data as Order);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!order) return <p className="p-8 text-center text-bark-500">Orden no encontrada.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-sage-200 bg-cream-50 p-8 text-center shadow-sm">
        <Leaf
          variant={1}
          className="absolute -right-6 -top-6 h-32 w-32 text-sage-100"
        />
        <Leaf
          variant={2}
          className="absolute -bottom-6 -left-6 h-32 w-32 text-sage-100"
        />

        <div className="relative">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-sage-100">
            <CheckCircle size={48} className="text-sage-600" strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-bark-700">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-2 text-bark-500">Te enviaremos los detalles por email.</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 font-mono text-xs text-sage-800">
            <Package size={12} /> #{order.id.slice(0, 8)}
          </p>

          <div className="mt-8 space-y-3 rounded-2xl border border-sage-100 bg-cream-100/50 p-5 text-left text-sm">
            <p className="flex justify-between">
              <span className="text-bark-400">Fecha</span>
              <span className="font-medium text-bark-700">{formatDate(order.created_at)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-bark-400">Cliente</span>
              <span className="font-medium text-bark-700">{order.customer_name}</span>
            </p>
            <p className="flex justify-between border-t border-sage-200 pt-3">
              <span className="text-bark-400">Total</span>
              <span className="font-display text-lg font-bold text-sage-700">
                {formatPrice(order.total)}
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/productos">
              <Button variant="clay">Seguir comprando</Button>
            </Link>
            <Link to="/mis-ordenes">
              <Button variant="outline">Ver mis pedidos</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
