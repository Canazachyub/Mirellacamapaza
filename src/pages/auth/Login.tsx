import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/store/uiStore';
import { CANDIDATA } from '@/utils/constants';

const schema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof schema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.password);
      if (success) {
        toast.success('¡Bienvenido al panel administrativo!');
        navigate('/admin');
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card padding="lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-600 flex items-center justify-center mb-4">
              <span className="text-white font-display font-bold text-4xl">
                {CANDIDATA.numeroLista}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Panel Administrativo
            </h1>
            <p className="text-secondary-600 text-sm mt-1">
              {CANDIDATA.nombreCompleto}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa la contraseña"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Back link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Volver al sitio público
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
