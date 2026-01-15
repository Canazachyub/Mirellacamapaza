import type { Sede, Proposal, NavItem } from '@/types';

// Información de la candidata
export const CANDIDATA = {
  nombre: 'Mirella',
  apellidos: 'Camapaza Quispe',
  nombreCompleto: 'Dra. Mirella Camapaza Quispe',
  titulo: 'Dra.',
  cargo: 'Candidata a Diputada por Puno',
  numeroLista: 4,
  partido: 'Ahora Nación',
  region: 'Puno',
  slogan: 'Mano dura contra el crimen y manos limpias para gobernar',
} as const;

// Contacto
export const CONTACTO = {
  whatsapp: '51964271720',
  whatsappDisplay: '+51 964 271 720',
  email: 'dra.mirella.camapaza.4@gmail.com',
  whatsappMessage: 'Hola, me interesa información sobre la candidatura de la Dra. Mirella Camapaza',
} as const;

// Redes Sociales
export const REDES_SOCIALES = {
  tiktok: {
    url: 'https://www.tiktok.com/@dramirellacamapaza',
    usuario: '@dramirellacamapaza',
    nombre: 'TikTok',
  },
  instagram: {
    url: 'https://www.instagram.com/dramirellacamapaza/',
    usuario: '@dramirellacamapaza',
    nombre: 'Instagram',
  },
  facebook: {
    url: 'https://www.facebook.com/ahoranacionilave/',
    nombre: 'Facebook',
    pagina: 'Ahora Nación Ilave',
  },
  whatsappGrupo: {
    url: 'https://chat.whatsapp.com/IUEaHeI5BcQKk9esAC4xE3',
    nombre: 'Grupo de Voluntariado',
  },
} as const;

// Sedes
export const SEDES: Sede[] = [
  {
    id: 'sede-principal',
    nombre: 'Sede Principal - Base Regional Puno',
    direccion: 'Jr. Prolongación Arboleda Manzana Ñ Lote 6, Parque Industrial Salcedo',
    referencia: 'Costado de SENATI',
    ciudad: 'Puno',
    lat: -15.870420,
    lng: -69.999016,
    googleMapsUrl: 'https://maps.app.goo.gl/jxQzsh4HhAsw3YeK8?g_st=awb',
    esPrincipal: true,
  },
  {
    id: 'juliaca-1',
    nombre: 'Sede Juliaca - Deustua',
    direccion: 'Jr. Deustua 434',
    referencia: 'Salida a Puno',
    ciudad: 'Juliaca',
    lat: -15.5000,
    lng: -70.1333,
    esPrincipal: false,
  },
  {
    id: 'juliaca-2',
    nombre: 'Sede Juliaca - Gonzales Prada',
    direccion: 'Jr. Gonzales Prada 368',
    referencia: '',
    ciudad: 'Juliaca',
    lat: -15.4980,
    lng: -70.1300,
    esPrincipal: false,
  },
  {
    id: 'ilave',
    nombre: 'Sede Collao - Ilave',
    direccion: 'Jr. Los Mártires 162',
    referencia: 'Grifo Quenaya, Barrio Cruzani',
    ciudad: 'Ilave',
    lat: -16.0833,
    lng: -69.6500,
    esPrincipal: false,
  },
];

// Propuestas
export const PROPUESTAS: Proposal[] = [
  {
    id: 'salud',
    titulo: 'Salud para Todos',
    descripcion: 'Mejorar el acceso y calidad de los servicios de salud en toda la región Puno.',
    categoria: 'Salud',
    icono: 'Heart',
    detalles: [
      'Construcción y equipamiento de centros de salud en zonas rurales',
      'Programa de salud preventiva y brigadas médicas',
      'Fortalecimiento del Hospital Regional de Puno',
      'Acceso a medicamentos de calidad',
    ],
  },
  {
    id: 'educacion',
    titulo: 'Educación de Calidad',
    descripcion: 'Transformar la educación en Puno con infraestructura moderna y docentes capacitados.',
    categoria: 'Educación',
    icono: 'GraduationCap',
    detalles: [
      'Mejoramiento de infraestructura educativa',
      'Programas de capacitación docente',
      'Becas para estudiantes destacados',
      'Implementación de tecnología en aulas',
    ],
  },
  {
    id: 'economia',
    titulo: 'Desarrollo Económico',
    descripcion: 'Impulsar el crecimiento económico y la generación de empleo en la región.',
    categoria: 'Desarrollo Económico',
    icono: 'TrendingUp',
    detalles: [
      'Apoyo a micro y pequeños empresarios',
      'Promoción del turismo regional',
      'Fomento de la agroindustria',
      'Facilitación del comercio transfronterizo',
    ],
  },
  {
    id: 'infraestructura',
    titulo: 'Infraestructura Moderna',
    descripcion: 'Construir y mejorar la infraestructura vial y de servicios básicos.',
    categoria: 'Infraestructura',
    icono: 'Building',
    detalles: [
      'Mejoramiento de carreteras y caminos rurales',
      'Proyectos de agua y saneamiento',
      'Electrificación rural',
      'Conectividad digital para todos',
    ],
  },
  {
    id: 'agricultura',
    titulo: 'Agricultura Sostenible',
    descripcion: 'Fortalecer la agricultura y ganadería con tecnología y mercados justos.',
    categoria: 'Agricultura',
    icono: 'Leaf',
    detalles: [
      'Sistemas de riego tecnificado',
      'Acceso a créditos agrarios',
      'Mejoramiento genético del ganado',
      'Mercados justos para productores',
    ],
  },
  {
    id: 'ambiente',
    titulo: 'Medio Ambiente',
    descripcion: 'Proteger nuestros recursos naturales y combatir la contaminación del Lago Titicaca.',
    categoria: 'Medio Ambiente',
    icono: 'TreePine',
    detalles: [
      'Descontaminación del Lago Titicaca',
      'Manejo de residuos sólidos',
      'Reforestación y áreas verdes',
      'Educación ambiental',
    ],
  },
];

