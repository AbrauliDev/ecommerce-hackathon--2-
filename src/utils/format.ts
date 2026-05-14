// Formatea un número como precio en EUR (cambia 'es-ES' / 'EUR' si quieres otra moneda)
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Formatea fecha ISO a algo legible
export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Mapea el status de la orden a una etiqueta + color de tailwind
export const statusBadge = (status: string) => {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Pagada', classes: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Enviada', classes: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Entregada', classes: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelada', classes: 'bg-red-100 text-red-800' },
  };
  return map[status] ?? { label: status, classes: 'bg-gray-100 text-gray-800' };
};

// Genera un slug simple
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
