import { Search } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  categorySlug: string;
  onCategoryChange: (slug: string) => void;
}

export const ProductFilters = ({
  search,
  onSearchChange,
  categorySlug,
  onCategoryChange,
}: ProductFiltersProps) => {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage-400"
        />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border border-sage-200 bg-cream-50 py-2.5 pl-11 pr-4 text-sm text-bark-700 placeholder:text-bark-400/60 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition"
        />
      </div>
      <select
        value={categorySlug}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-full border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-bark-700 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};
