import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  UserPlus,
  MessageSquare,
  Calendar,
  TrendingUp,
  Download,
  MapPin,
  PieChart,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Badge } from '@/components/common';
import { getAffiliates, getVolunteers, getMessages, getEvents } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { PROVINCIAS_PUNO, AREAS_VOLUNTARIADO } from '@/utils/constants';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const toast = useToast();

  const { data: affiliatesResponse, isLoading: loadingAffiliates } = useQuery({
    queryKey: ['affiliates-report'],
    queryFn: () => getAffiliates({ limit: 1000 }),
  });

  const { data: volunteersResponse, isLoading: loadingVolunteers } = useQuery({
    queryKey: ['volunteers-report'],
    queryFn: () => getVolunteers({ limit: 1000 }),
  });

  const { data: messagesResponse, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages-report'],
    queryFn: () => getMessages({ limit: 1000 }),
  });

  const { data: eventsResponse, isLoading: loadingEvents } = useQuery({
    queryKey: ['events-report'],
    queryFn: () => getEvents(),
  });

  const isLoading = loadingAffiliates || loadingVolunteers || loadingMessages || loadingEvents;
  const affiliates = affiliatesResponse?.data || [];
  const volunteers = volunteersResponse?.data || [];
  const messages = messagesResponse?.data || [];
  const events = eventsResponse?.data || [];

  // Calculate affiliate stats by province
  const affiliatesByProvince = PROVINCIAS_PUNO.reduce((acc, provincia) => {
    acc[provincia] = affiliates.filter(a => a.Provincia === provincia).length;
    return acc;
  }, {} as Record<string, number>);

  const topProvinces = Object.entries(affiliatesByProvince)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate volunteer stats by area
  const volunteersByArea = AREAS_VOLUNTARIADO.reduce((acc, area) => {
    acc[area] = volunteers.filter(v => v.Area === area).length;
    return acc;
  }, {} as Record<string, number>);

  const topAreas = Object.entries(volunteersByArea)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Message stats
  const messageStats = {
    total: messages.length,
    nuevo: messages.filter(m => m.Estado === 'Nuevo').length,
    leido: messages.filter(m => m.Estado === 'Leido').length,
    respondido: messages.filter(m => m.Estado === 'Respondido').length,
  };

  // Event stats
  const eventStats = {
    total: events.length,
    programado: events.filter(e => e.Estado === 'Programado').length,
    enCurso: events.filter(e => e.Estado === 'EnCurso').length,
    finalizado: events.filter(e => e.Estado === 'Finalizado').length,
  };

  // Calculate growth (mock data for demo)
  const getGrowthData = () => {
    return {
      affiliates: Math.floor(Math.random() * 20) + 5,
      volunteers: Math.floor(Math.random() * 15) + 3,
      messages: Math.floor(Math.random() * 30) + 10,
    };
  };

  const growth = getGrowthData();

  const exportReport = () => {
    const reportData = {
      fecha: new Date().toISOString(),
      estadisticas: {
        afiliados: {
          total: affiliates.length,
          verificados: affiliates.filter(a => a.Estado === 'Verificado').length,
          pendientes: affiliates.filter(a => a.Estado === 'Pendiente').length,
          porProvincia: affiliatesByProvince,
        },
        voluntarios: {
          total: volunteers.length,
          activos: volunteers.filter(v => v.Estado === 'Activo').length,
          porArea: volunteersByArea,
        },
        mensajes: messageStats,
        eventos: eventStats,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_campana_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Reporte exportado correctamente');
  };

  return (
    <DashboardLayout title="Reportes">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary-900">
              Análisis de Campaña
            </h2>
            <p className="text-sm text-secondary-500">
              Estadísticas y métricas en tiempo real
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="all">Todo el tiempo</option>
          </select>
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportReport}
          >
            Exportar Reporte
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-secondary-500">
          Cargando estadísticas...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Afiliados</p>
                    <p className="text-3xl font-bold">{affiliates.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{growth.affiliates}% este mes</span>
                    </div>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Voluntarios</p>
                    <p className="text-3xl font-bold">{volunteers.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{growth.volunteers}% este mes</span>
                    </div>
                  </div>
                  <UserPlus className="w-12 h-12 text-purple-200" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Mensajes Recibidos</p>
                    <p className="text-3xl font-bold">{messages.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{growth.messages}% este mes</span>
                    </div>
                  </div>
                  <MessageSquare className="w-12 h-12 text-green-200" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Eventos</p>
                    <p className="text-3xl font-bold">{events.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{eventStats.programado} programados</span>
                    </div>
                  </div>
                  <Calendar className="w-12 h-12 text-amber-200" />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Affiliates by Province */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Afiliados por Provincia
                </h3>
                <MapPin className="w-5 h-5 text-secondary-400" />
              </div>
              <div className="space-y-4">
                {topProvinces.map(([provincia, count], index) => (
                  <div key={provincia}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-secondary-700">{provincia}</span>
                      <span className="text-sm font-medium text-secondary-900">{count}</span>
                    </div>
                    <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / (topProvinces[0][1] || 1)) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Volunteers by Area */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Voluntarios por Área
                </h3>
                <PieChart className="w-5 h-5 text-secondary-400" />
              </div>
              <div className="space-y-4">
                {topAreas.map(([area, count], index) => {
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
                  return (
                    <div key={area}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-secondary-700">{area}</span>
                        <span className="text-sm font-medium text-secondary-900">{count}</span>
                      </div>
                      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / (topAreas[0][1] || 1)) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full ${colors[index]} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Affiliate Status */}
            <Card>
              <h4 className="font-semibold text-secondary-900 mb-4">Estado de Afiliados</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Verificados</span>
                  <Badge variant="success">
                    {affiliates.filter(a => a.Estado === 'Verificado').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Pendientes</span>
                  <Badge variant="warning">
                    {affiliates.filter(a => a.Estado === 'Pendiente').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Rechazados</span>
                  <Badge variant="danger">
                    {affiliates.filter(a => a.Estado === 'Rechazado').length}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Volunteer Status */}
            <Card>
              <h4 className="font-semibold text-secondary-900 mb-4">Estado de Voluntarios</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Activos</span>
                  <Badge variant="success">
                    {volunteers.filter(v => v.Estado === 'Activo').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Pendientes</span>
                  <Badge variant="warning">
                    {volunteers.filter(v => v.Estado === 'Pendiente').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Inactivos</span>
                  <Badge variant="default">
                    {volunteers.filter(v => v.Estado === 'Inactivo').length}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Message Status */}
            <Card>
              <h4 className="font-semibold text-secondary-900 mb-4">Estado de Mensajes</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Nuevos</span>
                  <Badge variant="info">{messageStats.nuevo}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Leídos</span>
                  <Badge variant="default">{messageStats.leido}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Respondidos</span>
                  <Badge variant="success">{messageStats.respondido}</Badge>
                </div>
              </div>
            </Card>

            {/* Event Status */}
            <Card>
              <h4 className="font-semibold text-secondary-900 mb-4">Estado de Eventos</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Programados</span>
                  <Badge variant="info">{eventStats.programado}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">En Curso</span>
                  <Badge variant="warning">{eventStats.enCurso}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Finalizados</span>
                  <Badge variant="success">{eventStats.finalizado}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
