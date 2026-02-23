import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  User, Phone, Mail, CreditCard, Calendar, MapPin, Globe,
  Shield, CheckCircle, AlertCircle, Briefcase, Search, Eraser,
} from 'lucide-react';
import { Button, Input, Select } from '@/components/common';
import { addPersonero } from '@/services/api';
import { useToast } from '@/store/uiStore';
import {
  REGIONES_PERU, PROVINCIAS_POR_REGION, PAISES, TIPOS_EXPERIENCIA_PERSONERO,
  REDES_SOCIALES,
} from '@/utils/constants';
import type { PersoneroFormData } from '@/types';

const schema = z.object({
  dni: z.string().length(8, 'El DNI debe tener exactamente 8 dígitos numéricos').regex(/^\d+$/, 'Solo números'),
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidoPaterno: z.string().min(2, 'El apellido paterno es requerido'),
  apellidoMaterno: z.string().min(2, 'El apellido materno es requerido'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida').refine((val) => {
    const birthDate = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
    return adjustedAge >= 18;
  }, 'Debe ser mayor de edad'),
  telefono: z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^9\d{8}$/.test(val), 'Formato: 9XXXXXXXX (9 dígitos comenzando con 9)'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  tipoUbicacion: z.enum(['Nacional', 'Extranjero']),
  region: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  pais: z.string().optional(),
  ciudadExterior: z.string().optional(),
  grupoVotacion: z.string().optional(),
  referente: z.string().optional(),
  esAfiliado: z.boolean(),
  tieneExperiencia: z.boolean(),
  tipoExperiencia: z.string().optional(),
  detalleExperiencia: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.tipoUbicacion === 'Nacional') {
    if (!data.region) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La región es requerida', path: ['region'] });
    }
    if (!data.provincia) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La provincia es requerida', path: ['provincia'] });
    }
    if (!data.distrito) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El distrito es requerido', path: ['distrito'] });
    }
  }
  if (data.tipoUbicacion === 'Extranjero') {
    if (!data.pais) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El país es requerido', path: ['pais'] });
    }
  }
  if (data.tieneExperiencia && data.tipoExperiencia === 'Otro' && !data.detalleExperiencia) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Detalle su experiencia', path: ['detalleExperiencia'] });
  }
});

interface PersoneroFormProps {
  onSuccess?: () => void;
}

