import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Leaf } from '@/components/ui/Leaf';

export const Footer = () => (
  <footer className="relative overflow-hidden bg-sage-800 text-cream-100 mt-16">
    {/* Decoración hojas en esquinas */}
    <Leaf
      variant={1}
      className="absolute -left-8 -top-8 h-40 w-40 text-sage-700 opacity-50"
    />
    <Leaf
      variant={2}
      className="absolute -right-10 bottom-0 h-48 w-48 text-sage-700 opacity-50"
    />

    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2">
          <Logo variant="full" tone="light" />
          <p className="mt-4 max-w-sm text-sm text-cream-200/80">
            Tu rincón perezoso favorito. Productos cuidadosamente seleccionados
            para acompañar tu ritmo, sin prisas.
          </p>
        </div>

        {/* Tienda */}
        <div>
          <h3 className="font-display text-base font-semibold text-cream-50">Tienda</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/productos" className="text-cream-200/80 hover:text-clay-300 transition">Todos los productos</Link></li>
            <li><Link to="/productos" className="text-cream-200/80 hover:text-clay-300 transition">Novedades</Link></li>
            <li><Link to="/carrito" className="text-cream-200/80 hover:text-clay-300 transition">Carrito</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-display text-base font-semibold text-cream-50">Información</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><span className="text-cream-200/80">Envío estándar 3-5 días</span></li>
            <li><span className="text-cream-200/80">Envío express 1-2 días</span></li>
            <li><span className="text-cream-200/80">Garantía 2 años</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-sage-700 pt-6 md:flex-row md:items-center">
        <p className="text-xs text-cream-300/60 tracking-wider">
          © {new Date().getFullYear()} LAZY — RELAX · UNWIND · ENJOY
        </p>
        <p className="text-xs text-cream-300/60">
          Hecho con cariño · React · Supabase
        </p>
      </div>
    </div>
  </footer>
);
