import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Mail,
  MailOpen,
  Reply,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Badge, Modal, Textarea } from '@/components/common';
import { getMessages, replyMessage, updateMessage, deleteMessage } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate, getStatusColor } from '@/utils/helpers';
import type { Message } from '@/types';

const Messages = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: messagesResponse, isLoading } = useQuery({
    queryKey: ['messages', { search, estado: filter }],
    queryFn: () => getMessages({ search, estado: filter || undefined }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, respuesta }: { id: string; respuesta: string }) =>
      replyMessage(id, respuesta),
    onSuccess: () => {
      toast.success('Respuesta enviada correctamente');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setShowReplyModal(false);
      setReplyText('');
      setSelectedMessage(null);
    },
    onError: () => {
      toast.error('Error al enviar respuesta');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success('Mensaje eliminado');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setSelectedMessage(null);
    },
    onError: () => {
      toast.error('Error al eliminar mensaje');
    },
  });

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    // Mark as read
    if (message.Estado === 'Nuevo') {
      await updateMessage(message.ID, 'Leido');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  };

  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    replyMutation.mutate({ id: selectedMessage.ID, respuesta: replyText });
  };

  const messages = messagesResponse?.data || [];
  const unread = messagesResponse?.unread || 0;

  return (
    <DashboardLayout title="Mensajes">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="info" size="lg">
            {unread} sin leer
          </Badge>
          <Badge variant="default" size="lg">
            {messagesResponse?.total || 0} total
          </Badge>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Buscar mensajes..."
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
            <option value="">Todos</option>
            <option value="Nuevo">Nuevos</option>
            <option value="Leido">Leídos</option>
            <option value="Respondido">Respondidos</option>
            <option value="Archivado">Archivados</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card padding="none" className="divide-y divide-secondary-100">
            {isLoading ? (
              <div className="p-8 text-center text-secondary-500">
                Cargando mensajes...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-secondary-500">
                No hay mensajes
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message.ID}
                  onClick={() => handleViewMessage(message)}
                  className={`w-full p-4 text-left hover:bg-secondary-50 transition-colors ${
                    selectedMessage?.ID === message.ID ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.Estado === 'Nuevo'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      {message.Estado === 'Nuevo' ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <MailOpen className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium truncate ${
                            message.Estado === 'Nuevo'
                              ? 'text-secondary-900'
                              : 'text-secondary-700'
                          }`}
                        >
                          {message.Nombre}
                        </p>
                        <ChevronRight className="w-4 h-4 text-secondary-400" />
                      </div>
                      <p className="text-sm text-secondary-600 truncate">
                        {message.Asunto || 'Sin asunto'}
                      </p>
                      <p className="text-xs text-secondary-400 mt-1">
                        {formatRelativeDate(message.Fecha)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    {selectedMessage.Asunto || 'Sin asunto'}
                  </h2>
                  <p className="text-secondary-600">
                    De: {selectedMessage.Nombre}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {selectedMessage.Email} | {selectedMessage.Telefono}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedMessage.Estado)}>
                      {selectedMessage.Estado}
                    </Badge>
                    <span className="text-xs text-secondary-400">
                      {formatRelativeDate(selectedMessage.Fecha)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Reply className="w-4 h-4" />}
                    onClick={() => setShowReplyModal(true)}
                  >
                    Responder
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => deleteMutation.mutate(selectedMessage.ID)}
                    isLoading={deleteMutation.isPending}
                  />
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="text-secondary-700 whitespace-pre-wrap">
                    {selectedMessage.Mensaje}
                  </p>
                </div>
              </div>

              {selectedMessage.Respuesta && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    Tu respuesta:
                  </h3>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-secondary-700 whitespace-pre-wrap">
                      {selectedMessage.Respuesta}
                    </p>
                    <p className="text-xs text-secondary-500 mt-2">
                      Enviada: {formatRelativeDate(selectedMessage.FechaRespuesta)}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-64">
              <div className="text-center text-secondary-500">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona un mensaje para ver los detalles</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="Responder mensaje"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600">
              Respondiendo a: <strong>{selectedMessage?.Nombre}</strong>
            </p>
            <p className="text-sm text-secondary-500">{selectedMessage?.Email}</p>
          </div>

          <Textarea
            label="Tu respuesta"
            placeholder="Escribe tu respuesta..."
            rows={6}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowReplyModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleReply}
              isLoading={replyMutation.isPending}
              disabled={!replyText.trim()}
            >
              Enviar Respuesta
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Messages;