const PersoneroForm = ({ onSuccess }: PersoneroFormProps) => {
  const toast = useToast();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [dniValidated, setDniValidated] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PersoneroFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoUbicacion: 'Nacional',
      esAfiliado: false,
      tieneExperiencia: false,
    },
  });

  const tipoUbicacion = useWatch({ control, name: 'tipoUbicacion' });
  const selectedRegion = useWatch({ control, name: 'region' });
  const tieneExperiencia = useWatch({ control, name: 'tieneExperiencia' });
  const tipoExperiencia = useWatch({ control, name: 'tipoExperiencia' });

  const mutation = useMutation({
    mutationFn: addPersonero,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || '¡Registro exitoso! Gracias por ser personero de mesa.');
        setRegistrationSuccess(true);
        onSuccess?.();
      } else {
        toast.error(response.error || 'Error al registrar');
      }
    },
    onError: () => {
      toast.error('Error de conexión. Intenta de nuevo.');
    },
  });

  const onSubmit = (data: PersoneroFormData) => {
    mutation.mutate(data);
  };

  const handleClearForm = () => {
    reset();
    setDniValidated(false);
  };

  const handleValidateDNI = () => {
    const dni = getValues('dni');
    if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
      toast.error('Ingrese un DNI válido de 8 dígitos');
      return;
    }
    setDniValidated(true);
    toast.success('DNI validado: Complete los datos de nombres y apellidos');
  };

  const handleNewRegistration = () => {
    setRegistrationSuccess(false);
    setDniValidated(false);
    reset();
  };

  const regionOptions = REGIONES_PERU.map((r) => ({ value: r, label: r }));
  const provinciaOptions = selectedRegion && PROVINCIAS_POR_REGION[selectedRegion]
    ? PROVINCIAS_POR_REGION[selectedRegion].map((p) => ({ value: p, label: p }))
    : [];
  const paisOptions = PAISES.map((p) => ({ value: p, label: p }));
  const experienciaOptions = TIPOS_EXPERIENCIA_PERSONERO.map((t) => ({ value: t, label: t }));

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setValue('region', newRegion);
    setValue('provincia', '');
    setValue('distrito', '');
  };

  // Success state
  if (registrationSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h3>
          <p className="text-green-100">
            Gracias por registrarte como <strong>personero de mesa</strong>. Tu participación es fundamental para defender la democracia.
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-900 mb-2">¿Qué sigue?</h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Nos comunicaremos contigo para coordinar tu capacitación</li>
                <li>• Recibirás información sobre tu mesa asignada</li>
                <li>• Te entregaremos tu credencial de personero</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-green-900 mb-1">Únete a nuestro grupo de WhatsApp</h4>
              <p className="text-green-700 text-sm mb-3">
                Mantente informado sobre capacitaciones y coordinaciones.
              </p>
              <a
                href={REDES_SOCIALES.whatsappGrupo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-all"
              >
                Unirse al grupo
              </a>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t-2 border-gray-100">
          <button
            onClick={handleNewRegistration}
            className="text-gray-600 hover:text-blue-600 font-medium text-sm underline"
          >
            ¿Quieres registrar a otro personero?
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-wide">REGISTRO DE PERSONEROS DE MESA</h3>
            <p className="text-blue-100 font-medium mt-1">Elecciones Generales 2026</p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <p className="text-xs font-medium">Ahora Nación</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-sm text-blue-50 leading-relaxed">
            Regístrate como <strong>personero de mesa</strong> y ayuda a garantizar la transparencia del proceso electoral. Tu presencia es clave para defender cada voto.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-blue-100 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>Los campos marcados con <span className="text-yellow-300 font-bold">*</span> son obligatorios</span>
        </div>
      </div>

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b-2 border-blue-100 flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          DATOS PERSONALES
        </h4>

        {/* DNI con botón Validar */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="12345678"
                maxLength={8}
                className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors ${
                  errors.dni ? 'border-red-300' : 'border-gray-200'
                }`}
                {...register('dni')}
              />
            </div>
            <button
              type="button"
              onClick={handleValidateDNI}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Validar
            </button>
          </div>
          {errors.dni?.message && (
            <p className="text-sm text-red-500 mt-1">{errors.dni.message}</p>
          )}
          {dniValidated && !errors.dni && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> DNI validado: Complete los datos manualmente
            </p>
          )}
        </div>

        {/* Nombres, Apellido Paterno, Apellido Materno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Input
            label="Nombres *"
            placeholder="Ej: Juan Carlos"
            error={errors.nombres?.message}
            {...register('nombres')}
          />
          <Input
            label="Apellido Paterno *"
            placeholder="Ej: García"
            error={errors.apellidoPaterno?.message}
            {...register('apellidoPaterno')}
          />
          <Input
            label="Apellido Materno *"
            placeholder="Ej: López"
            error={errors.apellidoMaterno?.message}
            {...register('apellidoMaterno')}
          />
        </div>

        {/* Fecha Nacimiento, Teléfono, Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Fecha de Nacimiento *"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.fechaNacimiento?.message}
            {...register('fechaNacimiento')}
          />
          <Input
            label="Teléfono"
            placeholder="987654321"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.telefono?.message}
            helperText="Opcional - formato: 9XXXXXXXX"
            maxLength={9}
            {...register('telefono')}
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

      {/* SECCIÓN 2: UBICACIÓN DE VOTACIÓN */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b-2 border-blue-100 flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          UBICACIÓN DE VOTACIÓN
        </h4>

        {/* Radio Nacional / Extranjero */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">Lugar de Votación *</label>
          <Controller
            control={control}
            name="tipoUbicacion"
            render={({ field }) => (
              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    field.value === 'Nacional'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={field.value === 'Nacional'}
                    onChange={() => {
                      field.onChange('Nacional');
                      setValue('pais', '');
                      setValue('ciudadExterior', '');
                    }}
                  />
                  <span className="text-2xl">🇵🇪</span>
                  <span className="font-semibold">Nacional</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    field.value === 'Extranjero'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={field.value === 'Extranjero'}
                    onChange={() => {
                      field.onChange('Extranjero');
                      setValue('region', '');
                      setValue('provincia', '');
                      setValue('distrito', '');
                    }}
                  />
                  <span className="text-2xl">🌍</span>
                  <span className="font-semibold">Extranjero</span>
                </label>
              </div>
            )}
          />
        </div>

        {/* Campos condicionales Nacional */}
        {tipoUbicacion === 'Nacional' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Región *</label>
              <select
                className={`w-full px-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors ${
                  errors.region ? 'border-red-300' : 'border-gray-200'
                }`}
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
              label="Provincia *"
              options={provinciaOptions}
              placeholder={selectedRegion ? 'Seleccione provincia' : 'Primero seleccione región'}
              error={errors.provincia?.message}
              {...register('provincia')}
              disabled={!selectedRegion}
            />
            <Input
              label="Distrito *"
              placeholder="Ej: Juliaca"
              error={errors.distrito?.message}
              {...register('distrito')}
            />
          </div>
        )}

        {/* Campos condicionales Extranjero */}
        {tipoUbicacion === 'Extranjero' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <Select
              label="País *"
              options={paisOptions}
              placeholder="Seleccione país"
              error={errors.pais?.message}
              {...register('pais')}
            />
            <Input
              label="Ciudad / Provincia"
              placeholder="Ej: Buenos Aires"
              leftIcon={<Globe className="w-4 h-4" />}
              error={errors.ciudadExterior?.message}
              helperText="Opcional"
              {...register('ciudadExterior')}
            />
          </div>
        )}

        {/* Grupo de Votación */}
        <Input
          label="Grupo de Votación (Mesa)"
          placeholder="Ej. Mesa N° 012345"
          leftIcon={<CreditCard className="w-4 h-4" />}
          error={errors.grupoVotacion?.message}
          helperText="Opcional - Si conoce su número de mesa"
          {...register('grupoVotacion')}
        />
      </div>

      {/* SECCIÓN 3: REFERENTE Y EXPERIENCIA */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b-2 border-blue-100 flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          REFERENTE Y EXPERIENCIA
        </h4>

        {/* Referente */}
        <div className="mb-5">
          <Input
            label="Referente / Contacto"
            placeholder="Nombre de quien lo refiere"
            error={errors.referente?.message}
            helperText="Opcional"
            {...register('referente')}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-4 mb-5">
          <Controller
            control={control}
            name="esAfiliado"
            render={({ field }) => (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    field.value
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {field.value && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="font-medium text-gray-700">Es Afiliado al partido</span>
              </label>
            )}
          />

          <Controller
            control={control}
            name="tieneExperiencia"
            render={({ field }) => (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    field.value
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {field.value && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (!e.target.checked) {
                      setValue('tipoExperiencia', '');
                      setValue('detalleExperiencia', '');
                    }
                  }}
                />
                <span className="font-medium text-gray-700">Tiene Experiencia Previa</span>
              </label>
            )}
          />
        </div>

        {/* Campos condicionales de experiencia */}
        {tieneExperiencia && (
          <div className="space-y-4 pl-4 border-l-4 border-blue-200">
            <Select
              label="Tipo de Experiencia *"
              options={experienciaOptions}
              placeholder="Seleccione tipo"
              error={errors.tipoExperiencia?.message}
              {...register('tipoExperiencia')}
            />

            {tipoExperiencia === 'Otro' && (
              <Input
                label="Detalle de Experiencia *"
                placeholder="Describa su experiencia"
                error={errors.detalleExperiencia?.message}
                {...register('detalleExperiencia')}
              />
            )}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleClearForm}
          leftIcon={<Eraser className="w-5 h-5" />}
          className="sm:w-auto"
        >
          Limpiar Formulario
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={mutation.isPending}
          leftIcon={<Shield className="w-5 h-5" />}
          className="!bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-bold !py-4 !text-lg shadow-lg hover:shadow-xl transition-all"
        >
          {mutation.isPending ? 'Registrando...' : 'Registrar Personero'}
        </Button>
      </div>
    </form>
  );
};

export default PersoneroForm;
