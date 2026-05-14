import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/ui/Logo';
import { Leaf } from '@/components/ui/Leaf';

export const RegisterPage = () => (
  <div className="relative mx-auto flex max-w-md flex-col items-center px-4 py-16">
    <Leaf
      variant={1}
      className="absolute -right-8 top-4 h-32 w-32 text-sage-100 opacity-60"
    />
    <Leaf
      variant={2}
      className="absolute -left-8 bottom-4 h-32 w-32 text-sage-100 opacity-60"
    />
    <div className="relative w-full rounded-3xl border border-sage-100 bg-cream-50 p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center">
        <Logo variant="mark" className="h-14 w-14" />
        <h1 className="mt-4 font-display text-2xl font-bold text-bark-700">
          Únete a Lazy
        </h1>
        <p className="text-sm text-bark-400">Crea tu cuenta en 30 segundos</p>
      </div>
      <RegisterForm />
    </div>
  </div>
);
