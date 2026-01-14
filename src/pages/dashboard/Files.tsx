import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  FileText,
  Image,
  Video,
  File,
  Upload,
  Trash2,
  Download,
  FolderPlus,
  ArrowLeft,
  Eye,
  Search,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Modal } from '@/components/common';
import { getFiles, uploadFile, deleteFile, createFolder } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate } from '@/utils/helpers';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime?: string;
  url: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
}

const Files = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: filesResponse, isLoading } = useQuery({
    queryKey: ['files', currentFolderId],
    queryFn: () => getFiles(currentFolderId),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success('Archivo subido correctamente');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setShowUploadModal(false);
    },
    onError: () => {
      toast.error('Error al subir archivo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast.success('Archivo eliminado');
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: () => {
      toast.error('Error al eliminar archivo');
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      toast.success('Carpeta creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setShowFolderModal(false);
      setNewFolderName('');
    },
    onError: () => {
      toast.error('Error al crear carpeta');
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      uploadMutation.mutate({
        name: file.name,
        content: base64,
        mimeType: file.type,
        folderId: currentFolderId,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFolderClick = (folder: DriveFile) => {
    setFolderHistory([...folderHistory, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
  };

  const handleGoBack = () => {
    const newHistory = [...folderHistory];
    newHistory.pop();
    setFolderHistory(newHistory);
    setCurrentFolderId(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : undefined);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate({
      name: newFolderName,
      parentId: currentFolderId,
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <FolderOpen className="w-10 h-10 text-amber-500" />;
    if (mimeType.includes('image')) return <Image className="w-10 h-10 text-blue-500" />;
    if (mimeType.includes('video')) return <Video className="w-10 h-10 text-purple-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-10 h-10 text-red-500" />;
    return <File className="w-10 h-10 text-secondary-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // La API devuelve archivos y carpetas en arrays separados
  const apiFiles = filesResponse?.data?.files || [];
  const apiFolders = filesResponse?.data?.folders || [];

  // Combinar para mostrar
  const folders = apiFolders.map((f: any) => ({ ...f, mimeType: 'application/vnd.google-apps.folder' }));
  const documents = apiFiles;
  const files = [...folders, ...documents];

  const filteredFolders = folders.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDocuments = documents.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Archivos">
      {/* Toolbar */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {folderHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={handleGoBack}
              >
                Volver
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <span className="font-medium">Raíz</span>
              {folderHistory.map((folder, index) => (
                <span key={folder.id} className="flex items-center gap-2">
                  <span>/</span>
                  <span className={index === folderHistory.length - 1 ? 'font-medium text-primary-600' : ''}>
                    {folder.name}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Buscar archivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="w-48"
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderPlus className="w-4 h-4" />}
              onClick={() => setShowFolderModal(true)}
            >
              Nueva Carpeta
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={() => setShowUploadModal(true)}
            >
              Subir Archivo
            </Button>
          </div>
        </div>
      </Card>

      {/* Files Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-secondary-500">
          Cargando archivos...
        </div>
      ) : files.length === 0 ? (
        <Card className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-500">Esta carpeta está vacía</p>
          <p className="text-sm text-secondary-400 mt-2">
            Sube archivos o crea carpetas para comenzar
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Folders */}
          {filteredFolders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-3">Carpetas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFolders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow text-center"
                      padding="sm"
                      onClick={() => handleFolderClick(folder)}
                    >
                      <FolderOpen className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {folder.name}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {filteredDocuments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-3">Archivos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            getFileIcon(file.mimeType)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-secondary-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {formatFileSize(file.size)}
                          </p>
                          {file.updatedAt && (
                            <p className="text-xs text-secondary-400 mt-1">
                              {formatRelativeDate(file.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                        {file.url && (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        {file.downloadUrl && (
                          <a
                            href={file.downloadUrl}
                            download
                            className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(file.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Subir Archivo"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600 mb-2">
              Arrastra un archivo aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                {uploadMutation.isPending ? 'Subiendo...' : 'Seleccionar Archivo'}
              </span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        title="Nueva Carpeta"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la carpeta"
            placeholder="Ej: Documentos de campaña"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowFolderModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateFolder}
              isLoading={createFolderMutation.isPending}
              disabled={!newFolderName.trim()}
            >
              Crear Carpeta
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Files;
