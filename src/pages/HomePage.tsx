import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Leaf } from '@/components/ui/Leaf';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FeaturesBar } from '@/components/layout/FeaturesBar';
import { useProducts } from '@/hooks/useProducts';

export const HomePage = () => {
  const { products: featured, loading } = useProducts();
  const { products: offers, loading: loadingOffers } = useProducts({ onlyOffers: true });

  return (
    <>
      {/* HERO - banda verde con tagline */}
      <section className="relative overflow-hidden bg-sage-700 text-cream-50">
        {/* Decoración hojas */}
        <Leaf
          variant={1}
          className="absolute -right-12 -top-12 h-72 w-72 text-sage-600 opacity-40"
        />
        <Leaf
          variant={2}
          className="absolute -bottom-16 -left-16 h-72 w-72 text-sage-600 opacity-30"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sage-600/50 px-3 py-1 text-xs font-medium tracking-wider text-cream-100 backdrop-blur">
              <Sparkles size={12} /> NUEVA TEMPORADA · PRIMAVERA
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Descubre productos
              <br />
              <span className="italic text-clay-300">cuidadosamente</span> seleccionados
            </h1>
            <p className="mt-5 max-w-xl text-base text-cream-100/80 sm:text-lg">
              Tu rincón perezoso favorito. Diseño moderno, envíos rápidos
              y experiencia de compra fluida — todo a tu ritmo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/productos">
                <Button variant="clay" size="lg">
                  Ver catálogo <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/ofertas">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-cream-100/30 bg-transparent text-cream-50 hover:bg-cream-50/10 hover:border-cream-100/50"
                >
                  Ver ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <FeaturesBar />

      {/* OFERTAS LAZY */}
      {offers.length > 0 && (
        <section className="relative overflow-hidden bg-clay-50 py-16">
          <Leaf
            variant={3}
            className="absolute right-0 top-0 h-32 w-32 text-clay-200"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-clay-500 px-3 py-1 text-xs font-bold tracking-wider text-cream-50">
                  <Sparkles size={12} /> OFERTAS LAZY
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-bark-700 sm:text-4xl">
                  Descuentos que se sienten bien
                </h2>
                <p className="mt-1 text-bark-400">
                  Productos seleccionados con precio rebajado por tiempo limitado.
                </p>
              </div>
              <Link
                to="/ofertas"
                className="hidden text-sm font-semibold text-sage-700 hover:text-clay-600 transition sm:inline-block"
              >
                Ver todas →
              </Link>
            </div>
            <ProductGrid products={offers.slice(0, 4)} loading={loadingOffers} />
          </div>
        </section>
      )}

      {/* DESTACADOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-sage-600">
              Lo más nuevo
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-bark-700 sm:text-4xl">
              Productos destacados
            </h2>
          </div>
          <Link
            to="/productos"
            className="hidden text-sm font-semibold text-sage-700 hover:text-clay-600 transition sm:inline-block"
          >
            Ver todos →
          </Link>
        </div>
        <ProductGrid products={featured.slice(0, 8)} loading={loading} />
      </section>

      {/* SEPARADOR ORNAMENTAL + frase */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="divider-leaf mb-4 text-sage-400">
          <Leaf variant={1} className="h-6 w-6" />
        </div>
        <p className="font-display text-2xl italic text-bark-500 sm:text-3xl">
          "Toma las cosas con calma.<br />
          <span className="text-sage-700">Lo bueno llega a su ritmo."</span>
        </p>
        <p className="mt-4 text-sm tracking-widest text-sage-600">— FILOSOFÍA LAZY —</p>
      </section>
    </>
  );
};
