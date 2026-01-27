// Afiliado
export interface Affiliate {
  ID: string;
  Fecha: string;
  Nombre: string;
  Apellidos: string;
  DNI: string;
  Telefono: string;
  Email: string;
  Direccion: string;
  Distrito: string;
  Provincia: string;
  Ocupacion?: string;
  Estado: 'Pendiente' | 'Verificado' | 'Activo' | 'Inactivo' | 'Rechazado';
  // Campos adicionales para ficha de afiliación
  Region?: string;
  FechaNacimiento?: string;
  LugarNacimiento?: string;
  EstadoCivil?: 'S' | 'C' | 'V' | 'D' | 'Conv';
  Sexo?: 'M' | 'F';
  NumeroDireccion?: string;
  Urbanizacion?: string;
}

// Voluntario
export interface Volunteer {
  ID: string;
  Fecha: string;
  Nombre: string;
  Apellidos: string;
  DNI: string;
  Telefono: string;
  Email: string;
  Distrito: string;
  Provincia: string;
  Area: string;
  AreasInteres: string;
  Disponibilidad: string;
  Habilidades?: string;
  Experiencia?: string;
  Estado: 'Activo' | 'Inactivo' | 'Pendiente';
  Equipo: string;
}

// Mensaje
export interface Message {
  ID: string;
  Fecha: string;
  Nombre: string;
  Email: string;
  Telefono: string;
  Asunto: string;
  Mensaje: string;
  Estado: 'Nuevo' | 'Leido' | 'Respondido' | 'Archivado';
  Respuesta: string;
  FechaRespuesta: string;
}

// Equipo
export interface Team {
  ID: string;
  Nombre: string;
  Descripcion: string;
  Lider: string;
  Miembros: string;
  FechaCreacion: string;
  Estado: 'Activo' | 'Inactivo';
}

// Tarea Diaria
export interface Task {
  ID: string;
  Fecha: string;              // YYYY-MM-DD
  Titulo: string;
  EquipoID: string;
  EquipoNombre?: string;
  AsignadoA: string;          // ID del voluntario o "EQUIPO" para todo el equipo
  AsignadoNombre: string;
  Completado: boolean;
  FechaCompletado?: string;
  FechaCreacion: string;
}

// Evento
export interface Event {
  ID: string;
  Titulo: string;
  Descripcion: string;
  Fecha: string;
  Hora: string;
  Lugar: string;
  Responsable: string;
  Estado: 'Programado' | 'EnCurso' | 'Finalizado' | 'Cancelado';
}

// Archivo
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  downloadUrl: string;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

// Carpeta
export interface DriveFolder {
  id: string;
  name: string;
  url: string;
}

// Sede
export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  referencia: string;
  ciudad: string;
  lat: number;
  lng: number;
  googleMapsUrl?: string;
  telefono?: string;
  horario?: string;
  esPrincipal?: boolean;
  esNueva?: boolean;
  fechaInauguracion?: string;
}

// Propuesta
export interface Proposal {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  icono: string;
  detalles: string[];
}

// Estadísticas
export interface Stats {
  totalAffiliates: number;
  totalMessages: number;
  totalVolunteers: number;
  totalEvents: number;
  unreadMessages: number;
  recentAffiliates: number;
  monthlyAffiliates: number;
  upcomingEvents: number;
  affiliatesByDistrict: Record<string, number>;
  affiliatesByProvince: Record<string, number>;
  affiliatesByStatus: Record<string, number>;
  volunteersByArea: Record<string, number>;
  volunteersByStatus: Record<string, number>;
  lastUpdated: string;
}

// Respuesta API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  unread?: number;
  pending?: number;
  active?: number;
  verified?: number;
}

// Usuario Auth
export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'moderador' | 'usuario';
}

// Form States
export interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

// Navigation Item
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

// Form Data Types
export interface AffiliateFormData {
  // Datos personales
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  dni: string;
  fechaNacimiento?: string;
  estadoCivil?: 'S' | 'C' | 'V' | 'D' | 'Conv';
  sexo?: 'M' | 'F';
  lugarNacimiento?: string;
  // Domicilio actual
  region?: string;
  provincia?: string;
  distrito?: string;
  direccion?: string;
  numeroDireccion?: string;
  urbanizacion?: string;
  telefono: string;
  email?: string;
}

export interface VolunteerFormData {
  nombre: string;
  apellidos: string;
  dni?: string;
  telefono: string;
  email?: string;
  distrito?: string;
  areasInteres: string[];
  disponibilidad?: string;
}

export interface ContactFormData {
  nombre: string;
  email?: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

// Files Response
export interface FilesResponse {
  currentFolder: {
    id: string;
    name: string;
  };
  files: DriveFile[];
  folders: DriveFolder[];
}

// Config
export interface ConfigItem {
  value: string;
  description: string;
}

export type Config = Record<string, ConfigItem>;

// Sentimiento (Análisis de Redes Sociales)
export interface Sentiment {
  ID?: string;
  Autor: string;
  Responde_A: string;
  Comentario: string;
  Sentimiento: 'positivo' | 'negativo' | 'neutro';
  Tema: string;
  Categoria: string;
  Etiquetas: string;
  Nivel_Riesgo: string;
  Todas_Categorias: string;
  Detalle: string;
  Tiempo: string;
  Editado: string;
}

// Respuesta de Gemini AI
export interface GeminiResponse {
  respuesta: string;
  tono: string;
  puntosClave: string[];
}
