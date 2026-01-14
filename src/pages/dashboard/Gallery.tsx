import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Trash2,
  FolderPlus,
  Upload,
  Calendar,
  MapPin,
  Eye,
  FileText,
  Download,
  Folder,
  ArrowLeft,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Modal } from '@/components/common';
import { getFiles, createFolder, uploadFile, deleteFile } from '@/services/api';
import { useToast } from '@/store/uiStore';
import { formatRelativeDate } from '@/utils/helpers';

interface Album {
  id: string;
  name: string;
  url?: string;
  imageCount?: number;
}

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string | null;
  createdAt: string;
}

interface DocumentFile {
  id: string;
  name: string;
  url: string;
  downloadUrl?: string;
  mimeType: string;
  createdAt: string;
}

interface DocumentFolder {
  id: string;
  name: string;
}

const DashboardGallery = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'photos' | 'documents'>('photos');

  // Photo states
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAlbumLocation, setNewAlbumLocation] = useState('');
  const [galeriaFolderId, setGaleriaFolderId] = useState<string | null>(null);

  // Document states
  const [selectedDocFolder, setSelectedDocFolder] = useState<DocumentFolder | null>(null);
  const [showNewDocFolderModal, setShowNewDocFolderModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [newDocFolderName, setNewDocFolderName] = useState('');
  const [documentosFolderId, setDocumentosFolderId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const toast = useToast();

  // ==================== PHOTOS QUERIES ====================

  // Obtener carpeta GALERIA
  const { isLoading: loadingGaleriaRoot } = useQuery({
    queryKey: ['gallery-root'],
    queryFn: async () => {
      const response = await getFiles();
      const galeriaFolder = response?.data?.folders?.find(
        (f: { name: string }) => {
          const name = f.name.toUpperCase().trim();
          return name === 'GALERIA' || name === 'GALLERY' ||
                 name.startsWith('GALERIA ') || name.startsWith('GALLERY ') ||
                 name.startsWith('GALERIA_') || name.startsWith('GALLERY_');
        }
      );
      if (galeriaFolder) {
        setGaleriaFolderId(galeriaFolder.id);
      }
      return response;
    },
  });

  // Obtener álbumes (subcarpetas de GALERIA)
  const { data: albumsResponse, isLoading: loadingAlbums } = useQuery({
    queryKey: ['gallery-albums', galeriaFolderId],
    queryFn: () => galeriaFolderId ? getFiles(galeriaFolderId) : Promise.resolve(null),
    enabled: !!galeriaFolderId,
  });

  // Obtener imágenes del álbum seleccionado
  const { data: albumImagesResponse, isLoading: loadingImages } = useQuery({
    queryKey: ['gallery-images', selectedAlbum?.id],
    queryFn: () => selectedAlbum ? getFiles(selectedAlbum.id) : Promise.resolve(null),
    enabled: !!selectedAlbum,
  });

  // ==================== DOCUMENTS QUERIES ====================

  // Obtener carpeta DOCUMENTOS
  const { isLoading: loadingDocsRoot } = useQuery({
    queryKey: ['documents-root'],
    queryFn: async () => {
      const response = await getFiles();
      const docsFolder = response?.data?.folders?.find(
        (f: { name: string }) =>
          f.name.toUpperCase().includes('DOCUMENTO') ||
          f.name.toUpperCase() === 'DOCS'
      );
      if (docsFolder) {
        setDocumentosFolderId(docsFolder.id);
      }
      return response;
    },
  });

  // Obtener subcarpetas de DOCUMENTOS
  const { data: docFoldersResponse, isLoading: loadingDocFolders } = useQuery({
    queryKey: ['documents-folders', documentosFolderId],
    queryFn: () => documentosFolderId ? getFiles(documentosFolderId) : Promise.resolve(null),
    enabled: !!documentosFolderId,
  });

  // Obtener archivos de la carpeta de documentos seleccionada
  const { data: docFilesResponse, isLoading: loadingDocFiles } = useQuery({
    queryKey: ['documents-files', selectedDocFolder?.id || documentosFolderId],
    queryFn: () => {
      const folderId = selectedDocFolder?.id || documentosFolderId;
      return folderId ? getFiles(folderId) : Promise.resolve(null);
    },
    enabled: !!(selectedDocFolder?.id || documentosFolderId),
  });

  // ==================== PHOTOS MUTATIONS ====================

  const createAlbumMutation = useMutation({
    mutationFn: async () => {
      const parentId = galeriaFolderId || undefined;
      const albumName = `${newAlbumDate} - ${newAlbumName}${newAlbumLocation ? ` - ${newAlbumLocation}` : ''}`;
      return createFolder({ name: albumName, parentId });
    },
    onSuccess: () => {
      toast.success('Álbum creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] });
      setShowNewAlbumModal(false);
      setNewAlbumName('');
      setNewAlbumLocation('');
    },
    onError: () => {
      toast.error('Error al crear el álbum');
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const parentId = selectedAlbum?.id || galeriaFolderId || undefined;
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return uploadFile({ name: file.name, content, mimeType: file.type, folderId: parentId });
    },
    onSuccess: () => {
      toast.success('Imagen subida correctamente');
      queryClient.invalidateQueries({ queryKey: ['gallery-images', selectedAlbum?.id] });
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] });
    },
    onError: () => {
      toast.error('Error al subir la imagen');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast.success('Imagen eliminada');
      queryClient.invalidateQueries({ queryKey: ['gallery-images', selectedAlbum?.id] });
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] });
    },
    onError: () => {
      toast.error('Error al eliminar la imagen');
    },
  });

  // ==================== DOCUMENTS MUTATIONS ====================

  const createDocFolderMutation = useMutation({
    mutationFn: async () => {
      const parentId = documentosFolderId || undefined;
      return createFolder({ name: newDocFolderName, parentId });
    },
    onSuccess: () => {
      toast.success('Carpeta creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['documents-folders'] });
      queryClient.invalidateQueries({ queryKey: ['documents-files'] });
      setShowNewDocFolderModal(false);
      setNewDocFolderName('');
    },
    onError: () => {
      toast.error('Error al crear la carpeta');
    },
  });

  const uploadDocMutation = useMutation({
    mutationFn: async (file: File) => {
      const parentId = selectedDocFolder?.id || documentosFolderId || undefined;
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return uploadFile({ name: file.name, content, mimeType: file.type, folderId: parentId });
    },
    onSuccess: () => {
      toast.success('Documento subido correctamente');
      queryClient.invalidateQueries({ queryKey: ['documents-files'] });
      queryClient.invalidateQueries({ queryKey: ['documents-folders'] });
    },
    onError: () => {
      toast.error('Error al subir el documento');
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      toast.success('Documento eliminado');
      queryClient.invalidateQueries({ queryKey: ['documents-files'] });
      queryClient.invalidateQueries({ queryKey: ['documents-folders'] });
    },
    onError: () => {
      toast.error('Error al eliminar el documento');
    },
  });

  // ==================== HANDLERS ====================

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        await uploadImageMutation.mutateAsync(file);
      }
    }
    setShowUploadModal(false);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadDocMutation.mutateAsync(file);
    }
    setShowUploadDocModal(false);
  };

  // ==================== DATA PROCESSING ====================

  const albums: Album[] = albumsResponse?.data?.folders || [];
  const images: GalleryImage[] = (albumImagesResponse?.data?.files || [])
    .filter((f: { mimeType?: string }) => f.mimeType?.startsWith('image/'));

  const docFolders: DocumentFolder[] = docFoldersResponse?.data?.folders || [];
  const docFiles: DocumentFile[] = (docFilesResponse?.data?.files || [])
    .filter((f: { mimeType: string }) =>
      f.mimeType === 'application/pdf' ||
      f.mimeType?.includes('document') ||
      f.mimeType?.includes('spreadsheet') ||
      f.mimeType?.includes('presentation')
    );

  const parseAlbumName = (name: string) => {
    const parts = name.split(' - ');
    const date = parts[0] || '';
    const title = parts[1] || name;
    const location = parts[2] || '';
    return { date, title, location };
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-red-600" /></div>;
    }
    if (mimeType?.includes('spreadsheet')) {
      return <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-green-600" /></div>;
    }
    if (mimeType?.includes('presentation')) {
      return <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-orange-600" /></div>;
    }
    return <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>;
  };

  const formatFileName = (name: string) => {
    return name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  };

  const isLoadingPhotos = loadingGaleriaRoot || loadingAlbums;
  const isLoadingDocs = loadingDocsRoot || loadingDocFolders;

  return (
    <DashboardLayout title="Galería y Documentos">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white rounded-lg p-1 shadow-md border">
          <button
            onClick={() => { setActiveTab('photos'); setSelectedAlbum(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'photos'
                ? 'bg-primary-600 text-white'
                : 'text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Fotos
          </button>
          <button
            onClick={() => { setActiveTab('documents'); setSelectedDocFolder(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'documents'
                ? 'bg-primary-600 text-white'
                : 'text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            Documentos
          </button>
        </div>
      </div>

      {/* ==================== PHOTOS TAB ==================== */}
      {activeTab === 'photos' && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  {selectedAlbum ? parseAlbumName(selectedAlbum.name).title : 'Gestión de Fotos'}
                </h2>
                <p className="text-sm text-secondary-500">
                  {selectedAlbum
                    ? `${images.length} imágenes`
                    : `${albums.length} álbumes`
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedAlbum ? (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => setSelectedAlbum(null)}
                  >
                    Volver
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Upload className="w-4 h-4" />}
                    onClick={() => setShowUploadModal(true)}
                  >
                    Subir Fotos
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<FolderPlus className="w-4 h-4" />}
                    onClick={() => setShowNewAlbumModal(true)}
                  >
                    Nuevo Álbum
                  </Button>
                  {!galeriaFolderId && (
                    <Button
                      variant="primary"
                      onClick={async () => {
                        try {
                          await createFolder({ name: 'GALERIA' });
                          toast.success('Carpeta GALERIA creada');
                          queryClient.invalidateQueries({ queryKey: ['gallery-root'] });
                        } catch {
                          toast.error('Error al crear carpeta GALERIA');
                        }
                      }}
                    >
                      Crear Carpeta GALERIA
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoadingPhotos ? (
            <div className="text-center py-12 text-secondary-500">
              Cargando galería...
            </div>
          ) : selectedAlbum ? (
            loadingImages ? (
              <div className="text-center py-12 text-secondary-500">
                Cargando imágenes...
              </div>
            ) : images.length === 0 ? (
              <Card className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">Este álbum está vacío</p>
                <Button
                  variant="primary"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={() => setShowUploadModal(true)}
                >
                  Subir Primera Foto
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card padding="none" className="group relative overflow-hidden">
                      <div className="aspect-square">
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full text-secondary-700 hover:text-primary-600"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => {
                              if (confirm('¿Eliminar esta imagen?')) {
                                deleteImageMutation.mutate(image.id);
                              }
                            }}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-secondary-500 truncate">{image.name}</p>
                        <p className="text-xs text-secondary-400">
                          {formatRelativeDate(image.createdAt)}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            !galeriaFolderId ? (
              <Card className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">
                  No existe la carpeta GALERIA en Google Drive
                </p>
                <Button
                  variant="primary"
                  onClick={async () => {
                    try {
                      await createFolder({ name: 'GALERIA' });
                      toast.success('Carpeta GALERIA creada');
                      queryClient.invalidateQueries({ queryKey: ['gallery-root'] });
                    } catch {
                      toast.error('Error al crear carpeta GALERIA');
                    }
                  }}
                >
                  Crear Carpeta GALERIA
                </Button>
              </Card>
            ) : albums.length === 0 ? (
              <Card className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">No hay álbumes creados</p>
                <Button
                  variant="primary"
                  leftIcon={<FolderPlus className="w-4 h-4" />}
                  onClick={() => setShowNewAlbumModal(true)}
                >
                  Crear Primer Álbum
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album, index) => {
                  const { date, title, location } = parseAlbumName(album.name);
                  return (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedAlbum(album)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-8 h-8 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-secondary-900 truncate">
                              {title}
                            </h3>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 text-sm text-secondary-500">
                                <Calendar className="w-4 h-4" />
                                <span>{date}</span>
                              </div>
                              {location && (
                                <div className="flex items-center gap-2 text-sm text-secondary-500">
                                  <MapPin className="w-4 h-4" />
                                  <span>{location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}

      {/* ==================== DOCUMENTS TAB ==================== */}
      {activeTab === 'documents' && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  {selectedDocFolder ? selectedDocFolder.name : 'Gestión de Documentos'}
                </h2>
                <p className="text-sm text-secondary-500">
                  {selectedDocFolder
                    ? `${docFiles.length} archivos`
                    : `${docFolders.length} carpetas, ${docFiles.length} archivos`
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedDocFolder ? (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => setSelectedDocFolder(null)}
                  >
                    Volver
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Upload className="w-4 h-4" />}
                    onClick={() => setShowUploadDocModal(true)}
                  >
                    Subir Documentos
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<FolderPlus className="w-4 h-4" />}
                    onClick={() => setShowNewDocFolderModal(true)}
                  >
                    Nueva Carpeta
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Upload className="w-4 h-4" />}
                    onClick={() => setShowUploadDocModal(true)}
                  >
                    Subir Documentos
                  </Button>
                  {!documentosFolderId && (
                    <Button
                      variant="primary"
                      onClick={async () => {
                        try {
                          await createFolder({ name: 'DOCUMENTOS' });
                          toast.success('Carpeta DOCUMENTOS creada');
                          queryClient.invalidateQueries({ queryKey: ['documents-root'] });
                        } catch {
                          toast.error('Error al crear carpeta DOCUMENTOS');
                        }
                      }}
                    >
                      Crear Carpeta DOCUMENTOS
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoadingDocs ? (
            <div className="text-center py-12 text-secondary-500">
              Cargando documentos...
            </div>
          ) : !documentosFolderId ? (
            <Card className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
              <p className="text-secondary-500 mb-4">
                No existe la carpeta DOCUMENTOS en Google Drive
              </p>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await createFolder({ name: 'DOCUMENTOS' });
                    toast.success('Carpeta DOCUMENTOS creada');
                    queryClient.invalidateQueries({ queryKey: ['documents-root'] });
                  } catch {
                    toast.error('Error al crear carpeta DOCUMENTOS');
                  }
                }}
              >
                Crear Carpeta DOCUMENTOS
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Folders Grid (only show when not inside a folder) */}
              {!selectedDocFolder && docFolders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-primary-600" />
                    Carpetas
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docFolders.map((folder, index) => (
                      <motion.div
                        key={folder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedDocFolder(folder)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Folder className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-secondary-900 truncate">
                                {folder.name}
                              </h4>
                              <p className="text-sm text-secondary-500">Carpeta</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Grid */}
              {loadingDocFiles ? (
                <div className="text-center py-8 text-secondary-500">
                  Cargando archivos...
                </div>
              ) : docFiles.length === 0 && docFolders.length === 0 ? (
                <Card className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                  <p className="text-secondary-500 mb-4">No hay documentos</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      leftIcon={<FolderPlus className="w-4 h-4" />}
                      onClick={() => setShowNewDocFolderModal(true)}
                    >
                      Nueva Carpeta
                    </Button>
                    <Button
                      variant="primary"
                      leftIcon={<Upload className="w-4 h-4" />}
                      onClick={() => setShowUploadDocModal(true)}
                    >
                      Subir Documento
                    </Button>
                  </div>
                </Card>
              ) : docFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    Archivos
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docFiles.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            {getFileIcon(doc.mimeType)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-secondary-900 truncate">
                                {formatFileName(doc.name)}
                              </h4>
                              <p className="text-sm text-secondary-500 mt-1">
                                {doc.mimeType === 'application/pdf' ? 'PDF' :
                                 doc.mimeType?.includes('spreadsheet') ? 'Hoja de cálculo' :
                                 doc.mimeType?.includes('presentation') ? 'Presentación' :
                                 'Documento'}
                              </p>
                              <p className="text-xs text-secondary-400 mt-1">
                                {formatRelativeDate(doc.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Ver
                            </a>
                            {doc.downloadUrl && (
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Descargar
                              </a>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('¿Eliminar este documento?')) {
                                  deleteDocMutation.mutate(doc.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </>
      )}

      {/* ==================== MODALS ==================== */}

      {/* New Album Modal */}
      <Modal
        isOpen={showNewAlbumModal}
        onClose={() => setShowNewAlbumModal(false)}
        title="Crear Nuevo Álbum"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del álbum"
            placeholder="Ej: Visita a Juliaca"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            required
          />
          <Input
            label="Fecha"
            type="date"
            value={newAlbumDate}
            onChange={(e) => setNewAlbumDate(e.target.value)}
            required
          />
          <Input
            label="Ubicación (opcional)"
            placeholder="Ej: Juliaca, Puno"
            value={newAlbumLocation}
            onChange={(e) => setNewAlbumLocation(e.target.value)}
            leftIcon={<MapPin className="w-5 h-5" />}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowNewAlbumModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => createAlbumMutation.mutate()}
              isLoading={createAlbumMutation.isPending}
              disabled={!newAlbumName.trim()}
            >
              Crear Álbum
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Images Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Subir Fotos"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-secondary-400 mb-4" />
            <p className="text-secondary-600 mb-4">
              Arrastra las fotos aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                {uploadImageMutation.isPending ? 'Subiendo...' : 'Seleccionar Fotos'}
              </span>
            </label>
          </div>
          <p className="text-sm text-secondary-500 text-center">
            Formatos soportados: JPG, PNG, GIF, WebP
          </p>
        </div>
      </Modal>

      {/* New Document Folder Modal */}
      <Modal
        isOpen={showNewDocFolderModal}
        onClose={() => setShowNewDocFolderModal(false)}
        title="Crear Nueva Carpeta"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la carpeta"
            placeholder="Ej: Actas 2024"
            value={newDocFolderName}
            onChange={(e) => setNewDocFolderName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowNewDocFolderModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => createDocFolderMutation.mutate()}
              isLoading={createDocFolderMutation.isPending}
              disabled={!newDocFolderName.trim()}
            >
              Crear Carpeta
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Documents Modal */}
      <Modal
        isOpen={showUploadDocModal}
        onClose={() => setShowUploadDocModal(false)}
        title="Subir Documentos"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-secondary-400 mb-4" />
            <p className="text-secondary-600 mb-4">
              Arrastra los documentos aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              multiple
              onChange={handleDocUpload}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                {uploadDocMutation.isPending ? 'Subiendo...' : 'Seleccionar Documentos'}
              </span>
            </label>
          </div>
          <p className="text-sm text-secondary-500 text-center">
            Formatos soportados: PDF, Word, Excel, PowerPoint
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardGallery;
