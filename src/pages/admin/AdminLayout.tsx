import { NavLink, Outlet } from 'react-router-dom';
import { Package, ShoppingBag, LayoutDashboard, Sparkles } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-sage-100 text-sage-800'
      : 'text-bark-500 hover:bg-sage-50 hover:text-bark-700'
  }`;

export const AdminLayout = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-wider text-clay-600">
        Panel administrativo
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-bark-700 sm:text-4xl">
        Gestión Lazy
      </h1>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-sage-100 bg-cream-50 p-3">
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className={linkClass}>
            <Package size={16} /> Productos
          </NavLink>
          <NavLink to="/admin/ordenes" className={linkClass}>
            <ShoppingBag size={16} /> Órdenes
          </NavLink>
          <NavLink to="/admin/ofertas" className={linkClass}>
            <Sparkles size={16} /> Ofertas
          </NavLink>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  </div>
);
