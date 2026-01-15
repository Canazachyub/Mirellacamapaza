import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader } from '@/components/common';
import { useAuthStore } from '@/store/authStore';

// Public Pages
const Home = lazy(() => import('@/pages/public/Home'));
const Affiliate = lazy(() => import('@/pages/public/Affiliate'));
const Volunteer = lazy(() => import('@/pages/public/Volunteer'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Locations = lazy(() => import('@/pages/public/Locations'));
const Proposals = lazy(() => import('@/pages/public/Proposals'));
const About = lazy(() => import('@/pages/public/About'));
const Gallery = lazy(() => import('@/pages/public/Gallery'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));

// Dashboard Pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const DashboardAffiliates = lazy(() => import('@/pages/dashboard/Affiliates'));
const DashboardVolunteers = lazy(() => import('@/pages/dashboard/Volunteers'));
const DashboardMessages = lazy(() => import('@/pages/dashboard/Messages'));
const DashboardFiles = lazy(() => import('@/pages/dashboard/Files'));
const DashboardTeams = lazy(() => import('@/pages/dashboard/Teams'));
const DashboardEvents = lazy(() => import('@/pages/dashboard/Events'));
const DashboardReports = lazy(() => import('@/pages/dashboard/Reports'));
const DashboardSettings = lazy(() => import('@/pages/dashboard/Settings'));
const DashboardGallery = lazy(() => import('@/pages/dashboard/Gallery'));
const DashboardSocialMedia = lazy(() => import('@/pages/dashboard/SocialMedia'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" text="Cargando..." />
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/afiliate" element={<Affiliate />} />
        <Route path="/voluntariado" element={<Volunteer />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/sedes" element={<Locations />} />
        <Route path="/propuestas" element={<Proposals />} />
        <Route path="/conoceme" element={<About />} />
        <Route path="/galeria" element={<Gallery />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/afiliados"
          element={
            <ProtectedRoute>
              <DashboardAffiliates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/voluntarios"
          element={
            <ProtectedRoute>
              <DashboardVolunteers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mensajes"
          element={
            <ProtectedRoute>
              <DashboardMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/archivos"
          element={
            <ProtectedRoute>
              <DashboardFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/equipos"
          element={
            <ProtectedRoute>
              <DashboardTeams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/eventos"
          element={
            <ProtectedRoute>
              <DashboardEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute>
              <DashboardReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/configuracion"
          element={
            <ProtectedRoute>
              <DashboardSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/galeria"
          element={
            <ProtectedRoute>
              <DashboardGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/redes"
          element={
            <ProtectedRoute>
              <DashboardSocialMedia />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
                <p className="text-xl text-secondary-600 mb-6">
                  Página no encontrada
                </p>
                <a
                  href="/"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
