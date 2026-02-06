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
  whatsapp: '51967178956',
  whatsappDisplay: '+51 967 178 956',
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
    url: 'https://www.facebook.com/MirellaCamapazaAhoraNacion',
    nombre: 'Facebook',
    pagina: 'Dra. Mirella Camapaza',
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
  {
    id: 'ayaviri',
    nombre: 'Sede Melgar - Ayaviri',
    direccion: 'Ayaviri',
    referencia: '',
    ciudad: 'Ayaviri',
    lat: -14.8817,
    lng: -70.5928,
    esPrincipal: false,
  },
  {
    id: 'puno-melgar',
    nombre: 'Sede Puno - Jr. Melgar',
    direccion: 'Jr. Melgar 244',
    referencia: 'Frente al Colegio La Merced',
    ciudad: 'Puno',
    lat: -15.8402,
    lng: -70.0219,
    esPrincipal: false,
    esNueva: true,
    fechaInauguracion: '2026-01-28T16:00:00',
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

// Propuestas del Plan de Gobierno - Ahora Nación (2026-2031)
export const PROPUESTAS_PARTIDO: Proposal[] = [
  {
    id: 'partido-salud',
    titulo: 'Salud y Modernización Sanitaria',
    descripcion: 'Transformación integral del sistema de salud con infraestructura moderna y digitalización total.',
    categoria: 'Salud',
    icono: 'HeartPulse',
    detalles: [
      'Construcción o mejora de 500 centros de salud de primer nivel',
      'Digitalización total de historias clínicas interoperables',
      'Meta de acceso universal a atención primaria',
      'Objetivo de eliminar desnutrición crónica infantil',
    ],
  },
  {
    id: 'partido-industria',
    titulo: 'Desarrollo Productivo e Industrialización',
    descripcion: 'Impulsar la industrialización regional con parques industriales y un sistema portuario integrado.',
    categoria: 'Desarrollo Económico',
    icono: 'Factory',
    detalles: [
      'Parques industriales en todas las regiones',
      'Sistema Portuario Integrado para exportaciones',
      'Descentralización productiva para impulsar economías regionales',
    ],
  },
  {
    id: 'partido-infraestructura',
    titulo: 'Infraestructura y Conectividad',
    descripcion: 'Red de transporte moderno con ferrocarriles y mejora de la red vial a nivel nacional.',
    categoria: 'Infraestructura',
    icono: 'TrainFront',
    detalles: [
      'Ferrocarriles Lima–Ica y Lima–Barranca',
      'Mantenimiento de red vial vecinal',
      'Fuerte inversión en infraestructura logística',
    ],
  },
  {
    id: 'partido-seguridad',
    titulo: 'Seguridad y Justicia',
    descripcion: 'Reforma integral del sistema de seguridad ciudadana con tecnología e integración institucional.',
    categoria: 'Seguridad',
    icono: 'Shield',
    detalles: [
      'Reforma del sistema de seguridad ciudadana',
      'Sistema informático integrado entre PNP, Fiscalía y Poder Judicial',
      'Nueva ley del Sistema Nacional de Seguridad Ciudadana',
      'Pruebas de polígrafo en admisión policial',
    ],
  },
  {
    id: 'partido-energia',
    titulo: 'Energía y Sostenibilidad',
    descripcion: 'Transición energética con renovables e hidrógeno verde para un futuro sostenible.',
    categoria: 'Medio Ambiente',
    icono: 'Zap',
    detalles: [
      '30% de energías renovables en sector público',
      'Proyectos piloto de hidrógeno verde',
      'Transición energética progresiva',
    ],
  },
  {
    id: 'partido-vivienda',
    titulo: 'Vivienda y Formalización',
    descripcion: 'Formalización masiva de la propiedad urbana y reubicación de viviendas en zonas de riesgo.',
    categoria: 'Vivienda',
    icono: 'Home',
    detalles: [
      '500,000 títulos de propiedad urbana',
      'Reubicación de viviendas en zonas de riesgo',
    ],
  },
  {
    id: 'partido-economia',
    titulo: 'Gestión Económica del Estado',
    descripcion: 'Manejo responsable de recursos con un Fondo Soberano y descentralización institucional.',
    categoria: 'Economía',
    icono: 'Landmark',
    detalles: [
      'Fondo Soberano de Riqueza con excedentes fiscales y recursos extractivos',
      'Descentralización con fortalecimiento institucional',
      'Inversión sostenida en infraestructura',
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

// Regiones del Perú (25 regiones)
export const REGIONES_PERU = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
] as const;

// Distritos de Puno (principales)
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
  'Putina',
  'Sandia',
  'Moho',
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

// Provincias por Región (principales ciudades/provincias)
export const PROVINCIAS_POR_REGION: Record<string, string[]> = {
  'Amazonas': ['Chachapoyas', 'Bagua', 'Bongará', 'Condorcanqui', 'Luya', 'Rodríguez de Mendoza', 'Utcubamba'],
  'Áncash': ['Huaraz', 'Aija', 'Antonio Raymondi', 'Asunción', 'Bolognesi', 'Carhuaz', 'Carlos Fermín Fitzcarrald', 'Casma', 'Corongo', 'Huari', 'Huarmey', 'Huaylas', 'Mariscal Luzuriaga', 'Ocros', 'Pallasca', 'Pomabamba', 'Recuay', 'Santa', 'Sihuas', 'Yungay'],
  'Apurímac': ['Abancay', 'Andahuaylas', 'Antabamba', 'Aymaraes', 'Cotabambas', 'Chincheros', 'Grau'],
  'Arequipa': ['Arequipa', 'Camaná', 'Caravelí', 'Castilla', 'Caylloma', 'Condesuyos', 'Islay', 'La Unión'],
  'Ayacucho': ['Huamanga', 'Cangallo', 'Huanca Sancos', 'Huanta', 'La Mar', 'Lucanas', 'Parinacochas', 'Páucar del Sara Sara', 'Sucre', 'Víctor Fajardo', 'Vilcas Huamán'],
  'Cajamarca': ['Cajamarca', 'Cajabamba', 'Celendín', 'Chota', 'Contumazá', 'Cutervo', 'Hualgayoc', 'Jaén', 'San Ignacio', 'San Marcos', 'San Miguel', 'San Pablo', 'Santa Cruz'],
  'Callao': ['Callao'],
  'Cusco': ['Cusco', 'Acomayo', 'Anta', 'Calca', 'Canas', 'Canchis', 'Chumbivilcas', 'Espinar', 'La Convención', 'Paruro', 'Paucartambo', 'Quispicanchi', 'Urubamba'],
  'Huancavelica': ['Huancavelica', 'Acobamba', 'Angaraes', 'Castrovirreyna', 'Churcampa', 'Huaytará', 'Tayacaja'],
  'Huánuco': ['Huánuco', 'Ambo', 'Dos de Mayo', 'Huacaybamba', 'Huamalíes', 'Leoncio Prado', 'Marañón', 'Pachitea', 'Puerto Inca', 'Lauricocha', 'Yarowilca'],
  'Ica': ['Ica', 'Chincha', 'Nazca', 'Palpa', 'Pisco'],
  'Junín': ['Huancayo', 'Concepción', 'Chanchamayo', 'Jauja', 'Junín', 'Satipo', 'Tarma', 'Yauli', 'Chupaca'],
  'La Libertad': ['Trujillo', 'Ascope', 'Bolívar', 'Chepén', 'Julcán', 'Otuzco', 'Pacasmayo', 'Pataz', 'Sánchez Carrión', 'Santiago de Chuco', 'Gran Chimú', 'Virú'],
  'Lambayeque': ['Chiclayo', 'Ferreñafe', 'Lambayeque'],
  'Lima': ['Lima', 'Barranca', 'Cajatambo', 'Canta', 'Cañete', 'Huaral', 'Huarochirí', 'Huaura', 'Oyón', 'Yauyos'],
  'Loreto': ['Maynas', 'Alto Amazonas', 'Loreto', 'Mariscal Ramón Castilla', 'Requena', 'Ucayali', 'Datem del Marañón', 'Putumayo'],
  'Madre de Dios': ['Tambopata', 'Manu', 'Tahuamanu'],
  'Moquegua': ['Mariscal Nieto', 'General Sánchez Cerro', 'Ilo'],
  'Pasco': ['Pasco', 'Daniel Alcides Carrión', 'Oxapampa'],
  'Piura': ['Piura', 'Ayabaca', 'Huancabamba', 'Morropón', 'Paita', 'Sullana', 'Talara', 'Sechura'],
  'Puno': ['Puno', 'San Román', 'El Collao', 'Melgar', 'Azángaro', 'Carabaya', 'Chucuito', 'Lampa', 'Huancané', 'Yunguyo', 'Sandia', 'Moho', 'San Antonio de Putina'],
  'San Martín': ['Moyobamba', 'Bellavista', 'El Dorado', 'Huallaga', 'Lamas', 'Mariscal Cáceres', 'Picota', 'Rioja', 'San Martín', 'Tocache'],
  'Tacna': ['Tacna', 'Candarave', 'Jorge Basadre', 'Tarata'],
  'Tumbes': ['Tumbes', 'Contralmirante Villar', 'Zarumilla'],
  'Ucayali': ['Coronel Portillo', 'Atalaya', 'Padre Abad', 'Purús'],
};

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
  { label: 'Mapa Electoral', href: '/admin/mapa-electoral', icon: 'Map' },
  { label: 'Mensajes', href: '/admin/mensajes', icon: 'MessageSquare' },
  { label: 'Afiliados', href: '/admin/afiliados', icon: 'Users' },
  { label: 'Voluntarios', href: '/admin/voluntarios', icon: 'UserPlus' },
  { label: 'Archivos', href: '/admin/archivos', icon: 'FolderOpen' },
  { label: 'Galería', href: '/admin/galeria', icon: 'Image' },
  { label: 'Equipos', href: '/admin/equipos', icon: 'UsersRound' },
  { label: 'Eventos', href: '/admin/eventos', icon: 'Calendar' },
  { label: 'Redes Sociales', href: '/admin/redes', icon: 'Share2' },
  { label: 'Sentimientos', href: '/admin/sentimientos', icon: 'Brain' },
  { label: 'Reportes', href: '/admin/reportes', icon: 'BarChart3' },
  { label: 'Configuración', href: '/admin/configuracion', icon: 'Settings' },
];

// Fecha de elecciones
export const FECHA_ELECCIONES = new Date('2026-04-12T08:00:00');

// API URL - Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwR-81-k1CHOJIqL3CeRaK3Zx2i7ceht3pR-tJIP8-mNCNvr4dYdq2P1M0y69VsafnJ-Q/exec';
export const API_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL;
