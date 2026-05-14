import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useShippingMethods } from '@/hooks/useShippingMethods';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { ShippingMethods } from '@/components/checkout/ShippingMethods';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Feedback';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import type { ShippingAddress } from '@/types';

export const CheckoutPage = () => {
  const { items, subtotal, totalSavings, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { methods, loading: loadingMethods } = useShippingMethods();
  const navigate = useNavigate();

  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<{
    name: string;
    email: string;
    address: ShippingAddress;
  }>({
    name: profile?.full_name ?? '',
    email: profile?.email ?? user?.email ?? '',
    address: { street: '', city: '', state: '', postal_code: '', country: 'España' },
  });

  if (items.length === 0) return <Navigate to="/carrito" replace />;

  const shippingMethod = methods.find((m) => m.id === selectedShipping);
  const shippingCost = shippingMethod?.price ?? 0;

  const validate = (): boolean => {
    if (!formValues.name.trim()) return toast.error('Falta el nombre'), false;
    if (!formValues.email.trim()) return toast.error('Falta el email'), false;
    if (!formValues.address.street.trim()) return toast.error('Falta la dirección'), false;
    if (!formValues.address.city.trim()) return toast.error('Falta la ciudad'), false;
    if (!formValues.address.postal_code.trim()) return toast.error('Falta el código postal'), false;
    if (!selectedShipping) return toast.error('Selecciona un método de envío'), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    setSubmitting(true);

    try {
      // 1) Validar precios server-side llamando a la función Postgres `get_current_price`
      // por cada producto. Esto garantiza que el descuento que vea el usuario
      // sea el real al momento del checkout (no manipulable desde el cliente).
      const pricedItems = await Promise.all(
        items.map(async (item) => {
          const { data, error } = await supabase.rpc('get_current_price', {
            p_id: item.product_id,
          });
          if (error) throw new Error(`Error al validar precio: ${error.message}`);
          // data viene como número directamente
          const serverPrice = Number(data);
          return {
            ...item,
            validated_price: serverPrice,
          };
        }),
      );

      // 2) Si algún precio cambió, avisar al usuario y abortar
      const priceChanged = pricedItems.find(
        (p) => Math.abs(p.validated_price - p.price) > 0.001,
      );
      if (priceChanged) {
        toast.error(
          `El precio de "${priceChanged.name}" ha cambiado. Revisa tu carrito.`,
          { duration: 5000 },
        );
        setSubmitting(false);
        return;
      }

      // 3) Calcular subtotal validado
      const validatedSubtotal = pricedItems.reduce(
        (acc, p) => acc + p.validated_price * p.quantity,
        0,
      );
      const total = validatedSubtotal + shippingCost;

      // 4) Crear la orden
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          subtotal: validatedSubtotal,
          shipping_cost: shippingCost,
          total,
          shipping_method_id: selectedShipping,
          shipping_address: formValues.address,
          customer_email: formValues.email,
          customer_name: formValues.name,
        })
        .select()
        .single();

      if (orderErr || !orderData) {
        throw new Error(orderErr?.message ?? 'Error al crear orden');
      }

      // 5) Insertar items (con variant_id y label como snapshot)
      const itemsPayload = pricedItems.map((p) => ({
        order_id: orderData.id,
        product_id: p.product_id,
        product_name: p.name,
        unit_price: p.validated_price,
        quantity: p.quantity,
        subtotal: p.validated_price * p.quantity,
        variant_id: p.variant_id,
        variant_label: p.variant_label,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsErr) throw new Error('Error al añadir items: ' + itemsErr.message);

      toast.success('¡Pedido creado! 🌿');
      clearCart();
      navigate(`/orden-confirmada/${orderData.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en el checkout';
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-bark-700 sm:text-4xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-sage-100 bg-cream-50 p-6">
            <h2 className="mb-5 font-display text-lg font-semibold text-bark-700">
              Datos de envío
            </h2>
            <ShippingForm values={formValues} onChange={setFormValues} />
          </section>

          <section className="rounded-2xl border border-sage-100 bg-cream-50 p-6">
            <h2 className="mb-5 font-display text-lg font-semibold text-bark-700">
              Método de envío
            </h2>
            {loadingMethods ? (
              <PageSpinner />
            ) : (
              <ShippingMethods
                methods={methods}
                selectedId={selectedShipping}
                onSelect={setSelectedShipping}
              />
            )}
          </section>
        </div>

        <div className="space-y-4">
          {totalSavings > 0 && (
            <div className="rounded-2xl border-2 border-clay-200 bg-clay-50 p-4 text-sm">
              <p className="font-bold text-clay-700">
                Ahorras {formatPrice(totalSavings)} con ofertas
              </p>
            </div>
          )}
          <CartSummary subtotal={subtotal} shippingCost={shippingCost} />
          <Button fullWidth size="lg" variant="clay" onClick={handleSubmit} loading={submitting}>
            Confirmar pedido
          </Button>
          <p className="text-center text-xs text-bark-400">
            Demo de hackathon — no se procesa pago real.
          </p>
        </div>
      </div>
    </div>
  );
};
