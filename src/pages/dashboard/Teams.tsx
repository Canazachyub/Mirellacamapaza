import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Crown,
  Search,
  Plus,
  ChevronLeft,
  UserMinus,
  ClipboardList,
  CheckSquare,
  Square,
  Calendar,
  Eye,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Modal, Textarea } from '@/components/common';
import {
  getTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  getVolunteers,
  getTeamVolunteers,
  addVolunteerToTeam,
  removeVolunteerFromTeam,
  getTasks,
  addTask,
  toggleTaskComplete,
  deleteTask,
} from '@/services/api';
import { useToast } from '@/store/uiStore';
import type { Team } from '@/types';

const Teams = () => {
  // Estados principales
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lider: '',
  });

  // Estados para vista detallada
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'volunteers' | 'tasks'>('volunteers');

  // Estados para modales de voluntarios y tareas
  const [showAddVolunteerModal, setShowAddVolunteerModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('EQUIPO');
  const [volunteerSearch, setVolunteerSearch] = useState('');

  // Estado para fecha de tareas (por defecto hoy)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const queryClient = useQueryClient();
  const toast = useToast();

  // Query: Lista de equipos
  const { data: teamsResponse, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });

  // Query: Todos los voluntarios activos (para crear equipos y agregar voluntarios)
  const { data: volunteersResponse } = useQuery({
    queryKey: ['volunteers', 'active'],
    queryFn: () => getVolunteers({ estado: 'Activo' }),
  });

  // Query: Voluntarios del equipo seleccionado
  const { data: teamVolunteersResponse, isLoading: isLoadingTeamVolunteers } = useQuery({
    queryKey: ['teamVolunteers', selectedTeam?.ID, selectedTeam?.Nombre],
    queryFn: () => getTeamVolunteers(selectedTeam!.ID, selectedTeam!.Nombre),
    enabled: !!selectedTeam,
  });

  // Query: Tareas del equipo seleccionado
  const { data: tasksResponse, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', selectedTeam?.ID, selectedTeam?.Nombre, selectedDate],
    queryFn: () => getTasks({ equipoId: selectedTeam!.ID, equipoNombre: selectedTeam!.Nombre, fecha: selectedDate }),
    enabled: !!selectedTeam && activeTab === 'tasks',
  });

  // Mutations para equipos
  const addMutation = useMutation({
    mutationFn: addTeam,
    onSuccess: () => {
      toast.success('Equipo creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      handleCloseModal();
    },
    onError: () => {
      toast.error('Error al crear equipo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) =>
      updateTeam(id, data),
    onSuccess: () => {
      toast.success('Equipo actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      handleCloseModal();
    },
    onError: () => {
      toast.error('Error al actualizar equipo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      toast.success('Equipo eliminado');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toast.error('Error al eliminar equipo');
    },
  });

  // Mutations para voluntarios de equipo
  const addVolunteerToTeamMutation = useMutation({
    mutationFn: ({ volunteerId, teamId, teamName }: { volunteerId: string; teamId: string; teamName: string }) =>
      addVolunteerToTeam(volunteerId, teamId, teamName),
    onSuccess: () => {
      toast.success('Voluntario agregado al equipo');
      queryClient.invalidateQueries({ queryKey: ['teamVolunteers'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      setShowAddVolunteerModal(false);
      setVolunteerSearch('');
    },
    onError: () => {
      toast.error('Error al agregar voluntario');
    },
  });

  const removeVolunteerMutation = useMutation({
    mutationFn: removeVolunteerFromTeam,
    onSuccess: () => {
      toast.success('Voluntario removido del equipo');
      queryClient.invalidateQueries({ queryKey: ['teamVolunteers'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
    onError: () => {
      toast.error('Error al remover voluntario');
    },
  });

  // Mutations para tareas
  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      toast.success('Tarea creada');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowAddTaskModal(false);
      setTaskTitle('');
      setTaskAssignee('EQUIPO');
    },
    onError: () => {
      toast.error('Error al crear tarea');
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completado }: { id: string; completado: boolean }) =>
      toggleTaskComplete(id, completado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Error al actualizar tarea');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success('Tarea eliminada');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Error al eliminar tarea');
    },
  });

  // Handlers
  const handleOpenModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        nombre: team.Nombre,
        descripcion: team.Descripcion || '',
        lider: team.Lider || '',
      });
    } else {
      setEditingTeam(null);
      setFormData({ nombre: '', descripcion: '', lider: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeam(null);
    setFormData({ nombre: '', descripcion: '', lider: '' });
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    if (editingTeam) {
      updateMutation.mutate({
        id: editingTeam.ID,
        data: {
          Nombre: formData.nombre,
          Descripcion: formData.descripcion,
          Lider: formData.lider,
        },
      });
    } else {
      addMutation.mutate({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        lider: formData.lider,
      });
    }
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setActiveTab('volunteers');
  };

  const handleBackToList = () => {
    setSelectedTeam(null);
    setActiveTab('volunteers');
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      toast.error('El título de la tarea es requerido');
      return;
    }

    const teamVolunteersList = teamVolunteersResponse?.data || [];
    let asignadoNombre = 'Todo el equipo';

    if (taskAssignee !== 'EQUIPO') {
      const volunteer = teamVolunteersList.find(v => v.ID === taskAssignee);
      if (volunteer) {
        asignadoNombre = `${volunteer.Nombre} ${volunteer.Apellidos || ''}`.trim();
      } else {
        asignadoNombre = 'Sin asignar';
      }
    }

    addTaskMutation.mutate({
      titulo: taskTitle,
      equipoId: selectedTeam!.ID,
      equipoNombre: selectedTeam!.Nombre,
      asignadoA: taskAssignee,
      asignadoNombre: asignadoNombre,
      fecha: selectedDate,
    });
  };

  // Data
  const teams = teamsResponse?.data || [];
  const allVolunteers = volunteersResponse?.data || [];
  const teamVolunteers = teamVolunteersResponse?.data || [];
  const tasks = tasksResponse?.data || [];

  const filteredTeams = teams.filter(team =>
    team.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Voluntarios disponibles para agregar (no están en este equipo)
  const availableVolunteers = allVolunteers.filter(v => {
    const isInTeam = v.Equipo === selectedTeam?.ID || v.Equipo === selectedTeam?.Nombre;
    const matchesSearch = volunteerSearch
      ? `${v.Nombre} ${v.Apellidos}`.toLowerCase().includes(volunteerSearch.toLowerCase())
      : true;
    return !isInTeam && matchesSearch;
  });

  const getTeamColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-amber-500 to-amber-600',
      'from-red-500 to-red-600',
      'from-cyan-500 to-cyan-600',
    ];
    return colors[index % colors.length];
  };

  // Render: Vista detallada del equipo
  if (selectedTeam) {
    const teamIndex = teams.findIndex(t => t.ID === selectedTeam.ID);
    const teamColor = getTeamColor(teamIndex >= 0 ? teamIndex : 0);

    return (
      <DashboardLayout title="Equipos">
        {/* Header con botón volver */}
        <div className="mb-6">
          <Button
            variant="ghost"
            leftIcon={<ChevronLeft className="w-5 h-5" />}
            onClick={handleBackToList}
            className="mb-4"
          >
            Volver a equipos
          </Button>

          <div className={`bg-gradient-to-r ${teamColor} rounded-xl p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedTeam.Nombre}</h2>
                {selectedTeam.Descripcion && (
                  <p className="text-white/80 mt-1">{selectedTeam.Descripcion}</p>
                )}
                {selectedTeam.Lider && (
                  <div className="flex items-center gap-2 mt-2">
                    <Crown className="w-4 h-4" />
                    <span>Líder: {selectedTeam.Lider}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{teamVolunteers.length}</div>
                <div className="text-white/80 text-sm">miembros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-secondary-200">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'volunteers'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
            onClick={() => setActiveTab('volunteers')}
          >
            <Users className="w-4 h-4" />
            Voluntarios
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <ClipboardList className="w-4 h-4" />
            Tareas del Día
          </button>
        </div>

        {/* Tab: Voluntarios */}
        {activeTab === 'volunteers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">
                Voluntarios del equipo
              </h3>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="w-4 h-4" />}
                onClick={() => setShowAddVolunteerModal(true)}
              >
                Agregar Voluntario
              </Button>
            </div>

            {isLoadingTeamVolunteers ? (
              <div className="text-center py-8 text-secondary-500">
                Cargando voluntarios...
              </div>
            ) : teamVolunteers.length === 0 ? (
              <Card className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-secondary-300 mb-3" />
                <p className="text-secondary-500 mb-4">
                  No hay voluntarios asignados a este equipo
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setShowAddVolunteerModal(true)}
                >
                  Agregar Primer Voluntario
                </Button>
              </Card>
            ) : (
              <div className="grid gap-3">
                {teamVolunteers.map((volunteer) => (
                  <Card key={volunteer.ID} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {volunteer.Nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {volunteer.Nombre} {volunteer.Apellidos}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {volunteer.Telefono} • {volunteer.Area || 'Sin área'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm(`¿Remover a ${volunteer.Nombre} del equipo?`)) {
                          removeVolunteerMutation.mutate(volunteer.ID);
                        }
                      }}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Tareas */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAddTaskModal(true)}
              >
                Nueva Tarea
              </Button>
            </div>

            {isLoadingTasks ? (
              <div className="text-center py-8 text-secondary-500">
                Cargando tareas...
              </div>
            ) : tasks.length === 0 ? (
              <Card className="text-center py-8">
                <ClipboardList className="w-12 h-12 mx-auto text-secondary-300 mb-3" />
                <p className="text-secondary-500 mb-4">
                  No hay tareas para esta fecha
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddTaskModal(true)}
                >
                  Crear Primera Tarea
                </Button>
              </Card>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card
                    key={task.ID}
                    className={`flex items-center justify-between p-4 ${
                      task.Completado ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() =>
                          toggleTaskMutation.mutate({
                            id: task.ID,
                            completado: !task.Completado,
                          })
                        }
                        className="text-secondary-400 hover:text-primary-600 transition-colors"
                      >
                        {task.Completado ? (
                          <CheckSquare className="w-6 h-6 text-green-600" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.Completado
                              ? 'line-through text-secondary-400'
                              : 'text-secondary-900'
                          }`}
                        >
                          {task.Titulo}
                        </p>
                        <p className="text-sm text-secondary-500">
                          Asignado a: {task.AsignadoNombre || (task.AsignadoA === 'EQUIPO' ? 'Todo el equipo' : 'Sin asignar')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('¿Eliminar esta tarea?')) {
                          deleteTaskMutation.mutate(task.ID);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Agregar Voluntario */}
        <Modal
          isOpen={showAddVolunteerModal}
          onClose={() => {
            setShowAddVolunteerModal(false);
            setVolunteerSearch('');
          }}
          title="Agregar Voluntario al Equipo"
        >
          <div className="space-y-4">
            <Input
              placeholder="Buscar voluntario..."
              value={volunteerSearch}
              onChange={(e) => setVolunteerSearch(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableVolunteers.length === 0 ? (
                <p className="text-center text-secondary-500 py-4">
                  No hay voluntarios disponibles
                </p>
              ) : (
                availableVolunteers.map((volunteer) => (
                  <button
                    key={volunteer.ID}
                    onClick={() =>
                      addVolunteerToTeamMutation.mutate({
                        volunteerId: volunteer.ID,
                        teamId: selectedTeam!.ID,
                        teamName: selectedTeam!.Nombre,
                      })
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {volunteer.Nombre.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        {volunteer.Nombre} {volunteer.Apellidos}
                      </p>
                      <p className="text-sm text-secondary-500">
                        {volunteer.Area || 'Sin área'} • {volunteer.Disponibilidad || 'Sin disponibilidad'}
                      </p>
                    </div>
                    <UserPlus className="w-5 h-5 text-primary-600" />
                  </button>
                ))
              )}
            </div>
          </div>
        </Modal>

        {/* Modal: Nueva Tarea */}
        <Modal
          isOpen={showAddTaskModal}
          onClose={() => {
            setShowAddTaskModal(false);
            setTaskTitle('');
            setTaskAssignee('EQUIPO');
          }}
          title="Nueva Tarea"
        >
          <div className="space-y-4">
            <Input
              label="Título de la tarea"
              placeholder="Ej: Llamar a coordinadores"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Asignar a
              </label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="EQUIPO">Todo el equipo</option>
                {teamVolunteers.map((v) => (
                  <option key={v.ID} value={v.ID}>
                    {v.Nombre} {v.Apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddTaskModal(false);
                  setTaskTitle('');
                  setTaskAssignee('EQUIPO');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAddTask}
                isLoading={addTaskMutation.isPending}
              >
                Crear Tarea
              </Button>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
    );
  }

  // Render: Lista de equipos
  return (
    <DashboardLayout title="Equipos">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              {teams.length} Equipos
            </h2>
            <p className="text-sm text-secondary-500">
              Gestiona los equipos de campaña
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Buscar equipos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            className="w-48"
          />
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Equipo
          </Button>
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-secondary-500">
          Cargando equipos...
        </div>
      ) : filteredTeams.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-500">No hay equipos registrados</p>
          <Button
            variant="primary"
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
          >
            Crear Primer Equipo
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-r ${getTeamColor(index)} -mx-6 -mt-6 px-6 py-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      {team.Nombre}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSelectTeam(team)}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Ver equipo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(team);
                        }}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Estás seguro de eliminar este equipo?')) {
                            deleteMutation.mutate(team.ID);
                          }
                        }}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="cursor-pointer"
                  onClick={() => handleSelectTeam(team)}
                >
                  {team.Descripcion && (
                    <p className="text-secondary-600 text-sm mb-4">
                      {team.Descripcion}
                    </p>
                  )}

                  {team.Lider && (
                    <div className="flex items-center gap-2 p-3 bg-secondary-50 rounded-lg mb-4">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-xs text-secondary-500">Líder</p>
                        <p className="font-medium text-secondary-900">{team.Lider}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm">
                        {team.Miembros || 0} miembros
                      </span>
                    </div>
                    <span className="text-sm text-primary-600 font-medium">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre del equipo"
            placeholder="Ej: Redes Sociales"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />

          <Textarea
            label="Descripción"
            placeholder="Describe las funciones de este equipo..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Líder del equipo
            </label>
            <select
              value={formData.lider}
              onChange={(e) => setFormData({ ...formData, lider: e.target.value })}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccionar líder...</option>
              {allVolunteers.map((v) => (
                <option key={v.ID} value={`${v.Nombre} ${v.Apellidos}`}>
                  {v.Nombre} {v.Apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={addMutation.isPending || updateMutation.isPending}
            >
              {editingTeam ? 'Guardar Cambios' : 'Crear Equipo'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Teams;
