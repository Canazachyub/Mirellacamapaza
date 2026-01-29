import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Target,
  BarChart3,
  MapPin,
  Eye,
  Plus,
  X,
  Phone,
  Building2,
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  Users2
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/common';
import {
  REGIONAL_TOTALS,
  PROVINCE_LOCATIONS,
  getProvinceStats,
  getDistritosByProvincia,
  type ProvinciaStats,
  type DistritoElectoral
} from '@/utils/electoralData';
import { getBases, addBase, updateBase, deleteBase, getBaseStats } from '@/services/api';
import type { BaseTerritorial, BaseFormData, BaseStats } from '@/types';

type ViewMode = 'electores' | 'jovenes' | 'mayores' | 'mujeres';

// Component to handle map view changes
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Modal para agregar/editar base
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BaseFormData) => Promise<void>;
  initialData?: BaseTerritorial;
  provincia: string;
  distrito: string;
  isLoading: boolean;
}

const BaseModal = ({ isOpen, onClose, onSubmit, initialData, provincia, distrito, isLoading }: BaseModalProps) => {
  const [formData, setFormData] = useState<BaseFormData>({
    provincia,
    distrito,
    tipoBase: initialData?.TipoBase || 'Punto_Contacto',
    responsable: initialData?.Responsable || '',
    telefono: initialData?.Telefono || '',
    estado: initialData?.Estado || 'Pendiente',
    afiliados: initialData?.Afiliados || 0,
    voluntarios: initialData?.Voluntarios || 0,
    competencia: initialData?.Competencia || '',
    notasCompetencia: initialData?.NotasCompetencia || '',
    prioridad: initialData?.Prioridad || 'Media',
    notas: initialData?.Notas || '',
  });

  useEffect(() => {
    setFormData({
      provincia,
      distrito,
      tipoBase: initialData?.TipoBase || 'Punto_Contacto',
      responsable: initialData?.Responsable || '',
      telefono: initialData?.Telefono || '',
      estado: initialData?.Estado || 'Pendiente',
      afiliados: initialData?.Afiliados || 0,
      voluntarios: initialData?.Voluntarios || 0,
      competencia: initialData?.Competencia || '',
      notasCompetencia: initialData?.NotasCompetencia || '',
      prioridad: initialData?.Prioridad || 'Media',
      notas: initialData?.Notas || '',
    });
  }, [provincia, distrito, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-secondary-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-secondary-900">
                {initialData ? 'Editar Base' : 'Registrar Base Territorial'}
              </h2>
              <p className="text-sm text-secondary-600">{distrito}, {provincia}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Tipo de Base</label>
              <select
                value={formData.tipoBase}
                onChange={(e) => setFormData({ ...formData, tipoBase: e.target.value as BaseFormData['tipoBase'] })}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="Sede">Sede Principal</option>
                <option value="Punto_Contacto">Punto de Contacto</option>
                <option value="Comunidad">Comunidad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Responsable *</label>
              <input
                type="text"
                required
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                placeholder="Nombre del coordinador"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Telefono *</label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="987654321"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as BaseFormData['estado'] })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Activa">Activa</option>
                  <option value="En_Formacion">En Formacion</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Prioridad</label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as BaseFormData['prioridad'] })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Afiliados</label>
                <input
                  type="number"
                  min="0"
                  value={formData.afiliados || 0}
                  onChange={(e) => setFormData({ ...formData, afiliados: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Voluntarios</label>
                <input
                  type="number"
                  min="0"
                  value={formData.voluntarios || 0}
                  onChange={(e) => setFormData({ ...formData, voluntarios: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Competencia (partidos rivales)</label>
              <input
                type="text"
                value={formData.competencia || ''}
                onChange={(e) => setFormData({ ...formData, competencia: e.target.value })}
                placeholder="Ej: Partido X, Partido Y"
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Analisis de Competencia</label>
              <textarea
                value={formData.notasCompetencia || ''}
                onChange={(e) => setFormData({ ...formData, notasCompetencia: e.target.value })}
                placeholder="Fortalezas y debilidades de rivales..."
                rows={2}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Notas Generales</label>
              <textarea
                value={formData.notas || ''}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                placeholder="Observaciones adicionales..."
                rows={2}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {initialData ? 'Actualizar' : 'Registrar Base'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ElectoralMap = () => {
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('electores');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15.0, -70.0]);
  const [mapZoom, setMapZoom] = useState(8);

  const [bases, setBases] = useState<BaseTerritorial[]>([]);
  const [baseStats, setBaseStats] = useState<BaseStats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState<{ provincia: string; distrito: string } | null>(null);
  const [editingBase, setEditingBase] = useState<BaseTerritorial | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const provinceStats = useMemo(() => getProvinceStats(), []);

  const selectedProvinceData = useMemo(() => {
    if (!selectedProvincia) return null;
    return provinceStats.find(p => p.nombre === selectedProvincia);
  }, [selectedProvincia, provinceStats]);

  const distritos = useMemo(() => {
    if (!selectedProvincia) return [];
    return getDistritosByProvincia(selectedProvincia);
  }, [selectedProvincia]);

  const filteredProvincias = useMemo(() => {
    if (!searchTerm) return provinceStats;
    return provinceStats.filter(p =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [provinceStats, searchTerm]);

  const maxElectores = useMemo(() =>
    Math.max(...provinceStats.map(p => p.electores)),
    [provinceStats]
  );

  const loadBases = async () => {
    try {
      const [basesRes, statsRes] = await Promise.all([getBases(), getBaseStats()]);
      if (basesRes.success && basesRes.data) setBases(basesRes.data);
      if (statsRes.success && statsRes.data) setBaseStats(statsRes.data);
    } catch (error) {
      console.error('Error cargando bases:', error);
    }
  };

  useEffect(() => {
    loadBases();
  }, []);

  const getBaseByDistrito = (provincia: string, distrito: string) => {
    return bases.find(b => b.Provincia === provincia && b.Distrito === distrito);
  };

  const handleBaseSubmit = async (data: BaseFormData) => {
    setIsSaving(true);
    try {
      if (editingBase) {
        await updateBase(editingBase.ID, data);
      } else {
        await addBase(data);
      }
      await loadBases();
      setModalOpen(false);
      setEditingBase(undefined);
      setSelectedDistrito(null);
    } catch (error) {
      console.error('Error guardando base:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = (provincia: string, distrito: string) => {
    setSelectedDistrito({ provincia, distrito });
    setEditingBase(undefined);
    setModalOpen(true);
  };

  const openEditModal = (base: BaseTerritorial) => {
    setSelectedDistrito({ provincia: base.Provincia, distrito: base.Distrito });
    setEditingBase(base);
    setModalOpen(true);
  };

  const handleDeleteBase = async (id: string) => {
    if (!confirm('Eliminar esta base territorial?')) return;
    try {
      await deleteBase(id);
      await loadBases();
    } catch (error) {
      console.error('Error eliminando base:', error);
    }
  };

  const getStatValue = (item: ProvinciaStats | DistritoElectoral) => {
    switch (viewMode) {
      case 'jovenes':
        return { value: item.jovenes, percent: ((item.jovenes / item.electores) * 100).toFixed(1) };
      case 'mayores':
        return { value: item.mayores70, percent: ((item.mayores70 / item.electores) * 100).toFixed(1) };
      case 'mujeres':
        return { value: item.mujeres, percent: ((item.mujeres / item.electores) * 100).toFixed(1) };
      default:
        return { value: item.electores, percent: ((item.electores / REGIONAL_TOTALS.electores) * 100).toFixed(1) };
    }
  };

  const getMarkerColor = () => {
    switch (viewMode) {
      case 'jovenes': return '#22c55e';
      case 'mayores': return '#f97316';
      case 'mujeres': return '#ec4899';
      default: return '#3b82f6';
    }
  };

  const getMarkerRadius = (electores: number) => {
    const minRadius = 15;
    const maxRadius = 45;
    return minRadius + (electores / maxElectores) * (maxRadius - minRadius);
  };

  const handleProvinceSelect = (nombre: string) => {
    const isSelected = selectedProvincia === nombre;
    setSelectedProvincia(isSelected ? null : nombre);

    if (!isSelected) {
      const coords = PROVINCE_LOCATIONS[nombre];
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(10);
      }
    } else {
      setMapCenter([-15.0, -70.0]);
      setMapZoom(8);
    }
  };

  const getBarColor = () => {
    switch (viewMode) {
      case 'jovenes': return 'bg-green-500';
      case 'mayores': return 'bg-orange-500';
      case 'mujeres': return 'bg-pink-500';
      default: return 'bg-blue-500';
    }
  };

  const maxValue = useMemo(() => {
    return Math.max(...provinceStats.map(p => {
      switch (viewMode) {
        case 'jovenes': return p.jovenes;
        case 'mayores': return p.mayores70;
        case 'mujeres': return p.mujeres;
        default: return p.electores;
      }
    }));
  }, [provinceStats, viewMode]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Activa': return <Badge variant="success">Activa</Badge>;
      case 'En_Formacion': return <Badge variant="warning">En Formacion</Badge>;
      case 'Pendiente': return <Badge variant="info">Pendiente</Badge>;
      default: return <Badge variant="default">Inactiva</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
              <Map className="w-7 h-7 text-primary-600" />
              Mapa Electoral - Region Puno
            </h1>
            <p className="text-secondary-600 mt-1">
              Analisis territorial de {REGIONAL_TOTALS.electores.toLocaleString()} electores en {REGIONAL_TOTALS.provincias} provincias
            </p>
          </div>
          <Badge variant="info" className="text-lg px-4 py-2">
            {REGIONAL_TOTALS.distritos} Distritos
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary-900">{REGIONAL_TOTALS.varones.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">Varones (49.5%)</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center">
              <UserCheck className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary-900">{REGIONAL_TOTALS.mujeres.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">Mujeres (50.5%)</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary-900">{REGIONAL_TOTALS.jovenes.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">Jovenes (31.3%)</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center">
              <UserPlus className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary-900">{REGIONAL_TOTALS.mayores70.toLocaleString()}</p>
              <p className="text-sm text-secondary-500">+70 anos (9.5%)</p>
            </Card>
          </motion.div>
        </div>

        {baseStats && (
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-secondary-900">Bases Territoriales</h3>
                  <p className="text-sm text-secondary-600">Coordinadores registrados</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{baseStats.totalBases}</p>
                  <p className="text-xs text-secondary-500">Total Bases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{baseStats.activas}</p>
                  <p className="text-xs text-secondary-500">Activas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{baseStats.enFormacion}</p>
                  <p className="text-xs text-secondary-500">En Formacion</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{baseStats.totalAfiliados}</p>
                  <p className="text-xs text-secondary-500">Afiliados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{baseStats.totalVoluntarios}</p>
                  <p className="text-xs text-secondary-500">Voluntarios</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-secondary-500" />
            <span className="text-sm font-medium text-secondary-700 mr-2">Visualizar:</span>
            {[
              { key: 'electores', label: 'Total Electores', color: 'bg-blue-500' },
              { key: 'jovenes', label: 'Jovenes', color: 'bg-green-500' },
              { key: 'mayores', label: '+70 anos', color: 'bg-orange-500' },
              { key: 'mujeres', label: 'Mujeres', color: 'bg-pink-500' },
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as ViewMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === mode.key
                    ? `${mode.color} text-white`
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="h-[500px] relative">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  {provinceStats.map((provincia) => {
                    const coords = PROVINCE_LOCATIONS[provincia.nombre];
                    if (!coords) return null;
                    const isSelected = selectedProvincia === provincia.nombre;

                    return (
                      <CircleMarker
                        key={provincia.nombre}
                        center={[coords.lat, coords.lng]}
                        radius={getMarkerRadius(provincia.electores)}
                        pathOptions={{
                          fillColor: getMarkerColor(),
                          color: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.8)',
                          weight: isSelected ? 3 : 2,
                          fillOpacity: 0.85
                        }}
                        eventHandlers={{ click: () => handleProvinceSelect(provincia.nombre) }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg text-yellow-600 border-b pb-2 mb-2">{provincia.nombre}</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Electores:</span>
                                <span className="font-semibold text-blue-600">{provincia.electores.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Varones:</span>
                                <span>{provincia.varones.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Mujeres:</span>
                                <span className="text-pink-600">{provincia.mujeres.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Jovenes:</span>
                                <span className="text-green-600">{provincia.jovenes.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t mt-2">
                                <span className="text-gray-600">Distritos:</span>
                                <span className="font-semibold">{provincia.distritos}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Tamano: Poblacion</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getBarColor()}`}></div>
                    <span className="text-xs text-gray-600">
                      {viewMode === 'electores' ? 'Total Electores' :
                       viewMode === 'jovenes' ? 'Jovenes' :
                       viewMode === 'mayores' ? '+70 anos' : 'Mujeres'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-secondary-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Provincias
                </h2>
                <span className="text-sm text-secondary-500">{filteredProvincias.length}</span>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Buscar provincia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredProvincias.map((provincia, idx) => {
                  const stats = getStatValue(provincia);
                  const isSelected = selectedProvincia === provincia.nombre;
                  const barWidth = (stats.value / maxValue) * 100;

                  return (
                    <motion.button
                      key={provincia.nombre}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleProvinceSelect(provincia.nombre)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected ? 'bg-primary-50 border-primary-500' : 'bg-white border-secondary-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx < 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-secondary-200 text-secondary-600'
                          }`}>{idx + 1}</span>
                          <span className="font-medium text-secondary-900 text-sm">{provincia.nombre}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-secondary-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">{provincia.distritos} distritos</span>
                        <span className="font-semibold text-primary-600">{stats.value.toLocaleString()} ({stats.percent}%)</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                        <div className={`h-full ${getBarColor()} rounded-full transition-all duration-500`} style={{ width: `${barWidth}%` }} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {selectedProvinceData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    {selectedProvinceData.nombre}
                  </h2>
                  <p className="text-primary-100 mt-1">{selectedProvinceData.distritos} distritos</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{selectedProvinceData.electores.toLocaleString()}</p>
                  <p className="text-primary-100">electores</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedProvinceData.varones.toLocaleString()}</p>
                  <p className="text-xs text-primary-200">Varones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedProvinceData.mujeres.toLocaleString()}</p>
                  <p className="text-xs text-primary-200">Mujeres</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedProvinceData.jovenes.toLocaleString()}</p>
                  <p className="text-xs text-primary-200">Jovenes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedProvinceData.mayores70.toLocaleString()}</p>
                  <p className="text-xs text-primary-200">+70 anos</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Distritos de {selectedProvinceData.nombre}
                <span className="text-sm font-normal text-secondary-500 ml-2">(Clic en + para registrar responsable)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700">#</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700">Distrito</th>
                      <th className="text-right py-2 px-3 font-semibold text-secondary-700">Electores</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700">Responsable</th>
                      <th className="text-center py-2 px-3 font-semibold text-secondary-700">Estado</th>
                      <th className="text-center py-2 px-3 font-semibold text-secondary-700">Prioridad</th>
                      <th className="text-center py-2 px-3 font-semibold text-secondary-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distritos.map((distrito, idx) => {
                      const base = getBaseByDistrito(selectedProvinceData.nombre, distrito.distrito);
                      return (
                        <tr key={distrito.distrito} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-2 px-3 text-secondary-500">{idx + 1}</td>
                          <td className="py-2 px-3 font-medium text-secondary-900">{distrito.distrito}</td>
                          <td className="py-2 px-3 text-right font-semibold text-blue-600">{distrito.electores.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            {base ? (
                              <div className="flex items-center gap-2">
                                <Users2 className="w-4 h-4 text-purple-500" />
                                <div>
                                  <p className="font-medium text-secondary-900">{base.Responsable}</p>
                                  <p className="text-xs text-secondary-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />{base.Telefono}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-secondary-400 italic">Sin asignar</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {base ? getEstadoBadge(base.Estado) : <Badge variant="default">-</Badge>}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge variant={distrito.electores >= 10000 ? 'danger' : distrito.electores >= 5000 ? 'warning' : 'success'}>
                              {distrito.electores >= 10000 ? 'Alta' : distrito.electores >= 5000 ? 'Media' : 'Baja'}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {base ? (
                                <>
                                  <button onClick={() => openEditModal(base)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600" title="Editar">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteBase(base.ID)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-600" title="Eliminar">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => openAddModal(selectedProvinceData.nombre, distrito.distrito)} className="p-1.5 hover:bg-green-100 rounded-lg text-green-600" title="Agregar responsable">
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {!selectedProvinceData && (
          <Card className="text-center py-12">
            <Eye className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">Selecciona una Provincia</h3>
            <p className="text-secondary-500 max-w-md mx-auto">
              Haz clic en un marcador del mapa o en una provincia de la lista para ver el detalle y registrar responsables.
            </p>
          </Card>
        )}

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-secondary-700">Leyenda de Prioridad:</span>
              <div className="flex items-center gap-2">
                <Badge variant="danger">Alta (+10,000)</Badge>
                <Badge variant="warning">Media (5,000-10,000)</Badge>
                <Badge variant="success">Baja (-5,000)</Badge>
              </div>
            </div>
            <div className="text-sm text-secondary-500">Fuente: ONPE/JNE - Padron Electoral 2021</div>
          </div>
        </Card>
      </div>

      {selectedDistrito && (
        <BaseModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingBase(undefined); setSelectedDistrito(null); }}
          onSubmit={handleBaseSubmit}
          initialData={editingBase}
          provincia={selectedDistrito.provincia}
          distrito={selectedDistrito.distrito}
          isLoading={isSaving}
        />
      )}
    </DashboardLayout>
  );
};

export default ElectoralMap;
