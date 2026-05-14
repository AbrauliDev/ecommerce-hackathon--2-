import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/format';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/types';

interface ProductFormProps {
  initial?: Product | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  category_id: string;
  is_active: boolean;
}

const defaults: FormState = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  image_url: '',
  category_id: '',
  is_active: true,
};

export const ProductForm = ({ initial, onSaved, onCancel }: ProductFormProps) => {
  const { categories } = useCategories();
  const [form, setForm] = useState<FormState>(defaults);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description ?? '',
        price: String(initial.price),
        stock: String(initial.stock),
        image_url: initial.image_url ?? '',
        category_id: initial.category_id ?? '',
        is_active: initial.is_active,
      });
    } else {
      setForm(defaults);
    }
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = initial
      ? await supabase.from('products').update(payload).eq('id', initial.id)
      : await supabase.from('products').insert(payload);

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(initial ? 'Producto actualizado' : 'Producto creado');
    onSaved?.();
  };

  const selectClass = 'mt-1 w-full rounded-lg border border-sage-200 bg-cream-50 px-3 py-2.5 text-sm text-bark-700 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <div>
        <label className="text-sm font-medium text-bark-600">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={selectClass}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Precio (€)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
      </div>
      <Input label="URL de imagen" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
      <div>
        <label className="text-sm font-medium text-bark-600">Categoría</label>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={selectClass}>
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-bark-600">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-400"
        />
        Producto activo (visible en la tienda)
      </label>
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={loading}>
          {initial ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
