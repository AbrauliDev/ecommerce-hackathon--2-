import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Logo } from '@/components/ui/Logo';

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium tracking-wide transition ${
      isActive ? 'text-cream-50' : 'text-cream-100/80 hover:text-cream-50'
    } after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-clay-400 after:transition-transform ${
      isActive ? 'after:scale-x-100' : 'after:scale-x-0'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-sage-700 shadow-sm">
      {/* Banda superior con tagline */}
      <div className="border-b border-sage-600 bg-sage-800">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-1.5 text-xs text-cream-200/80 tracking-wider">
          <span className="hidden sm:inline">RELAX · UNWIND · ENJOY ·</span>
          <span className="ml-2">ENVÍO GRATIS EN PEDIDOS DESDE 50€</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo variant="full" tone="light" />
        </Link>

        {/* Búsqueda desktop */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage-300"
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-full bg-sage-600/50 py-2 pl-9 pr-4 text-sm text-cream-50 placeholder:text-sage-300 backdrop-blur focus:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-clay-400/50 transition"
              onFocus={(e) => {
                // Navegar a /productos al hacer focus (UX simplificada)
                e.target.blur();
                window.location.href = '/productos';
              }}
              readOnly
            />
          </div>
        </div>

        {/* Desktop links + actions */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={desktopLinkClass}>Inicio</NavLink>
          <NavLink to="/productos" className={desktopLinkClass}>Productos</NavLink>
          {user && (
            <NavLink to="/mis-ordenes" className={desktopLinkClass}>Pedidos</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={desktopLinkClass}>
              <span className="inline-flex items-center gap-1">
                <Shield size={13} /> Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <button
              onClick={signOut}
              className="hidden rounded-lg p-2 text-cream-100/80 hover:bg-sage-600 hover:text-cream-50 transition md:block"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg p-2 text-cream-100/80 hover:bg-sage-600 hover:text-cream-50 transition md:block"
              aria-label="Iniciar sesión"
              title="Iniciar sesión"
            >
              <User size={18} />
            </Link>
          )}

          {/* Carrito como botón destacado */}
          <Link
            to="/carrito"
            className="relative ml-1 inline-flex items-center gap-2 rounded-full bg-clay-500 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-clay-600 transition shadow-sm"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bark-700 px-1.5 text-xs font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-1 rounded-lg p-2 text-cream-100 hover:bg-sage-600 transition md:hidden"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-sage-600 bg-sage-700 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-cream-100 hover:bg-sage-600">Inicio</NavLink>
            <NavLink to="/productos" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-cream-100 hover:bg-sage-600">Productos</NavLink>
            {user && (
              <NavLink to="/mis-ordenes" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-cream-100 hover:bg-sage-600">Mis pedidos</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-clay-300 hover:bg-sage-600">Panel admin</NavLink>
            )}
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-cream-100 hover:bg-sage-600">Cerrar sesión</button>
            ) : (
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-cream-100 hover:bg-sage-600">Iniciar sesión</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
