import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

/**
 * Lista de órdenes. Según RLS:
 * - customers: solo ven las suyas
 * - admins: ven todas
 */
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error: qErr } = await supabase
      .from('orders')
      .select('*, items:order_items(*), shipping_method:shipping_methods(*)')
      .order('created_at', { ascending: false });

    if (qErr) setError(qErr.message);
    else setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { orders, loading, error, refresh };
};
