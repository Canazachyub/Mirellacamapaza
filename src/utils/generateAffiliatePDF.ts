import { jsPDF } from 'jspdf';
import type { Affiliate } from '@/types';

export const generateAffiliatePDF = (affiliate: Affiliate) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colores
  const primaryColor = [220, 38, 38] as const; // Rojo
  const grayColor = [100, 100, 100] as const;
  const blackColor = [0, 0, 0] as const;
  const lightGray = [240, 240, 240] as const;

  // ============================================
  // ENCABEZADO
  // ============================================

  // Borde superior
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 8, 'F');

  y = 20;

  // Título principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text('FICHA DE AFILIACIÓN', pageWidth / 2, y, { align: 'center' });

  // Número de ficha
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(`Ficha N° ${affiliate.ID}`, pageWidth - margin, y, { align: 'right' });

  // Partido
  y += 10;
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y - 5, contentWidth, 15, 2, 2, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PP000741 - AHORA NACIÓN - AN', pageWidth / 2, y + 4, { align: 'center' });

  y += 18;

  // Alcance y fecha
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Alcance de la organización política: Nacional', margin, y);

  const fechaAfiliacion = affiliate.Fecha
    ? new Date(affiliate.Fecha).toLocaleDateString('es-PE')
    : new Date().toLocaleDateString('es-PE');
  doc.text(`FECHA DE AFILIACIÓN: ${fechaAfiliacion}`, pageWidth - margin, y, { align: 'right' });

  y += 8;

  // Declaración
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...grayColor);
  const declaracion = 'Por medio del presente manifiesto mi decisión de AFILIARME a la organización política, comprometiéndome a cumplir con su estatuto y demás normas internas. En fe de lo cual firmo el presente documento.';
  const splitDeclaracion = doc.splitTextToSize(declaracion, contentWidth);
  doc.text(splitDeclaracion, margin, y);

  y += 15;

  // ============================================
  // DATOS PERSONALES
  // ============================================

  // Título sección
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('DATOS PERSONALES', margin + 3, y + 5);

  y += 12;

  // Función helper para dibujar campo
  const drawField = (label: string, value: string, x: number, yPos: number, width: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(label, x, yPos);

    doc.setDrawColor(200, 200, 200);
    doc.line(x, yPos + 2, x + width, yPos + 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...blackColor);
    doc.text(value || '-', x, yPos + 7);

    return yPos + 14;
  };

  // Separar nombre completo en partes (si está en formato "Nombres Apellidos")
  const nombreCompleto = affiliate.Nombre || '';
  const partes = nombreCompleto.split(' ');
  let apellidoPaterno = '';
  let apellidoMaterno = '';
  let nombres = '';

  if (partes.length >= 3) {
    // Asumimos formato: Nombres Apellido1 Apellido2
    apellidoPaterno = partes[partes.length - 2] || '';
    apellidoMaterno = partes[partes.length - 1] || '';
    nombres = partes.slice(0, -2).join(' ');
  } else if (partes.length === 2) {
    apellidoPaterno = partes[1] || '';
    nombres = partes[0] || '';
  } else {
    nombres = nombreCompleto;
  }

  // Fila 1: Apellido Paterno, Materno, Nombres
  const colWidth = (contentWidth - 10) / 3;
  drawField('Apellido Paterno', apellidoPaterno, margin, y, colWidth);
  drawField('Apellido Materno', apellidoMaterno, margin + colWidth + 5, y, colWidth);
  drawField('Nombres', nombres, margin + (colWidth + 5) * 2, y, colWidth);

  y += 18;

  // Fila 2: DNI, Fecha Nacimiento, Estado Civil, Sexo
  const col4Width = (contentWidth - 15) / 4;
  drawField('DNI', affiliate.DNI || '', margin, y, col4Width);
  drawField('Fecha de Nacimiento', '-', margin + col4Width + 5, y, col4Width);
  drawField('Estado Civil', '-', margin + (col4Width + 5) * 2, y, col4Width);
  drawField('Sexo', '-', margin + (col4Width + 5) * 3, y, col4Width);

  y += 18;

  // Lugar de Nacimiento
  drawField('Lugar de Nacimiento', '-', margin, y, contentWidth);

  y += 18;

  // ============================================
  // DOMICILIO ACTUAL
  // ============================================

  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('DOMICILIO ACTUAL', margin + 3, y + 5);

  y += 12;

  // Región, Provincia, Distrito
  drawField('Región', 'Puno', margin, y, colWidth);
  drawField('Provincia', affiliate.Provincia || '', margin + colWidth + 5, y, colWidth);
  drawField('Distrito', affiliate.Distrito || '', margin + (colWidth + 5) * 2, y, colWidth);

  y += 18;

  // Dirección
  const dirWidth = contentWidth * 0.75;
  const numWidth = contentWidth * 0.2;
  drawField('Avenida / Calle / Jirón', affiliate.Direccion || '', margin, y, dirWidth);
  drawField('Número', '', margin + dirWidth + 5, y, numWidth);

  y += 18;

  // Urbanización y Teléfono
  const halfWidth = (contentWidth - 5) / 2;
  drawField('Urbanización / Sector / Caserío', '', margin, y, halfWidth);
  drawField('Teléfono', affiliate.Telefono || '', margin + halfWidth + 5, y, halfWidth);

  y += 18;

  // Email
  drawField('Correo electrónico', affiliate.Email || '', margin, y, contentWidth);

  y += 25;

  // ============================================
  // SECCIÓN FIRMA Y HUELLA
  // ============================================

  // Línea divisoria
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);

  y += 15;

  // Espacio para foto
  const fotoWidth = 35;
  const fotoHeight = 45;
  doc.setDrawColor(150, 150, 150);
  doc.setFillColor(250, 250, 250);
  doc.rect(pageWidth - margin - fotoWidth, y - 10, fotoWidth, fotoHeight, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('FOTO DEL', pageWidth - margin - fotoWidth / 2, y + 12, { align: 'center' });
  doc.text('AFILIADO', pageWidth - margin - fotoWidth / 2, y + 17, { align: 'center' });

  // Firma
  const firmaWidth = 60;
  doc.line(margin, y + 25, margin + firmaWidth, y + 25);
  doc.setFontSize(9);
  doc.text('Firma del Afiliado', margin + firmaWidth / 2, y + 30, { align: 'center' });

  // Huella digital
  const huellaX = margin + firmaWidth + 20;
  const huellaSize = 25;
  doc.setDrawColor(150, 150, 150);
  doc.setFillColor(250, 250, 250);
  doc.rect(huellaX, y + 5, huellaSize, huellaSize, 'FD');
  doc.setFontSize(8);
  doc.text('Huella Digital', huellaX + huellaSize / 2, y + 35, { align: 'center' });

  // ============================================
  // PIE DE PÁGINA
  // ============================================

  const pageHeight = doc.internal.pageSize.getHeight();

  // Borde inferior
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Dra. Mirella Camapaza Quispe - Candidata a Diputada por Puno N°4 - Ahora Nación', pageWidth / 2, pageHeight - 8, { align: 'center' });
  doc.text('www.mirellacamapaza.com', pageWidth / 2, pageHeight - 4, { align: 'center' });

  // Descargar
  const fileName = `Ficha_Afiliacion_${affiliate.DNI || affiliate.ID}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);

  return fileName;
};

export default generateAffiliatePDF;
