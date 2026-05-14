import { useState } from 'react';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

export const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const { products, loading } = useProducts({ search, categorySlug });

  return (
    <>
      {/* Cabecera con fondo de color */}
      <section className="bg-sage-100/40 border-b border-sage-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-wider text-sage-700">
            CATÁLOGO COMPLETO
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-bark-700 sm:text-5xl">
            Todos los productos
          </h1>
          <p className="mt-2 text-bark-500">
            Explora la colección Lazy completa, encuentra tu próximo favorito.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            categorySlug={categorySlug}
            onCategoryChange={setCategorySlug}
          />
        </div>
        <ProductGrid products={products} loading={loading} />
      </section>
    </>
  );
};
