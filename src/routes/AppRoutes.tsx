import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Públicas
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { OffersPage } from '@/pages/OffersPage';
import { CartPage } from '@/pages/CartPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

// Protegidas
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { MyOrdersPage } from '@/pages/MyOrdersPage';

// Admin
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminOffers } from '@/pages/admin/AdminOffers';

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="productos" element={<ProductsPage />} />
      <Route path="productos/:slug" element={<ProductDetailPage />} />
      <Route path="ofertas" element={<OffersPage />} />
      <Route path="carrito" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="registro" element={<RegisterPage />} />

      <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="orden-confirmada/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
      <Route path="mis-ordenes" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

      <Route path="admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="ordenes" element={<AdminOrders />} />
        <Route path="ofertas" element={<AdminOffers />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="mx-auto max-w-md py-16 text-center">
            <h1 className="font-display text-3xl font-bold text-bark-700">404</h1>
            <p className="mt-2 text-bark-400">Página no encontrada</p>
          </div>
        }
      />
    </Route>
  </Routes>
);
