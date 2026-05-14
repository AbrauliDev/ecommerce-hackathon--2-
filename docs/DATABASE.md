# 🗄️ Base de Datos

## Diagrama de relaciones

```
auth.users (Supabase)
    │
    └─── profiles ────────────┐
         (1:1)                 │
                               │
    categories                 │
        │                      │
        │                      │
        └── products ──────────┼─────────────┐
                               │             │
                               │             │
    shipping_methods           │             │
        │                      │             │
        └─── orders ───────────┘             │
                │ (1:N)                      │
                │                            │
                └── order_items ─────────────┘
```

## Tablas

### `profiles`
Extiende `auth.users` con datos custom. Se llena automáticamente vía trigger.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | FK a `auth.users.id` |
| `email` | text | único |
| `full_name` | text | |
| `role` | text | `customer` o `admin` |
| `created_at` | timestamptz | |

### `categories`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `slug` | text | único, para URLs |

### `products`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `name`, `slug`, `description` | text | |
| `price` | numeric(10,2) | |
| `stock` | int | |
| `image_url` | text | |
| `category_id` | uuid | FK |
| `is_active` | bool | si está visible en la tienda |

### `shipping_methods`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | "Estándar" / "Express" |
| `description` | text | |
| `price` | numeric(10,2) | coste del envío |
| `estimated_days` | text | "3-5 días" |
| `is_active` | bool | |

### `orders`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid | FK a profiles |
| `status` | text | `pending` / `paid` / `shipped` / `delivered` / `cancelled` |
| `subtotal`, `shipping_cost`, `total` | numeric(10,2) | |
| `shipping_method_id` | uuid | FK |
| `shipping_address` | jsonb | `{ street, city, state, postal_code, country }` |
| `customer_email`, `customer_name` | text | snapshot, no depende del profile |

### `order_items`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `order_id` | uuid | FK con cascade |
| `product_id` | uuid | FK (set null si se borra producto) |
| `product_name` | text | **snapshot** — sobrevive aunque se borre el producto |
| `unit_price` | numeric(10,2) | snapshot |
| `quantity` | int | |
| `subtotal` | numeric(10,2) | |

## 🔒 Row Level Security (RLS)

Toda la seguridad se aplica en la base de datos, NO en el frontend. Incluso si alguien usa la `anon key` directamente, solo verá lo que las políticas permiten.

### Helper: `is_admin()`
Función SQL que chequea si el usuario actual tiene `role = 'admin'`. Se usa en todas las políticas.

### Resumen de políticas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | propio o admin | (trigger) | propio | — |
| categories | todos | admin | admin | admin |
| products | activos o admin | admin | admin | admin |
| shipping_methods | todos | admin | admin | admin |
| orders | propio o admin | propio | admin | — |
| order_items | de orden propia o admin | de orden propia | — | — |

## 🔄 Trigger automático

Cuando un usuario se registra en `auth.users`, se dispara `handle_new_user()` que inserta automáticamente su fila en `profiles`. Por eso no hay que crear el profile manualmente desde el frontend.

```sql
trigger on_auth_user_created on auth.users
  for each row execute function public.handle_new_user();
```

## ⚙️ Operaciones comunes

### Promover a admin

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
```

### Resetear órdenes (desarrollo)

```sql
DELETE FROM order_items;
DELETE FROM orders;
```

### Añadir un método de envío

```sql
INSERT INTO shipping_methods (name, description, price, estimated_days)
VALUES ('Recoger en tienda', 'Recoger en local físico', 0, 'Mismo día');
```

### Cambiar todos los productos a stock 0

```sql
UPDATE products SET stock = 0;
```

## 🔧 Migraciones a futuro

Para añadir columnas sin perder datos:

```sql
ALTER TABLE products ADD COLUMN tags text[] DEFAULT '{}';
```

Ejecuta SQL incremental en el SQL Editor. Para un hackatón no se necesita una herramienta de migraciones formal.
