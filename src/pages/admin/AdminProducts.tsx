import { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, EyeOff, Eye, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { isOfferActive } from '@/utils/pricing';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge, PageSpinner, EmptyState } from '@/components/ui/Feedback';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), variants:product_variants(*)')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    load();
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) return toast.error(error.message);
    toast.success('Producto eliminado');
    load();
  };

  const handleToggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);
    if (error) return toast.error(error.message);
    toast.success(product.is_active ? 'Producto desactivado' : 'Producto activado');
    load();
  };

  return (
    <div className="rounded-2xl border border-sage-100 bg-cream-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-bark-700">Productos</h2>
        <Button onClick={openCreate} variant="clay">
          <Plus size={16} /> Nuevo producto
        </Button>
      </div>

      {loading ? (
        <PageSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          title="Aún no hay productos"
          description="Crea tu primer producto para empezar."
          action={<Button onClick={openCreate}>Crear producto</Button>}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sage-200 text-xs uppercase tracking-wide text-bark-400">
              <tr>
                <th className="pb-3 pr-3">Producto</th>
                <th className="pb-3 pr-3">Categoría</th>
                <th className="pb-3 pr-3">Precio</th>
                <th className="pb-3 pr-3">Stock</th>
                <th className="pb-3 pr-3">Variantes</th>
                <th className="pb-3 pr-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {products.map((p) => {
                const onOffer = isOfferActive(p);
                return (
                  <tr key={p.id} className="hover:bg-sage-50/50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-bark-700">{p.name}</p>
                          {onOffer && (
                            <span className="inline-flex items-center gap-1 text-xs text-clay-600">
                              <Sparkles size={10} /> En oferta
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-bark-500">{p.category?.name ?? '—'}</td>
                    <td className="py-3 pr-3">
                      <div>
                        {onOffer && p.discount_price != null && (
                          <span className="block text-bark-400 text-xs line-through">
                            {formatPrice(p.price)}
                          </span>
                        )}
                        <span className="font-medium text-bark-700">
                          {formatPrice(onOffer && p.discount_price != null ? p.discount_price : p.price)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={p.stock === 0 ? 'text-red-700' : 'text-bark-600'}>{p.stock}</span>
                    </td>
                    <td className="py-3 pr-3 text-bark-500">
                      {p.variants?.length ?? 0}
                    </td>
                    <td className="py-3 pr-3">
                      {p.is_active ? (
                        <Badge className="bg-sage-100 text-sage-800">Activo</Badge>
                      ) : (
                        <Badge className="bg-cream-200 text-bark-500">Inactivo</Badge>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className="rounded p-1.5 text-bark-400 hover:bg-sage-100 hover:text-sage-700 transition"
                          title={p.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {p.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 text-bark-400 hover:bg-sage-100 hover:text-sage-700 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="rounded p-1.5 text-bark-400 hover:bg-red-50 hover:text-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        maxWidth="max-w-2xl"
      >
        <ProductForm
          initial={editing}
          onSaved={handleSaved}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
