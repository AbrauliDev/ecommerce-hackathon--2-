import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, ArrowLeft, Minus, Plus, Clock, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { isOfferActive, getCurrentPrice, getDiscountPercent, getOfferTimeLeft } from '@/utils/pricing';
import { Button } from '@/components/ui/Button';
import { PageSpinner, EmptyState } from '@/components/ui/Feedback';
import { VariantSelector, findVariant } from '@/components/product/VariantSelector';

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;

  const currentVariant = useMemo(
    () => (hasVariants ? findVariant(variants, selectedColor, selectedSize) : null),
    [variants, selectedColor, selectedSize, hasVariants],
  );

  // Auto-seleccionar primera combinación disponible cuando carga el producto
  useEffect(() => {
    if (hasVariants && !selectedColor && !selectedSize) {
      const firstAvailable = variants.find((v) => v.stock > 0);
      if (firstAvailable) {
        setSelectedColor(firstAvailable.color);
        setSelectedSize(firstAvailable.size);
      }
    }
  }, [hasVariants, variants, selectedColor, selectedSize]);

  if (loading) return <PageSpinner />;
  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState
          title="Producto no encontrado"
          action={<Link to="/productos" className="text-sage-700 font-semibold underline">Volver al catálogo</Link>}
        />
      </div>
    );
  }

  const onOffer = isOfferActive(product);
  const currentPrice = getCurrentPrice(product);
  const discountPct = getDiscountPercent(product);
  const timeLeft = getOfferTimeLeft(product);

  // Stock disponible: el de la variante seleccionada, o el del producto si no hay variantes
  const availableStock = hasVariants ? currentVariant?.stock ?? 0 : product.stock;

  const handleAdd = () => {
    if (hasVariants && !currentVariant) {
      toast.error('Selecciona color y talla');
      return;
    }
    if (availableStock <= 0) {
      toast.error('Sin stock para esta combinación');
      return;
    }
    addToCart(product, currentVariant, qty);
    const label = currentVariant ? `${product.name} (${[currentVariant.color, currentVariant.size].filter(Boolean).join(' · ')})` : product.name;
    toast.success(`${qty} × ${label} añadido`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/productos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-bark-500 hover:text-sage-700 transition"
      >
        <ArrowLeft size={14} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100 border border-sage-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sage-300">Sin imagen</div>
          )}
          {onOffer && discountPct > 0 && (
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-clay-500 px-3 py-1.5 text-sm font-bold text-cream-50 shadow-lg">
              -{discountPct}% OFF
            </span>
          )}
        </div>

        {/* Detalles */}
        <div className="flex flex-col">
          {product.category && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-sage-700">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-bold text-bark-700 sm:text-4xl">
            {product.name}
          </h1>

          {/* Precio + descuento */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-bark-700">
              {formatPrice(currentPrice)}
            </span>
            {onOffer && (
              <>
                <span className="text-lg text-bark-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="inline-flex items-center rounded-full bg-clay-100 px-2 py-0.5 text-xs font-bold text-clay-700">
                  AHORRAS {formatPrice(product.price - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Countdown de oferta */}
          {onOffer && timeLeft && (
            <div className="mt-3 inline-flex items-center gap-2 self-start rounded-full bg-clay-100 px-3 py-1.5 text-sm font-medium text-clay-700">
              <Clock size={14} />
              Termina en {timeLeft}
            </div>
          )}

          {/* Descripción */}
          {product.description && (
            <p className="mt-6 leading-relaxed text-bark-500">{product.description}</p>
          )}

          {/* Selector de variantes */}
          {hasVariants && (
            <div className="mt-8">
              <VariantSelector
                variants={variants}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
              />
            </div>
          )}

          {/* Stock indicator */}
          <div className="mt-6">
            <p className="text-sm">
              {availableStock > 0 ? (
                <span className="text-sage-700 font-medium">
                  ✓ {availableStock} disponibles
                  {hasVariants && !currentVariant && ' (selecciona variante)'}
                </span>
              ) : (
                <span className="font-medium text-red-700">Sin stock</span>
              )}
            </p>
          </div>

          {/* Cantidad + CTA */}
          {availableStock > 0 && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex items-center rounded-full border border-sage-200 bg-cream-50">
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="rounded-l-full px-4 py-2.5 hover:bg-sage-100 transition"
                  aria-label="Disminuir"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[3rem] text-center font-display font-semibold text-bark-700">{qty}</span>
                <button
                  onClick={() => setQty((v) => Math.min(availableStock, v + 1))}
                  className="rounded-r-full px-4 py-2.5 hover:bg-sage-100 transition"
                  aria-label="Aumentar"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button size="lg" onClick={handleAdd} variant="clay" className="flex-1 sm:flex-none">
                <ShoppingBag size={18} /> Añadir al carrito
              </Button>
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-sage-100 pt-6">
            <div className="flex items-start gap-3">
              <Truck size={20} className="mt-0.5 shrink-0 text-sage-600" />
              <div>
                <p className="text-sm font-semibold text-bark-700">Envío en 24-48h</p>
                <p className="text-xs text-bark-400">Express disponible</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sage-600" />
              <div>
                <p className="text-sm font-semibold text-bark-700">Garantía 2 años</p>
                <p className="text-xs text-bark-400">Devoluciones 30 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
