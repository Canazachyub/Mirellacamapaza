// Efemérides de la Región Puno - Completo
// 13 Provincias, 110 Distritos, Mercados, Plazas Feriales y Festividades
// Organizado cronológicamente por mes y día

export interface Efemeride {
  dia: number;
  mes: number;
  anio?: number;
  titulo: string;
  descripcion: string;
  categoria: 'provincia' | 'distrito' | 'mercado' | 'festividad';
  provincia: string;
  baseLegal?: string;
}

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const getNombreMes = (mes: number): string => MESES[mes] || '';

export const getCategoriaBadge = (categoria: Efemeride['categoria']) => {
  switch (categoria) {
    case 'provincia':
      return { label: 'Provincia', color: 'bg-purple-100 text-purple-700' };
    case 'distrito':
      return { label: 'Distrito', color: 'bg-blue-100 text-blue-700' };
    case 'mercado':
      return { label: 'Mercado / Plaza', color: 'bg-amber-100 text-amber-700' };
    case 'festividad':
      return { label: 'Festividad', color: 'bg-rose-100 text-rose-700' };
  }
};

// ══════════════════════════════════════════════════════════════════════════
// TODAS LAS EFEMÉRIDES - ORDEN CRONOLÓGICO (mes, día)
// ══════════════════════════════════════════════════════════════════════════
export const EFEMERIDES: Efemeride[] = [

  // ═══════════════════════════════════════════
  // ENERO
  // ═══════════════════════════════════════════
  {
    dia: 8, mes: 1, anio: 1965,
    titulo: 'Aniversario del Mercado Santa Bárbara',
    descripcion: 'El Mercado Santa Bárbara de Juliaca celebra su aniversario cada 8 de enero con misa y actividades deportivas.',
    categoria: 'mercado', provincia: 'San Román',
  },

  // ═══════════════════════════════════════════
  // FEBRERO
  // ═══════════════════════════════════════════
  {
    dia: 2, mes: 2,
    titulo: 'Fiesta de la Virgen de la Candelaria',
    descripcion: 'Patrimonio Cultural Inmaterial de la Humanidad (UNESCO, 2014). La festividad más grande de Puno, con concursos de danzas autóctonas y de trajes de luces. Se celebra del 1 al 14 de febrero.',
    categoria: 'festividad', provincia: 'Puno',
  },
  {
    dia: 5, mes: 2, anio: 1875,
    titulo: 'Creación Política de la Provincia de Sandia',
    descripcion: 'Segregada de la antigua provincia de Carabaya durante el gobierno de Manuel Pardo y Lavalle. Capital: Sandia.',
    categoria: 'provincia', provincia: 'Sandia',
    baseLegal: 'Ley del 05/02/1875',
  },
  {
    dia: 5, mes: 2, anio: 1875,
    titulo: 'Aniversario del Distrito de Sandia',
    descripcion: 'Distrito capital de la provincia de Sandia. Establecido como capital al crearse la provincia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'Ley del 05/02/1875',
  },
  {
    dia: 5, mes: 2, anio: 1875,
    titulo: 'Aniversario del Distrito de Macusani',
    descripcion: 'Distrito capital de la provincia de Carabaya. Se reorganizó al separarse Sandia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'Ley del 05/02/1875',
  },
  {
    dia: 5, mes: 2, anio: 1875,
    titulo: 'Aniversario del Distrito de Crucero',
    descripcion: 'Distrito de Crucero, provincia de Carabaya. Fue la antigua capital de Carabaya antes de Macusani.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'Ley del 05/02/1875',
  },
  {
    dia: 14, mes: 2,
    titulo: 'Carnavales de Juliaca',
    descripcion: 'Los Carnavales de Juliaca son una de las festividades más coloridas del altiplano, con comparsas, danzas y la tradicional "ch\'alla".',
    categoria: 'festividad', provincia: 'San Román',
  },
  {
    dia: 28, mes: 2, anio: 1958,
    titulo: 'Aniversario del Distrito de Cabanillas',
    descripcion: 'Distrito de Cabanillas, provincia de San Román. Creado por separación del distrito de Cabana.',
    categoria: 'distrito', provincia: 'San Román',
    baseLegal: 'Ley N.° 12963 del 28/02/1958',
  },

  // ═══════════════════════════════════════════
  // MARZO
  // ═══════════════════════════════════════════
  {
    dia: 17, mes: 3, anio: 1962,
    titulo: 'Aniversario del Distrito de Pedro Vilca Apaza',
    descripcion: 'Distrito de Pedro Vilca Apaza, provincia de San Antonio de Putina. Creado durante el segundo gobierno de Manuel Prado.',
    categoria: 'distrito', provincia: 'San Antonio de Putina',
    baseLegal: 'Ley N.° 14045 del 17/03/1962',
  },
  {
    dia: 26, mes: 3, anio: 1986,
    titulo: 'Aniversario del Distrito de Quilcapuncu',
    descripcion: 'Distrito de Quilcapuncu, provincia de San Antonio de Putina. Creado durante el primer gobierno de Alan García.',
    categoria: 'distrito', provincia: 'San Antonio de Putina',
    baseLegal: 'Ley N.° 24574 del 26/03/1986',
  },

  // ═══════════════════════════════════════════
  // ABRIL
  // ═══════════════════════════════════════════
  {
    dia: 9, mes: 4,
    titulo: 'Aniversario local del Distrito de Amantani',
    descripcion: 'Distrito insular de Amantani, provincia de Puno. Creado el 02/05/1854, celebra su aniversario local cada 9 de abril.',
    categoria: 'distrito', provincia: 'Puno',
  },
  {
    dia: 17, mes: 4, anio: 1936,
    titulo: 'Aniversario del Distrito de Santa Lucía',
    descripcion: 'Distrito de Santa Lucía, provincia de Lampa. Importante centro minero del altiplano.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'Ley N.° 8249 del 17/04/1936',
  },

  // ═══════════════════════════════════════════
  // MAYO
  // ═══════════════════════════════════════════
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Creación Política de la Provincia de Puno',
    descripcion: 'Creación de la provincia del Cercado de Puno por decreto de Ramón Castilla. Hoy reconocida como la actual provincia de Puno.',
    categoria: 'provincia', provincia: 'Puno',
    baseLegal: 'Decreto del 02/05/1854 (Ramón Castilla)',
  },
  // -- Prov. Puno: distritos del 02/05/1854 --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario del Distrito de Puno',
    descripcion: 'Capital de la provincia y del departamento de Puno. Reorganizado por el Decreto del 02/05/1854.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ácora',
    descripcion: 'Distrito de Ácora, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Paucarcolla',
    descripcion: 'Distrito de Paucarcolla, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Atuncolla',
    descripcion: 'Distrito de Atuncolla, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Capachica',
    descripcion: 'Distrito de Capachica, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Chucuito (distrito)',
    descripcion: 'Distrito de Chucuito, provincia de Puno. Fundación española el 02/04/1564.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Coata',
    descripcion: 'Distrito de Coata, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Pichacani',
    descripcion: 'Distrito de Pichacani, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Mañazo',
    descripcion: 'Distrito de Mañazo, provincia de Puno. Nota: celebra su aniversario local el 17 de mayo.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Platería',
    descripcion: 'Distrito de Platería, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Vilque',
    descripcion: 'Distrito de Vilque, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de San Antonio de Esquilache',
    descripcion: 'Distrito de San Antonio de Esquilache, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Tiquillaca',
    descripcion: 'Distrito de Tiquillaca, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Azángaro: distritos del 02/05/1854 --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Azángaro (distrito)',
    descripcion: 'Distrito capital de la provincia de Azángaro. Integrado al departamento de Puno desde 1825.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Asillo',
    descripcion: 'Distrito de Asillo, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Samán',
    descripcion: 'Distrito de Samán, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Arapa',
    descripcion: 'Distrito de Arapa, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de San Antón',
    descripcion: 'Distrito de San Antón, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Achaya',
    descripcion: 'Distrito de Achaya, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Chupa',
    descripcion: 'Distrito de Chupa, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Muñani',
    descripcion: 'Distrito de Muñani, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Santiago de Pupuja',
    descripcion: 'Distrito de Santiago de Pupuja, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de San José',
    descripcion: 'Distrito de San José, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Caminaca',
    descripcion: 'Distrito de Caminaca, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de San Juan de Salinas',
    descripcion: 'Distrito de San Juan de Salinas, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Potoni',
    descripcion: 'Distrito de Potoni, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Lampa: distritos del 02/05/1854 --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Lampa (distrito)',
    descripcion: 'Distrito capital de la provincia de Lampa. Conocida como la "Ciudad Rosada".',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Nicasio',
    descripcion: 'Distrito de Nicasio, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Calapuja',
    descripcion: 'Distrito de Calapuja, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Vilavila',
    descripcion: 'Distrito de Vilavila, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Pucará',
    descripcion: 'Distrito de Pucará, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Cabanilla',
    descripcion: 'Distrito de Cabanilla, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ocuviri',
    descripcion: 'Distrito de Ocuviri, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Carabaya: distritos del 02/05/1854 --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ayapata',
    descripcion: 'Distrito de Ayapata, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ajoyani',
    descripcion: 'Distrito de Ajoyani, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Coasa',
    descripcion: 'Distrito de Coasa, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Usicayos',
    descripcion: 'Distrito de Usicayos, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ituata',
    descripcion: 'Distrito de Ituata, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Corani',
    descripcion: 'Distrito de Corani, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ollachea',
    descripcion: 'Distrito de Ollachea, provincia de Carabaya.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. El Collao --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ilave',
    descripcion: 'Distrito de Ilave, capital de la provincia de El Collao. Centro comercial importante del altiplano.',
    categoria: 'distrito', provincia: 'El Collao',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Santa Rosa de Mazocruz',
    descripcion: 'Distrito de Santa Rosa (Mazocruz), provincia de El Collao. Nota: su celebración local se trasladó al 5 de mayo.',
    categoria: 'distrito', provincia: 'El Collao',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Chucuito --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Juli',
    descripcion: 'Distrito de Juli, capital de la provincia de Chucuito. Fundación española el 02/04/1565. Conocida como la "Pequeña Roma de América".',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Pomata',
    descripcion: 'Distrito de Pomata, provincia de Chucuito.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Desaguadero',
    descripcion: 'Distrito de Desaguadero, provincia de Chucuito. Importante zona fronteriza con Bolivia.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Huacullani',
    descripcion: 'Distrito de Huacullani, provincia de Chucuito.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Zepita',
    descripcion: 'Distrito de Zepita, provincia de Chucuito.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Pisacoma',
    descripcion: 'Distrito de Pisacoma, provincia de Chucuito.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Sandia --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Quiaca',
    descripcion: 'Distrito de Quiaca, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Cuyocuyo',
    descripcion: 'Distrito de Cuyocuyo, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Phara',
    descripcion: 'Distrito de Phara, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Patambuco',
    descripcion: 'Distrito de Patambuco, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Limbani',
    descripcion: 'Distrito de Limbani, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Yanahuaya',
    descripcion: 'Distrito de Yanahuaya, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de San Juan del Oro',
    descripcion: 'Distrito de San Juan del Oro, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. San Román --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Cabana',
    descripcion: 'Distrito de Cabana, provincia de San Román.',
    categoria: 'distrito', provincia: 'San Román',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Caracoto',
    descripcion: 'Distrito de Caracoto, provincia de San Román.',
    categoria: 'distrito', provincia: 'San Román',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. San Antonio de Putina --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ananea',
    descripcion: 'Distrito de Ananea, provincia de San Antonio de Putina. Importante centro minero.',
    categoria: 'distrito', provincia: 'San Antonio de Putina',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Putina (distrito)',
    descripcion: 'Distrito de Putina, capital de la provincia de San Antonio de Putina.',
    categoria: 'distrito', provincia: 'San Antonio de Putina',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Sina',
    descripcion: 'Distrito de Sina, provincia de San Antonio de Putina.',
    categoria: 'distrito', provincia: 'San Antonio de Putina',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Huancané --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Huancané (distrito)',
    descripcion: 'Distrito capital de la provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Pusi',
    descripcion: 'Distrito de Pusi, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Taraco',
    descripcion: 'Distrito de Taraco, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Vilque Chico',
    descripcion: 'Distrito de Vilque Chico, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Cojata',
    descripcion: 'Distrito de Cojata, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Inchupalla',
    descripcion: 'Distrito de Inchupalla, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Moho --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Moho (distrito)',
    descripcion: 'Distrito capital de la provincia de Moho.',
    categoria: 'distrito', provincia: 'Moho',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Conima',
    descripcion: 'Distrito de Conima, provincia de Moho.',
    categoria: 'distrito', provincia: 'Moho',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Tilali',
    descripcion: 'Distrito de Tilali, provincia de Moho.',
    categoria: 'distrito', provincia: 'Moho',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // -- Prov. Yunguyo --
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Yunguyo (distrito)',
    descripcion: 'Distrito capital de la provincia de Yunguyo. Ciudad fronteriza con Bolivia.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Copani',
    descripcion: 'Distrito de Copani, provincia de Yunguyo.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Ollaraya',
    descripcion: 'Distrito de Ollaraya, provincia de Yunguyo.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Cuturapi',
    descripcion: 'Distrito de Cuturapi, provincia de Yunguyo.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Anapia',
    descripcion: 'Distrito insular de Anapia, provincia de Yunguyo. Ubicado en el Lago Titicaca.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  {
    dia: 2, mes: 5, anio: 1854,
    titulo: 'Aniversario de Tinicachi',
    descripcion: 'Distrito de Tinicachi, provincia de Yunguyo.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'D.L. N.° 12103 del 02/05/1854',
  },
  // Distritos con aniversario local distinto al 2 de mayo
  {
    dia: 5, mes: 5,
    titulo: 'Aniversario local de Santa Rosa de Mazocruz',
    descripcion: 'Distrito de Santa Rosa (Mazocruz), provincia de El Collao. Creado el 02/05/1854, celebra su aniversario local cada 5 de mayo.',
    categoria: 'distrito', provincia: 'El Collao',
  },
  {
    dia: 13, mes: 5, anio: 2005,
    titulo: 'Aniversario del Distrito de San Pedro de Putina Punco',
    descripcion: 'Distrito de San Pedro de Putina Punco, provincia de Sandia. Creado durante el gobierno de Alejandro Toledo.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'Ley N.° 28509 del 13/05/2005',
  },
  {
    dia: 17, mes: 5,
    titulo: 'Aniversario local del Distrito de Mañazo',
    descripcion: 'Distrito de Mañazo, provincia de Puno. Creado el 02/05/1854, celebra su aniversario local cada 17 de mayo.',
    categoria: 'distrito', provincia: 'Puno',
  },
  {
    dia: 18, mes: 5, anio: 1982,
    titulo: 'Aniversario del Distrito de Unicachi',
    descripcion: 'Distrito de Unicachi, provincia de Yunguyo.',
    categoria: 'distrito', provincia: 'Yunguyo',
    baseLegal: 'Ley N.° 23382 del 18/05/1982',
  },

  // ═══════════════════════════════════════════
  // JUNIO
  // ═══════════════════════════════════════════
  {
    dia: 1, mes: 6, anio: 1982,
    titulo: 'Aniversario del Distrito de Kelluyo',
    descripcion: 'Distrito de Kelluyo, provincia de Chucuito.',
    categoria: 'distrito', provincia: 'Chucuito',
    baseLegal: 'Ley N.° 23417 del 01/06/1982',
  },
  {
    dia: 3, mes: 6, anio: 1828,
    titulo: 'Creación Política de la Provincia de Chucuito',
    descripcion: 'Provincia con capital en Juli. Creada por decreto, con Juli elevada a villa y declarada capital. Reorganizada el 02/05/1854.',
    categoria: 'provincia', provincia: 'Chucuito',
    baseLegal: 'Decreto del 03/06/1828',
  },
  {
    dia: 12, mes: 6, anio: 1989,
    titulo: 'Creación de la Provincia de San Antonio de Putina',
    descripcion: 'Provincia con capital en Putina. Creada durante el primer gobierno de Alan García Pérez.',
    categoria: 'provincia', provincia: 'San Antonio de Putina',
    baseLegal: 'Ley N.° 25038 del 12/06/1989',
  },
  {
    dia: 21, mes: 6, anio: 1825,
    titulo: 'Creación Política de la Provincia de Lampa',
    descripcion: 'Creada por Decreto Dictatorial de Simón Bolívar. Capital: Lampa, la "Ciudad Rosada".',
    categoria: 'provincia', provincia: 'Lampa',
    baseLegal: 'Decreto del 21/06/1825 (Simón Bolívar)',
  },
  {
    dia: 21, mes: 6, anio: 1825,
    titulo: 'Creación Política de la Provincia de Azángaro',
    descripcion: 'Elevada a provincia del departamento de Puno por decreto de Simón Bolívar.',
    categoria: 'provincia', provincia: 'Azángaro',
    baseLegal: 'Decreto del 21/06/1825 (Simón Bolívar)',
  },
  {
    dia: 21, mes: 6, anio: 1825,
    titulo: 'Creación Política de la Provincia de Carabaya',
    descripcion: 'Integrada al departamento de Puno por decreto de Simón Bolívar. Capital: Macusani.',
    categoria: 'provincia', provincia: 'Carabaya',
    baseLegal: 'Decreto del 21/06/1825 (Simón Bolívar)',
  },
  {
    dia: 21, mes: 6, anio: 1967,
    titulo: 'Aniversario del Distrito de Huatasani',
    descripcion: 'Distrito de Huatasani, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'Ley N.° 16669 del 21/06/1967',
  },

  // ═══════════════════════════════════════════
  // JULIO
  // ═══════════════════════════════════════════
  {
    dia: 28, mes: 7, anio: 2016,
    titulo: 'Aniversario del Distrito de San Miguel',
    descripcion: 'Distrito de San Miguel, provincia de San Román. Quinto distrito de la provincia, creado durante el gobierno de Ollanta Humala.',
    categoria: 'distrito', provincia: 'San Román',
    baseLegal: 'Ley N.° 30492 del 28/07/2016',
  },

  // ═══════════════════════════════════════════
  // AGOSTO
  // ═══════════════════════════════════════════
  {
    dia: 22, mes: 8, anio: 1921,
    titulo: 'Aniversario del Distrito de Huata',
    descripcion: 'Distrito de Huata, provincia de Puno.',
    categoria: 'distrito', provincia: 'Puno',
    baseLegal: 'Ley Regional N.° 467 del 22/08/1921',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario del Distrito de Ayaviri',
    descripcion: 'Distrito capital de la provincia de Melgar. Creado por ley de Simón Bolívar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Nuñoa',
    descripcion: 'Distrito de Nuñoa, provincia de Melgar. Creado por ley de Simón Bolívar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Orurillo',
    descripcion: 'Distrito de Orurillo, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Macari',
    descripcion: 'Distrito de Macari, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Santa Rosa (Melgar)',
    descripcion: 'Distrito de Santa Rosa, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Umachiri',
    descripcion: 'Distrito de Umachiri, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Llalli',
    descripcion: 'Distrito de Llalli, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Cupi',
    descripcion: 'Distrito de Cupi, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },
  {
    dia: 30, mes: 8, anio: 1825,
    titulo: 'Aniversario de Antauta',
    descripcion: 'Distrito de Antauta, provincia de Melgar.',
    categoria: 'distrito', provincia: 'Melgar',
    baseLegal: 'Ley del 30/08/1825 (Simón Bolívar)',
  },

  // ═══════════════════════════════════════════
  // SEPTIEMBRE
  // ═══════════════════════════════════════════
  {
    dia: 6, mes: 9, anio: 1926,
    titulo: 'Creación Política de la Provincia de San Román',
    descripcion: 'Capital: Juliaca. Promulgada por Augusto B. Leguía.',
    categoria: 'provincia', provincia: 'San Román',
    baseLegal: 'Ley N.° 5463 del 06/09/1926',
  },
  {
    dia: 6, mes: 9, anio: 1997,
    titulo: 'Aniversario de la Plaza Internacional San José',
    descripcion: 'La Plaza Internacional del Altiplano San José de Juliaca fue fundada el 6 de septiembre de 1997. Uno de los centros comerciales más importantes de la región.',
    categoria: 'mercado', provincia: 'San Román',
  },
  {
    dia: 13, mes: 9, anio: 1994,
    titulo: 'Aniversario del Distrito de Alto Inambari',
    descripcion: 'Distrito de Alto Inambari, provincia de Sandia.',
    categoria: 'distrito', provincia: 'Sandia',
    baseLegal: 'Ley del 13/09/1994',
  },
  {
    dia: 19, mes: 9, anio: 1827,
    titulo: 'Creación Política de la Provincia de Huancané',
    descripcion: 'Creada por Decreto Supremo. Capital: Huancané.',
    categoria: 'provincia', provincia: 'Huancané',
    baseLegal: 'Decreto Supremo del 19/09/1827',
  },
  {
    dia: 23, mes: 9, anio: 1998,
    titulo: 'Aniversario de la Plataforma Comercial Las Mercedes',
    descripcion: 'La Plataforma Comercial Las Mercedes de Juliaca celebra su aniversario con concurso de danzas y actividades culturales.',
    categoria: 'mercado', provincia: 'San Román',
  },
  {
    dia: 29, mes: 9,
    titulo: 'Fiesta de San Miguel Arcángel',
    descripcion: 'Fiesta patronal celebrada en Ilave, Ollaraya, Copani y Conima con misas y danzas folklóricas.',
    categoria: 'festividad', provincia: 'El Collao',
  },

  // ═══════════════════════════════════════════
  // OCTUBRE
  // ═══════════════════════════════════════════
  {
    dia: 5, mes: 10, anio: 1954,
    titulo: 'Aniversario del Distrito de José Domingo Choquehuanca',
    descripcion: 'Distrito de José Domingo Choquehuanca, provincia de Azángaro. Nombrado en honor al político y abogado puneño.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'Ley N.° 12121 del 05/10/1954',
  },
  {
    dia: 15, mes: 10, anio: 1925,
    titulo: 'Aniversario del Distrito de San Gabán',
    descripcion: 'Distrito de San Gabán, provincia de Carabaya. Zona de selva alta.',
    categoria: 'distrito', provincia: 'Carabaya',
    baseLegal: 'Ley N.° 5214 del 15/10/1925',
  },
  {
    dia: 17, mes: 10, anio: 1954,
    titulo: 'Aniversario del Distrito de Paratía',
    descripcion: 'Distrito de Paratía, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'Ley del 17/10/1954',
  },
  {
    dia: 24, mes: 10, anio: 1876,
    titulo: 'Aniversario del Distrito de Rosaspata',
    descripcion: 'Distrito de Rosaspata, provincia de Huancané.',
    categoria: 'distrito', provincia: 'Huancané',
    baseLegal: 'Ley del 24/10/1876',
  },
  {
    dia: 24, mes: 10, anio: 1926,
    titulo: 'Aniversario de Juliaca',
    descripcion: 'Inauguración oficial de la provincia de San Román con Juliaca como capital. Don Pedro de Noriega fue el primer alcalde provincial.',
    categoria: 'distrito', provincia: 'San Román',
    baseLegal: 'Inauguración provincial del 24/10/1926',
  },
  {
    dia: 25, mes: 10, anio: 1901,
    titulo: 'Creación Política de la Provincia de Melgar',
    descripcion: 'Creada originalmente como "Provincia de Ayaviri". Renombrada a Melgar el 02/12/1925 (Ley 5310) en honor al poeta Mariano Melgar.',
    categoria: 'provincia', provincia: 'Melgar',
    baseLegal: 'Ley del 25/10/1901',
  },
  {
    dia: 25, mes: 10, anio: 1901,
    titulo: 'Aniversario del Distrito de Palca',
    descripcion: 'Distrito de Palca, provincia de Lampa.',
    categoria: 'distrito', provincia: 'Lampa',
    baseLegal: 'Ley del 25/10/1901',
  },
  {
    dia: 25, mes: 10, anio: 1961,
    titulo: 'Aniversario del Mercado Central de Puno',
    descripcion: 'El Mercado Central de Puno celebra su aniversario en octubre con actividades cívicas.',
    categoria: 'mercado', provincia: 'Puno',
  },

  // ═══════════════════════════════════════════
  // NOVIEMBRE
  // ═══════════════════════════════════════════
  {
    dia: 10, mes: 11, anio: 1943,
    titulo: 'Aniversario del Distrito de Tirapata',
    descripcion: 'Distrito de Tirapata, provincia de Azángaro.',
    categoria: 'distrito', provincia: 'Azángaro',
    baseLegal: 'Ley N.° 9840 del 10/11/1943',
  },
  {
    dia: 24, mes: 11, anio: 1961,
    titulo: 'Aniversario del Distrito de Pilcuyo',
    descripcion: 'Distrito de Pilcuyo, provincia de El Collao.',
    categoria: 'distrito', provincia: 'El Collao',
    baseLegal: 'D.L. N.° 13753 del 24/11/1961',
  },
  {
    dia: 24, mes: 11, anio: 1961,
    titulo: 'Aniversario del Distrito de Conduriri',
    descripcion: 'Distrito de Conduriri, provincia de El Collao.',
    categoria: 'distrito', provincia: 'El Collao',
    baseLegal: 'D.L. N.° 13753 del 24/11/1961',
  },
  {
    dia: 24, mes: 11, anio: 1961,
    titulo: 'Aniversario del Distrito de Capaso',
    descripcion: 'Distrito de Capaso, provincia de El Collao.',
    categoria: 'distrito', provincia: 'El Collao',
    baseLegal: 'D.L. N.° 13753 del 24/11/1961',
  },

  // ═══════════════════════════════════════════
  // DICIEMBRE
  // ═══════════════════════════════════════════
  {
    dia: 8, mes: 12,
    titulo: 'Fiesta de la Inmaculada Concepción',
    descripcion: 'Festividad patronal celebrada en Lampa, Juli, Mañazo, Nuñoa y Macusani con procesiones y danzas.',
    categoria: 'festividad', provincia: 'Lampa',
  },
  {
    dia: 12, mes: 12, anio: 1991,
    titulo: 'Creación de la Provincia de El Collao',
    descripcion: 'Provincia con capital en Ilave. Creada durante el gobierno de Alberto Fujimori.',
    categoria: 'provincia', provincia: 'El Collao',
    baseLegal: 'Ley N.° 25361 del 12/12/1991',
  },
  {
    dia: 12, mes: 12, anio: 1991,
    titulo: 'Creación de la Provincia de Moho',
    descripcion: 'Provincia con capital en Moho. Creada durante el gobierno de Alberto Fujimori.',
    categoria: 'provincia', provincia: 'Moho',
    baseLegal: 'Ley N.° 25360 del 12/12/1991',
  },
  {
    dia: 12, mes: 12, anio: 1991,
    titulo: 'Aniversario del Distrito de Huayrapata',
    descripcion: 'Distrito de Huayrapata, provincia de Moho. Creado junto con la provincia.',
    categoria: 'distrito', provincia: 'Moho',
    baseLegal: 'Ley N.° 25360 del 12/12/1991',
  },
  {
    dia: 18, mes: 12, anio: 1965,
    titulo: 'Fundación del Mercado Túpac Amaru',
    descripcion: 'Asociación de comerciantes del Mercado Túpac Amaru de Juliaca.',
    categoria: 'mercado', provincia: 'San Román',
  },
  {
    dia: 28, mes: 12, anio: 1984,
    titulo: 'Creación de la Provincia de Yunguyo',
    descripcion: 'Provincia fronteriza con Bolivia. Capital: Yunguyo. Segregada de la provincia de Chucuito. 7 distritos.',
    categoria: 'provincia', provincia: 'Yunguyo',
    baseLegal: 'Ley N.° 24042 del 28/12/1984',
  },
];

// Agrupar efemérides por mes
export const getEfemeridesPorMes = (): Map<number, Efemeride[]> => {
  const porMes = new Map<number, Efemeride[]>();
  for (const ef of EFEMERIDES) {
    const lista = porMes.get(ef.mes) || [];
    lista.push(ef);
    porMes.set(ef.mes, lista);
  }
  return porMes;
};

// Obtener la próxima efeméride más cercana
export const getProximaEfemeride = (): Efemeride | null => {
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();

  let proxima = EFEMERIDES.find(
    (ef) => ef.mes > mesActual || (ef.mes === mesActual && ef.dia >= diaActual)
  );

  if (!proxima) {
    proxima = EFEMERIDES[0];
  }

  return proxima || null;
};

// Contar efemérides por categoría
export const contarPorCategoria = () => {
  let provincias = 0;
  let distritos = 0;
  let mercados = 0;
  let festividades = 0;
  for (const ef of EFEMERIDES) {
    if (ef.categoria === 'provincia') provincias++;
    else if (ef.categoria === 'distrito') distritos++;
    else if (ef.categoria === 'mercado') mercados++;
    else festividades++;
  }
  return { provincias, distritos, mercados, festividades, total: EFEMERIDES.length };
};
