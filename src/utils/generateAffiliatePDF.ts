import { jsPDF } from 'jspdf';
import type { Affiliate } from '@/types';

// Helper para asegurar que el valor sea string
const toString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// Helper para formatear fecha de YYYY-MM-DD a DD-MM-YYYY
const formatDateDMY = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  // Si tiene formato YYYY-MM-DD, convertir a DD-MM-YYYY
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return String(dateStr);
};

export const generateAffiliatePDF = (affiliate: Affiliate) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colores
  const blackColor = [0, 0, 0] as const;
  const grayColor = [100, 100, 100] as const;

  // ============================================
  // ENCABEZADO CON FOTO A LA DERECHA
  // ============================================

  // Cuadro de foto (arriba a la derecha) - POSICIÓN ORIGINAL
  const fotoWidth = 30;
  const fotoHeight = 35;
  const fotoX = pageWidth - margin - fotoWidth;
  const fotoY = margin;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(fotoX, fotoY, fotoWidth, fotoHeight);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('FOTO DEL', fotoX + fotoWidth / 2, fotoY + fotoHeight / 2 - 2, { align: 'center' });
  doc.text('AFILIADO', fotoX + fotoWidth / 2, fotoY + fotoHeight / 2 + 3, { align: 'center' });

  // Título y Ficha N°
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text('FICHA DE AFILIACIÓN', margin, y + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Ficha N°', fotoX - 45, y + 5);
  doc.rect(fotoX - 30, y, 25, 7); // Cuadro para número de ficha

  y += 15;

  // Cuadro del partido
  doc.setLineWidth(0.8);
  doc.rect(margin, y, contentWidth - fotoWidth - 10, 18);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PP000741 – AHORA NACION - AN', margin + 5, y + 12);

  y += 25;

  // Alcance
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Alcance de la organización política: Nacional (  )    Regional (  ) Región: ...............................', margin, y);
  doc.setFontSize(7);
  doc.text('(Solo llenar en caso de movimientos regionales)', margin + 95, y + 3);

  y += 10;

  // Fecha de afiliación
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FECHA DE AFILIACIÓN:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text('/        /', margin + 48, y);
  doc.text('(Obligatorio)', margin + 65, y);

  y += 8;

  // Declaración
  doc.setFontSize(8);
  const declaracion = 'Por medio del presente manifiesto mi decisión de AFILIARME a la organización política, comprometiéndome a cumplir con su estatuto y demás normas internas. En fe de lo cual firmo el presente documento:';
  const splitDeclaracion = doc.splitTextToSize(declaracion, contentWidth);
  doc.text(splitDeclaracion, margin, y);

  y += 12;

  // ============================================
  // DATOS PERSONALES
  // ============================================

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS PERSONALES', margin, y);

  y += 3;

  // Función para dibujar campo con cuadro
  const drawFieldBox = (label: string, value: string, x: number, yPos: number, width: number, height: number = 10) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(label, x, yPos);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(x, yPos + 1, width, height);

    if (value) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...blackColor);
      doc.text(toString(value), x + 2, yPos + 7);
    }
  };

  // Apellido Paterno, Materno, Nombres
  const col3Width = (contentWidth - 10) / 3;

  // Separar apellidos
  const apellidosCompleto = toString(affiliate.Apellidos);
  const partesApellidos = apellidosCompleto.split(' ');
  const apellidoPaterno = partesApellidos[0] || '';
  const apellidoMaterno = partesApellidos.slice(1).join(' ') || '';
  const nombres = toString(affiliate.Nombre);

  drawFieldBox('Apellido Paterno', apellidoPaterno, margin, y, col3Width);
  drawFieldBox('Apellido Materno', apellidoMaterno, margin + col3Width + 5, y, col3Width);
  drawFieldBox('Nombres', nombres, margin + (col3Width + 5) * 2, y, col3Width);

  y += 18;

  // DNI, Fecha Nacimiento, Estado Civil, Sexo
  const dniWidth = 30;
  const fechaNacWidth = 40;

  drawFieldBox('DNI', toString(affiliate.DNI), margin, y, dniWidth);

  // Fecha de nacimiento con Día/Mes/Año
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text('Fecha de', margin + dniWidth + 8, y);
  doc.text('Nacimiento', margin + dniWidth + 8, y + 4);
  doc.setFontSize(7);
  doc.text('Día    Mes    Año', margin + dniWidth + 25, y);
  doc.rect(margin + dniWidth + 25, y + 1, fechaNacWidth, 10);

  // Llenar fecha de nacimiento si existe (convertir de YYYY-MM-DD a DD-MM-YYYY)
  if (affiliate.FechaNacimiento) {
    doc.setFontSize(9);
    doc.setTextColor(...blackColor);
    doc.text(formatDateDMY(affiliate.FechaNacimiento), margin + dniWidth + 27, y + 7);
  } else {
    doc.text('/        /', margin + dniWidth + 35, y + 7);
  }

  // Estado Civil (S, C, V, D, Conv)
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text('Estado Civil', margin + dniWidth + fechaNacWidth + 35, y);
  const estadoX = margin + dniWidth + fechaNacWidth + 35;
  doc.rect(estadoX, y + 1, 8, 10);
  doc.rect(estadoX + 8, y + 1, 8, 10);
  doc.rect(estadoX + 16, y + 1, 8, 10);
  doc.rect(estadoX + 24, y + 1, 8, 10);
  doc.rect(estadoX + 32, y + 1, 12, 10);
  doc.setFontSize(7);
  doc.text('S', estadoX + 3, y + 7);
  doc.text('C', estadoX + 11, y + 7);
  doc.text('V', estadoX + 19, y + 7);
  doc.text('D', estadoX + 27, y + 7);
  doc.text('Conv.', estadoX + 34, y + 7);

  // Marcar estado civil seleccionado con X
  if (affiliate.EstadoCivil) {
    doc.setFontSize(12);
    doc.setTextColor(...blackColor);
    const estadoPos: Record<string, number> = { 'S': 0, 'C': 8, 'V': 16, 'D': 24, 'Conv': 32 };
    const offset = estadoPos[affiliate.EstadoCivil] || 0;
    doc.text('X', estadoX + offset + 2.5, y + 8);
  }

  // Sexo (M, F)
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text('Sexo', estadoX + 50, y);
  doc.rect(estadoX + 50, y + 1, 8, 10);
  doc.rect(estadoX + 58, y + 1, 8, 10);
  doc.setFontSize(7);
  doc.text('M', estadoX + 53, y + 7);
  doc.text('F', estadoX + 61, y + 7);

  // Marcar sexo seleccionado con X
  if (affiliate.Sexo) {
    doc.setFontSize(12);
    doc.setTextColor(...blackColor);
    if (affiliate.Sexo === 'M') {
      doc.text('X', estadoX + 52.5, y + 8);
    } else if (affiliate.Sexo === 'F') {
      doc.text('X', estadoX + 60.5, y + 8);
    }
  }

  y += 18;

  // Lugar de Nacimiento
  drawFieldBox('Lugar de Nacimiento', toString(affiliate.LugarNacimiento), margin, y, contentWidth);

  y += 18;

  // ============================================
  // DOMICILIO ACTUAL
  // ============================================

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text('DOMICILIO ACTUAL', margin, y);

  y += 3;

  // Región, Provincia, Distrito
  drawFieldBox('Región', toString(affiliate.Region), margin, y, col3Width);
  drawFieldBox('Provincia', toString(affiliate.Provincia), margin + col3Width + 5, y, col3Width);
  drawFieldBox('Distrito', toString(affiliate.Distrito), margin + (col3Width + 5) * 2, y, col3Width);

  y += 18;

  // Avenida/Calle/Jirón y Número
  const dirWidth = contentWidth * 0.8;
  const numWidth = contentWidth * 0.15;
  drawFieldBox('Avenida / Calle / Jirón', toString(affiliate.Direccion), margin, y, dirWidth);
  drawFieldBox('Número', toString(affiliate.NumeroDireccion), margin + dirWidth + 5, y, numWidth);

  y += 18;

  // Urbanización y Teléfono
  const halfWidth = (contentWidth - 5) / 2;
  drawFieldBox('Urbanización / Sector / Caserío', toString(affiliate.Urbanizacion), margin, y, halfWidth);
  drawFieldBox('Teléfono', toString(affiliate.Telefono), margin + halfWidth + 5, y, halfWidth);

  y += 18;

  // Correo electrónico
  drawFieldBox('Correo electrónico', toString(affiliate.Email), margin, y, contentWidth);

  y += 25;

  // ============================================
  // FIRMA Y HUELLA (parte inferior)
  // ============================================

  // Línea de firma
  const firmaY = pageHeight - 45;
  doc.setLineWidth(0.3);
  doc.line(margin, firmaY, margin + 70, firmaY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text('Firma del Afiliado', margin + 35, firmaY + 5, { align: 'center' });

  // Cuadro de huella digital
  const huellaX = pageWidth - margin - 35;
  const huellaY = firmaY - 25;
  const huellaSize = 25;
  doc.rect(huellaX, huellaY, huellaSize, huellaSize);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Huella Digital', huellaX + huellaSize / 2, huellaY + huellaSize + 5, { align: 'center' });

  // ============================================
  // PIE DE PÁGINA (opcional - información de campaña)
  // ============================================

  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text('www.mirellacamapaza.com | Dra. Mirella Camapaza Quispe - Ahora Nación', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Descargar
  const dniStr = toString(affiliate.DNI) || toString(affiliate.ID);
  const fileName = `Ficha_Afiliacion_${dniStr}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);

  return fileName;
};

export default generateAffiliatePDF;
