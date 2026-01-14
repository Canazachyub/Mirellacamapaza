import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Globe,
  Phone,
  Mail,
  Shield,
  Database,
  Key,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Textarea, Badge } from '@/components/common';
import { getConfig, updateConfig, pingApi } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { CANDIDATA, CONTACTO, REDES_SOCIALES } from '@/utils/constants';

interface ConfigItem {
  key: string;
  value: string;
  description?: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: configResponse, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value, description }: ConfigItem) =>
      updateConfig(key, value, description),
    onSuccess: () => {
      toast.success('Configuración guardada');
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
    onError: () => {
      toast.error('Error al guardar configuración');
    },
  });

  // Check API status
  useEffect(() => {
    const checkApi = async () => {
      try {
        await pingApi();
        setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  // Initialize form data from config
  useEffect(() => {
    if (configResponse?.data) {
      // Extract values from Config items
      const config: Record<string, string> = {};
      Object.entries(configResponse.data).forEach(([key, item]) => {
        if (typeof item === 'object' && item !== null && 'value' in item) {
          config[key] = item.value;
        } else if (typeof item === 'string') {
          config[key] = item;
        }
      });
      setFormData(config);
    }
  }, [configResponse]);

  const handleSave = (key: string, description?: string) => {
    if (formData[key] !== undefined) {
      updateMutation.mutate({ key, value: formData[key], description });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'contact', label: 'Contacto', icon: Phone },
    { id: 'social', label: 'Redes Sociales', icon: Globe },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'api', label: 'API', icon: Database },
  ];

  return (
    <DashboardLayout title="Configuración">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-600 hover:bg-secondary-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <Card className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-secondary-400 mx-auto animate-spin" />
              <p className="text-secondary-500 mt-4">Cargando configuración...</p>
            </Card>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* General Settings */}
              {activeTab === 'general' && (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                    Configuración General
                  </h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <h4 className="font-medium text-secondary-900 mb-4">
                        Información de la Candidata
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-secondary-500">Nombre:</span>
                          <span className="ml-2 font-medium">{CANDIDATA.nombreCompleto}</span>
                        </div>
                        <div>
                          <span className="text-secondary-500">Partido:</span>
                          <span className="ml-2 font-medium">{CANDIDATA.partido}</span>
                        </div>
                        <div>
                          <span className="text-secondary-500">Número de Lista:</span>
                          <span className="ml-2 font-medium">{CANDIDATA.numeroLista}</span>
                        </div>
                        <div>
                          <span className="text-secondary-500">Región:</span>
                          <span className="ml-2 font-medium">{CANDIDATA.region}</span>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Título del Sitio"
                      value={formData.siteTitle || 'Dra. Mirella Camapaza - Candidata a Diputada'}
                      onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                      helperText="Este título aparece en la pestaña del navegador"
                    />

                    <Textarea
                      label="Descripción del Sitio"
                      value={formData.siteDescription || CANDIDATA.slogan}
                      onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                      rows={3}
                      helperText="Esta descripción aparece en los resultados de búsqueda"
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={() => handleSave('siteTitle')}
                        isLoading={updateMutation.isPending}
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Contact Settings */}
              {activeTab === 'contact' && (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                    Información de Contacto
                  </h3>
                  <div className="space-y-6">
                    <Input
                      label="WhatsApp"
                      value={formData.whatsapp || CONTACTO.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      leftIcon={<Phone className="w-5 h-5" />}
                      helperText="Número sin espacios ni guiones (ej: 51964271720)"
                    />

                    <Input
                      label="Correo Electrónico"
                      type="email"
                      value={formData.email || CONTACTO.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      leftIcon={<Mail className="w-5 h-5" />}
                    />

                    <Textarea
                      label="Mensaje de WhatsApp Predeterminado"
                      value={formData.whatsappMessage || CONTACTO.whatsappMessage}
                      onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                      rows={2}
                      helperText="Este mensaje se pre-carga cuando alguien hace clic en el botón de WhatsApp"
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={() => handleSave('whatsapp')}
                        isLoading={updateMutation.isPending}
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Social Settings */}
              {activeTab === 'social' && (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                    Redes Sociales
                  </h3>
                  <div className="space-y-6">
                    <Input
                      label="Facebook"
                      value={formData.facebook || REDES_SOCIALES.facebook.url}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />

                    <Input
                      label="Instagram"
                      value={formData.instagram || REDES_SOCIALES.instagram.url}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />

                    <Input
                      label="TikTok"
                      value={formData.tiktok || REDES_SOCIALES.tiktok.url}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/..."
                    />

                    <Input
                      label="Grupo de WhatsApp"
                      value={formData.whatsappGroup || REDES_SOCIALES.whatsappGrupo.url}
                      onChange={(e) => setFormData({ ...formData, whatsappGroup: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={() => handleSave('facebook')}
                        isLoading={updateMutation.isPending}
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                    Seguridad
                  </h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">
                            Cambiar Contraseña del Panel
                          </h4>
                          <p className="text-sm text-amber-700 mt-1">
                            La contraseña se almacena en la hoja de Configuración de Google Sheets.
                            Para cambiarla, actualiza el valor de ADMIN_PASSWORD directamente en la hoja.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Nueva Contraseña"
                      type="password"
                      value={formData.newPassword || ''}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      leftIcon={<Key className="w-5 h-5" />}
                      helperText="Mínimo 8 caracteres"
                    />

                    <Input
                      label="Confirmar Contraseña"
                      type="password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      leftIcon={<Key className="w-5 h-5" />}
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={() => {
                          if (formData.newPassword !== formData.confirmPassword) {
                            toast.error('Las contraseñas no coinciden');
                            return;
                          }
                          if (formData.newPassword && formData.newPassword.length < 8) {
                            toast.error('La contraseña debe tener al menos 8 caracteres');
                            return;
                          }
                          handleSave('ADMIN_PASSWORD');
                        }}
                        isLoading={updateMutation.isPending}
                        disabled={!formData.newPassword || !formData.confirmPassword}
                      >
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                      Estado de la API
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-6 h-6 text-secondary-600" />
                        <div>
                          <p className="font-medium text-secondary-900">Google Apps Script API</p>
                          <p className="text-sm text-secondary-500">Backend de la aplicación</p>
                        </div>
                      </div>
                      <Badge
                        variant={apiStatus === 'online' ? 'success' : apiStatus === 'offline' ? 'danger' : 'default'}
                        size="lg"
                      >
                        {apiStatus === 'checking' && 'Verificando...'}
                        {apiStatus === 'online' && 'En línea'}
                        {apiStatus === 'offline' && 'Sin conexión'}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                        onClick={async () => {
                          setApiStatus('checking');
                          try {
                            await pingApi();
                            setApiStatus('online');
                            toast.success('API funcionando correctamente');
                          } catch {
                            setApiStatus('offline');
                            toast.error('No se pudo conectar con la API');
                          }
                        }}
                      >
                        Verificar Conexión
                      </Button>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                      URLs de Recursos
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-500 mb-1">Google Spreadsheet ID</p>
                        <p className="font-mono text-sm text-secondary-900 break-all">
                          {import.meta.env.VITE_SPREADSHEET_ID || 'No configurado'}
                        </p>
                      </div>

                      <div className="p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-500 mb-1">Google Drive Folder ID</p>
                        <p className="font-mono text-sm text-secondary-900 break-all">
                          {import.meta.env.VITE_DRIVE_FOLDER_ID || 'No configurado'}
                        </p>
                      </div>

                      <div className="p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-500 mb-1">API URL</p>
                        <p className="font-mono text-sm text-secondary-900 break-all">
                          {import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'No configurado'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
