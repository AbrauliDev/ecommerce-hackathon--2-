import { Truck, ShieldCheck, CreditCard, Package } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Envío Gratis', desc: 'En pedidos +50€' },
  { icon: ShieldCheck, title: 'Garantía', desc: '2 años en todo' },
  { icon: CreditCard, title: 'Pago Seguro', desc: '100% protegido' },
  { icon: Package, title: 'Devoluciones', desc: '30 días gratis' },
];

export const FeaturesBar = () => (
  <section className="bg-cream-100 py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-sage-200/60 bg-cream-50 p-5 transition hover:border-sage-400 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-sage-700 group-hover:bg-sage-600 group-hover:text-cream-50 transition">
              <f.icon size={22} strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-base font-semibold text-bark-700">{f.title}</h3>
            <p className="mt-0.5 text-sm text-bark-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
