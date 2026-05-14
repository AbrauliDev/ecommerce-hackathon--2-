# 🚀 Setup inicial

## 1. Pre-requisitos

- Node.js 18 o superior
- Cuenta gratuita en [Supabase](https://supabase.com)

## 2. Crear proyecto en Supabase

1. Entra en [supabase.com](https://supabase.com) → "New Project"
2. Elige un nombre y una región cercana (mejor latencia)
3. Espera 1-2 minutos a que se provisione

## 3. Ejecutar el schema

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Abre `supabase/schema.sql` de este repo
3. Copia todo el contenido y pégalo en el editor
4. Click en **Run**

Esto crea:
- Las 6 tablas (profiles, categories, products, shipping_methods, orders, order_items)
- Las políticas de Row Level Security (RLS)
- El trigger que crea perfiles automáticamente al registrarse
- Los datos seed (8 productos, 4 categorías, 2 métodos de envío)

## 4. Obtener las claves

En Supabase: **Settings → API**

Copia:
- **Project URL** (algo como `https://xxxx.supabase.co`)
- **anon public** key (empieza por `eyJ...`)

## 5. Configurar `.env`

```bash
cp .env.example .env
```

Edita `.env` y pega tus valores:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 6. Instalar y arrancar

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## 7. Crear el usuario admin

1. Regístrate en la app desde `/registro` con el email que quieras usar como admin
2. Ve a Supabase → **Table Editor → profiles**
3. Edita el registro recién creado y cambia `role` de `customer` a `admin`
4. Cierra sesión y vuelve a entrar — ya verás el link al panel admin

Alternativamente, ejecuta esto en el SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
```

## 8. Configurar URLs en Supabase (importante para el deploy)

Cuando despliegues en el Pi (o en cualquier sitio), añade esa URL en:

**Supabase → Authentication → URL Configuration**
- **Site URL**: `http://<IP-DEL-PI>` (o tu dominio)
- **Redirect URLs**: añade la misma

Sin esto, los emails de confirmación y los flujos de auth pueden fallar.

## ✅ Verificar que todo funciona

- [ ] Catálogo en `/productos` muestra 8 productos
- [ ] Click en un producto abre su detalle
- [ ] Añadir al carrito funciona y persiste tras recargar
- [ ] `/registro` crea cuenta nueva
- [ ] `/checkout` permite seleccionar método de envío
- [ ] Tras pagar aparece en `/mis-ordenes`
- [ ] Con cuenta admin, `/admin` muestra dashboard y productos
