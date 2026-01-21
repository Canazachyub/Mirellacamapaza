import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, Mail, CreditCard, Home, MapPin, Calendar, Building } from 'lucide-react';
import { Button, Input, Select } from '@/components/common';
import { addAffiliate } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { REGIONES_PERU, PROVINCIAS_POR_REGION, REDES_SOCIALES } from '@/utils/constants';
import type { AffiliateFormData } from '@/types';

const schema = z.object({
  apellidoPaterno: z.string().min(2, 'El apellido paterno es requerido'),
  apellidoMaterno: z.string().min(2, 'El apellido materno es requerido'),
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  fechaNacimiento: z.string().optional(),
  estadoCivil: z.enum(['S', 'C', 'V', 'D', 'Conv']).optional(),
  sexo: z.enum(['M', 'F']).optional(),
  lugarNacimiento: z.string().optional(),
  region: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  direccion: z.string().optional(),
  numeroDireccion: z.string().optional(),
  urbanizacion: z.string().optional(),
  telefono: z.string().min(9, 'El teléfono debe tener 9 dígitos').regex(/^9\d{8}$/, 'Debe comenzar con 9'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

interface AffiliationFormProps {
  onSuccess?: () => void;
}

const ESTADOS_CIVILES = [
  { value: 'S', label: 'Soltero(a)' },
  { value: 'C', label: 'Casado(a)' },
  { value: 'V', label: 'Viudo(a)' },
  { value: 'D', label: 'Divorciado(a)' },
  { value: 'Conv', label: 'Conviviente' },
];

const SEXOS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

const AffiliationForm = ({ onSuccess }: AffiliationFormProps) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AffiliateFormData>({
    resolver: zodResolver(schema),
  });

  // Watch region to update provinces dynamically
  const selectedRegion = useWatch({ control, name: 'region' });

  const mutation = useMutation({
    mutationFn: addAffiliate,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || '¡Registro exitoso! Gracias por afiliarte.');
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

  const onSubmit = (data: AffiliateFormData) => {
    mutation.mutate(data);
  };

  // Get region options
  const regionOptions = REGIONES_PERU.map((r) => ({ value: r, label: r }));

  // Get province options based on selected region
  const provinciaOptions = selectedRegion && PROVINCIAS_POR_REGION[selectedRegion]
    ? PROVINCIAS_POR_REGION[selectedRegion].map((p) => ({ value: p, label: p }))
    : [];

  // Handle region change - reset provincia when region changes
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setValue('region', newRegion);
    setValue('provincia', ''); // Reset provincia when region changes
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Encabezado estilo ficha oficial */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">FICHA DE AFILIACIÓN</h3>
            <p className="text-sm text-gray-600 font-medium">PP000741 - AHORA NACIÓN - AN</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Alcance: Nacional</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          Por medio del presente manifiesto mi decisión de AFILIARME a la organización política,
          comprometiéndome a cumplir con su estatuto y demás normas internas.
        </p>
      </div>

      {/* DATOS PERSONALES */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
          <User className="w-4 h-4" />
          DATOS PERSONALES
        </h4>

        {/* Apellido Paterno, Materno, Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Apellido Paterno"
            placeholder="Ej: García"
            error={errors.apellidoPaterno?.message}
            {...register('apellidoPaterno')}
            required
          />
          <Input
            label="Apellido Materno"
            placeholder="Ej: López"
            error={errors.apellidoMaterno?.message}
            {...register('apellidoMaterno')}
            required
          />
          <Input
            label="Nombres"
            placeholder="Ej: Juan Carlos"
            error={errors.nombres?.message}
            {...register('nombres')}
            required
          />
        </div>

        {/* DNI, Fecha Nacimiento, Estado Civil, Sexo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="DNI"
            placeholder="12345678"
            leftIcon={<CreditCard className="w-4 h-4" />}
            error={errors.dni?.message}
            maxLength={8}
            {...register('dni')}
            required
          />
          <Input
            label="Fecha de Nacimiento"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.fechaNacimiento?.message}
            {...register('fechaNacimiento')}
          />
          <Select
            label="Estado Civil"
            options={ESTADOS_CIVILES}
            placeholder="Seleccione"
            error={errors.estadoCivil?.message}
            {...register('estadoCivil')}
          />
          <Select
            label="Sexo"
            options={SEXOS}
            placeholder="Seleccione"
            error={errors.sexo?.message}
            {...register('sexo')}
          />
        </div>

        {/* Lugar de Nacimiento */}
        <Input
          label="Lugar de Nacimiento"
          placeholder="Ej: Puno, Perú"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.lugarNacimiento?.message}
          {...register('lugarNacimiento')}
        />
      </div>

      {/* DOMICILIO ACTUAL */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b flex items-center gap-2">
          <Home className="w-4 h-4" />
          DOMICILIO ACTUAL
        </h4>

        {/* Región, Provincia, Distrito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('region')}
              onChange={handleRegionChange}
            >
              <option value="">Seleccione región</option>
              {regionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.region?.message && (
              <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>
            )}
          </div>
          <Select
            label="Provincia"
            options={provinciaOptions}
            placeholder={selectedRegion ? "Seleccione provincia" : "Primero seleccione región"}
            error={errors.provincia?.message}
            {...register('provincia')}
            disabled={!selectedRegion}
          />
          <Input
            label="Distrito"
            placeholder="Ej: Puno"
            error={errors.distrito?.message}
            {...register('distrito')}
          />
        </div>

        {/* Dirección y Número */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <Input
              label="Avenida / Calle / Jirón"
              placeholder="Ej: Jr. Lima"
              leftIcon={<Building className="w-4 h-4" />}
              error={errors.direccion?.message}
              {...register('direccion')}
            />
          </div>
          <Input
            label="Número"
            placeholder="Ej: 123"
            error={errors.numeroDireccion?.message}
            {...register('numeroDireccion')}
          />
        </div>

        {/* Urbanización */}
        <Input
          label="Urbanización / Sector / Caserío"
          placeholder="Ej: Urb. San Carlos"
          error={errors.urbanizacion?.message}
          {...register('urbanizacion')}
          className="mb-4"
        />

        {/* Teléfono y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            placeholder="987654321"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.telefono?.message}
            maxLength={9}
            {...register('telefono')}
            required
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            helperText="Opcional"
            {...register('email')}
          />
        </div>
      </div>

      {/* Declaración */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-xs text-yellow-800">
          <strong>Declaración:</strong> Al enviar este formulario, declaro que los datos proporcionados
          son verdaderos y acepto las normas del partido Ahora Nación.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={mutation.isPending}
      >
        ¡Quiero Afiliarme a Ahora Nación!
      </Button>

      {/* WhatsApp Group */}
      <div className="text-center pt-4 border-t">
        <p className="text-secondary-600 text-sm mb-3">
          ¿Quieres estar más conectado con la campaña?
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
          Únete al grupo de WhatsApp
        </a>
      </div>
    </form>
  );
};

export default AffiliationForm;
