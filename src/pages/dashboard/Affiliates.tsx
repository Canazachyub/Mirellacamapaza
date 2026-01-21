import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Badge, Modal } from '@/components/common';
import { getAffiliates, updateAffiliate, deleteAffiliate } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate, getStatusColor } from '@/utils/helpers';
import { generateAffiliatePDF } from '@/utils/generateAffiliatePDF';
import type { Affiliate } from '@/types';

const Affiliates = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: affiliatesResponse, isLoading } = useQuery({
    queryKey: ['affiliates', { search, estado: filter }],
    queryFn: () => getAffiliates({ search, estado: filter || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      updateAffiliate(id, { Estado: estado as 'Pendiente' | 'Verificado' | 'Activo' | 'Inactivo' | 'Rechazado' }),
    onSuccess: () => {
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAffiliate,
    onSuccess: () => {
      toast.success('Afiliado eliminado');
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      setShowDetailModal(false);
    },
    onError: () => {
      toast.error('Error al eliminar afiliado');
    },
  });

  const handleViewAffiliate = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowDetailModal(true);
  };

  const handleStatusChange = (id: string, estado: string) => {
    updateMutation.mutate({ id, estado });
  };

  const handleDownloadPDF = (affiliate: Affiliate) => {
    try {
      generateAffiliatePDF(affiliate);
      toast.success('Ficha PDF generada correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  const exportToCSV = () => {
    const affiliates = affiliatesResponse?.data || [];
    if (affiliates.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const headers = ['Nombre', 'DNI', 'Email', 'Teléfono', 'Provincia', 'Distrito', 'Estado', 'Fecha'];
    const rows = affiliates.map(a => [
      a.Nombre,
      a.DNI,
      a.Email,
      a.Telefono,
      a.Provincia,
      a.Distrito,
      a.Estado,
      new Date(a.Fecha).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `afiliados_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Archivo exportado correctamente');
  };

  const affiliates = affiliatesResponse?.data || [];
  const stats = {
    total: affiliatesResponse?.total || 0,
    pending: affiliatesResponse?.pending || 0,
    verified: affiliatesResponse?.verified || 0,
  };

  return (
    <DashboardLayout title="Afiliados">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100">Total Afiliados</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
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
              <p className="text-green-100">Verificados</p>
              <p className="text-3xl font-bold">{stats.verified}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <Input
              placeholder="Buscar afiliados..."
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
              <option value="Verificado">Verificado</option>
              <option value="Rechazado">Rechazado</option>
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

      {/* Affiliates Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">Nombre</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">DNI</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">Contacto</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">Ubicación</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-700">Fecha</th>
                <th className="text-center py-4 px-6 font-semibold text-secondary-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-secondary-500">
                    Cargando afiliados...
                  </td>
                </tr>
              ) : affiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-secondary-500">
                    No hay afiliados registrados
                  </td>
                </tr>
              ) : (
                affiliates.map((affiliate) => (
                  <motion.tr
                    key={affiliate.ID}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-secondary-900">{affiliate.Nombre}</div>
                    </td>
                    <td className="py-4 px-6 text-secondary-600">{affiliate.DNI}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-sm">
                        <span className="text-secondary-600">{affiliate.Email}</span>
                        <span className="text-secondary-500">{affiliate.Telefono}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-secondary-600">
                        <MapPin className="w-4 h-4" />
                        {affiliate.Distrito}, {affiliate.Provincia}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(affiliate.Estado)}>
                        {affiliate.Estado}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-secondary-500">
                      {formatRelativeDate(affiliate.Fecha)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewAffiliate(affiliate)}
                          className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(affiliate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Descargar Ficha PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {affiliate.Estado === 'Pendiente' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(affiliate.ID, 'Verificado')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(affiliate.ID, 'Rechazado')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(affiliate.ID)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalles del Afiliado"
        size="lg"
      >
        {selectedAffiliate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">
                  {selectedAffiliate.Nombre}
                </h3>
                <p className="text-secondary-600">DNI: {selectedAffiliate.DNI}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="font-medium">{selectedAffiliate.Email}</p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Teléfono</span>
                </div>
                <p className="font-medium">{selectedAffiliate.Telefono}</p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Ubicación</span>
                </div>
                <p className="font-medium">
                  {selectedAffiliate.Distrito}, {selectedAffiliate.Provincia}
                </p>
              </div>

              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center gap-2 text-secondary-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha de registro</span>
                </div>
                <p className="font-medium">
                  {new Date(selectedAffiliate.Fecha).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {selectedAffiliate.Ocupacion && (
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-600 mb-1">Ocupación</p>
                <p className="font-medium">{selectedAffiliate.Ocupacion}</p>
              </div>
            )}

            {/* Botón de descarga PDF destacado */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Ficha de Afiliación PDF</p>
                  <p className="text-sm text-blue-700">Descarga la ficha para agregar foto, firma y huella digital</p>
                </div>
                <Button
                  variant="primary"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={() => handleDownloadPDF(selectedAffiliate)}
                >
                  Descargar PDF
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Badge size="lg" className={getStatusColor(selectedAffiliate.Estado)}>
                {selectedAffiliate.Estado}
              </Badge>

              <div className="flex gap-2">
                {selectedAffiliate.Estado === 'Pendiente' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => {
                        handleStatusChange(selectedAffiliate.ID, 'Verificado');
                        setShowDetailModal(false);
                      }}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<XCircle className="w-4 h-4" />}
                      onClick={() => {
                        handleStatusChange(selectedAffiliate.ID, 'Rechazado');
                        setShowDetailModal(false);
                      }}
                    >
                      Rechazar
                    </Button>
                  </>
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
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Affiliates;
