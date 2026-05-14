import { Input } from '@/components/ui/Input';
import type { ShippingAddress } from '@/types';

interface ShippingFormProps {
  values: { name: string; email: string; address: ShippingAddress };
  onChange: (values: { name: string; email: string; address: ShippingAddress }) => void;
  errors?: Partial<Record<string, string>>;
}

export const ShippingForm = ({ values, onChange, errors = {} }: ShippingFormProps) => {
  const set = (key: keyof typeof values, v: string) =>
    onChange({ ...values, [key]: v });
  const setAddr = (key: keyof ShippingAddress, v: string) =>
    onChange({ ...values, address: { ...values.address, [key]: v } });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
          required
        />
      </div>
      <Input
        label="Dirección"
        value={values.address.street}
        onChange={(e) => setAddr('street', e.target.value)}
        error={errors.street}
        placeholder="Calle, número, piso..."
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Ciudad"
          value={values.address.city}
          onChange={(e) => setAddr('city', e.target.value)}
          error={errors.city}
          required
        />
        <Input
          label="Provincia"
          value={values.address.state}
          onChange={(e) => setAddr('state', e.target.value)}
          error={errors.state}
        />
        <Input
          label="Código postal"
          value={values.address.postal_code}
          onChange={(e) => setAddr('postal_code', e.target.value)}
          error={errors.postal_code}
          required
        />
      </div>
      <Input
        label="País"
        value={values.address.country}
        onChange={(e) => setAddr('country', e.target.value)}
        error={errors.country}
        required
      />
    </div>
  );
};
