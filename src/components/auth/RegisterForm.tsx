import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Cuenta creada. Ya puedes iniciar sesión 🌴');
      navigate('/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoFocus />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="Mínimo 6 caracteres"
        required
      />
      <Button type="submit" fullWidth loading={loading} size="lg">
        Crear cuenta
      </Button>
      <p className="text-center text-sm text-bark-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-sage-700 hover:text-clay-600 transition">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};
