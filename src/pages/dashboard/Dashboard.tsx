import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  UserPlus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common';
import { getStats } from '@/services/api';
import { cn } from '@/utils/cn';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mt-2">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {trendValue}
              </span>
              <span className="text-secondary-400 text-sm">vs semana pasada</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 60000, // Refresh every minute
  });

  const stats = statsResponse?.data;

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Afiliados"
            value={isLoading ? '...' : stats?.totalAffiliates || 0}
            icon={Users}
            color="blue"
            trend="up"
            trendValue={`+${stats?.recentAffiliates || 0}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Mensajes"
            value={isLoading ? '...' : stats?.totalMessages || 0}
            icon={MessageSquare}
            color="green"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Voluntarios"
            value={isLoading ? '...' : stats?.totalVolunteers || 0}
            icon={UserPlus}
            color="purple"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Mensajes sin leer"
            value={isLoading ? '...' : stats?.unreadMessages || 0}
            icon={MessageSquare}
            color="red"
          />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Afiliados por Distrito */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-bold text-secondary-900 mb-4">
              Afiliados por Distrito
            </h3>
            {stats?.affiliatesByDistrict ? (
              <div className="space-y-3">
                {Object.entries(stats.affiliatesByDistrict)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 5)
                  .map(([distrito, count]) => (
                    <div key={distrito}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-700">{distrito}</span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{
                            width: `${
                              ((count as number) / stats.totalAffiliates) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-center py-8">
                No hay datos disponibles
              </p>
            )}
          </Card>
        </motion.div>

        {/* Voluntarios por Área */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-lg font-bold text-secondary-900 mb-4">
              Voluntarios por Área
            </h3>
            {stats?.volunteersByArea ? (
              <div className="space-y-3">
                {Object.entries(stats.volunteersByArea)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 5)
                  .map(([area, count]) => (
                    <div key={area}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-700">{area}</span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                      <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: `${
                              ((count as number) / stats.totalVolunteers) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-secondary-500 text-center py-8">
                No hay datos disponibles
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <h3 className="text-lg font-bold text-secondary-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/mensajes"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <span className="text-sm font-medium text-secondary-700">
                Ver Mensajes
              </span>
            </a>
            <a
              href="/admin/afiliados"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-secondary-700">
                Ver Afiliados
              </span>
            </a>
            <a
              href="/admin/voluntarios"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <UserPlus className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-secondary-700">
                Ver Voluntarios
              </span>
            </a>
            <a
              href="/admin/eventos"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-secondary-700">
                Ver Eventos
              </span>
            </a>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
