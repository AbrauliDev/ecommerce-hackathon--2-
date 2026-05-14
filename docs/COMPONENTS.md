# 🧩 Guía de Componentes y Arquitectura

## Filosofía

El proyecto sigue **separación clara de responsabilidades** en 4 capas:

```
Pages       → Composición de componentes + lógica de página
Components  → UI reutilizable, sin saber de qué página vienen
Hooks       → Lógica de acceso a datos (Supabase) reutilizable
Context     → Estado global (sesión, carrito)
```

Esta estructura permite que durante un hackatón puedas:
- Trabajar en paralelo (uno en componentes, otro en hooks)
- Cambiar un componente sin tocar la lógica
- Cambiar el backend (de Supabase a otro) tocando solo `hooks/` y `lib/supabase.ts`

## 🎨 Capa UI (`src/components/ui/`)

Átomos sin lógica de negocio. Reutilizables en CUALQUIER página.

| Componente | Para qué |
|---|---|
| `Button` | Botón con 5 variantes y 3 tamaños, soporta `loading` |
| `Input` | Input con label, hint y mensaje de error integrados |
| `Modal` | Modal genérico con backdrop, cierre con ESC y por click fuera |
| `Spinner` / `PageSpinner` | Indicador de carga |
| `Badge` | Etiqueta de color (para status, categorías...) |
| `EmptyState` | Estado vacío con icono, título, descripción y acción |

**Regla**: si un componente importa algo de `@/context` o `@/hooks`, **no debe estar aquí**.

## 🏗️ Capa Layout (`src/components/layout/`)

| Componente | Notas |
|---|---|
| `Layout` | Wrapper con Navbar + Outlet + Footer |
| `Navbar` | Responsive (hamburguesa en móvil), muestra contador de carrito, link admin si procede |
| `Footer` | Estático |

## 📦 Capa Dominio (`src/components/{product,cart,checkout,auth,admin}/`)

Componentes específicos del e-commerce. Pueden usar contexts y hooks.

### Product
- `ProductCard`: tarjeta con imagen, precio, botón "añadir". Click navega a detalle.
- `ProductGrid`: grid responsive (1/2/3/4 columnas según viewport) con loading y empty state.
- `ProductFilters`: input de búsqueda + select de categoría.

### Cart
- `CartItem`: fila de carrito con controles de cantidad y eliminar.
- `CartSummary`: resumen de subtotal/envío/total. Reutilizado en carrito Y en checkout.

### Checkout
- `ShippingForm`: nombre, email, dirección. Recibe `values` y `onChange` (controlado por la página).
- `ShippingMethods`: tarjetas seleccionables de método de envío.

### Auth
- `LoginForm` / `RegisterForm`: formularios autocontenidos que usan `useAuth`.
- `ProtectedRoute`: HOC para rutas que requieren auth o admin.

### Admin
- `ProductForm`: crear/editar productos. Mismo componente, comportamiento cambia según `initial`.

## 🪝 Hooks (`src/hooks/`)

Encapsulan Supabase. Los componentes solo ven `{ data, loading, error }`.

```typescript
// Patrón típico:
const { products, loading, error } = useProducts({ search, categorySlug });
const { orders, loading, refresh } = useOrders();
const { methods } = useShippingMethods();
const { categories } = useCategories();
```

Cuando necesites una mutación (insert/update/delete), no crees un hook a menos que se vaya a reutilizar. Llama a Supabase directo en la página/componente y usa `refresh()` del hook después.

## 🌍 Contexts (`src/context/`)

### `AuthContext`
- `user` / `session` / `profile` / `isAdmin`
- `signIn(email, password)`, `signUp(email, password, name)`, `signOut()`
- Carga el profile automáticamente al loguearse
- Usa `supabase.auth.onAuthStateChange` para reaccionar a cambios

### `CartContext`
- `items`, `totalItems`, `subtotal`
- `addToCart(product, qty?)`, `removeFromCart(id)`, `updateQuantity(id, qty)`, `clearCart()`
- **Persiste en localStorage** automáticamente
- Respeta el `stock` (nunca permite añadir más de lo disponible)

## 🛣️ Rutas (`src/routes/AppRoutes.tsx`)

| Ruta | Acceso | Componente |
|---|---|---|
| `/` | Público | HomePage |
| `/productos` | Público | ProductsPage |
| `/productos/:slug` | Público | ProductDetailPage |
| `/carrito` | Público | CartPage |
| `/login`, `/registro` | Público | LoginPage / RegisterPage |
| `/checkout` | Auth | CheckoutPage |
| `/orden-confirmada/:id` | Auth | OrderConfirmationPage |
| `/mis-ordenes` | Auth | MyOrdersPage |
| `/admin` | Admin | AdminLayout → Dashboard |
| `/admin/productos` | Admin | AdminProducts |
| `/admin/ordenes` | Admin | AdminOrders |

## 🎨 Sistema de diseño

### Colores
Variable principal en `tailwind.config.js`: paleta `brand` (escala de naranja).
Cambia los valores hex para rebrandear toda la app en 30 segundos.

### Tipografía
- **Display**: Bricolage Grotesque (títulos grandes)
- **Body**: Inter (texto general)

Cargadas desde Google Fonts en `index.html` con preconnect.

### Spacing y radii
Usar utilities de Tailwind directamente, sin custom. Radios consistentes:
- `rounded-lg` para inputs/botones (8px)
- `rounded-xl` para tarjetas (12px)
- `rounded-2xl` para hero/modales (16px)

## 🔌 Cómo añadir una nueva feature

**Ejemplo: añadir "favoritos"**

1. **DB**: en `supabase/schema.sql` añade tabla `favorites (user_id, product_id)` con RLS
2. **Tipos**: añade `Favorite` en `types/index.ts`
3. **Hook**: crea `hooks/useFavorites.ts` con `add`, `remove`, `list`
4. **UI**: crea `components/product/FavoriteButton.tsx` que usa el hook
5. **Usar**: añade el botón en `ProductCard` y `ProductDetailPage`
6. **(Opcional) Página**: crea `pages/FavoritesPage.tsx`

Nunca tienes que tocar más de 5-6 archivos para una feature nueva.

## ⚡ Tips de rendimiento (para Raspberry Pi)

- Las imágenes vienen de Unsplash directamente. Si quieres ahorrar ancho de banda, descarga las imágenes y sírvelas desde `public/`.
- `manualChunks` en `vite.config.ts` separa React y Supabase en chunks, mejor cache.
- `loading="lazy"` en `<img>` ya está aplicado a las cards.
- El build minifica con esbuild (más rápido que terser, ideal para Pi si compilas allí).
