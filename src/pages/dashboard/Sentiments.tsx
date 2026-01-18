import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Search,
  Filter,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Send,
  X,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Loader } from '@/components/common';
import { getSentiments, getSentimentStats, generateAIResponse } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { cn } from '@/utils/cn';
import type { Sentiment } from '@/types';

type TabType = 'dashboard' | 'responder';
type SentimentFilter = 'todos' | 'positivo' | 'negativo' | 'neutro';

const Sentiments = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | null>(null);

  // AI Responder State
  const [commentToRespond, setCommentToRespond] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [copied, setCopied] = useState(false);

  // Queries
  const { data: sentimentsResponse, isLoading: isLoadingSentiments, refetch } = useQuery({
    queryKey: ['sentiments', sentimentFilter, searchTerm],
    queryFn: () =>
      getSentiments({
        sentimiento: sentimentFilter === 'todos' ? undefined : sentimentFilter,
        search: searchTerm || undefined,
        limit: 100,
      }),
  });

  const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
    queryKey: ['sentimentStats'],
    queryFn: getSentimentStats,
  });

  // AI Response Mutation
  const [aiError, setAiError] = useState<string | null>(null);

  const aiMutation = useMutation({
    mutationFn: generateAIResponse,
    onSuccess: (response) => {
      setAiError(null);
      if (response.success && response.data) {
        setAiResponse(response.data.respuesta);
        toast.success('Respuesta generada exitosamente');
      } else {
        const errorMsg = response.error || 'Error al generar respuesta';
        setAiError(errorMsg);
        toast.error('Error al generar respuesta');
      }
    },
    onError: (error: Error) => {
      const errorMsg = error.message || 'Error de conexión con la API de IA';
      setAiError(errorMsg);
      toast.error('Error de conexión');
    },
  });

  const sentiments = sentimentsResponse?.data || [];
  const stats = statsResponse?.data;

  const handleGenerateResponse = () => {
    if (!commentToRespond.trim()) {
      toast.error('Ingresa un comentario para responder');
      return;
    }
    aiMutation.mutate({
      comentario: commentToRespond,
      tono: 'profesional',
    });
  };

  const handleCopyResponse = async () => {
    if (aiResponse) {
      await navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      toast.success('Respuesta copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSentimentIcon = (sentimiento: string) => {
    switch (sentimiento) {
      case 'positivo':
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'negativo':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentimiento: string) => {
    switch (sentimiento) {
      case 'positivo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negativo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (nivel: string) => {
    const normalizedNivel = nivel?.toLowerCase() || '';
    if (normalizedNivel.includes('alto') || normalizedNivel.includes('high')) {
      return 'bg-red-100 text-red-800';
    }
    if (normalizedNivel.includes('medio') || normalizedNivel.includes('medium')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  return (
    <DashboardLayout title="Analisis de Sentimientos">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
            activeTab === 'dashboard'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-100'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('responder')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
            activeTab === 'responder'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-100'
          )}
        >
          <Sparkles className="w-4 h-4" />
          Responder con IA
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Total</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {isLoadingStats ? '...' : stats?.total || 0}
                  </p>
                </div>
              </Card>

              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <ThumbsUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Positivos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoadingStats ? '...' : stats?.positivos || 0}
                  </p>
                </div>
              </Card>

              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100">
                  <ThumbsDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Negativos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {isLoadingStats ? '...' : stats?.negativos || 0}
                  </p>
                </div>
              </Card>

              <Card className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gray-100">
                  <Minus className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Neutros</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {isLoadingStats ? '...' : stats?.neutros || 0}
                  </p>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary-500" />
                  <span className="font-medium text-secondary-700">Filtrar por:</span>
                  <div className="flex gap-2">
                    {(['todos', 'positivo', 'negativo', 'neutro'] as SentimentFilter[]).map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => setSentimentFilter(filter)}
                          className={cn(
                            'px-3 py-1 rounded-full text-sm font-medium transition-all capitalize',
                            sentimentFilter === filter
                              ? 'bg-primary-600 text-white'
                              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                          )}
                        >
                          {filter}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Buscar comentarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                    title="Actualizar"
                  >
                    <RefreshCw className="w-5 h-5 text-secondary-600" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Sentiments List */}
            <Card>
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                Comentarios ({sentiments.length})
              </h3>

              {isLoadingSentiments ? (
                <div className="flex justify-center py-8">
                  <Loader size="lg" />
                </div>
              ) : sentiments.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  No hay comentarios para mostrar
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sentiments.map((sentiment, index) => (
                    <motion.div
                      key={sentiment.ID || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedSentiment(sentiment)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-secondary-900">
                              {sentiment.Autor || 'Anonimo'}
                            </span>
                            {sentiment.Responde_A && (
                              <span className="text-xs text-secondary-500">
                                responde a {sentiment.Responde_A}
                              </span>
                            )}
                          </div>
                          <p className="text-secondary-700 line-clamp-2">
                            {sentiment.Comentario}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                                getSentimentColor(sentiment.Sentimiento)
                              )}
                            >
                              {getSentimentIcon(sentiment.Sentimiento)}
                              {sentiment.Sentimiento}
                            </span>
                            {sentiment.Categoria && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                {sentiment.Categoria}
                              </span>
                            )}
                            {sentiment.Nivel_Riesgo && (
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-xs',
                                  getRiskColor(sentiment.Nivel_Riesgo)
                                )}
                              >
                                Riesgo: {sentiment.Nivel_Riesgo}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCommentToRespond(sentiment.Comentario);
                            setActiveTab('responder');
                          }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Sentiment Detail Modal */}
            <AnimatePresence>
              {selectedSentiment && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedSentiment(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-secondary-900">
                          Detalle del Comentario
                        </h3>
                        <button
                          onClick={() => setSelectedSentiment(null)}
                          className="p-2 hover:bg-secondary-100 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-secondary-500">Autor</label>
                          <p className="text-secondary-900">{selectedSentiment.Autor || 'Anonimo'}</p>
                        </div>

                        {selectedSentiment.Responde_A && (
                          <div>
                            <label className="text-sm font-medium text-secondary-500">
                              Responde a
                            </label>
                            <p className="text-secondary-900">{selectedSentiment.Responde_A}</p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium text-secondary-500">Comentario</label>
                          <p className="text-secondary-900 bg-secondary-50 p-3 rounded-lg">
                            {selectedSentiment.Comentario}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-secondary-500">
                              Sentimiento
                            </label>
                            <p
                              className={cn(
                                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm',
                                getSentimentColor(selectedSentiment.Sentimiento)
                              )}
                            >
                              {getSentimentIcon(selectedSentiment.Sentimiento)}
                              {selectedSentiment.Sentimiento}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-secondary-500">
                              Nivel de Riesgo
                            </label>
                            <p
                              className={cn(
                                'inline-block px-2 py-1 rounded-full text-sm',
                                getRiskColor(selectedSentiment.Nivel_Riesgo)
                              )}
                            >
                              {selectedSentiment.Nivel_Riesgo || 'No especificado'}
                            </p>
                          </div>
                        </div>

                        {selectedSentiment.Tema && (
                          <div>
                            <label className="text-sm font-medium text-secondary-500">Tema</label>
                            <p className="text-secondary-900">{selectedSentiment.Tema}</p>
                          </div>
                        )}

                        {selectedSentiment.Categoria && (
                          <div>
                            <label className="text-sm font-medium text-secondary-500">Categoria</label>
                            <p className="text-secondary-900">{selectedSentiment.Categoria}</p>
                          </div>
                        )}

                        {selectedSentiment.Etiquetas && (
                          <div>
                            <label className="text-sm font-medium text-secondary-500">Etiquetas</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedSentiment.Etiquetas.split(',').map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full text-xs"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedSentiment.Detalle && (
                          <div>
                            <label className="text-sm font-medium text-secondary-500">Detalle</label>
                            <p className="text-secondary-700 text-sm">{selectedSentiment.Detalle}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedSentiment(null)}
                          >
                            Cerrar
                          </Button>
                          <Button
                            onClick={() => {
                              setCommentToRespond(selectedSentiment.Comentario);
                              setSelectedSentiment(null);
                              setActiveTab('responder');
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generar Respuesta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="responder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* AI Response Generator */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold text-secondary-900">
                  Generador de Respuestas con IA
                </h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Como usar esta herramienta:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Copia el comentario de Facebook que deseas responder</li>
                      <li>Pegalo en el campo de texto de abajo</li>
                      <li>Haz clic en "Generar Respuesta"</li>
                      <li>Revisa y copia la respuesta generada</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Comentario a responder
                  </label>
                  <textarea
                    value={commentToRespond}
                    onChange={(e) => setCommentToRespond(e.target.value)}
                    placeholder="Pega aqui el comentario de Facebook que deseas responder..."
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] resize-y"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCommentToRespond('');
                      setAiResponse('');
                      setAiError(null);
                    }}
                    disabled={aiMutation.isPending}
                  >
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleGenerateResponse}
                    disabled={!commentToRespond.trim() || aiMutation.isPending}
                  >
                    {aiMutation.isPending ? (
                      <>
                        <Loader size="sm" className="mr-2" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generar Respuesta
                      </>
                    )}
                  </Button>
                </div>

                {/* Error Display */}
                {aiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Error al generar respuesta</p>
                        <p className="text-sm text-red-700 mt-1 break-all">{aiError}</p>
                        <p className="text-xs text-red-600 mt-2">
                          Verifica que el backend tenga el modelo correcto: gemini-2.0-flash-lite
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* AI Response Output */}
            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-secondary-900">Respuesta Sugerida</h4>
                      </div>
                      <Button
                        size="sm"
                        variant={copied ? 'primary' : 'secondary'}
                        onClick={handleCopyResponse}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-secondary-800 whitespace-pre-wrap">{aiResponse}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-secondary-500">
                        Esta respuesta fue generada por IA basada en el contexto de la campana.
                        Revisala antes de publicarla y ajustala segun sea necesario.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips Card */}
            <Card className="bg-secondary-50">
              <h4 className="font-medium text-secondary-900 mb-3">
                Consejos para responder comentarios
              </h4>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">1.</span>
                  Mantén un tono profesional y respetuoso siempre
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">2.</span>
                  No respondas a provocaciones o ataques personales
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">3.</span>
                  Usa datos y hechos para respaldar tus argumentos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">4.</span>
                  Redirige la conversación hacia las propuestas de campana
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">5.</span>
                  Revisa y personaliza la respuesta antes de publicar
                </li>
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Sentiments;
