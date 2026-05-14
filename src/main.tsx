import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AppRoutes } from '@/routes/AppRoutes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                background: '#fdfbf6',
                color: '#2d2520',
                border: '1px solid #c8d2bd',
              },
              success: { iconTheme: { primary: '#6c805d', secondary: '#fdfbf6' } },
              error: { iconTheme: { primary: '#cd5f34', secondary: '#fdfbf6' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
