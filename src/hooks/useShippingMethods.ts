import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ShippingMethod } from '@/types';

export const useShippingMethods = () => {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('shipping_methods')
      .select('*')
      .eq('is_active', true)
      .order('price')
      .then(({ data }) => {
        setMethods((data ?? []) as ShippingMethod[]);
        setLoading(false);
      });
  }, []);

  return { methods, loading };
};
