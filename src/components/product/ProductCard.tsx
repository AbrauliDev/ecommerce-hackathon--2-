import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { isOfferActive, getCurrentPrice, getDiscountPercent } from '@/utils/pricing';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const onOffer = isOfferActive(product);
  const currentPrice = getCurrentPrice(product);
  const discountPct = getDiscountPercent(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('Producto agotado');
      return;
    }
    // Si tiene variantes, redirigir a detalle para que elija
    if (hasVariants) {
      window.location.href = `/productos/${product.slug}`;
      return;
    }
    addToCart(product, null, 1);
    toast.success(`${product.name} añadido`);
  };

  return (
    <Link
      to={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sage-100 bg-cream-50 transition-all duration-300 hover:border-sage-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sage-300">
            Sin imagen
          </div>
        )}

        {onOffer && discountPct > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-clay-500 px-2.5 py-1 text-xs font-bold text-cream-50 shadow-sm">
            -{discountPct}%
          </span>
        )}

        {product.category && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-cream-50/95 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-sage-700 backdrop-blur">
            {product.category.name}
          </span>
        )}

        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bark-700 text-cream-50 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-clay-500 disabled:opacity-50"
          aria-label={hasVariants ? 'Ver opciones' : 'Añadir al carrito'}
          title={hasVariants ? 'Ver opciones' : 'Añadir al carrito'}
        >
          <Plus size={18} />
        </button>

        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-bark-700/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-cream-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-bark-700">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-bark-700 group-hover:text-sage-700 transition line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-3">
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-bark-700">
              {formatPrice(currentPrice)}
            </span>
            {onOffer && (
              <span className="text-sm text-bark-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock < 5 && !hasVariants && (
            <span className="text-xs font-medium text-clay-600">
              ¡Quedan {product.stock}!
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