// Colores del partido
export const COLORES = {
  primario: '#dc2626',
  secundario: '#1e293b',
  acento: '#fbbf24',
  fondo: '#ffffff',
  texto: '#1f2937',
} as const;

// Categorías de propuestas
export const CATEGORIAS_PROPUESTAS = [
  'Salud',
  'Educación',
  'Desarrollo Económico',
  'Infraestructura',
  'Agricultura',
  'Medio Ambiente',
  'Seguridad',
  'Cultura',
] as const;

// Áreas de interés para voluntarios
export const AREAS_VOLUNTARIADO = [
  'Redes Sociales',
  'Logística',
  'Comunicaciones',
  'Eventos',
  'Transporte',
  'Diseño Gráfico',
  'Fotografía/Video',
  'Brigadas de Campo',
  'Call Center',
  'Jurídico',
] as const;

// Disponibilidad
export const DISPONIBILIDAD = [
  'Tiempo completo',
  'Medio tiempo',
  'Fines de semana',
  'Solo eventos',
  'Disponibilidad variable',
] as const;

// Distritos de Puno
export const DISTRITOS_PUNO = [
  'Puno',
  'Juliaca',
  'Ilave',
  'Ayaviri',
  'Azángaro',
  'Macusani',
  'Juli',
  'Lampa',
  'Huancané',
  'Yunguyo',
  'Desaguadero',
  'Melgar',
  'Sandia',
  'Carabaya',
  'Otro',
] as const;

// Provincias de Puno
export const PROVINCIAS_PUNO = [
  'Puno',
  'San Román',
  'El Collao',
  'Melgar',
  'Azángaro',
  'Carabaya',
  'Chucuito',
  'Lampa',
  'Huancané',
  'Yunguyo',
  'Sandia',
  'Moho',
  'San Antonio de Putina',
] as const;

// Estados
export const ESTADOS_MENSAJE = ['Nuevo', 'Leido', 'Respondido', 'Archivado'] as const;
export const ESTADOS_AFILIADO = ['Pendiente', 'Verificado', 'Activo', 'Inactivo'] as const;
export const ESTADOS_VOLUNTARIO = ['Activo', 'Inactivo', 'Pendiente'] as const;
export const ESTADOS_EVENTO = ['Programado', 'EnCurso', 'Finalizado', 'Cancelado'] as const;

// Navegación pública
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Conóceme', href: '/conoceme' },
  { label: 'Propuestas', href: '/propuestas' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Sedes', href: '/sedes' },
  { label: 'Contacto', href: '/contacto' },
];

// Navegación dashboard
export const DASHBOARD_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Mensajes', href: '/admin/mensajes', icon: 'MessageSquare' },
  { label: 'Afiliados', href: '/admin/afiliados', icon: 'Users' },
  { label: 'Voluntarios', href: '/admin/voluntarios', icon: 'UserPlus' },
  { label: 'Archivos', href: '/admin/archivos', icon: 'FolderOpen' },
  { label: 'Galería', href: '/admin/galeria', icon: 'Image' },
  { label: 'Equipos', href: '/admin/equipos', icon: 'UsersRound' },
  { label: 'Eventos', href: '/admin/eventos', icon: 'Calendar' },
  { label: 'Redes Sociales', href: '/admin/redes', icon: 'Share2' },
  { label: 'Reportes', href: '/admin/reportes', icon: 'BarChart3' },
  { label: 'Configuración', href: '/admin/configuracion', icon: 'Settings' },
];

// Fecha de elecciones
export const FECHA_ELECCIONES = new Date('2026-04-12T08:00:00');

// API URL - Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKLcr0Ig6zpMBdplm5_zGidxzxy5fAEuC4l9teM2dTlYbbjVODh3GhhoOAEsG7vIpkfA/exec';
export const API_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL;
