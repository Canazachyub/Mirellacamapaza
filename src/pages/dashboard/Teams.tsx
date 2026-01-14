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
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Modal, Textarea } from '@/components/common';
import { getTeams, addTeam, updateTeam, deleteTeam, getVolunteers } from '@/services/api';
import { useToast } from '@/store/uiStore';
import type { Team } from '@/types';

const Teams = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    lider: '',
  });

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: teamsResponse, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });

  const { data: volunteersResponse } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => getVolunteers({ estado: 'Activo' }),
  });

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

  const teams = teamsResponse?.data || [];
  const volunteers = volunteersResponse?.data || [];

  const filteredTeams = teams.filter(team =>
    team.Nombre.toLowerCase().includes(search.toLowerCase())
  );

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
              <Card className="overflow-hidden">
                <div className={`bg-gradient-to-r ${getTeamColor(index)} -mx-6 -mt-6 px-6 py-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      {team.Nombre}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(team)}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
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

                <div className="flex items-center gap-2 text-secondary-600">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">
                    {team.Miembros || 0} miembros
                  </span>
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
              {volunteers.map((v) => (
                <option key={v.ID} value={v.Nombre}>
                  {v.Nombre}
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
