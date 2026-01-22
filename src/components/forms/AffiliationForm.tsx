import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { User, Phone, Mail, CreditCard, Home, MapPin, Calendar, Building, CheckCircle, AlertCircle, Download, Navigation, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input, Select } from '@/components/common';
import { addAffiliate } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { REGIONES_PERU, PROVINCIAS_POR_REGION, REDES_SOCIALES, SEDES } from '@/utils/constants';
import { generateAffiliatePDF } from '@/utils/generateAffiliatePDF';
import type { AffiliateFormData, Affiliate } from '@/types';

const schema = z.object({
  apellidoPaterno: z.string().min(2, 'El apellido paterno es requerido'),
  apellidoMaterno: z.string().min(2, 'El apellido materno es requerido'),
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  estadoCivil: z.enum(['S', 'C', 'V', 'D', 'Conv'], { errorMap: () => ({ message: 'Seleccione estado civil' }) }),
  sexo: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Seleccione sexo' }) }),
  lugarNacimiento: z.string().min(2, 'El lugar de nacimiento es requerido'),
  region: z.string().min(1, 'La región es requerida'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  distrito: z.string().min(2, 'El distrito es requerido'),
  direccion: z.string().min(3, 'La dirección es requerida'),
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
  const [submittedData, setSubmittedData] = useState<AffiliateFormData | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success(response.message || '¡Registro exitoso! Gracias por afiliarte.');
        setSubmittedData(variables);
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

  const onSubmit = (data: AffiliateFormData) => {
    mutation.mutate(data);
  };

  // Convert form data to Affiliate format for PDF generation
  const handleDownloadPDF = () => {
    if (!submittedData) return;

    const affiliateForPDF: Affiliate = {
      ID: '',
      Fecha: new Date().toISOString(),
      Nombre: submittedData.nombres,
      Apellidos: `${submittedData.apellidoPaterno} ${submittedData.apellidoMaterno}`.trim(),
      DNI: submittedData.dni,
      Telefono: submittedData.telefono,
      Email: submittedData.email || '',
      Direccion: submittedData.direccion || '',
      Distrito: submittedData.distrito || '',
      Provincia: submittedData.provincia || '',
      Estado: 'Pendiente',
      Region: submittedData.region || '',
      FechaNacimiento: submittedData.fechaNacimiento || '',
      LugarNacimiento: submittedData.lugarNacimiento || '',
      EstadoCivil: submittedData.estadoCivil,
      Sexo: submittedData.sexo,
      NumeroDireccion: submittedData.numeroDireccion || '',
      Urbanizacion: submittedData.urbanizacion || '',
    };

    try {
      generateAffiliatePDF(affiliateForPDF);
      toast.success('Ficha PDF descargada correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  // Handle new registration
  const handleNewRegistration = () => {
    setRegistrationSuccess(false);
    setSubmittedData(null);
    reset();
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

  // Show success section if registration was successful
  if (registrationSuccess && submittedData) {
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h3>
          <p className="text-green-100">
            Gracias por unirte a <strong>Ahora Nación</strong>, {submittedData.nombres}.
          </p>
        </div>

        {/* Download PDF Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-900 mb-2">Descarga tu Ficha de Afiliación</h4>
              <p className="text-blue-700 text-sm mb-4">
                Descarga tu ficha en PDF, imprímela y llévala a cualquiera de nuestras sedes para completar tu afiliación con tu <strong>foto, firma y huella digital</strong>.
              </p>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Download className="w-5 h-5" />}
                onClick={handleDownloadPDF}
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                Descargar Ficha PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Party Bases Section */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            Visita Nuestras Sedes
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Lleva tu ficha impresa a cualquiera de nuestras sedes para completar tu afiliación:
          </p>

          <div className="space-y-3">
            {SEDES.slice(0, 3).map((sede) => (
              <div
                key={sede.id}
                className={`p-4 rounded-lg border-2 ${
                  sede.esPrincipal ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-800">{sede.nombre}</h5>
                      {sede.esPrincipal && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{sede.direccion}</p>
                    {sede.referencia && (
                      <p className="text-xs text-gray-500">Ref: {sede.referencia}</p>
                    )}
                  </div>
                  {sede.googleMapsUrl && (
                    <a
                      href={sede.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Ver en Google Maps"
                    >
                      <Navigation className="w-5 h-5 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/sedes"
            className="mt-4 inline-flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700"
          >
            <MapPin className="w-4 h-4" />
            Ver todas las sedes
          </Link>
        </div>

        {/* WhatsApp Group */}
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
                Mantente informado sobre actividades y eventos del partido.
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

        {/* New Registration Button */}
        <div className="text-center pt-4 border-t-2 border-gray-100">
          <button
            onClick={handleNewRegistration}
            className="text-gray-600 hover:text-red-600 font-medium text-sm underline"
          >
            ¿Quieres registrar a otra persona?
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Encabezado estilo ficha oficial mejorado */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-5 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-wide">FICHA DE AFILIACIÓN</h3>
            <p className="text-red-100 font-medium mt-1">PP000741 - AHORA NACIÓN - AN</p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <p className="text-xs font-medium">Alcance Nacional</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-sm text-red-50 leading-relaxed">
            Por medio del presente manifiesto mi decisión de <strong>AFILIARME</strong> a la organización política,
            comprometiéndome a cumplir con su estatuto y demás normas internas.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-red-100 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>Los campos marcados con <span className="text-yellow-300 font-bold">*</span> son obligatorios</span>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b-2 border-red-100 flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-red-600" />
          </div>
          DATOS PERSONALES
        </h4>

        {/* Apellido Paterno, Materno, Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
          <Input
            label="Nombres *"
            placeholder="Ej: Juan Carlos"
            error={errors.nombres?.message}
            {...register('nombres')}
          />
        </div>

        {/* DNI, Fecha Nacimiento, Estado Civil, Sexo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <Input
            label="DNI *"
            placeholder="12345678"
            leftIcon={<CreditCard className="w-4 h-4" />}
            error={errors.dni?.message}
            maxLength={8}
            {...register('dni')}
          />
          <Input
            label="Fecha de Nacimiento *"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.fechaNacimiento?.message}
            {...register('fechaNacimiento')}
          />
          <Select
            label="Estado Civil *"
            options={ESTADOS_CIVILES}
            placeholder="Seleccione"
            error={errors.estadoCivil?.message}
            {...register('estadoCivil')}
          />
          <Select
            label="Sexo *"
            options={SEXOS}
            placeholder="Seleccione"
            error={errors.sexo?.message}
            {...register('sexo')}
          />
        </div>

        {/* Lugar de Nacimiento */}
        <Input
          label="Lugar de Nacimiento *"
          placeholder="Ej: Juliaca, Puno, Perú"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.lugarNacimiento?.message}
          {...register('lugarNacimiento')}
        />
      </div>

      {/* DOMICILIO ACTUAL */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b-2 border-red-100 flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-lg">
            <Home className="w-5 h-5 text-red-600" />
          </div>
          DOMICILIO ACTUAL
        </h4>

        {/* Región, Provincia, Distrito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Región *</label>
            <select
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 hover:bg-white transition-colors"
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
            placeholder={selectedRegion ? "Seleccione provincia" : "Primero seleccione región"}
            error={errors.provincia?.message}
            {...register('provincia')}
            disabled={!selectedRegion}
          />
          <Input
            label="Distrito *"
            placeholder="Ej: Puno"
            error={errors.distrito?.message}
            {...register('distrito')}
          />
        </div>

        {/* Dirección y Número */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="md:col-span-3">
            <Input
              label="Avenida / Calle / Jirón *"
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
            helperText="Opcional"
            {...register('numeroDireccion')}
          />
        </div>

        {/* Urbanización */}
        <Input
          label="Urbanización / Sector / Caserío"
          placeholder="Ej: Urb. San Carlos"
          error={errors.urbanizacion?.message}
          helperText="Opcional"
          {...register('urbanizacion')}
          className="mb-5"
        />

        {/* Teléfono y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono Celular *"
            placeholder="987654321"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.telefono?.message}
            maxLength={9}
            {...register('telefono')}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            helperText="Opcional - para recibir información"
            {...register('email')}
          />
        </div>
      </div>

      {/* Declaración */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Declaración Jurada</p>
            <p className="text-sm text-amber-700">
              Al enviar este formulario, declaro bajo juramento que los datos proporcionados
              son verdaderos y acepto las normas del partido <strong>Ahora Nación</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={mutation.isPending}
        className="!bg-gradient-to-r !from-red-600 !to-red-700 hover:!from-red-700 hover:!to-red-800 !text-white !font-bold !py-4 !text-lg shadow-lg hover:shadow-xl transition-all"
      >
        {mutation.isPending ? 'Registrando...' : '¡Quiero Afiliarme a Ahora Nación!'}
      </Button>

      {/* WhatsApp Group */}
      <div className="text-center pt-6 border-t-2 border-gray-100">
        <p className="text-gray-600 text-sm mb-4">
          ¿Quieres estar más conectado con la campaña?
        </p>
        <a
          href={REDES_SOCIALES.whatsappGrupo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
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
