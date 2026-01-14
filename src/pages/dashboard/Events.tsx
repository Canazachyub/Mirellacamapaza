import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Edit3,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';

// URL del calendario de Google de la candidata
const GOOGLE_CALENDAR_EMAIL = 'dra.mirella.camapaza.4@gmail.com';
const GOOGLE_CALENDAR_EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_EMAIL)}&ctz=America/Lima&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`;
const GOOGLE_CALENDAR_PUBLIC_URL = `https://calendar.google.com/calendar/u/0?cid=${btoa(GOOGLE_CALENDAR_EMAIL)}`;
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Modal, Textarea, Badge } from '@/components/common';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { getStatusColor } from '@/utils/helpers';
import type { Event } from '@/types';

const Events = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    lugar: '',
    responsable: '',
  });

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => getEvents({ estado: filter || undefined }),
  });

  const addMutation = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      toast.success('Evento creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      handleCloseModal();
    },
    onError: () => {
      toast.error('Error al crear evento');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      updateEvent(id, data),
    onSuccess: () => {
      toast.success('Evento actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      handleCloseModal();
    },
    onError: () => {
      toast.error('Error al actualizar evento');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success('Evento eliminado');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Error al eliminar evento');
    },
  });

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        titulo: event.Titulo,
        descripcion: event.Descripcion || '',
        fecha: event.Fecha?.split('T')[0] || '',
        hora: event.Hora || '',
        lugar: event.Lugar || '',
        responsable: event.Responsable || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '',
        lugar: '',
        responsable: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      titulo: '',
      descripcion: '',
      fecha: '',
      hora: '',
      lugar: '',
      responsable: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim() || !formData.fecha) {
      toast.error('El título y la fecha son requeridos');
      return;
    }

    if (editingEvent) {
      updateMutation.mutate({
        id: editingEvent.ID,
        data: {
          Titulo: formData.titulo,
          Descripcion: formData.descripcion,
          Fecha: formData.fecha,
          Hora: formData.hora,
          Lugar: formData.lugar,
          Responsable: formData.responsable,
        },
      });
    } else {
      addMutation.mutate({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        hora: formData.hora,
        lugar: formData.lugar,
        responsable: formData.responsable,
      });
    }
  };

  const handleStatusChange = (id: string, estado: 'Programado' | 'EnCurso' | 'Finalizado' | 'Cancelado') => {
    updateMutation.mutate({ id, data: { Estado: estado } });
  };

  const events = eventsResponse?.data || [];

  const filteredEvents = events.filter(event =>
    event.Titulo.toLowerCase().includes(search.toLowerCase()) ||
    event.Lugar?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Programado':
        return <Calendar className="w-4 h-4" />;
      case 'EnCurso':
        return <PlayCircle className="w-4 h-4" />;
      case 'Finalizado':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const isUpcoming = (fecha: string) => {
    return new Date(fecha) >= new Date();
  };

  const upcomingEvents = filteredEvents.filter(e => isUpcoming(e.Fecha) && e.Estado !== 'Cancelado');
  const pastEvents = filteredEvents.filter(e => !isUpcoming(e.Fecha) || e.Estado === 'Cancelado');

  return (
    <DashboardLayout title="Eventos">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              {upcomingEvents.length} Eventos Próximos
            </h2>
            <p className="text-sm text-secondary-500">
              Gestiona los eventos de la campaña
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            className="w-48"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos</option>
            <option value="Programado">Programados</option>
            <option value="EnCurso">En Curso</option>
            <option value="Finalizado">Finalizados</option>
            <option value="Cancelado">Cancelados</option>
          </select>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Google Calendar Embed */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Agenda de la Candidata</h3>
              <p className="text-sm text-secondary-500">Calendario sincronizado con Google Calendar</p>
            </div>
          </div>
          <a
            href={GOOGLE_CALENDAR_PUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Abrir en Google Calendar</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="rounded-lg overflow-hidden border border-secondary-200">
          <iframe
            src={GOOGLE_CALENDAR_EMBED_URL}
            style={{ border: 0, overflow: 'hidden' }}
            width="100%"
            height="400"
            title="Agenda de la Dra. Mirella Camapaza"
          />
        </div>
      </Card>

      {/* Events */}
      {isLoading ? (
        <div className="text-center py-12 text-secondary-500">
          Cargando eventos...
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-500">No hay eventos registrados</p>
          <Button
            variant="primary"
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Crear Primer Evento
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Próximos Eventos
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.ID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-primary-600">
                            {new Date(event.Fecha).getDate()}
                          </span>
                          <span className="text-xs text-primary-600 uppercase">
                            {new Date(event.Fecha).toLocaleDateString('es-PE', { month: 'short' })}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-secondary-900">
                                {event.Titulo}
                              </h4>
                              <p className="text-secondary-600 text-sm mt-1">
                                {event.Descripcion}
                              </p>
                            </div>
                            <Badge className={getStatusColor(event.Estado)}>
                              {getStatusIcon(event.Estado)}
                              <span className="ml-1">{event.Estado}</span>
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-secondary-500">
                            {event.Hora && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.Hora}</span>
                              </div>
                            )}
                            {event.Lugar && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.Lugar}</span>
                              </div>
                            )}
                            {event.Responsable && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{event.Responsable}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {event.Estado === 'Programado' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleStatusChange(event.ID, 'EnCurso')}
                            >
                              Iniciar
                            </Button>
                          )}
                          {event.Estado === 'EnCurso' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(event.ID, 'Finalizado')}
                            >
                              Finalizar
                            </Button>
                          )}
                          <button
                            onClick={() => handleOpenModal(event)}
                            className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de eliminar este evento?')) {
                                deleteMutation.mutate(event.ID);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-4">
                Eventos Pasados / Cancelados
              </h3>
              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <Card key={event.ID} className="bg-secondary-50 opacity-75">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary-200 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-secondary-600">
                            {new Date(event.Fecha).getDate()}
                          </span>
                          <span className="text-xs text-secondary-500 uppercase">
                            {new Date(event.Fecha).toLocaleDateString('es-PE', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-secondary-700">{event.Titulo}</h4>
                          <p className="text-sm text-secondary-500">{event.Lugar}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(event.Estado)} size="sm">
                          {event.Estado}
                        </Badge>
                        <button
                          onClick={() => deleteMutation.mutate(event.ID)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Título del evento"
            placeholder="Ej: Mitin Central en Juliaca"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el evento..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
            <Input
              label="Hora"
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
            />
          </div>

          <Input
            label="Lugar"
            placeholder="Ej: Plaza de Armas de Juliaca"
            value={formData.lugar}
            onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
            leftIcon={<MapPin className="w-5 h-5" />}
          />

          <Input
            label="Responsable"
            placeholder="Nombre del encargado"
            value={formData.responsable}
            onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
            leftIcon={<User className="w-5 h-5" />}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={addMutation.isPending || updateMutation.isPending}
            >
              {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Events;
