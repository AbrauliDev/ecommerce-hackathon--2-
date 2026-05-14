import { Sparkles, Clock } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Leaf } from '@/components/ui/Leaf';
import { useProducts } from '@/hooks/useProducts';

export const OffersPage = () => {
  const { products, loading } = useProducts({ onlyOffers: true });

  return (
    <>
      <section className="relative overflow-hidden bg-clay-100 border-b border-clay-200">
        <Leaf
          variant={2}
          className="absolute -right-8 -top-4 h-40 w-40 text-clay-300 opacity-70"
        />
        <Leaf
          variant={3}
          className="absolute bottom-0 left-10 h-24 w-24 text-clay-300 opacity-60"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-clay-500 px-3 py-1 text-xs font-bold tracking-wider text-cream-50 shadow-sm">
            <Sparkles size={12} /> OFERTAS LAZY
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-bark-700 sm:text-5xl">
            Descuentos que se sienten bien
          </h1>
          <p className="mt-3 max-w-xl text-bark-500">
            Selección curada de productos con precios rebajados por tiempo limitado.
            Cuando se acabe el reloj, vuelven a su precio original.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-clay-700">
            <Clock size={14} /> Las ofertas expiran cuando termina su cuenta atrás
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductGrid products={products} loading={loading} />
      </section>
    </>
  );
};
