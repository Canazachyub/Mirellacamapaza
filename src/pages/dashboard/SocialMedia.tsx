import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Music2,
  ExternalLink,
  RefreshCw,
  Users,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button } from '@/components/common';
import { REDES_SOCIALES } from '@/utils/constants';

// Configuración de redes sociales
const SOCIAL_CONFIG = {
  facebook: {
    pageUrl: REDES_SOCIALES.facebook.url,
    pageName: 'ahoranacionilave',
    embedWidth: 500,
    embedHeight: 600,
  },
  instagram: {
    profileUrl: REDES_SOCIALES.instagram.url,
    username: 'dramirellacamapaza',
  },
  tiktok: {
    profileUrl: REDES_SOCIALES.tiktok.url,
    username: 'dramirellacamapaza',
  },
};

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState<'facebook' | 'instagram' | 'tiktok'>('facebook');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'facebook' as const, label: 'Facebook', icon: Facebook, color: 'text-blue-600 bg-blue-100' },
    { id: 'instagram' as const, label: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-100' },
    { id: 'tiktok' as const, label: 'TikTok', icon: Music2, color: 'text-gray-900 bg-gray-100' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Redes Sociales</h1>
        <p className="text-secondary-600">Monitorea tus redes sociales desde un solo lugar</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Facebook className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Facebook</p>
            <a
              href={SOCIAL_CONFIG.facebook.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary-900 hover:text-primary-600 flex items-center gap-1"
            >
              Ver página <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <Instagram className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Instagram</p>
            <a
              href={SOCIAL_CONFIG.instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary-900 hover:text-primary-600 flex items-center gap-1"
            >
              @{SOCIAL_CONFIG.instagram.username} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Music2 className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">TikTok</p>
            <a
              href={SOCIAL_CONFIG.tiktok.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary-900 hover:text-primary-600 flex items-center gap-1"
            >
              @{SOCIAL_CONFIG.tiktok.username} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Grupo WhatsApp</p>
            <a
              href={REDES_SOCIALES.whatsappGrupo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary-900 hover:text-primary-600 flex items-center gap-1"
            >
              Voluntariado <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
          className="ml-auto"
        >
          Actualizar
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-secondary-900">
                {activeTab === 'facebook' && 'Feed de Facebook'}
                {activeTab === 'instagram' && 'Perfil de Instagram'}
                {activeTab === 'tiktok' && 'Perfil de TikTok'}
              </h3>
              <a
                href={
                  activeTab === 'facebook' ? SOCIAL_CONFIG.facebook.pageUrl :
                  activeTab === 'instagram' ? SOCIAL_CONFIG.instagram.profileUrl :
                  SOCIAL_CONFIG.tiktok.profileUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Abrir en {activeTab === 'facebook' ? 'Facebook' : activeTab === 'instagram' ? 'Instagram' : 'TikTok'}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Facebook Embed */}
            {activeTab === 'facebook' && (
              <div key={`fb-${refreshKey}`} className="flex justify-center">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(SOCIAL_CONFIG.facebook.pageUrl)}&tabs=timeline&width=${SOCIAL_CONFIG.facebook.embedWidth}&height=${SOCIAL_CONFIG.facebook.embedHeight}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  width={SOCIAL_CONFIG.facebook.embedWidth}
                  height={SOCIAL_CONFIG.facebook.embedHeight}
                  style={{ border: 'none', overflow: 'hidden' }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook Page"
                />
              </div>
            )}

            {/* Instagram Info */}
            {activeTab === 'instagram' && (
              <div key={`ig-${refreshKey}`} className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-secondary-900 mb-2">@{SOCIAL_CONFIG.instagram.username}</h4>
                <p className="text-secondary-600 mb-6">
                  Instagram no permite embeds de perfil completo.<br />
                  Usa el botón para ver el perfil directamente.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href={SOCIAL_CONFIG.instagram.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    Ver Perfil en Instagram
                  </a>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Ver Likes</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Comentarios</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <Share2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Compartidos</p>
                  </div>
                </div>
              </div>
            )}

            {/* TikTok Info */}
            {activeTab === 'tiktok' && (
              <div key={`tt-${refreshKey}`} className="text-center py-8">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music2 className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-secondary-900 mb-2">@{SOCIAL_CONFIG.tiktok.username}</h4>
                <p className="text-secondary-600 mb-6">
                  TikTok no permite embeds de perfil.<br />
                  Usa el botón para ver el perfil directamente.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href={SOCIAL_CONFIG.tiktok.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Music2 className="w-5 h-5" />
                    Ver Perfil en TikTok
                  </a>
                </div>

                {/* TikTok Stats Placeholder */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Ver Likes</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Comentarios</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <Share2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Compartidos</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <h3 className="font-semibold text-secondary-900 mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <a
                href="https://business.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-secondary-900">Meta Business Suite</span>
                <ExternalLink className="w-4 h-4 text-secondary-400 ml-auto" />
              </a>
              <a
                href="https://www.instagram.com/accounts/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-secondary-900">Instagram Creator Studio</span>
                <ExternalLink className="w-4 h-4 text-secondary-400 ml-auto" />
              </a>
              <a
                href="https://www.tiktok.com/creator-center"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Music2 className="w-5 h-5 text-gray-900" />
                <span className="text-sm font-medium text-secondary-900">TikTok Creator Center</span>
                <ExternalLink className="w-4 h-4 text-secondary-400 ml-auto" />
              </a>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="font-semibold text-secondary-900 mb-4">Consejos</h3>
            <ul className="space-y-3 text-sm text-secondary-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Publica contenido regularmente (mínimo 3 veces por semana)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Responde a los comentarios para aumentar el engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Usa hashtags relevantes: #Puno #Elecciones2026 #AhoraNación
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                Los videos cortos tienen más alcance en TikTok e Instagram Reels
              </li>
            </ul>
          </Card>

          {/* Upgrade Notice */}
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-2">¿Quieres más funciones?</h3>
            <p className="text-sm text-primary-700 mb-4">
              Para ver comentarios, notificaciones y métricas en tiempo real, necesitas integrar las APIs oficiales de cada plataforma.
            </p>
            <p className="text-xs text-primary-600">
              Contacta al desarrollador para configurar Meta Graph API y TikTok API.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMedia;
