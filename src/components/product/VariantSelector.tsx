import { useMemo } from 'react';
import { Check } from 'lucide-react';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onColorChange: (color: string | null) => void;
  onSizeChange: (size: string | null) => void;
}

/**
 * Selector visual de variantes: colores como círculos y tallas como chips.
 * Detecta automáticamente qué combinaciones existen y deshabilita las que no.
 */
export const VariantSelector = ({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) => {
  // Colores únicos
  const colors = useMemo(() => {
    const seen = new Map<string, { name: string; hex: string | null }>();
    variants.forEach((v) => {
      if (v.color && !seen.has(v.color)) {
        seen.set(v.color, { name: v.color, hex: v.color_hex });
      }
    });
    return Array.from(seen.values());
  }, [variants]);

  // Tallas únicas (en orden común S/M/L/XL si aplica)
  const sizes = useMemo(() => {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const seen = new Set<string>();
    variants.forEach((v) => v.size && seen.add(v.size));
    return Array.from(seen).sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [variants]);

  // Para deshabilitar tallas sin stock con el color seleccionado
  const isSizeAvailable = (size: string): boolean => {
    if (!selectedColor) return variants.some((v) => v.size === size && v.stock > 0);
    return variants.some(
      (v) => v.color === selectedColor && v.size === size && v.stock > 0,
    );
  };

  // Análogamente para colores
  const isColorAvailable = (color: string): boolean => {
    if (!selectedSize) return variants.some((v) => v.color === color && v.stock > 0);
    return variants.some(
      (v) => v.color === color && v.size === selectedSize && v.stock > 0,
    );
  };

  return (
    <div className="space-y-5">
      {colors.length > 0 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-bark-700">Color</span>
            {selectedColor && (
              <span className="text-sm text-bark-400">{selectedColor}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const available = isColorAvailable(c.name);
              const selected = c.name === selectedColor;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(selected ? null : c.name)}
                  disabled={!available}
                  className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    selected
                      ? 'border-bark-700 ring-2 ring-offset-2 ring-bark-700 ring-offset-cream-50'
                      : 'border-sage-200 hover:border-sage-400'
                  } ${!available ? 'opacity-30 cursor-not-allowed' : ''}`}
                  aria-label={c.name}
                  title={c.name}
                >
                  <span
                    className="block h-7 w-7 rounded-full"
                    style={{ backgroundColor: c.hex ?? '#999' }}
                  />
                  {selected && (
                    <Check
                      size={14}
                      className="absolute text-cream-50 drop-shadow"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-bark-700">Talla</span>
            {selectedSize && (
              <span className="text-sm text-bark-400">{selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const available = isSizeAvailable(s);
              const selected = s === selectedSize;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSizeChange(selected ? null : s)}
                  disabled={!available}
                  className={`min-w-[3rem] rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                    selected
                      ? 'border-sage-600 bg-sage-600 text-cream-50'
                      : 'border-sage-200 bg-cream-50 text-bark-700 hover:border-sage-400'
                  } ${!available ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Helper: dado un array de variantes y la selección (color/talla),
 * devuelve la variante exacta o null si la combinación no existe.
 */
export const findVariant = (
  variants: ProductVariant[],
  color: string | null,
  size: string | null,
): ProductVariant | null => {
  if (variants.length === 0) return null;
  return (
    variants.find(
      (v) =>
        (v.color ?? null) === color && (v.size ?? null) === size,
    ) ?? null
  );
};
