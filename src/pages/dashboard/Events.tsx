import { useState, useMemo } from 'react';
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
  Landmark,
  Building2,
  Store,
  ChevronDown,
  ChevronRight,
  Star,
  Music,
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
import {
  EFEMERIDES,
  getNombreMes,
  getCategoriaBadge,
  getProximaEfemeride,
  contarPorCategoria,
  type Efemeride,
} from '@/utils/efemerides';

type CategoriaFiltro = 'todas' | 'provincia' | 'distrito' | 'mercado' | 'festividad';

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

  // Efemérides state
  const [efemeridesOpen, setEfemeridesOpen] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaFiltro>('todas');
  const [searchEfemerides, setSearchEfemerides] = useState('');
  const [mesesExpandidos, setMesesExpandidos] = useState<Set<number>>(() => {
    // Expandir el mes actual por defecto
    const mesActual = new Date().getMonth() + 1;
    return new Set([mesActual]);
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

  // Efemérides computed
  const stats = useMemo(() => contarPorCategoria(), []);
  const proximaEfemeride = useMemo(() => getProximaEfemeride(), []);

  const efemeridesFiltradas = useMemo(() => {
    let resultado = EFEMERIDES;

    if (categoriaFiltro !== 'todas') {
      resultado = resultado.filter(ef => ef.categoria === categoriaFiltro);
    }

    if (searchEfemerides.trim()) {
      const q = searchEfemerides.toLowerCase();
      resultado = resultado.filter(
        ef =>
          ef.titulo.toLowerCase().includes(q) ||
          ef.provincia.toLowerCase().includes(q) ||
          ef.descripcion.toLowerCase().includes(q)
      );
    }

    return resultado;
  }, [categoriaFiltro, searchEfemerides]);

  const efemeridesPorMes = useMemo(() => {
    const porMes = new Map<number, Efemeride[]>();
    for (const ef of efemeridesFiltradas) {
      const lista = porMes.get(ef.mes) || [];
      lista.push(ef);
      porMes.set(ef.mes, lista);
    }
    return porMes;
  }, [efemeridesFiltradas]);

  const toggleMes = (mes: number) => {
    setMesesExpandidos(prev => {
      const next = new Set(prev);
      if (next.has(mes)) {
        next.delete(mes);
      } else {
        next.add(mes);
      }
      return next;
    });
  };

  const expandirTodos = () => {
    const todos = new Set<number>();
    efemeridesPorMes.forEach((_, mes) => todos.add(mes));
    setMesesExpandidos(todos);
  };

  const colapsarTodos = () => {
    setMesesExpandidos(new Set());
  };

  const getCategoriaIcon = (cat: Efemeride['categoria']) => {
    switch (cat) {
      case 'provincia':
        return <Landmark className="w-4 h-4" />;
      case 'distrito':
        return <Building2 className="w-4 h-4" />;
      case 'mercado':
        return <Store className="w-4 h-4" />;
      case 'festividad':
        return <Music className="w-4 h-4" />;
    }
  };

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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Efemérides de la Región Puno */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Card className="mb-6">
        {/* Header colapsable */}
        <button
          onClick={() => setEfemeridesOpen(!efemeridesOpen)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-secondary-900">
                Efemérides de la Región Puno
              </h3>
              <p className="text-sm text-secondary-500">
                {stats.total} efemérides: {stats.provincias} provincias, {stats.distritos} distritos, {stats.mercados} mercados, {stats.festividades} festividades
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-secondary-400 transition-transform ${efemeridesOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {efemeridesOpen && (
          <div className="mt-4">
            {/* Próxima efeméride destacada */}
            {proximaEfemeride && (
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-purple-700 uppercase">Próximo aniversario</span>
                </div>
                <p className="font-semibold text-secondary-900">{proximaEfemeride.titulo}</p>
                <p className="text-sm text-secondary-600">
                  {proximaEfemeride.dia} de {getNombreMes(proximaEfemeride.mes)}
                  {proximaEfemeride.anio ? ` (desde ${proximaEfemeride.anio})` : ''} — Prov. {proximaEfemeride.provincia}
                </p>
              </div>
            )}

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: 'todas' as CategoriaFiltro, label: 'Todas', count: stats.total },
                  { key: 'provincia' as CategoriaFiltro, label: 'Provincias', count: stats.provincias },
                  { key: 'distrito' as CategoriaFiltro, label: 'Distritos', count: stats.distritos },
                  { key: 'mercado' as CategoriaFiltro, label: 'Mercados', count: stats.mercados },
                  { key: 'festividad' as CategoriaFiltro, label: 'Festividades', count: stats.festividades },
                ]).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setCategoriaFiltro(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      categoriaFiltro === key
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Buscar distrito, provincia..."
                  value={searchEfemerides}
                  onChange={(e) => setSearchEfemerides(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Botones expandir/colapsar */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={expandirTodos}
                className="text-xs text-primary-600 hover:underline"
              >
                Expandir todos
              </button>
              <span className="text-secondary-300">|</span>
              <button
                onClick={colapsarTodos}
                className="text-xs text-primary-600 hover:underline"
              >
                Colapsar todos
              </button>
            </div>

            {/* Lista por meses */}
            <div className="space-y-2">
              {Array.from(efemeridesPorMes.entries())
                .sort(([a], [b]) => a - b)
                .map(([mes, efemerides]) => {
                  const expandido = mesesExpandidos.has(mes);
                  return (
                    <div key={mes} className="border border-secondary-200 rounded-lg overflow-hidden">
                      {/* Header del mes */}
                      <button
                        onClick={() => toggleMes(mes)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-secondary-50 hover:bg-secondary-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {expandido ? (
                            <ChevronDown className="w-4 h-4 text-secondary-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-secondary-500" />
                          )}
                          <span className="font-semibold text-secondary-800">
                            {getNombreMes(mes)}
                          </span>
                          <span className="text-xs bg-secondary-200 text-secondary-600 px-2 py-0.5 rounded-full">
                            {efemerides.length} {efemerides.length === 1 ? 'evento' : 'eventos'}
                          </span>
                        </div>
                      </button>

                      {/* Contenido del mes */}
                      {expandido && (
                        <div className="divide-y divide-secondary-100">
                          {efemerides.map((ef, idx) => {
                            const badge = getCategoriaBadge(ef.categoria);
                            return (
                              <motion.div
                                key={`${ef.mes}-${ef.dia}-${idx}`}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-secondary-50 transition-colors"
                              >
                                {/* Fecha */}
                                <div className="flex-shrink-0 w-12 h-12 bg-primary-50 border border-primary-200 rounded-lg flex flex-col items-center justify-center">
                                  <span className="text-lg font-bold text-primary-700 leading-none">
                                    {ef.dia}
                                  </span>
                                  <span className="text-[10px] text-primary-500 uppercase leading-none mt-0.5">
                                    {getNombreMes(ef.mes).slice(0, 3)}
                                  </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 flex-wrap">
                                    <h4 className="text-sm font-semibold text-secondary-900">
                                      {ef.titulo}
                                    </h4>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${badge.color}`}>
                                      {getCategoriaIcon(ef.categoria)}
                                      {badge.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-secondary-600 mt-0.5 line-clamp-2">
                                    {ef.descripcion}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-secondary-500">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      Prov. {ef.provincia}
                                    </span>
                                    {ef.anio && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Desde {ef.anio}
                                      </span>
                                    )}
                                    {ef.baseLegal && (
                                      <span className="hidden sm:inline text-secondary-400">
                                        {ef.baseLegal}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {efemeridesFiltradas.length === 0 && (
              <div className="text-center py-8 text-secondary-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                <p>No se encontraron efemérides con esos filtros.</p>
              </div>
            )}
          </div>
        )}
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
