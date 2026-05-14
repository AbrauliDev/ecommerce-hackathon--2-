import { useEffect, useState, useCallback } from 'react';
import { Sparkles, Calendar, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/utils/format';
import { isOfferActive, getOfferTimeLeft } from '@/utils/pricing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge, PageSpinner, EmptyState } from '@/components/ui/Feedback';
import type { Product } from '@/types';

interface OfferFormData {
  product_id: string;
  discount_price: string;
  starts_at: string;
  ends_at: string;
}

const OfferForm = ({
  products,
  initial,
  onSaved,
  onCancel,
}: {
  products: Product[];
  initial: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<OfferFormData>({
    product_id: initial?.id ?? '',
    discount_price: initial?.discount_price?.toString() ?? '',
    starts_at: initial?.discount_starts_at?.slice(0, 16) ?? '',
    ends_at: initial?.discount_ends_at?.slice(0, 16) ?? '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .update({
        discount_price: Number(form.discount_price),
        discount_starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        discount_ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        is_featured_offer: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', form.product_id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Oferta guardada');
    onSaved();
  };

  const selected = products.find((p) => p.id === form.product_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-bark-600">Producto</label>
        <select
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          disabled={!!initial}
          required
          className="mt-1 w-full rounded-lg border border-sage-200 bg-cream-50 px-3 py-2.5 text-sm text-bark-700 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition"
        >
          <option value="">Selecciona producto...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({formatPrice(p.price)})
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="rounded-lg bg-sage-50 p-3 text-sm">
          <p className="text-bark-500">Precio actual: <span className="font-semibold text-bark-700">{formatPrice(selected.price)}</span></p>
        </div>
      )}

      <Input
        label="Precio con descuento (€)"
        type="number"
        step="0.01"
        value={form.discount_price}
        onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
        required
        hint="Debe ser menor que el precio original"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Inicio (opcional)"
          type="datetime-local"
          value={form.starts_at}
          onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
          hint="Si vacío, empieza ya"
        />
        <Input
          label="Fin (opcional)"
          type="datetime-local"
          value={form.ends_at}
          onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
          hint="Si vacío, sin caducidad"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={loading} variant="clay">
          {initial ? 'Guardar cambios' : 'Crear oferta'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export const AdminOffers = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    setAllProducts((data ?? []) as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const offers = allProducts.filter(
    (p) => p.discount_price !== null || p.is_featured_offer,
  );

  const handleEnd = async (product: Product) => {
    if (!confirm(`¿Terminar oferta de "${product.name}"?`)) return;
    const { error } = await supabase
      .from('products')
      .update({
        discount_price: null,
        discount_starts_at: null,
        discount_ends_at: null,
        is_featured_offer: false,
      })
      .eq('id', product.id);
    if (error) return toast.error(error.message);
    toast.success('Oferta finalizada');
    load();
  };

  return (
    <div className="rounded-2xl border border-sage-100 bg-cream-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="inline-flex items-center gap-2 font-display text-xl font-semibold text-bark-700">
            <Sparkles size={18} className="text-clay-500" /> Ofertas Lazy
          </h2>
          <p className="mt-1 text-sm text-bark-400">
            Aplica descuentos con fecha de inicio y fin a productos del catálogo.
          </p>
        </div>
        <Button
          variant="clay"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Sparkles size={16} /> Nueva oferta
        </Button>
      </div>

      {loading ? (
        <PageSpinner />
      ) : offers.length === 0 ? (
        <EmptyState
          title="No hay ofertas activas"
          description="Crea descuentos limitados en el tiempo sobre productos del catálogo."
        />
      ) : (
        <div className="space-y-3">
          {offers.map((p) => {
            const active = isOfferActive(p);
            const timeLeft = getOfferTimeLeft(p);
            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-sage-100 bg-cream-100/50 p-4 sm:flex-row sm:items-center"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-display font-semibold text-bark-700">{p.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="line-through text-bark-400">{formatPrice(p.price)}</span>
                    <span className="font-bold text-clay-700">
                      {formatPrice(p.discount_price ?? 0)}
                    </span>
                    {active ? (
                      <Badge className="bg-sage-100 text-sage-800">Activa</Badge>
                    ) : (
                      <Badge className="bg-cream-200 text-bark-500">Inactiva</Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-bark-400">
                    {p.discount_starts_at && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} /> Inicio: {formatDate(p.discount_starts_at)}
                      </span>
                    )}
                    {p.discount_ends_at && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} /> Fin: {formatDate(p.discount_ends_at)}
                      </span>
                    )}
                    {timeLeft && (
                      <span className="font-medium text-clay-600">
                        Termina en {timeLeft}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setModalOpen(true);
                    }}
                    className="rounded p-2 text-bark-400 hover:bg-sage-100 hover:text-sage-700 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleEnd(p)}
                    className="rounded p-2 text-bark-400 hover:bg-red-50 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar oferta' : 'Nueva oferta'}
        maxWidth="max-w-xl"
      >
        <OfferForm
          products={editing ? [editing] : allProducts.filter((p) => !p.is_featured_offer)}
          initial={editing}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
