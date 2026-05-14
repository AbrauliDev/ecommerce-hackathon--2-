import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { PageSpinner, EmptyState } from '@/components/ui/Feedback';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
  if (loading) return <PageSpinner />;
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package size={48} strokeWidth={1.5} />}
        title="No se encontraron productos"
        description="Prueba a cambiar la búsqueda o los filtros."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};
