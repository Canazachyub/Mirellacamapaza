import type {
  ApiResponse,
  Affiliate,
  Message,
  Volunteer,
  Team,
  Event,
  Stats,
  FilesResponse,
  Config,
  AffiliateFormData,
  VolunteerFormData,
  ContactFormData,
} from '@/types';

// URL de la API - usa proxy en desarrollo, URL directa en producción
const API_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

// Helper para hacer peticiones GET con fetch (compatible con Google Apps Script)
const get = async <T>(action: string, params?: Record<string, string>): Promise<ApiResponse<T>> => {
  const queryParams = new URLSearchParams({ action, ...params });
  const url = `${API_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (GET):', error);
    throw error;
  }
};

// Helper para hacer peticiones POST con fetch (compatible con Google Apps Script)
const post = async <T>(action: string, data: object): Promise<ApiResponse<T>> => {
  const queryParams = new URLSearchParams({ action });
  const url = `${API_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API Error (POST):', error);
    throw error;
  }
};

// ============================================
// PING / TEST
// ============================================

export const pingApi = () => get<{ message: string; timestamp: string }>('ping');

// ============================================
// AFILIADOS
// ============================================

export interface GetAffiliatesParams {
  page?: number;
  limit?: number;
  estado?: string;
  distrito?: string;
  provincia?: string;
  search?: string;
}

export const getAffiliates = (params?: GetAffiliatesParams) => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.estado) queryParams.estado = params.estado;
  if (params?.distrito) queryParams.distrito = params.distrito;
  if (params?.provincia) queryParams.provincia = params.provincia;
  if (params?.search) queryParams.search = params.search;
  return get<Affiliate[]>('getAffiliates', queryParams);
};

export const getAffiliate = (id: string) => get<Affiliate>('getAffiliate', { id });

export const addAffiliate = (data: AffiliateFormData) => post<{ id: string }>('addAffiliate', data);

export const updateAffiliate = (id: string, data: Partial<Affiliate>) =>
  post<void>('updateAffiliate', { id, ...data });

export const deleteAffiliate = (id: string) => post<void>('deleteAffiliate', { id });

// ============================================
// MENSAJES
// ============================================

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  estado?: string;
  search?: string;
}

export const getMessages = (params?: GetMessagesParams) => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.estado) queryParams.estado = params.estado;
  if (params?.search) queryParams.search = params.search;
  return get<Message[]>('getMessages', queryParams);
};

export const getMessage = (id: string) => get<Message>('getMessage', { id });

export const addMessage = (data: ContactFormData) => post<{ id: string }>('addMessage', data);

export const updateMessage = (id: string, estado: string) =>
  post<void>('updateMessage', { id, estado });

export const replyMessage = (id: string, respuesta: string) =>
  post<void>('replyMessage', { id, respuesta });

export const deleteMessage = (id: string) => post<void>('deleteMessage', { id });

// ============================================
// VOLUNTARIOS
// ============================================

export interface GetVolunteersParams {
  page?: number;
  limit?: number;
  estado?: string;
  equipo?: string;
  distrito?: string;
  search?: string;
}

export const getVolunteers = (params?: GetVolunteersParams) => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.estado) queryParams.estado = params.estado;
  if (params?.equipo) queryParams.equipo = params.equipo;
  if (params?.distrito) queryParams.distrito = params.distrito;
  if (params?.search) queryParams.search = params.search;
  return get<Volunteer[]>('getVolunteers', queryParams);
};

export const getVolunteer = (id: string) => get<Volunteer>('getVolunteer', { id });

export const addVolunteer = (data: VolunteerFormData) => post<{ id: string }>('addVolunteer', data);

export const updateVolunteer = (id: string, data: Partial<Volunteer>) =>
  post<void>('updateVolunteer', { id, ...data });

export const deleteVolunteer = (id: string) => post<void>('deleteVolunteer', { id });

// ============================================
// EQUIPOS
// ============================================

export const getTeams = () => get<Team[]>('getTeams');

export const addTeam = (data: { nombre: string; descripcion?: string; lider?: string }) =>
  post<{ id: string }>('addTeam', data);

export const updateTeam = (id: string, data: Partial<Team>) =>
  post<void>('updateTeam', { id, ...data });

export const deleteTeam = (id: string) => post<void>('deleteTeam', { id });

// ============================================
// EVENTOS
// ============================================

export interface GetEventsParams {
  estado?: string;
  upcoming?: boolean;
}

export const getEvents = (params?: GetEventsParams) => {
  const queryParams: Record<string, string> = {};
  if (params?.estado) queryParams.estado = params.estado;
  if (params?.upcoming) queryParams.upcoming = 'true';
  return get<Event[]>('getEvents', queryParams);
};

export const addEvent = (data: {
  titulo: string;
  descripcion?: string;
  fecha: string;
  hora?: string;
  lugar?: string;
  responsable?: string;
}) => post<{ id: string }>('addEvent', data);

export const updateEvent = (id: string, data: Partial<Event>) =>
  post<void>('updateEvent', { id, ...data });

export const deleteEvent = (id: string) => post<void>('deleteEvent', { id });

// ============================================
// ARCHIVOS
// ============================================

export const getFiles = (folderId?: string) => {
  const queryParams: Record<string, string> = {};
  if (folderId) queryParams.folderId = folderId;
  return get<FilesResponse>('getFiles', queryParams);
};

export const uploadFile = (data: {
  name: string;
  content: string;
  mimeType: string;
  folderId?: string;
}) => post<{ id: string; name: string; url: string; downloadUrl: string }>('uploadFile', data);

export const deleteFile = (fileId: string) => post<void>('deleteFile', { fileId });

export const createFolder = (data: { name: string; parentId?: string }) =>
  post<{ id: string; name: string; url: string }>('createFolder', data);

// ============================================
// ESTADÍSTICAS
// ============================================

export const getStats = () => get<Stats>('getStats');

// ============================================
// CONFIGURACIÓN
// ============================================

export const getConfig = () => get<Config>('getConfig');

export const updateConfig = (key: string, value: string, description?: string) =>
  post<void>('updateConfig', { key, value, description });

export const validateLogin = (password: string) =>
  get<{ message: string }>('validateLogin', { password });
