import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Badge, Modal } from '@/components/common';
import { getVolunteers, updateVolunteer, deleteVolunteer } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate, getStatusColor } from '@/utils/helpers';
import type { Volunteer } from '@/types';

const Volunteers = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: volunteersResponse, isLoading } = useQuery({
    queryKey: ['volunteers', { search, estado: filter }],
    queryFn: () => getVolunteers({ search, estado: filter || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      updateVolunteer(id, { Estado: estado as 'Activo' | 'Inactivo' | 'Pendiente' }),
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      toast.success('Voluntario eliminado');
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      setShowDetailModal(false);
    },
    onError: () => {
      toast.error('Error al eliminar voluntario');
    },
  });

  const handleViewVolunteer = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowDetailModal(true);
  };

  const handleStatusChange = (id: string, estado: string) => {
    updateMutation.mutate({ id, estado });
  };

  const exportToCSV = () => {
    const volunteers = volunteersResponse?.data || [];
    if (volunteers.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const headers = ['Nombre', 'DNI', 'Email', 'Teléfono', 'Provincia', 'Distrito', 'Área', 'Disponibilidad', 'Estado', 'Fecha'];
    const rows = volunteers.map(v => [
      v.Nombre,
      v.DNI,
      v.Email,
      v.Telefono,
      v.Provincia,
      v.Distrito,
      v.Area,
      v.Disponibilidad,
      v.Estado,
      new Date(v.Fecha).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `voluntarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Archivo exportado correctamente');
  };

  const volunteers = volunteersResponse?.data || [];
  const stats = {
    total: volunteersResponse?.total || 0,
    pending: volunteersResponse?.pending || 0,
    active: volunteersResponse?.active || 0,
  };

  const getAreaBadge = (area: string) => {
    const colors: Record<string, string> = {
      'Redes Sociales': 'bg-blue-100 text-blue-700',
      'Logística': 'bg-amber-100 text-amber-700',
      'Comunicaciones': 'bg-purple-100 text-purple-700',
      'Eventos': 'bg-green-100 text-green-700',
      'Transporte': 'bg-orange-100 text-orange-700',
    };
    return colors[area] || 'bg-secondary-100 text-secondary-700';
  };

  return (
    <DashboardLayout title="Voluntarios">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100">Total Voluntarios</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-amber-100">Pendientes</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100">Activos</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <Input
              placeholder="Buscar voluntarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="w-64"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportToCSV}
          >
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Volunteers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-secondary-500">
            Cargando voluntarios...
          </div>
        ) : volunteers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-secondary-500">
            No hay voluntarios registrados
          </div>
        ) : (
          volunteers.map((volunteer) => (
            <motion.div
              key={volunteer.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">
                        {volunteer.Nombre.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        {volunteer.Nombre}
                      </h3>
                      <p className="text-sm text-secondary-500">
                        {volunteer.DNI}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(volunteer.Estado)}>
                    {volunteer.Estado}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{volunteer.Email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Phone className="w-4 h-4" />
                    <span>{volunteer.Telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <MapPin className="w-4 h-4" />
                    <span>{volunteer.Distrito}, {volunteer.Provincia}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getAreaBadge(volunteer.Area)}>
                    <Briefcase className="w-3 h-3 mr-1" />
                    {volunteer.Area}
                  </Badge>
                  <Badge variant="outline" className="text-secondary-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {volunteer.Disponibilidad}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-secondary-400">
                    {formatRelativeDate(volunteer.Fecha)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewVolunteer(volunteer)}
                      className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {volunteer.Estado === 'Pendiente' && (
                      <button
                        onClick={() => handleStatusChange(volunteer.ID, 'Activo')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activar"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(volunteer.ID)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalles del Voluntario"
        size="lg"
      >
        {selectedVolunteer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600">
                  {selectedVolunteer.Nombre.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">
                  {selectedVolunteer.Nombre}
                </h3>
                <p className="text-secondary-600">DNI: {selectedVolunteer.DNI}</p>
                <Badge className={getStatusColor(selectedVolunteer.Estado)} size="lg">
                  {selectedVolunteer.Estado}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="font-medium">{selectedVolunteer.Email}</p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Teléfono</span>
                </div>
                <p className="font-medium">{selectedVolunteer.Telefono}</p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Ubicación</span>
                </div>
                <p className="font-medium">
                  {selectedVolunteer.Distrito}, {selectedVolunteer.Provincia}
                </p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha de registro</span>
                </div>
                <p className="font-medium">
                  {new Date(selectedVolunteer.Fecha).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex items-center gap-2 text-primary-700 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Área de Interés</span>
                </div>
                <p className="font-semibold text-primary-900">{selectedVolunteer.Area}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Disponibilidad</span>
                </div>
                <p className="font-semibold text-blue-900">{selectedVolunteer.Disponibilidad}</p>
              </div>
            </div>

            {selectedVolunteer.Habilidades && (
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-600 mb-2">Habilidades</p>
                <p className="font-medium">{selectedVolunteer.Habilidades}</p>
              </div>
            )}

            {selectedVolunteer.Experiencia && (
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-600 mb-2">Experiencia</p>
                <p className="font-medium whitespace-pre-wrap">{selectedVolunteer.Experiencia}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              {selectedVolunteer.Estado === 'Pendiente' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => {
                      handleStatusChange(selectedVolunteer.ID, 'Activo');
                      setShowDetailModal(false);
                    }}
                  >
                    Activar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={() => {
                      handleStatusChange(selectedVolunteer.ID, 'Inactivo');
                      setShowDetailModal(false);
                    }}
                  >
                    Rechazar
                  </Button>
                </>
              )}
              {selectedVolunteer.Estado === 'Activo' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleStatusChange(selectedVolunteer.ID, 'Inactivo');
                    setShowDetailModal(false);
                  }}
                >
                  Desactivar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Volunteers;
