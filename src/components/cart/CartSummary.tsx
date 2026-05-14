import { formatPrice } from '@/utils/format';

interface CartSummaryProps {
  subtotal: number;
  shippingCost?: number;
  showTotal?: boolean;
}

export const CartSummary = ({ subtotal, shippingCost = 0, showTotal = true }: CartSummaryProps) => {
  const total = subtotal + shippingCost;

  return (
    <div className="rounded-2xl border border-sage-200 bg-cream-50 p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-bark-700">Resumen del pedido</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-bark-400">Subtotal</dt>
          <dd className="font-medium text-bark-700">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-bark-400">Envío</dt>
          <dd className="font-medium text-bark-700">
            {shippingCost > 0 ? formatPrice(shippingCost) : '—'}
          </dd>
        </div>
        {showTotal && (
          <div className="mt-3 flex items-baseline justify-between border-t border-sage-200 pt-4">
            <dt className="font-display text-base font-semibold text-bark-700">Total</dt>
            <dd className="font-display text-2xl font-bold text-sage-700">{formatPrice(total)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
