import { format, formatDistanceToNow, parseISO, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { es } from 'date-fns/locale';
import { CONTACTO, FECHA_ELECCIONES } from './constants';

// Formatear fecha
export const formatDate = (date: string | Date, pattern = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
};

// Formatear fecha y hora
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// Formatear fecha relativa
export const formatRelativeDate = (date: string | Date): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
};

// Formatear teléfono
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('51')) {
    return `+51 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};

// Generar URL de WhatsApp
export const getWhatsAppUrl = (phone?: string, message?: string): string => {
  const cleanPhone = (phone || CONTACTO.whatsapp).replace(/\D/g, '');
  const baseUrl = `https://wa.me/${cleanPhone}`;
  const msg = message || CONTACTO.whatsappMessage;
  return `${baseUrl}?text=${encodeURIComponent(msg)}`;
};

// Generar URL de email
export const getEmailUrl = (email: string, subject?: string, body?: string): string => {
  let url = `mailto:${email}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  if (params.length) url += `?${params.join('&')}`;
  return url;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

// Capitalizar texto
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar cada palabra
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text.split(' ').map(capitalize).join(' ');
};

// Validar DNI peruano
export const isValidDNI = (dni: string): boolean => {
  return /^\d{8}$/.test(dni);
};

// Validar teléfono peruano
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^9\d{8}$/.test(cleaned);
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generar ID único
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener iniciales
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Obtener extensión de archivo
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Delay/Sleep
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Debounce
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Scroll suave a elemento
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Scroll al inicio
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Copiar al portapapeles
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Descargar archivo
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Obtener parámetros de URL
export const getUrlParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// Obtener countdown para las elecciones
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const getElectionCountdown = (): Countdown => {
  const now = new Date();
  const total = FECHA_ELECCIONES.getTime() - now.getTime();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: differenceInDays(FECHA_ELECCIONES, now),
    hours: differenceInHours(FECHA_ELECCIONES, now) % 24,
    minutes: differenceInMinutes(FECHA_ELECCIONES, now) % 60,
    seconds: differenceInSeconds(FECHA_ELECCIONES, now) % 60,
    total,
  };
};

// Verificar si es dispositivo móvil
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Obtener icono de tipo de archivo
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Music';
  if (mimeType.includes('pdf')) return 'FileText';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'FileText';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Table';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
  return 'File';
};

// Convertir archivo a base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Obtener color de estado
export const getStatusColor = (estado: string): string => {
  const colors: Record<string, string> = {
    Nuevo: 'bg-blue-100 text-blue-800',
    Leido: 'bg-gray-100 text-gray-800',
    Respondido: 'bg-green-100 text-green-800',
    Archivado: 'bg-yellow-100 text-yellow-800',
    Pendiente: 'bg-yellow-100 text-yellow-800',
    Verificado: 'bg-blue-100 text-blue-800',
    Activo: 'bg-green-100 text-green-800',
    Inactivo: 'bg-red-100 text-red-800',
    Programado: 'bg-blue-100 text-blue-800',
    EnCurso: 'bg-yellow-100 text-yellow-800',
    Finalizado: 'bg-green-100 text-green-800',
    Cancelado: 'bg-red-100 text-red-800',
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
};
