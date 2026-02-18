import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  History,
  Users,
  Vote,
  Radio,
  Building2,
  Phone,
  Globe,
  Newspaper,
  Monitor,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trophy,
  TrendingUp,
  MapPin,
  Mail,
  MapPinIcon,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Badge } from '@/components/common';
import {
  ELECTORES_2026,
  TOTAL_ELECTORES_2026,
  RESULTADOS_2021,
  PARTICIPACION_2021,
  MEDIOS_COMUNICACION,
  ORGANIZACIONES_SOCIALES,
} from '@/utils/electoralData';

type Tab = 'historico' | 'electores' | 'medios' | 'organizaciones' | 'onpe' | 'candidatos';

const Strategy = () => {
  const [activeTab, setActiveTab] = useState<Tab>('historico');
  const [expandedPartido, setExpandedPartido] = useState<string | null>(null);

  const tabs = [
    { key: 'historico' as Tab, label: 'Elecciones 2021', icon: History },
    { key: 'electores' as Tab, label: 'Electores 2026', icon: Vote },
    { key: 'medios' as Tab, label: 'Medios', icon: Radio },
    { key: 'organizaciones' as Tab, label: 'Organizaciones', icon: Building2 },
    { key: 'onpe' as Tab, label: 'ONPE Histórico', icon: Globe },
    { key: 'candidatos' as Tab, label: 'Candidatos Puno', icon: Users },
  ];

  const partidoColors: Record<string, string> = {
    'Perú Libre': 'border-red-500 bg-red-50',
    'Acción Popular': 'border-blue-500 bg-blue-50',
    'Podemos Perú': 'border-purple-500 bg-purple-50',
    'Juntos por el Perú': 'border-green-500 bg-green-50',
  };

  const partidoBadge: Record<string, string> = {
    'Perú Libre': 'danger',
    'Acción Popular': 'info',
    'Podemos Perú': 'default',
    'Juntos por el Perú': 'success',
  };

  const electores2026Sorted = Object.entries(ELECTORES_2026).sort((a, b) => b[1] - a[1]);

  const tipoIconMap: Record<string, React.ElementType> = {
    'Radio': Radio,
    'TV': Monitor,
    'Prensa': Newspaper,
    'Digital': Globe,
  };

  const categoriaGroups = ORGANIZACIONES_SOCIALES.reduce((acc, org) => {
    if (!acc[org.categoria]) acc[org.categoria] = [];
    acc[org.categoria].push(org);
    return acc;
  }, {} as Record<string, typeof ORGANIZACIONES_SOCIALES>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
              <Swords className="w-7 h-7 text-primary-600" />
              Estrategia Electoral
            </h1>
            <p className="text-secondary-600 mt-1">
              Datos historicos, medios de comunicacion y organizaciones sociales de Puno
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* TAB: Histórico 2021 */}
        {activeTab === 'historico' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Resumen participación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{PARTICIPACION_2021.electoresHabiles.toLocaleString()}</p>
                <p className="text-sm text-secondary-500">Electores Habiles 2021</p>
              </Card>
              <Card className="text-center">
                <Vote className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{PARTICIPACION_2021.participacion.toLocaleString()}</p>
                <p className="text-sm text-secondary-500">Participacion Ciudadana</p>
              </Card>
              <Card className="text-center">
                <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{PARTICIPACION_2021.porcentaje}%</p>
                <p className="text-sm text-secondary-500">Porcentaje Participacion</p>
              </Card>
            </div>

            {/* Congresistas electos */}
            <Card>
              <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Congresistas Electos por Puno - 2021
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {RESULTADOS_2021.flatMap(r =>
                  r.candidatos.filter(c => c.elegido).map(c => (
                    <div key={`${r.partido}-${c.numero}`} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-900" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900 text-sm">{c.nombre}</p>
                        <p className="text-xs text-secondary-500">{r.partido} | {c.votos.toLocaleString()} votos</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Resultados por partido */}
            <div className="space-y-4">
              <h3 className="font-bold text-secondary-900 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                Resultados por Partido - Elecciones 2021
              </h3>
              {RESULTADOS_2021.map(resultado => (
                <Card
                  key={resultado.partido}
                  className={`border-l-4 ${partidoColors[resultado.partido] || 'border-gray-300 bg-gray-50'}`}
                >
                  <button
                    onClick={() => setExpandedPartido(expandedPartido === resultado.partido ? null : resultado.partido)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-secondary-900">{resultado.partido}</h4>
                      <Badge variant={partidoBadge[resultado.partido] as 'danger' | 'info' | 'success' | 'default'}>
                        {resultado.candidatos.filter(c => c.elegido).length} electos
                      </Badge>
                      <span className="text-sm text-secondary-500">
                        Total: {resultado.candidatos.reduce((s, c) => s + c.votos, 0).toLocaleString()} votos
                      </span>
                    </div>
                    {expandedPartido === resultado.partido
                      ? <ChevronUp className="w-5 h-5 text-secondary-400" />
                      : <ChevronDown className="w-5 h-5 text-secondary-400" />
                    }
                  </button>

                  {expandedPartido === resultado.partido && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-secondary-200">
                            <th className="text-left py-2 px-3 font-semibold text-secondary-700">#</th>
                            <th className="text-left py-2 px-3 font-semibold text-secondary-700">Candidato</th>
                            <th className="text-right py-2 px-3 font-semibold text-secondary-700">Votos</th>
                            <th className="text-center py-2 px-3 font-semibold text-secondary-700">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultado.candidatos.map(c => (
                            <tr
                              key={c.numero}
                              className={`border-b border-secondary-100 ${c.elegido ? 'bg-yellow-50 font-semibold' : ''}`}
                            >
                              <td className="py-2 px-3">{c.numero}</td>
                              <td className="py-2 px-3">{c.nombre || '—'}</td>
                              <td className="py-2 px-3 text-right font-semibold">{c.votos.toLocaleString()}</td>
                              <td className="py-2 px-3 text-center">
                                {c.elegido ? (
                                  <Badge variant="warning">ELECTO</Badge>
                                ) : (
                                  <span className="text-secondary-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>

            <Card className="bg-secondary-50">
              <p className="text-sm text-secondary-500 text-center">
                Fuente: ONPE - Resultados Historicos Elecciones Generales 2021
              </p>
            </Card>
          </motion.div>
        )}

        {/* TAB: Electores 2026 */}
        {activeTab === 'electores' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Vote className="w-6 h-6" />
                    Poblacion Electoral 2026 - Region Puno
                  </h2>
                  <p className="text-blue-100 mt-1">Fuente: RENIEC</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{TOTAL_ELECTORES_2026.toLocaleString()}</p>
                  <p className="text-blue-200">electores totales</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Electores por Provincia (2026 vs 2021)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-secondary-200">
                      <th className="text-left py-3 px-3 font-bold text-secondary-700">#</th>
                      <th className="text-left py-3 px-3 font-bold text-secondary-700">Provincia</th>
                      <th className="text-right py-3 px-3 font-bold text-secondary-700">Electores 2026</th>
                      <th className="text-right py-3 px-3 font-bold text-secondary-700">% del Total</th>
                      <th className="text-left py-3 px-3 font-bold text-secondary-700">Barra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {electores2026Sorted.map(([provincia, electores], idx) => {
                      const pct = ((electores / TOTAL_ELECTORES_2026) * 100).toFixed(1);
                      const barWidth = (electores / electores2026Sorted[0][1]) * 100;
                      return (
                        <tr key={provincia} className={`border-b border-secondary-100 ${idx < 3 ? 'bg-yellow-50' : ''}`}>
                          <td className="py-2.5 px-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx < 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-secondary-200 text-secondary-600'
                            }`}>{idx + 1}</span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-secondary-900">{provincia}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-600">{electores.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-secondary-600">{pct}%</td>
                          <td className="py-2.5 px-3 w-48">
                            <div className="h-4 bg-secondary-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${idx < 3 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-secondary-300 bg-secondary-50">
                      <td colSpan={2} className="py-3 px-3 font-bold text-secondary-900">TOTAL PUNO</td>
                      <td className="py-3 px-3 text-right font-bold text-blue-700 text-lg">{TOTAL_ELECTORES_2026.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-bold text-secondary-900">100%</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> La tabla del usuario sumaba 975,580 pero el calculo correcto de las cifras individuales da <strong>966,428</strong>.
                La cifra oficial de RENIEC es <strong>963,489</strong> electores para 2026.
                Se usan los datos RENIEC como fuente oficial.
              </p>
            </Card>
          </motion.div>
        )}

        {/* TAB: Medios */}
        {activeTab === 'medios' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <div className="flex items-center gap-3">
                <Radio className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Medios de Comunicacion - Region Puno</h2>
                  <p className="text-purple-200">{MEDIOS_COMUNICACION.length} medios registrados</p>
                </div>
              </div>
            </Card>

            {['Radio', 'TV', 'Prensa', 'Digital'].map(tipo => {
              const medios = MEDIOS_COMUNICACION.filter(m => m.tipo === tipo);
              const Icon = tipoIconMap[tipo] || Globe;
              if (medios.length === 0) return null;
              return (
                <Card key={tipo}>
                  <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-purple-600" />
                    {tipo === 'TV' ? 'Television' : tipo} ({medios.length})
                  </h3>
                  <div className="space-y-4">
                    {medios.map((m, idx) => (
                      <div key={idx} className="p-4 bg-secondary-50 rounded-lg border border-secondary-100">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-bold text-secondary-900 text-base">{m.medio}</p>
                            {m.frecuencia && <p className="text-sm text-purple-600 font-medium">{m.frecuencia}</p>}
                          </div>
                          {m.notas && (
                            <span className="text-xs text-secondary-500 bg-secondary-200 px-2 py-1 rounded">{m.notas}</span>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {m.direccion && (
                            <div className="flex items-start gap-2 text-secondary-600">
                              <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary-400" />
                              <span>{m.direccion}</span>
                            </div>
                          )}
                          {m.telefono && (
                            <div className="flex items-start gap-2 text-secondary-600">
                              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                              <span>{m.telefono}</span>
                            </div>
                          )}
                          {m.email && (
                            <div className="flex items-start gap-2 text-secondary-600">
                              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                              <span>{m.email}</span>
                            </div>
                          )}
                          {m.web && (
                            <div className="flex items-start gap-2">
                              <Globe className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
                              <a href={m.web.startsWith('http') ? m.web : `https://${m.web}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                {m.web}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Redes Sociales */}
                        {(m.facebook || m.instagram || m.twitter || m.tiktok || m.youtube) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.facebook && (
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">FB: {m.facebook}</span>
                            )}
                            {m.instagram && (
                              <span className="inline-flex items-center gap-1 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">IG: {m.instagram}</span>
                            )}
                            {m.twitter && (
                              <span className="inline-flex items-center gap-1 text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">X: {m.twitter}</span>
                            )}
                            {m.tiktok && (
                              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">TikTok: {m.tiktok}</span>
                            )}
                            {m.youtube && (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">YT: {m.youtube}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* TAB: Organizaciones */}
        {activeTab === 'organizaciones' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Organizaciones Sociales - Region Puno</h2>
                  <p className="text-green-200">{ORGANIZACIONES_SOCIALES.length} organizaciones registradas en {Object.keys(categoriaGroups).length} categorias</p>
                </div>
              </div>
            </Card>

            {Object.entries(categoriaGroups).map(([categoria, orgs]) => (
              <Card key={categoria}>
                <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  {categoria} ({orgs.length})
                </h3>
                <div className="space-y-3">
                  {orgs.map((org, idx) => (
                    <div key={idx} className="p-4 bg-secondary-50 rounded-lg border border-secondary-100">
                      <p className="font-bold text-secondary-900">{org.nombre}</p>
                      {org.descripcion && <p className="text-sm text-secondary-500 mt-1">{org.descripcion}</p>}

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1.5 text-sm">
                        {org.direccion && (
                          <div className="flex items-start gap-2 text-secondary-600">
                            <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary-400" />
                            <span>{org.direccion}</span>
                          </div>
                        )}
                        {org.telefono && (
                          <div className="flex items-start gap-2 text-secondary-600">
                            <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>{org.telefono}</span>
                          </div>
                        )}
                        {org.email && (
                          <div className="flex items-start gap-2 text-secondary-600">
                            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                            <span>{org.email}</span>
                          </div>
                        )}
                        {org.facebookWeb && (
                          <div className="flex items-start gap-2 text-secondary-600">
                            <Globe className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
                            <span>{org.facebookWeb}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* TAB: ONPE Embebido */}
        {activeTab === 'onpe' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-secondary-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-600" />
                  ONPE - Resultados Historicos EG 2021
                </h3>
                <a
                  href="https://resultadoshistorico.onpe.gob.pe/EG2021/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
                >
                  Abrir en nueva ventana
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-secondary-200" style={{ height: '700px' }}>
                <iframe
                  src="https://resultadoshistorico.onpe.gob.pe/EG2021/"
                  title="ONPE Resultados Historicos 2021"
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
              <p className="text-xs text-secondary-400 mt-2 text-center">
                Si el contenido no carga, usa el enlace de arriba para abrir en nueva ventana.
              </p>
            </Card>
          </motion.div>
        )}
        {/* TAB: Candidatos Puno */}
        {activeTab === 'candidatos' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-secondary-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Base de Datos - Candidatos a Diputados por Puno
                </h3>
                <a
                  href="https://canazachyub.github.io/Candidatospuno/consulta/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
                >
                  Abrir en nueva ventana
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-secondary-200" style={{ height: '700px' }}>
                <iframe
                  src="https://canazachyub.github.io/Candidatospuno/consulta/"
                  title="Candidatos a Diputados por Puno"
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
              <p className="text-xs text-secondary-400 mt-2 text-center">
                Si el contenido no carga, usa el enlace de arriba para abrir en nueva ventana.
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Strategy;
