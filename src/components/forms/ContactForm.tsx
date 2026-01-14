import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/common';
import { addMessage } from '@/services/api';
import { useToast } from '@/store/uiStore';
import type { ContactFormData } from '@/types';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  asunto: z.string().optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: addMessage,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || '¡Mensaje enviado!');
        reset();
        onSuccess?.();
      } else {
        toast.error(response.error || 'Error al enviar mensaje');
      }
    },
    onError: () => {
      toast.error('Error de conexión. Intenta de nuevo.');
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <Input
        label="Nombre completo"
        placeholder="¿Cómo te llamas?"
        leftIcon={<User className="w-5 h-5" />}
        error={errors.nombre?.message}
        {...register('nombre')}
        required
      />

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Teléfono"
          placeholder="987654321"
          leftIcon={<Phone className="w-5 h-5" />}
          error={errors.telefono?.message}
          {...register('telefono')}
        />
      </div>

      {/* Asunto */}
      <Input
        label="Asunto"
        placeholder="¿De qué se trata tu mensaje?"
        leftIcon={<MessageSquare className="w-5 h-5" />}
        error={errors.asunto?.message}
        {...register('asunto')}
      />

      {/* Mensaje */}
      <Textarea
        label="Mensaje"
        placeholder="Escribe tu mensaje aquí..."
        rows={5}
        error={errors.mensaje?.message}
        {...register('mensaje')}
        required
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={mutation.isPending}
      >
        Enviar Mensaje
      </Button>

      <p className="text-center text-secondary-500 text-sm">
        Te responderemos lo más pronto posible.
      </p>
    </form>
  );
};

export default ContactForm;
