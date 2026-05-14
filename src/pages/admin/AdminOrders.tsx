import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate, statusBadge } from '@/utils/format';
import { Badge, PageSpinner, EmptyState } from '@/components/ui/Feedback';
import type { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

interface OrderRowProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const OrderRow = ({ order, expanded, onToggle, onStatusChange }: OrderRowProps) => {
  const badge = statusBadge(order.status);
  return (
    <div className="rounded-2xl border border-sage-100 bg-cream-50 transition hover:border-sage-300">
      <div
        className="flex cursor-pointer items-center gap-4 p-4 hover:bg-sage-50/30"
        onClick={onToggle}
      >
        <button className="text-bark-400" aria-label="Expandir">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-bark-400">#{order.id.slice(0, 8)}</p>
          <p className="truncate font-medium text-bark-700">{order.customer_name}</p>
          <p className="truncate text-xs text-bark-400">{order.customer_email}</p>
        </div>
        <div className="hidden text-sm text-bark-400 sm:block">{formatDate(order.created_at)}</div>
        <div className="text-right">
          <p className="font-display text-lg font-bold text-bark-700">{formatPrice(order.total)}</p>
          <Badge className={badge.classes + ' mt-1'}>{badge.label}</Badge>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-sage-100 p-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-bark-400">Cliente</h3>
              <p className="flex items-center gap-2 text-sm text-bark-600">
                <Mail size={14} /> {order.customer_email}
              </p>
              <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-bark-400">Dirección</h3>
              <div className="flex items-start gap-2 text-sm text-bark-600">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <div>
                  <p>{order.shipping_address.street}</p>
                  <p>
                    {order.shipping_address.postal_code} {order.shipping_address.city}
                    {order.shipping_address.state && `, ${order.shipping_address.state}`}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-bark-400">Productos</h3>
              <ul className="space-y-1.5 text-sm text-bark-600">
                {order.items?.map((it) => (
                  <li key={it.id} className="flex justify-between gap-2">
                    <span>
                      {it.quantity} × {it.product_name}
                      {it.variant_label && (
                        <span className="text-bark-400"> ({it.variant_label})</span>
                      )}
                    </span>
                    <span>{formatPrice(it.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-sage-100 pt-3 text-sm">
                <div className="flex justify-between text-bark-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-bark-400">
                  <span>Envío</span>
                  <span>{formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-bark-700">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-sage-100 pt-4 sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-bark-600">Cambiar estado:</label>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className="rounded-lg border border-sage-200 bg-cream-50 px-3 py-1.5 text-sm text-bark-700 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{statusBadge(s).label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminOrders = () => {
  const { orders, loading, refresh } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) return toast.error(error.message);
    toast.success('Estado actualizado');
    refresh();
  };

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="rounded-2xl border border-sage-100 bg-cream-50 p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-bark-700">Órdenes</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-bark-500">Filtrar:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="rounded-lg border border-sage-200 bg-cream-50 px-3 py-1.5 text-sm text-bark-700 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition"
          >
            <option value="all">Todas</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{statusBadge(s).label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No hay órdenes" />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onStatusChange={(s) => handleStatusChange(order.id, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
