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
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
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
