import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Folder, ArrowRight, MapPin, ClipboardList, PenTool, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Loader } from '@/components/common';
import { getFiles } from '@/services/api';

// Componente de instrucciones de afiliación
const AffiliationInstructions = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 mb-6 border border-primary-200"
  >
    <h4 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
      <ClipboardList className="w-5 h-5" />
      Flujo de Afiliación - Puno
    </h4>

    <div className="space-y-4">
      {/* Paso 1 */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          1
        </div>
        <div>
          <p className="font-semibold text-secondary-900">Descargar el Modelo de Ficha de Afiliación</p>
          <p className="text-sm text-secondary-600">Obtener la plantilla oficial de la Ficha de Afiliación (PP000741 – AHORA NACION - AN).</p>
        </div>
      </div>

      {/* Paso 2 */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          2
        </div>
        <div>
          <p className="font-semibold text-secondary-900">Llenar los Datos Personales y del Domicilio</p>
          <p className="text-sm text-secondary-600 mb-2">El llenado de la ficha se inicia desde la sección de DATOS PERSONALES.</p>
          <div className="bg-white/70 rounded-lg p-3 space-y-1">
            <p className="text-sm text-secondary-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              Debe ser completada con <strong>letra imprenta MAYÚSCULA</strong>
            </p>
            <p className="text-sm text-secondary-700 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-600 flex-shrink-0" />
              Debe ser completada con <strong>lapicero AZUL</strong>
            </p>
            <p className="text-sm text-secondary-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <strong>NO</strong> debe presentar ningún borrón
            </p>
          </div>
        </div>
      </div>

      {/* Paso 3 */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          3
        </div>
        <div>
          <p className="font-semibold text-secondary-900">Completar la Información Final y Firmar</p>
          <div className="bg-white/70 rounded-lg p-3 space-y-1 mt-2">
            <p className="text-sm text-secondary-700">• Incluir el <strong>correo electrónico</strong></p>
            <p className="text-sm text-secondary-700">• El <strong>DOMICILIO</strong> y la <strong>FIRMA</strong> deben coincidir con la información del DNI</p>
            <p className="text-sm text-secondary-700">• Añadir la <strong>Firma del Afiliado</strong></p>
            <p className="text-sm text-secondary-700">• Colocar la <strong>Huella Digital</strong> con tampón azul</p>
            <p className="text-sm text-secondary-700">• La <strong>fecha de afiliación</strong> es un campo obligatorio</p>
          </div>
        </div>
      </div>

      {/* Paso 4 */}
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          4
        </div>
        <div>
          <p className="font-semibold text-secondary-900">Llevar la Ficha a una de las Sedes para Afiliarse</p>
          <p className="text-sm text-secondary-600 mb-3">Una vez completada y firmada, la ficha debe ser entregada en una de las sedes de la organización política en Puno.</p>
          <Link to="/sedes">
            <Button variant="primary" size="sm" leftIcon={<MapPin className="w-4 h-4" />}>
              Consultar Sedes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

// Helper para verificar si es carpeta de afiliación
const isAffiliationFolder = (folderName: string) => {
  const name = folderName.toUpperCase();
  return name.includes('AFILIA');
};

interface Document {
  id: string;
  name: string;
  url: string;
  downloadUrl?: string;
  mimeType: string;
  thumbnail?: string | null;
}

interface DocumentFolder {
  id: string;
  name: string;
  url?: string;
  documents: Document[];
}

const DocumentsSection = () => {
  // Obtener carpeta DOCUMENTOS
  const { data: rootResponse, isLoading } = useQuery({
    queryKey: ['documents-public'],
    queryFn: async () => {
      const response = await getFiles();
      // Buscamos la carpeta DOCUMENTOS
      const docsFolder = response?.data?.folders?.find(
        (f: { name: string }) =>
          f.name.toUpperCase().includes('DOCUMENTO') ||
          f.name.toUpperCase() === 'DOCS'
      );

      if (docsFolder) {
        // Obtenemos el contenido de la carpeta DOCUMENTOS
        const docsResponse = await getFiles(docsFolder.id);
        return {
          mainFolder: docsFolder,
          content: docsResponse?.data,
        };
      }

      // Si no hay carpeta DOCUMENTOS, usar archivos PDF de la raíz
      const rootDocs = (response?.data?.files || []).filter(
        (f: { mimeType: string }) =>
          f.mimeType === 'application/pdf' ||
          f.mimeType?.includes('document')
      );

      return {
        mainFolder: null,
        content: { files: rootDocs, folders: [] },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Procesar documentos por carpeta
  const processDocuments = () => {
    if (!rootResponse?.content) return [];

    const folders: DocumentFolder[] = [];

    // Agregar subcarpetas como secciones
    (rootResponse.content.folders || []).forEach((folder: { id: string; name: string; url?: string }) => {
      folders.push({
        id: folder.id,
        name: folder.name,
        url: folder.url,
        documents: [], // Se cargarán al hacer clic
      });
    });

    // Documentos sueltos en "General"
    const looseDocs = (rootResponse.content.files || [])
      .filter((f: { mimeType: string }) =>
        f.mimeType === 'application/pdf' ||
        f.mimeType?.includes('document') ||
        f.mimeType?.includes('spreadsheet') ||
        f.mimeType?.includes('presentation')
      )
      .map((f: { id: string; name: string; url: string; downloadUrl?: string; mimeType: string; thumbnail?: string | null }) => ({
        id: f.id,
        name: f.name,
        url: f.url,
        downloadUrl: f.downloadUrl,
        mimeType: f.mimeType,
        thumbnail: f.thumbnail,
      }));

    if (looseDocs.length > 0) {
      folders.unshift({
        id: 'general',
        name: 'Documentos Oficiales',
        documents: looseDocs,
      });
    }

    return folders;
  };

  const documentFolders = processDocuments();

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
      );
    }
    if (mimeType?.includes('spreadsheet')) {
      return (
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-green-600" />
        </div>
      );
    }
    if (mimeType?.includes('presentation')) {
      return (
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-orange-600" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>
    );
  };

  const formatFileName = (name: string) => {
    // Remover extensión y formatear
    return name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Cargando documentos..." />
          </div>
        </div>
      </section>
    );
  }

  if (documentFolders.length === 0) {
    return null; // No mostrar la sección si no hay documentos
  }

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container-custom overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Transparencia
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
            Documentos Oficiales
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Accede a nuestros documentos oficiales, estatutos y actas de forma transparente.
          </p>
        </motion.div>

        <div className="space-y-8">
          {documentFolders.map((folder, folderIndex) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: folderIndex * 0.1 }}
            >
              {/* Folder Header */}
              <div className="flex items-center gap-3 mb-4">
                <Folder className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-secondary-900">
                  {folder.name}
                </h3>
              </div>

              {/* Instrucciones de Afiliación para carpeta de afiliación */}
              {isAffiliationFolder(folder.name) && <AffiliationInstructions />}

              {/* Documents Grid */}
              {folder.documents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folder.documents.slice(0, 6).map((doc, docIndex) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: docIndex * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow h-full">
                        <div className="flex items-start gap-4 overflow-hidden">
                          <div className="flex-shrink-0">
                            {doc.thumbnail ? (
                              <img
                                src={doc.thumbnail}
                                alt={doc.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              getFileIcon(doc.mimeType)
                            )}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-medium text-secondary-900 truncate break-all">
                              {formatFileName(doc.name)}
                            </h4>
                            <p className="text-sm text-secondary-500 mt-1">
                              {doc.mimeType === 'application/pdf' ? 'PDF' :
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
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-500 text-sm italic">
                  Carpeta con documentos - Ver más para acceder
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/galeria">
            <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Ver todos los documentos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
