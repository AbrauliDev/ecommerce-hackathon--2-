import { Truck, Zap } from 'lucide-react';
import type { ShippingMethod } from '@/types';
import { formatPrice } from '@/utils/format';

interface ShippingMethodsProps {
  methods: ShippingMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ShippingMethods = ({ methods, selectedId, onSelect }: ShippingMethodsProps) => {
  return (
    <div className="space-y-3">
      {methods.map((method, idx) => {
        const isSelected = method.id === selectedId;
        // Express usa icono diferente
        const Icon = method.name.toLowerCase().includes('express') ? Zap : Truck;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
              isSelected
                ? 'border-sage-500 bg-sage-50'
                : 'border-sage-100 bg-cream-50 hover:border-sage-300'
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                isSelected ? 'bg-sage-600 text-cream-50' : 'bg-cream-100 text-sage-600'
              }`}
            >
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-bark-700">{method.name}</p>
              {method.description && (
                <p className="text-xs text-bark-400">{method.description}</p>
              )}
              {method.estimated_days && (
                <p className="mt-0.5 text-xs text-sage-600 font-medium">⏱ {method.estimated_days}</p>
              )}
            </div>
            <p className="font-display text-lg font-bold text-bark-700">{formatPrice(method.price)}</p>
          </button>
        );
      })}
    </div>
  );
};
