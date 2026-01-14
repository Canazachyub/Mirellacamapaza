import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, Mail } from 'lucide-react';
import { Button, Input, Select } from '@/components/common';
import { addVolunteer } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { DISTRITOS_PUNO, AREAS_VOLUNTARIADO, DISPONIBILIDAD, REDES_SOCIALES } from '@/utils/constants';
import type { VolunteerFormData } from '@/types';
import { cn } from '@/utils/cn';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  dni: z.string().optional(),
  telefono: z.string().min(9, 'El teléfono debe tener 9 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  distrito: z.string().optional(),
  areasInteres: z.array(z.string()).min(1, 'Selecciona al menos un área'),
  disponibilidad: z.string().optional(),
});

interface VolunteerFormProps {
  onSuccess?: () => void;
}

const VolunteerForm = ({ onSuccess }: VolunteerFormProps) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      areasInteres: [],
    },
  });

  const mutation = useMutation({
    mutationFn: addVolunteer,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || '¡Registro exitoso!');
        reset();
        onSuccess?.();
      } else {
        toast.error(response.error || 'Error al registrar');
      }
    },
    onError: () => {
      toast.error('Error de conexión. Intenta de nuevo.');
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    mutation.mutate(data);
  };

  const distritoOptions = DISTRITOS_PUNO.map((d) => ({ value: d, label: d }));
  const disponibilidadOptions = DISPONIBILIDAD.map((d) => ({ value: d, label: d }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre y Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          placeholder="Ingresa tus nombres"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.nombre?.message}
          {...register('nombre')}
          required
        />
        <Input
          label="Apellidos"
          placeholder="Ingresa tus apellidos"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.apellidos?.message}
          {...register('apellidos')}
          required
        />
      </div>

      {/* DNI y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="DNI"
          placeholder="12345678 (opcional)"
          maxLength={8}
          {...register('dni')}
        />
        <Input
          label="Teléfono"
          placeholder="987654321"
          leftIcon={<Phone className="w-5 h-5" />}
          error={errors.telefono?.message}
          maxLength={9}
          {...register('telefono')}
          required
        />
      </div>

      {/* Email y Distrito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Distrito"
          options={distritoOptions}
          placeholder="Selecciona tu distrito"
          {...register('distrito')}
        />
      </div>

      {/* Áreas de Interés */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          ¿En qué áreas te gustaría colaborar? <span className="text-red-500">*</span>
        </label>
        <Controller
          name="areasInteres"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AREAS_VOLUNTARIADO.map((area) => (
                <label
                  key={area}
                  className={cn(
                    'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all',
                    field.value.includes(area)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-secondary-200 hover:border-secondary-300'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={field.value.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...field.value, area]);
                      } else {
                        field.onChange(field.value.filter((a) => a !== area));
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.areasInteres && (
          <p className="mt-1 text-sm text-red-500">{errors.areasInteres.message}</p>
        )}
      </div>

      {/* Disponibilidad */}
      <Select
        label="Disponibilidad"
        options={disponibilidadOptions}
        placeholder="¿Cuándo puedes colaborar?"
        {...register('disponibilidad')}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={mutation.isPending}
      >
        ¡Quiero ser Voluntario!
      </Button>

      {/* WhatsApp Group */}
      <div className="text-center pt-4 border-t">
        <p className="text-secondary-600 text-sm mb-3">
          ¡Únete a nuestro grupo de voluntarios!
        </p>
        <a
          href={REDES_SOCIALES.whatsappGrupo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Grupo de Voluntariado
        </a>
      </div>
    </form>
  );
};

export default VolunteerForm;
