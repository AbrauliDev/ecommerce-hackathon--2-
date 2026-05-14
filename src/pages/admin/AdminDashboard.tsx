import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { PageSpinner } from '@/components/ui/Feedback';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  activeOffers: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const [products, orders, customers, offers] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_featured_offer', true),
      ]);

      const totalRevenue = (orders.data ?? []).reduce(
        (acc, o: { total: number }) => acc + Number(o.total),
        0,
      );

      setStats({
        totalProducts: products.count ?? 0,
        totalOrders: orders.data?.length ?? 0,
        totalRevenue,
        totalCustomers: customers.count ?? 0,
        activeOffers: offers.count ?? 0,
      });
    };
    load();
  }, []);

  if (!stats) return <PageSpinner />;

  const cards = [
    { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'bg-sage-100 text-sage-700' },
    { label: 'Órdenes', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-clay-100 text-clay-700' },
    { label: 'Clientes', value: stats.totalCustomers, icon: Users, color: 'bg-cream-300 text-bark-700' },
    { label: 'Facturado', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-sage-600 text-cream-50' },
    { label: 'Ofertas activas', value: stats.activeOffers, icon: Sparkles, color: 'bg-clay-500 text-cream-50' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-sage-100 bg-cream-50 p-5">
          <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
            <c.icon size={18} strokeWidth={1.75} />
          </div>
          <p className="text-sm text-bark-400">{c.label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-bark-700">{c.value}</p>
        </div>
      ))}
    </div>
  );
};
