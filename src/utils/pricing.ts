import type { Product } from '@/types';

/**
 * Determina si una oferta de producto está activa AHORA
 * en base a discount_price, discount_starts_at y discount_ends_at.
 */
export const isOfferActive = (product: Product): boolean => {
  if (product.discount_price == null) return false;

  const now = Date.now();
  const startsAt = product.discount_starts_at
    ? new Date(product.discount_starts_at).getTime()
    : null;
  const endsAt = product.discount_ends_at
    ? new Date(product.discount_ends_at).getTime()
    : null;

  if (startsAt !== null && startsAt > now) return false;
  if (endsAt !== null && endsAt < now) return false;

  return true;
};

/**
 * Devuelve el precio que se debe cobrar a día de hoy.
 * Si hay oferta activa, devuelve discount_price. Si no, price.
 *
 * IMPORTANTE: en el checkout esto se valida también server-side
 * via función Postgres `get_current_price()`. El cliente solo decide qué mostrar.
 */
export const getCurrentPrice = (product: Product): number => {
  if (isOfferActive(product) && product.discount_price != null) {
    return product.discount_price;
  }
  return product.price;
};

/**
 * Porcentaje de descuento aplicado (0-100).
 * Devuelve 0 si no hay oferta activa.
 */
export const getDiscountPercent = (product: Product): number => {
  if (!isOfferActive(product) || product.discount_price == null) return 0;
  return Math.round(((product.price - product.discount_price) / product.price) * 100);
};

/**
 * Tiempo restante de la oferta formateado (ej. "3 días", "5 horas", "12 min")
 * Devuelve null si no hay oferta o no tiene fecha de fin.
 */
export const getOfferTimeLeft = (product: Product): string | null => {
  if (!isOfferActive(product) || !product.discount_ends_at) return null;

  const ms = new Date(product.discount_ends_at).getTime() - Date.now();
  if (ms <= 0) return null;

  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days >= 1) return `${days} ${days === 1 ? 'día' : 'días'}`;

  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours >= 1) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;

  const mins = Math.floor(ms / (1000 * 60));
  return `${mins} min`;
};
