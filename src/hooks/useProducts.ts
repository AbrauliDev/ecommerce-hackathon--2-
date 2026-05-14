import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface UseProductsOptions {
  categorySlug?: string;
  search?: string;
  includeInactive?: boolean;
  onlyOffers?: boolean;
}

/**
 * Lista productos. Carga también `category` y `variants` en una sola query.
 */
export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .order('created_at', { ascending: false });

      if (!options.includeInactive) {
        query = query.eq('is_active', true);
      }

      if (options.onlyOffers) {
        query = query.eq('is_featured_offer', true);
      }

      if (options.categorySlug) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single();
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (options.search && options.search.trim().length > 0) {
        query = query.ilike('name', `%${options.search.trim()}%`);
      }

      const { data, error: qErr } = await query;

      if (cancelled) return;
      if (qErr) {
        setError(qErr.message);
        setProducts([]);
      } else {
        setProducts((data ?? []) as Product[]);
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [options.categorySlug, options.search, options.includeInactive, options.onlyOffers]);

  return { products, loading, error };
};

/**
 * Hook para un solo producto por slug — incluye categoría y variantes.
 */
export const useProduct = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      const { data, error: qErr } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (cancelled) return;
      if (qErr) setError(qErr.message);
      else setProduct(data as Product);
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
};
