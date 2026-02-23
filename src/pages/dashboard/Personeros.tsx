import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search, Shield, Phone, Mail, Calendar, Download, Eye, Trash2,
  CheckCircle, XCircle, MapPin, Users, CreditCard,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Modal, Badge } from '@/components/common';
import { getPersoneros, updatePersonero, deletePersonero } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate, getStatusColor } from '@/utils/helpers';
import type { Personero } from '@/types';

const DashboardPersoneros = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedPersonero, setSelectedPersonero] = useState<Personero | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: personerosResponse, isLoading } = useQuery({
    queryKey: ['personeros', { search, estado: filter }],
    queryFn: () => getPersoneros({ search: search || undefined, estado: filter || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      updatePersonero(id, { Estado: estado as Personero['Estado'] }),
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['personeros'] });
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePersonero,
    onSuccess: () => {
      toast.success('Personero eliminado');
      queryClient.invalidateQueries({ queryKey: ['personeros'] });
      setShowDetailModal(false);
    },
    onError: () => {
      toast.error('Error al eliminar');
    },
  });

  const personeros = personerosResponse?.data || [];
  const total = personerosResponse?.total || 0;
  const pendientes = personerosResponse?.pending || 0;
  const aprobados = personerosResponse?.active || 0;

  const handleExportCSV = () => {
    if (!personeros.length) return;
    const headers = [
      'ID', 'Fecha', 'DNI', 'Nombres', 'Apellido Paterno', 'Apellido Materno',
      'Teléfono', 'Email', 'Tipo Ubicación', 'Región', 'Provincia', 'Distrito',
      'País', 'Ciudad Exterior', 'Mesa', 'Referente', 'Es Afiliado',
      'Tiene Experiencia', 'Tipo Experiencia', 'Estado',
    ];
    const rows = personeros.map((p) => [
      p.ID, p.Fecha, p.DNI, p.Nombres, p.ApellidoPaterno, p.ApellidoMaterno,
      p.Telefono, p.Email, p.TipoUbicacion, p.Region, p.Provincia, p.Distrito,
      p.Pais, p.CiudadExterior, p.GrupoVotacion, p.Referente, p.EsAfiliado,
      p.TieneExperiencia, p.TipoExperiencia, p.Estado,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v || ''}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `personeros_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado correctamente');
  };

  const getUbicacionLabel = (p: Personero) => {
    if (p.TipoUbicacion === 'Extranjero') {
      return `🌍 ${p.Pais}${p.CiudadExterior ? `, ${p.CiudadExterior}` : ''}`;
    }
    return `🇵🇪 ${p.Provincia || p.Region || 'Sin ubicación'}${p.Distrito ? `, ${p.Distrito}` : ''}`;
  };

  return (
    <DashboardLayout title="Personeros de Mesa">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Personeros</p>
              <p className="text-3xl font-bold">{total}</p>
            </div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-r !from-amber-500 !to-amber-600 !text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-amber-100 text-sm">Pendientes</p>
              <p className="text-3xl font-bold">{pendientes}</p>
            </div>
          </div>
        </Card>
        <Card className="!bg-gradient-to-r !from-green-500 !to-green-600 !text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-green-100 text-sm">Aprobados</p>
              <p className="text-3xl font-bold">{aprobados}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o mesa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Rechazado">Rechazado</option>
          </select>
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
            disabled={!personeros.length}
          >
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Cargando personeros...</p>
          </div>
        ) : personeros.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay personeros registrados</p>
            <p className="text-gray-400 text-sm mt-1">
              Los registros aparecerán aquí cuando los personeros se inscriban
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DNI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Ubicación</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Mesa</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Fecha</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personeros.map((personero) => (
                  <motion.tr
                    key={personero.ID}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {personero.Nombres} {personero.ApellidoPaterno}
                        </p>
                        <p className="text-xs text-gray-500">{personero.ApellidoMaterno}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-gray-700">{personero.DNI}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{getUbicacionLabel(personero)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{personero.GrupoVotacion || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(personero.Estado)}>
                        {personero.Estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {personero.Fecha ? formatRelativeDate(personero.Fecha) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedPersonero(personero);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {personero.Estado === 'Pendiente' && (
                          <>
                            <button
                              onClick={() => updateMutation.mutate({ id: personero.ID, estado: 'Aprobado' })}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: personero.ID, estado: 'Rechazado' })}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este personero?')) {
                              deleteMutation.mutate(personero.ID);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalle del Personero"
      >
        {selectedPersonero && (
          <div className="space-y-6">
            {/* Estado */}
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(selectedPersonero.Estado)} text-base px-4 py-1`}>
                {selectedPersonero.Estado}
              </Badge>
              <span className="text-sm text-gray-500">
                ID: {selectedPersonero.ID}
              </span>
            </div>

            {/* Datos Personales */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Datos Personales
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Nombres:</span>
                  <p className="font-medium">{selectedPersonero.Nombres}</p>
                </div>
                <div>
                  <span className="text-gray-500">Apellidos:</span>
                  <p className="font-medium">{selectedPersonero.ApellidoPaterno} {selectedPersonero.ApellidoMaterno}</p>
                </div>
                <div>
                  <span className="text-gray-500">DNI:</span>
                  <p className="font-medium font-mono">{selectedPersonero.DNI}</p>
                </div>
                <div>
                  <span className="text-gray-500">Fecha Nac.:</span>
                  <p className="font-medium">{selectedPersonero.FechaNacimiento || '-'}</p>
                </div>
                {selectedPersonero.Telefono && (
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedPersonero.Telefono}
                    </p>
                  </div>
                )}
                {selectedPersonero.Email && (
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedPersonero.Email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Ubicación de Votación
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <p className="font-medium">
                    {selectedPersonero.TipoUbicacion === 'Nacional' ? '🇵🇪 Nacional' : '🌍 Extranjero'}
                  </p>
                </div>
                {selectedPersonero.TipoUbicacion === 'Nacional' ? (
                  <>
                    <div>
                      <span className="text-gray-500">Región:</span>
                      <p className="font-medium">{selectedPersonero.Region || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Provincia:</span>
                      <p className="font-medium">{selectedPersonero.Provincia || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Distrito:</span>
                      <p className="font-medium">{selectedPersonero.Distrito || '-'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-500">País:</span>
                      <p className="font-medium">{selectedPersonero.Pais || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ciudad:</span>
                      <p className="font-medium">{selectedPersonero.CiudadExterior || '-'}</p>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-gray-500">Mesa:</span>
                  <p className="font-medium">{selectedPersonero.GrupoVotacion || '-'}</p>
                </div>
              </div>
            </div>

            {/* Referente y Experiencia */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" /> Referente y Experiencia
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Referente:</span>
                  <p className="font-medium">{selectedPersonero.Referente || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Es Afiliado:</span>
                  <p className="font-medium">{selectedPersonero.EsAfiliado || 'No'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Experiencia:</span>
                  <p className="font-medium">{selectedPersonero.TieneExperiencia || 'No'}</p>
                </div>
                {selectedPersonero.TipoExperiencia && (
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <p className="font-medium">{selectedPersonero.TipoExperiencia}</p>
                  </div>
                )}
                {selectedPersonero.DetalleExperiencia && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Detalle:</span>
                    <p className="font-medium">{selectedPersonero.DetalleExperiencia}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {selectedPersonero.Estado === 'Pendiente' && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => {
                      updateMutation.mutate({ id: selectedPersonero.ID, estado: 'Aprobado' });
                      setSelectedPersonero({ ...selectedPersonero, Estado: 'Aprobado' });
                    }}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={() => {
                      updateMutation.mutate({ id: selectedPersonero.ID, estado: 'Rechazado' });
                      setSelectedPersonero({ ...selectedPersonero, Estado: 'Rechazado' });
                    }}
                    className="!text-red-600 !border-red-300 hover:!bg-red-50"
                  >
                    Rechazar
                  </Button>
                </>
              )}
              {selectedPersonero.Estado === 'Aprobado' && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  onClick={() => {
                    updateMutation.mutate({ id: selectedPersonero.ID, estado: 'Activo' });
                    setSelectedPersonero({ ...selectedPersonero, Estado: 'Activo' });
                  }}
                >
                  Marcar Activo
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  if (confirm('¿Eliminar este personero?')) {
                    deleteMutation.mutate(selectedPersonero.ID);
                  }
                }}
                className="!text-red-600 !border-red-300 hover:!bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardPersoneros;
