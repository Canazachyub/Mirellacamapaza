import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserPlus,
  FolderOpen,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Image,
  Share2,
  Brain,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';
import { CANDIDATA, DASHBOARD_NAV } from '@/utils/constants';
import { ToastContainer } from '@/components/common';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserPlus,
  FolderOpen,
  UsersRound: Users,
  Calendar,
  BarChart3,
  Settings,
  Image,
  Share2,
  Brain,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item }: { item: typeof DASHBOARD_NAV[0] }) => {
    const Icon = iconMap[item.icon || 'LayoutDashboard'];
    const active = isActive(item.href);

    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
          active
            ? 'bg-primary-600 text-white'
            : 'text-secondary-600 hover:bg-secondary-100'
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Icon className="w-5 h-5" />
        {(sidebarOpen || mobileMenuOpen) && (
          <span className="font-medium">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-100">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 hidden lg:block',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {CANDIDATA.numeroLista}
              </span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-secondary-900">Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary-100"
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 text-secondary-600 transition-transform',
                !sidebarOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {DASHBOARD_NAV.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {CANDIDATA.numeroLista}
            </span>
          </div>
          <span className="font-bold text-secondary-900">Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-secondary-100"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-40 bg-white pt-16"
          >
            <nav className="p-4 space-y-1">
              {DASHBOARD_NAV.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 pt-16 lg:pt-0',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Page Header */}
        {title && (
          <div className="bg-white shadow-sm px-6 py-4">
            <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
