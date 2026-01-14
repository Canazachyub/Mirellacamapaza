import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, X, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, Download, Eye, Folder } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, Loader } from '@/components/common';
import { getFiles } from '@/services/api';

interface Album {
  id: string;
  name: string;
  date: string;
  location?: string;
  coverImage: string;
  images: GalleryImage[];
}

interface GalleryImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  downloadUrl?: string;
  mimeType: string;
}

interface DocumentFolder {
  id: string;
  name: string;
  documents: Document[];
}

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'documents'>('documents');

  // ==================== FETCH ALL DOCUMENT FOLDERS ====================
  // Buscar TODAS las carpetas que empiecen con "DOCUMENTOS" y obtener sus contenidos
  const { data: documentFoldersData, isLoading: loadingDocs } = useQuery({
    queryKey: ['all-documents-public'],
    queryFn: async () => {
      // Obtener carpetas raíz
      const rootResponse = await getFiles();
      const allFolders = rootResponse?.data?.folders || [];

      // Filtrar carpetas que empiecen con "DOCUMENTOS"
      const docsFolders = allFolders.filter((f: { name: string }) =>
        f.name.toUpperCase().startsWith('DOCUMENTO')
      );

      // Para cada carpeta de documentos, obtener sus archivos
      const foldersWithDocs: DocumentFolder[] = await Promise.all(
        docsFolders.map(async (folder: { id: string; name: string }) => {
          const folderContent = await getFiles(folder.id);
          const files = (folderContent?.data?.files || [])
            .filter((f: { mimeType: string }) =>
              f.mimeType === 'application/pdf' ||
              f.mimeType?.includes('document') ||
              f.mimeType?.includes('spreadsheet') ||
              f.mimeType?.includes('presentation')
            )
            .map((f: { id: string; name: string; url: string; downloadUrl?: string; mimeType: string }) => ({
              id: f.id,
              name: f.name,
              url: f.url,
              downloadUrl: f.downloadUrl,
              mimeType: f.mimeType,
            }));

          return {
            id: folder.id,
            name: folder.name,
            documents: files,
          };
        })
      );

      return foldersWithDocs;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos cache
  });

  // ==================== FETCH GALLERY ALBUMS ====================
  // Buscar la carpeta GALERIA y obtener sus álbumes (subcarpetas)
  const { data: galleryData, isLoading: loadingGallery } = useQuery({
    queryKey: ['gallery-albums-public'],
    queryFn: async () => {
      // Obtener carpetas raíz
      const rootResponse = await getFiles();
      const allFolders = rootResponse?.data?.folders || [];

      // Buscar carpeta GALERIA
      const galeriaFolder = allFolders.find((f: { name: string }) => {
        const name = f.name.toUpperCase().trim();
        return name === 'GALERIA' || name === 'GALLERY';
      });

      if (!galeriaFolder) {
        return { albums: [], looseImages: [] };
      }

      // Obtener contenido de GALERIA (álbumes = subcarpetas)
      const galeriaContent = await getFiles(galeriaFolder.id);
      const albumFolders = galeriaContent?.data?.folders || [];
      const looseFiles = galeriaContent?.data?.files || [];

      // Procesar álbumes
      const albums: Album[] = await Promise.all(
        albumFolders.map(async (folder: { id: string; name: string }) => {
          // Obtener fotos del álbum
          const albumContent = await getFiles(folder.id);
          const images = (albumContent?.data?.files || [])
            .filter((f: { mimeType?: string }) => f.mimeType?.startsWith('image/'))
            .map((f: { id: string; name: string; url: string; thumbnail?: string | null }) => ({
              id: f.id,
              name: f.name,
              url: f.url,
              thumbnail: f.thumbnail || f.url,
            }));

          // Extraer fecha del nombre si existe (formato: YYYY-MM-DD - Título o similar)
          const dateMatch = folder.name.match(/(\d{4}-\d{2}-\d{2})/);
          const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

          // Extraer ubicación si existe
          const parts = folder.name.split(' - ');
          const location = parts.length > 2 ? parts[2] : undefined;
          const title = parts.length > 1 ? parts[1] : folder.name;

          return {
            id: folder.id,
            name: title || folder.name,
            date,
            location,
            coverImage: images[0]?.thumbnail || '/placeholder-album.jpg',
            images,
          };
        })
      );

      // Fotos sueltas en GALERIA
      const looseImages = looseFiles
        .filter((f: { mimeType?: string }) => f.mimeType?.startsWith('image/'))
        .map((f: { id: string; name: string; url: string; thumbnail?: string | null }) => ({
          id: f.id,
          name: f.name,
          url: f.url,
          thumbnail: f.thumbnail || f.url,
        }));

      return { albums, looseImages };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos cache
  });

  // ==================== PROCESSED DATA ====================
  const documentFolders = documentFoldersData || [];

  // Combinar álbumes con fotos sueltas si hay
  const albums = galleryData?.albums || [];
  if (galleryData?.looseImages && galleryData.looseImages.length > 0) {
    albums.unshift({
      id: 'general',
      name: 'Fotos Generales',
      date: new Date().toISOString().split('T')[0],
      coverImage: galleryData.looseImages[0]?.thumbnail || '/placeholder-album.jpg',
      images: galleryData.looseImages,
    });
  }

  // ==================== HELPERS ====================
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openLightbox = (album: Album, imageIndex: number) => {
    setSelectedAlbum(album);
    setSelectedImageIndex(imageIndex);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev < selectedAlbum.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedAlbum) {
      setSelectedImageIndex((prev) =>
        prev > 0 ? prev - 1 : selectedAlbum.images.length - 1
      );
    }
  };

  return (
    <Layout title="Galería y Documentos" description="Galería de fotos y documentos oficiales de la campaña de Dra. Mirella Camapaza">
      {/* Hero */}
      <section className="pt-28 pb-16 gradient-hero text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galería y Documentos
            </h1>
            <p className="text-xl text-white/90">
              Fotos de la campaña y documentos oficiales del partido
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'documents'
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                Documentos
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'photos'
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                Fotos
              </button>
            </div>
          </div>

          {/* ==================== DOCUMENTS TAB ==================== */}
          {activeTab === 'documents' && (
            <>
              {loadingDocs ? (
                <div className="flex justify-center py-12">
                  <Loader size="lg" text="Cargando documentos..." />
                </div>
              ) : documentFolders.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                  <p className="text-secondary-500 text-lg">
                    No hay documentos disponibles
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  {documentFolders.map((folder, folderIndex) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: folderIndex * 0.1 }}
                    >
                      {/* Folder Header */}
                      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary-200">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Folder className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-secondary-900">
                            {folder.name}
                          </h3>
                          <p className="text-sm text-secondary-500">
                            {folder.documents.length} {folder.documents.length === 1 ? 'documento' : 'documentos'}
                          </p>
                        </div>
                      </div>

                      {/* Documents Grid */}
                      {folder.documents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {folder.documents.map((doc, docIndex) => (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: docIndex * 0.05 }}
                            >
                              <Card className="hover:shadow-lg transition-shadow h-full">
                                <div className="flex items-start gap-4">
                                  {getFileIcon(doc.mimeType)}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-secondary-900 truncate" title={formatFileName(doc.name)}>
                                      {formatFileName(doc.name)}
                                    </h4>
                                    <p className="text-sm text-secondary-500 mt-1">
                                      {doc.mimeType === 'application/pdf' ? 'Documento PDF' :
                                       doc.mimeType?.includes('spreadsheet') ? 'Hoja de cálculo' :
                                       doc.mimeType?.includes('presentation') ? 'Presentación' :
                                       'Documento'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Ver
                                  </a>
                                  {doc.downloadUrl && (
                                    <a
                                      href={doc.downloadUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                                    >
                                      <Download className="w-4 h-4" />
                                      Descargar
                                    </a>
                                  )}
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-secondary-500 text-sm italic py-4">
                          Esta carpeta no contiene documentos
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ==================== PHOTOS TAB ==================== */}
          {activeTab === 'photos' && (
            <>
              {loadingGallery ? (
                <div className="flex justify-center py-12">
                  <Loader size="lg" text="Cargando galería..." />
                </div>
              ) : albums.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                  <p className="text-secondary-500 text-lg">
                    Próximamente compartiremos fotos de la campaña
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album, index) => (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
                        padding="none"
                        onClick={() => album.images.length > 0 && openLightbox(album, 0)}
                      >
                        <div className="relative h-48 bg-secondary-200 overflow-hidden">
                          {album.coverImage && album.coverImage !== '/placeholder-album.jpg' ? (
                            <img
                              src={album.coverImage}
                              alt={album.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                              <ImageIcon className="w-16 h-16 text-primary-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="font-bold text-lg truncate">{album.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-white/80 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(album.date)}
                              </span>
                              {album.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {album.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-secondary-600 text-sm">
                            {album.images.length} {album.images.length === 1 ? 'foto' : 'fotos'}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && selectedAlbum && selectedAlbum.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            {selectedAlbum.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedAlbum.images[selectedImageIndex]?.url}
              alt={selectedAlbum.images[selectedImageIndex]?.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
              <p className="font-medium">{selectedAlbum.name}</p>
              <p className="text-sm text-white/70">
                {selectedImageIndex + 1} / {selectedAlbum.images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
