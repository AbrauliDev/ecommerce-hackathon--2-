# 🌿 Rediseño Lazy + Ofertas + Variantes

Este paquete contiene el **rediseño completo Lazy** + dos features nuevas:
- **Ofertas Lazy**: descuentos con fecha de inicio y fin, validados server-side
- **Variantes de producto**: colores y tallas seleccionables por el usuario

## 📦 Cómo aplicar

### Paso 1: Backup (importante)

Antes de nada, crea una rama o copia tu proyecto actual:

```bash
git checkout -b before-lazy-redesign
git add -A && git commit -m "antes de aplicar Lazy redesign"
git checkout main
```

### Paso 2: Aplicar la migración SQL en Supabase

1. Abre el dashboard de Supabase → **SQL Editor** → **+ New query**
2. Copia el contenido de `supabase/migration-offers-variants.sql`
3. Pégalo y ejecuta (Run)
4. Al final verás un resumen: `Productos en oferta: 3 | Variantes creadas: 15`

Si ves errores tipo `column already exists`, ignóralos — el script es idempotente.

### Paso 3: Copiar los archivos al proyecto

Descomprime este zip **sobre tu proyecto actual** (sobrescribiendo). Los archivos clave que cambian:

```
tailwind.config.js              ← paleta sage/clay/cream/bark
src/index.css                   ← tipografía Fraunces + DM Sans
index.html                      ← fuentes Google + favicon
public/favicon.svg              ← nuevo favicon
src/types/index.ts              ← tipos con variants y descuentos
src/utils/pricing.ts            ← NUEVO: helper de descuentos
src/context/CartContext.tsx     ← carrito con soporte de variantes
src/hooks/useProducts.ts        ← incluye variants en la query
src/components/...              ← TODOS los componentes rediseñados
src/pages/...                   ← TODAS las páginas rediseñadas
src/pages/OffersPage.tsx        ← NUEVA: /ofertas
src/pages/admin/AdminOffers.tsx ← NUEVA: gestor de ofertas
```

### Paso 4: Reiniciar el dev server

```bash
# Detener con Ctrl+C el dev server actual
npm run dev
```

Vite recarga las variables del tailwind config al iniciar — es obligatorio reiniciar.

## 🎨 Sistema de diseño

### Paleta

```
sage      → Verde salvia (color principal, marca)
clay      → Terracota (acentos cálidos, CTAs destacados)
cream     → Beige crema (fondos, sustituye a "white")
bark      → Marrón profundo (texto)
```

Usa siempre los tokens, nunca colores hex hardcodeados.

### Tipografía

- **Body**: `DM Sans` (clase implícita)
- **Display**: `Fraunces` (clase `font-display`)

### Buttons

```tsx
<Button variant="primary">  // sage (default)
<Button variant="clay">     // terracota (CTAs principales)
<Button variant="outline">  // borde sutil
<Button variant="ghost">    // sin fondo
<Button variant="secondary">// bark oscuro
<Button variant="danger">   // rojo
```

## 🏷️ Ofertas Lazy — cómo funciona

### Modelo de datos

Nuevas columnas en `products`:
- `discount_price`: precio rebajado (null = sin oferta)
- `discount_starts_at`: fecha desde la que aplica (null = ya)
- `discount_ends_at`: fecha hasta la que aplica (null = sin caducidad)
- `is_featured_offer`: si aparece en /ofertas y en la home

### Función Postgres: `get_current_price(product_id)`

Esta función decide server-side qué precio cobrar:

```sql
select get_current_price('uuid-del-producto');
-- Devuelve discount_price si la oferta está vigente, sino price
```

### Seguridad de precio

En `CheckoutPage.tsx` se llama a esa función vía RPC **antes de crear la orden**. Si el precio del cliente no coincide con el server, se aborta. Así un usuario con DevTools no puede manipular el carrito.

### Gestión

`/admin/ofertas` permite crear, editar y terminar ofertas. Selecciona producto, precio rebajado y fechas (opcionales).

## 🎨 Variantes de producto

### Modelo de datos

Nueva tabla `product_variants`:
- `product_id`: enlace al producto
- `color`: nombre legible (ej. "Verde Salvia")
- `color_hex`: hex para mostrar el círculo (ej. "#6c805d")
- `size`: talla (ej. "M", "XL")
- `stock`: stock individual de esta variante

### Comportamiento

- Si un producto tiene variantes, el `stock` de `products` se ignora y se usa el de la variante seleccionada.
- En `ProductDetailPage`, el usuario debe elegir color y talla antes de añadir.
- Combinaciones sin stock aparecen tachadas/grises.
- El `CartItem` y `OrderItem` guardan `variant_label` como snapshot (ej. "Verde Salvia · M") para que sobreviva si la variante se borra.

### Gestión

Por ahora las variantes se gestionan vía SQL directo (es mucho código añadir un editor visual). Ejemplo para crear variantes:

```sql
insert into product_variants (product_id, color, color_hex, size, stock)
values
  ('uuid-producto', 'Crema', '#f1e8d2', 'S', 10),
  ('uuid-producto', 'Crema', '#f1e8d2', 'M', 8),
  ('uuid-producto', 'Verde', '#6c805d', 'M', 12);
```

Esta es una mejora futura natural para el admin.

## ✅ Verificación post-deploy

1. La home muestra el hero verde con tagline
2. Aparece sección "Ofertas Lazy" con productos en descuento
3. `/ofertas` muestra solo productos con `is_featured_offer = true`
4. En `/productos/camiseta-premium`: selector de colores (3) y tallas (S/M/L)
5. Al añadir al carrito, la variante aparece como subtítulo
6. En el checkout, si manipulas el precio en DevTools, se rechaza
7. `/admin/ofertas` permite crear/terminar ofertas con fechas

## 🐛 Troubleshooting

**"Could not find the function get_current_price"**
La migración SQL no se ejecutó. Re-ejecuta `supabase/migration-offers-variants.sql`.

**Los descuentos no aparecen**
Verifica en `products` que `discount_price` no es null, `is_featured_offer = true`, y que `discount_ends_at` está en el futuro.

**El selector de variantes no aparece**
La query del hook trae `variants:product_variants(*)`. Si la columna en la DB no existe, falla silenciosamente. Re-ejecuta la migración.

**Toast styling roto**
Vacía caché del navegador (Ctrl+Shift+R). El toast usa fuentes nuevas que pueden no haberse cargado.
