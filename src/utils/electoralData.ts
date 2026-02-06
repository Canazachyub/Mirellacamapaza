// Datos electorales de la Región Puno
// Padrón 2021: 922,016 electores | Población Electoral 2026: 963,489 (Fuente: RENIEC)

export interface DistritoElectoral {
  provincia: string;
  distrito: string;
  electores: number;
  varones: number;
  mujeres: number;
  jovenes: number;  // 18-29 años
  mayores70: number;
}

export interface ProvinciaStats {
  nombre: string;
  electores: number;
  varones: number;
  mujeres: number;
  jovenes: number;
  mayores70: number;
  distritos: number;
  lat: number;
  lng: number;
  distritosData: DistritoElectoral[];
}

export interface ApoyoTerritorial {
  id?: string;
  fecha: string;
  provincia: string;
  distrito: string;
  comunidad: string;
  tipo: 'Simpatizante' | 'Afiliado' | 'Voluntario' | 'Lider';
  nombre: string;
  telefono: string;
  compromiso: 'Alto' | 'Medio' | 'Bajo';
  notas: string;
}

export interface MetaTerritorial {
  provincia: string;
  distrito: string;
  electores: number;
  metaAfiliados: number;
  metaVoluntarios: number;
  prioridad: 'Alta' | 'Media' | 'Baja';
  responsable: string;
  estado: 'Pendiente' | 'EnProgreso' | 'Completado';
  apoyoActual?: number;
}

export interface Competencia {
  id?: string;
  partido: string;
  candidato: string;
  cargo: string;
  provincia: string;
  fortaleza: string;
  debilidad: string;
  estrategia: string;
  nivelAmenaza: 'Alto' | 'Medio' | 'Bajo';
  notas: string;
}

// Datos electorales por distrito (Fuente: ONPE/JNE 2021)
export const ELECTORAL_DATA: DistritoElectoral[] = [
  // AZANGARO (15 distritos)
  {provincia:"AZANGARO",distrito:"ACHAYA",electores:3413,varones:1758,mujeres:1655,jovenes:1032,mayores70:263},
  {provincia:"AZANGARO",distrito:"ARAPA",electores:6576,varones:3252,mujeres:3324,jovenes:2049,mayores70:853},
  {provincia:"AZANGARO",distrito:"ASILLO",electores:12497,varones:5833,mujeres:6664,jovenes:4332,mayores70:1245},
  {provincia:"AZANGARO",distrito:"AZANGARO",electores:24951,varones:12432,mujeres:12519,jovenes:8998,mayores70:1923},
  {provincia:"AZANGARO",distrito:"CAMINACA",electores:3909,varones:1928,mujeres:1981,jovenes:1084,mayores70:382},
  {provincia:"AZANGARO",distrito:"CHUPA",electores:6275,varones:3057,mujeres:3218,jovenes:1731,mayores70:1054},
  {provincia:"AZANGARO",distrito:"JOSE DOMINGO CHOQUEHUANCA",electores:3594,varones:1747,mujeres:1847,jovenes:1083,mayores70:371},
  {provincia:"AZANGARO",distrito:"MUÑANI",electores:5068,varones:2456,mujeres:2612,jovenes:1962,mayores70:455},
  {provincia:"AZANGARO",distrito:"POTONI",electores:2864,varones:1326,mujeres:1538,jovenes:1130,mayores70:193},
  {provincia:"AZANGARO",distrito:"SAMAN",electores:10161,varones:5068,mujeres:5093,jovenes:3116,mayores70:1080},
  {provincia:"AZANGARO",distrito:"SAN ANTON",electores:5939,varones:2789,mujeres:3150,jovenes:2077,mayores70:568},
  {provincia:"AZANGARO",distrito:"SAN JOSE",electores:4109,varones:1961,mujeres:2148,jovenes:1452,mayores70:465},
  {provincia:"AZANGARO",distrito:"SAN JUAN DE SALINAS",electores:3066,varones:1400,mujeres:1666,jovenes:956,mayores70:333},
  {provincia:"AZANGARO",distrito:"SANTIAGO DE PUPUJA",electores:4151,varones:1971,mujeres:2180,jovenes:1078,mayores70:616},
  {provincia:"AZANGARO",distrito:"TIRAPATA",electores:2287,varones:1086,mujeres:1201,jovenes:803,mayores70:255},

  // CARABAYA (10 distritos)
  {provincia:"CARABAYA",distrito:"AJOYANI",electores:1891,varones:966,mujeres:925,jovenes:640,mayores70:115},
  {provincia:"CARABAYA",distrito:"AYAPATA",electores:4545,varones:2268,mujeres:2277,jovenes:1681,mayores70:379},
  {provincia:"CARABAYA",distrito:"COASA",electores:4762,varones:2417,mujeres:2345,jovenes:1784,mayores70:375},
  {provincia:"CARABAYA",distrito:"CORANI",electores:3128,varones:1585,mujeres:1543,jovenes:1292,mayores70:183},
  {provincia:"CARABAYA",distrito:"CRUCERO",electores:6081,varones:2940,mujeres:3141,jovenes:2325,mayores70:467},
  {provincia:"CARABAYA",distrito:"ITUATA",electores:4137,varones:2151,mujeres:1986,jovenes:1575,mayores70:299},
  {provincia:"CARABAYA",distrito:"MACUSANI",electores:9306,varones:4614,mujeres:4692,jovenes:3766,mayores70:508},
  {provincia:"CARABAYA",distrito:"OLLACHEA",electores:4100,varones:2101,mujeres:1999,jovenes:1534,mayores70:276},
  {provincia:"CARABAYA",distrito:"SAN GABAN",electores:5039,varones:3235,mujeres:1804,jovenes:1530,mayores70:151},
  {provincia:"CARABAYA",distrito:"USICAYOS",electores:2457,varones:1217,mujeres:1240,jovenes:927,mayores70:212},

  // CHUCUITO (7 distritos)
  {provincia:"CHUCUITO",distrito:"DESAGUADERO",electores:8474,varones:4167,mujeres:4307,jovenes:2585,mayores70:647},
  {provincia:"CHUCUITO",distrito:"HUACULLANI",electores:3634,varones:1830,mujeres:1804,jovenes:994,mayores70:490},
  {provincia:"CHUCUITO",distrito:"JULI",electores:17534,varones:8512,mujeres:9022,jovenes:5154,mayores70:2265},
  {provincia:"CHUCUITO",distrito:"KELLUYO",electores:3965,varones:2008,mujeres:1957,jovenes:1133,mayores70:456},
  {provincia:"CHUCUITO",distrito:"PISACOMA",electores:2055,varones:988,mujeres:1067,jovenes:494,mayores70:318},
  {provincia:"CHUCUITO",distrito:"POMATA",electores:11903,varones:5862,mujeres:6041,jovenes:3193,mayores70:1950},
  {provincia:"CHUCUITO",distrito:"ZEPITA",electores:12754,varones:6342,mujeres:6412,jovenes:3997,mayores70:1780},

  // EL COLLAO (5 distritos)
  {provincia:"EL COLLAO",distrito:"CAPASO",electores:645,varones:301,mujeres:344,jovenes:139,mayores70:102},
  {provincia:"EL COLLAO",distrito:"CONDURIRI",electores:2342,varones:1160,mujeres:1182,jovenes:643,mayores70:277},
  {provincia:"EL COLLAO",distrito:"ILAVE",electores:38227,varones:18783,mujeres:19444,jovenes:12234,mayores70:4190},
  {provincia:"EL COLLAO",distrito:"PILCUYO",electores:9327,varones:4476,mujeres:4851,jovenes:1801,mayores70:2092},
  {provincia:"EL COLLAO",distrito:"SANTA ROSA",electores:2855,varones:1368,mujeres:1487,jovenes:680,mayores70:418},

  // HUANCANE (8 distritos)
  {provincia:"HUANCANE",distrito:"COJATA",electores:3758,varones:1907,mujeres:1851,jovenes:1246,mayores70:271},
  {provincia:"HUANCANE",distrito:"HUANCANE",electores:17720,varones:8695,mujeres:9025,jovenes:4753,mayores70:2738},
  {provincia:"HUANCANE",distrito:"HUATASANI",electores:2222,varones:1111,mujeres:1111,jovenes:610,mayores70:277},
  {provincia:"HUANCANE",distrito:"INCHUPALLA",electores:2796,varones:1430,mujeres:1366,jovenes:757,mayores70:327},
  {provincia:"HUANCANE",distrito:"PUSI",electores:4345,varones:2081,mujeres:2264,jovenes:1087,mayores70:556},
  {provincia:"HUANCANE",distrito:"ROSASPATA",electores:4695,varones:2343,mujeres:2352,jovenes:1246,mayores70:769},
  {provincia:"HUANCANE",distrito:"TARACO",electores:11549,varones:5632,mujeres:5917,jovenes:3332,mayores70:1536},
  {provincia:"HUANCANE",distrito:"VILQUE CHICO",electores:8457,varones:4147,mujeres:4310,jovenes:1852,mayores70:1615},

  // LAMPA (10 distritos)
  {provincia:"LAMPA",distrito:"CABANILLA",electores:4828,varones:2291,mujeres:2537,jovenes:1361,mayores70:478},
  {provincia:"LAMPA",distrito:"CALAPUJA",electores:1793,varones:851,mujeres:942,jovenes:446,mayores70:187},
  {provincia:"LAMPA",distrito:"LAMPA",electores:10076,varones:4882,mujeres:5194,jovenes:2824,mayores70:1051},
  {provincia:"LAMPA",distrito:"NICASIO",electores:2559,varones:1225,mujeres:1334,jovenes:748,mayores70:254},
  {provincia:"LAMPA",distrito:"OCUVIRI",electores:1931,varones:1000,mujeres:931,jovenes:673,mayores70:128},
  {provincia:"LAMPA",distrito:"PALCA",electores:1598,varones:784,mujeres:814,jovenes:455,mayores70:139},
  {provincia:"LAMPA",distrito:"PARATIA",electores:1949,varones:951,mujeres:998,jovenes:672,mayores70:171},
  {provincia:"LAMPA",distrito:"PUCARA",electores:4864,varones:2331,mujeres:2533,jovenes:1376,mayores70:635},
  {provincia:"LAMPA",distrito:"SANTA LUCIA",electores:5653,varones:2766,mujeres:2887,jovenes:1792,mayores70:481},
  {provincia:"LAMPA",distrito:"VILAVILA",electores:900,varones:455,mujeres:445,jovenes:284,mayores70:67},

  // MELGAR (9 distritos)
  {provincia:"MELGAR",distrito:"ANTAUTA",electores:4462,varones:2254,mujeres:2208,jovenes:1455,mayores70:311},
  {provincia:"MELGAR",distrito:"AYAVIRI",electores:19869,varones:9686,mujeres:10183,jovenes:6806,mayores70:1537},
  {provincia:"MELGAR",distrito:"CUPI",electores:1548,varones:715,mujeres:833,jovenes:467,mayores70:154},
  {provincia:"MELGAR",distrito:"LLALLI",electores:2324,varones:1051,mujeres:1273,jovenes:818,mayores70:243},
  {provincia:"MELGAR",distrito:"MACARI",electores:5553,varones:2678,mujeres:2875,jovenes:1958,mayores70:529},
  {provincia:"MELGAR",distrito:"NUÑOA",electores:7129,varones:3446,mujeres:3683,jovenes:2443,mayores70:757},
  {provincia:"MELGAR",distrito:"ORURILLO",electores:6520,varones:3019,mujeres:3501,jovenes:2141,mayores70:808},
  {provincia:"MELGAR",distrito:"SANTA ROSA",electores:4733,varones:2275,mujeres:2458,jovenes:1514,mayores70:460},
  {provincia:"MELGAR",distrito:"UMACHIRI",electores:2921,varones:1371,mujeres:1550,jovenes:782,mayores70:274},

  // MOHO (4 distritos)
  {provincia:"MOHO",distrito:"CONIMA",electores:3146,varones:1504,mujeres:1642,jovenes:683,mayores70:590},
  {provincia:"MOHO",distrito:"HUAYRAPATA",electores:2962,varones:1489,mujeres:1473,jovenes:946,mayores70:305},
  {provincia:"MOHO",distrito:"MOHO",electores:12925,varones:6255,mujeres:6670,jovenes:3333,mayores70:2197},
  {provincia:"MOHO",distrito:"TILALI",electores:2591,varones:1239,mujeres:1352,jovenes:611,mayores70:427},

  // PUNO (15 distritos)
  {provincia:"PUNO",distrito:"ACORA",electores:18824,varones:9488,mujeres:9336,jovenes:4672,mayores70:3122},
  {provincia:"PUNO",distrito:"AMANTANI",electores:4087,varones:1968,mujeres:2119,jovenes:1104,mayores70:473},
  {provincia:"PUNO",distrito:"ATUNCOLLA",electores:4040,varones:2000,mujeres:2040,jovenes:1311,mayores70:348},
  {provincia:"PUNO",distrito:"CAPACHICA",electores:8219,varones:3981,mujeres:4238,jovenes:1883,mayores70:1568},
  {provincia:"PUNO",distrito:"CHUCUITO",electores:6801,varones:3197,mujeres:3604,jovenes:1582,mayores70:1167},
  {provincia:"PUNO",distrito:"COATA",electores:6105,varones:2868,mujeres:3237,jovenes:2011,mayores70:559},
  {provincia:"PUNO",distrito:"HUATA",electores:2752,varones:1344,mujeres:1408,jovenes:761,mayores70:358},
  {provincia:"PUNO",distrito:"MAÑAZO",electores:4288,varones:2046,mujeres:2242,jovenes:1356,mayores70:444},
  {provincia:"PUNO",distrito:"PAUCARCOLLA",electores:4112,varones:2021,mujeres:2091,jovenes:1089,mayores70:570},
  {provincia:"PUNO",distrito:"PICHACANI",electores:5171,varones:2446,mujeres:2725,jovenes:1328,mayores70:685},
  {provincia:"PUNO",distrito:"PLATERIA",electores:6199,varones:3098,mujeres:3101,jovenes:1475,mayores70:1118},
  {provincia:"PUNO",distrito:"PUNO",electores:105137,varones:52368,mujeres:52769,jovenes:31799,mayores70:7467},
  {provincia:"PUNO",distrito:"SAN ANTONIO",electores:1135,varones:562,mujeres:573,jovenes:392,mayores70:112},
  {provincia:"PUNO",distrito:"TIQUILLACA",electores:2282,varones:1084,mujeres:1198,jovenes:448,mayores70:363},
  {provincia:"PUNO",distrito:"VILQUE",electores:2460,varones:1203,mujeres:1257,jovenes:740,mayores70:217},

  // SAN ANTONIO DE PUTINA (5 distritos)
  {provincia:"SAN ANTONIO DE PUTINA",distrito:"ANANEA",electores:3648,varones:1828,mujeres:1820,jovenes:1178,mayores70:133},
  {provincia:"SAN ANTONIO DE PUTINA",distrito:"PEDRO VILCA APAZA",electores:1718,varones:845,mujeres:873,jovenes:549,mayores70:225},
  {provincia:"SAN ANTONIO DE PUTINA",distrito:"PUTINA",electores:12235,varones:5892,mujeres:6343,jovenes:4162,mayores70:970},
  {provincia:"SAN ANTONIO DE PUTINA",distrito:"QUILCAPUNCU",electores:4050,varones:2051,mujeres:1999,jovenes:1458,mayores70:338},
  {provincia:"SAN ANTONIO DE PUTINA",distrito:"SINA",electores:1282,varones:655,mujeres:627,jovenes:464,mayores70:96},

  // SAN ROMAN (5 distritos)
  {provincia:"SAN ROMAN",distrito:"CABANA",electores:4040,varones:1825,mujeres:2215,jovenes:1069,mayores70:485},
  {provincia:"SAN ROMAN",distrito:"CABANILLAS",electores:3897,varones:1845,mujeres:2052,jovenes:1155,mayores70:434},
  {provincia:"SAN ROMAN",distrito:"CARACOTO",electores:8176,varones:3804,mujeres:4372,jovenes:2125,mayores70:845},
  {provincia:"SAN ROMAN",distrito:"JULIACA",electores:181824,varones:91906,mujeres:89918,jovenes:64671,mayores70:8058},
  {provincia:"SAN ROMAN",distrito:"SAN MIGUEL",electores:20173,varones:8607,mujeres:11566,jovenes:5965,mayores70:823},

  // SANDIA (10 distritos)
  {provincia:"SANDIA",distrito:"ALTO INAMBARI",electores:4577,varones:2565,mujeres:2012,jovenes:1564,mayores70:291},
  {provincia:"SANDIA",distrito:"CUYOCUYO",electores:5075,varones:2638,mujeres:2437,jovenes:1478,mayores70:463},
  {provincia:"SANDIA",distrito:"LIMBANI",electores:2296,varones:1218,mujeres:1078,jovenes:680,mayores70:170},
  {provincia:"SANDIA",distrito:"PATAMBUCO",electores:3788,varones:1931,mujeres:1857,jovenes:1460,mayores70:305},
  {provincia:"SANDIA",distrito:"PHARA",electores:3835,varones:2054,mujeres:1781,jovenes:1161,mayores70:278},
  {provincia:"SANDIA",distrito:"QUIACA",electores:1809,varones:956,mujeres:853,jovenes:632,mayores70:108},
  {provincia:"SANDIA",distrito:"SAN JUAN DEL ORO",electores:3399,varones:1861,mujeres:1538,jovenes:911,mayores70:335},
  {provincia:"SANDIA",distrito:"SAN PEDRO DE PUTINA PUNCO",electores:6267,varones:3671,mujeres:2596,jovenes:2040,mayores70:305},
  {provincia:"SANDIA",distrito:"SANDIA",electores:9516,varones:5055,mujeres:4461,jovenes:3205,mayores70:874},
  {provincia:"SANDIA",distrito:"YANAHUAYA",electores:1708,varones:975,mujeres:733,jovenes:503,mayores70:127},

  // YUNGUYO (7 distritos)
  {provincia:"YUNGUYO",distrito:"ANAPIA",electores:980,varones:488,mujeres:492,jovenes:221,mayores70:166},
  {provincia:"YUNGUYO",distrito:"COPANI",electores:4116,varones:2068,mujeres:2048,jovenes:1234,mayores70:565},
  {provincia:"YUNGUYO",distrito:"CUTURAPI",electores:995,varones:476,mujeres:519,jovenes:238,mayores70:182},
  {provincia:"YUNGUYO",distrito:"OLLARAYA",electores:2006,varones:934,mujeres:1072,jovenes:345,mayores70:526},
  {provincia:"YUNGUYO",distrito:"TINICACHI",electores:596,varones:279,mujeres:317,jovenes:119,mayores70:87},
  {provincia:"YUNGUYO",distrito:"UNICACHI",electores:1019,varones:484,mujeres:535,jovenes:158,mayores70:271},
  {provincia:"YUNGUYO",distrito:"YUNGUYO",electores:20982,varones:10226,mujeres:10756,jovenes:5823,mayores70:2828}
];

// Coordenadas de las provincias
export const PROVINCE_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "PUNO": { lat: -15.8402, lng: -70.0219 },
  "SAN ROMAN": { lat: -15.5000, lng: -70.1333 },
  "AZANGARO": { lat: -14.9100, lng: -70.1900 },
  "MELGAR": { lat: -14.9167, lng: -70.5933 },
  "LAMPA": { lat: -15.3644, lng: -70.3678 },
  "HUANCANE": { lat: -15.2044, lng: -69.7633 },
  "MOHO": { lat: -15.3589, lng: -69.4967 },
  "SAN ANTONIO DE PUTINA": { lat: -14.9333, lng: -69.8667 },
  "SANDIA": { lat: -14.3278, lng: -69.4350 },
  "CARABAYA": { lat: -14.0633, lng: -70.3633 },
  "CHUCUITO": { lat: -16.2167, lng: -69.4500 },
  "EL COLLAO": { lat: -16.0833, lng: -69.6333 },
  "YUNGUYO": { lat: -16.2472, lng: -69.0928 }
};

// Totales regionales (Padrón 2021 para detalle distrital)
export const REGIONAL_TOTALS = {
  electores: 922016,
  varones: 456030,
  mujeres: 465986,
  jovenes: 288974,
  mayores70: 87137,
  provincias: 13,
  distritos: 110
};

// Población Electoral 2026 por provincia (Fuente: RENIEC)
export const ELECTORES_2026: Record<string, number> = {
  "SAN ROMAN": 229360,
  "PUNO": 183277,
  "AZANGARO": 103000,
  "CHUCUITO": 62630,
  "HUANCANE": 57373,
  "MELGAR": 57065,
  "EL COLLAO": 53915,
  "CARABAYA": 51592,
  "SANDIA": 46947,
  "LAMPA": 38508,
  "YUNGUYO": 31874,
  "SAN ANTONIO DE PUTINA": 24638,
  "MOHO": 23310,
};

export const TOTAL_ELECTORES_2026 = 963489;

// Resultados Elecciones Congresales 2021 - Puno
export interface ResultadoEleccion2021 {
  partido: string;
  candidatos: { nombre: string; numero: number; votos: number; elegido: boolean }[];
}

export const RESULTADOS_2021: ResultadoEleccion2021[] = [
  {
    partido: 'Perú Libre',
    candidatos: [
      { nombre: 'Flavio Cruz Mamani', numero: 1, votos: 30025, elegido: true },
      { nombre: 'Nancy Rossel Angles', numero: 2, votos: 16814, elegido: false },
      { nombre: 'Oscar Zea Choquechambi', numero: 3, votos: 34450, elegido: true },
      { nombre: 'Marilu Zulema Yanarico Apaza', numero: 4, votos: 4705, elegido: false },
      { nombre: 'Wilson Rusbel Quispe Mamani', numero: 5, votos: 28343, elegido: true },
      { nombre: '', numero: 6, votos: 913, elegido: false },
    ],
  },
  {
    partido: 'Acción Popular',
    candidatos: [
      { nombre: 'Jorge Luis Flores Ancachi', numero: 1, votos: 23539, elegido: true },
      { nombre: 'Armida Isia Larico', numero: 2, votos: 12073, elegido: false },
      { nombre: 'Elmer Quispe Cahui', numero: 3, votos: 22646, elegido: false },
      { nombre: 'Maria Lourdes Llano Flores', numero: 4, votos: 10267, elegido: false },
      { nombre: 'Carlos Javier Zeballos Madariaga', numero: 5, votos: 23883, elegido: true },
      { nombre: 'Danitza Frisancho Berrios', numero: 6, votos: 3112, elegido: false },
    ],
  },
  {
    partido: 'Podemos Perú',
    candidatos: [
      { nombre: 'Wilbert Mariano Portugal Menendez', numero: 1, votos: 2833, elegido: false },
      { nombre: '', numero: 2, votos: 1724, elegido: false },
      { nombre: 'Porfirio Vargas Quispe', numero: 3, votos: 872, elegido: false },
      { nombre: 'Yenny Velasquez Calla', numero: 4, votos: 2569, elegido: false },
      { nombre: 'Jorge Enrique Sotomayor Perales', numero: 5, votos: 4629, elegido: false },
      { nombre: 'Dina Natty Romero Salcedo', numero: 6, votos: 437, elegido: false },
    ],
  },
  {
    partido: 'Juntos por el Perú',
    candidatos: [
      { nombre: 'Luis Butron Castillo', numero: 1, votos: 10496, elegido: false },
      { nombre: 'Elisabeth Vilca Ticona', numero: 2, votos: 3615, elegido: false },
      { nombre: 'Gonzalo Gregorio Salas Charca', numero: 3, votos: 2147, elegido: false },
      { nombre: 'Patricia del Carmen Barra Hinojosa', numero: 4, votos: 854, elegido: false },
      { nombre: 'Richard Freddy Gonzales Salcedo', numero: 5, votos: 2524, elegido: false },
      { nombre: '', numero: 6, votos: 195, elegido: false },
    ],
  },
];

// Datos de participación 2021
export const PARTICIPACION_2021 = {
  electoresHabiles: 922016,
  participacion: 755332,
  porcentaje: 81.92,
};

// Medios de comunicación de Puno - COMPLETO (Fuente: E:\Base de datos\Medios_Comunicacion_Puno.xlsx)
export interface MedioComunicacion {
  tipo: string;
  medio: string;
  frecuencia: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  notas: string;
}

export const MEDIOS_COMUNICACION: MedioComunicacion[] = [
  // RADIOS (9)
  { tipo: 'Radio', medio: 'Radio RPP Juliaca', frecuencia: '88.9 FM', direccion: '', telefono: '+51 1 215 0200 (central Lima)', email: '', web: 'https://rpp.pe', facebook: '@rppnoticias', instagram: '@rppnoticias', twitter: '@RPPNoticias', tiktok: '', youtube: '', notas: 'Red nacional. Sin número exclusivo para Juliaca' },
  { tipo: 'Radio', medio: 'Radio San Pedro Juliaca', frecuencia: '98.1 FM', direccion: 'Jr. Moquegua 565, Juliaca', telefono: '+51 914 200 404 (cabina/WhatsApp)', email: '', web: 'http://www.radiosanpedrofm.com/', facebook: '@RadioSanPedro98.1FM', instagram: '', twitter: '', tiktok: '', youtube: '', notas: '' },
  { tipo: 'Radio', medio: 'Radio Ritmo Romántica Juliaca', frecuencia: '98.9 FM', direccion: 'Jr. Justo Pastor Dávila 197, Chorrillos, Lima (central)', telefono: '+51 949 100 636 (WhatsApp) / +51 617 6600 (fijo)', email: 'ritmoromanticafm@gmail.com', web: 'https://www.ritmoromantica.pe', facebook: '@RadioRitmoRomantica', instagram: '@radioritmoranticafm', twitter: '@Ritmo_Romantica', tiktok: '@radioritmorantica', youtube: '@RitmoromanticaPeru', notas: 'Red CRP, central nacional' },
  { tipo: 'Radio', medio: 'Radio Karibeña Juliaca', frecuencia: '94.9 FM', direccion: 'Av. Guardia Civil 674, Chorrillos, Lima (central)', telefono: '(01) 251-2622 (cabina) / +51 900 207 785 (WhatsApp)', email: 'ventas@corporacionuniversal.pe', web: 'https://lakaribena.com.pe', facebook: 'Radio Karibeña', instagram: '@lakaribenaperu', twitter: '@karibenape', tiktok: '@lakaribena', youtube: '', notas: 'Corporación Universal' },
  { tipo: 'Radio', medio: 'Radio Las Vegas Juliaca', frecuencia: '94.3 FM', direccion: 'Jr. Carlos Dreyer 110, Puno', telefono: '+51 953 300 095 (cabina)', email: '', web: 'http://www.radiolasvegasjuliaca.com', facebook: 'radiolasvegas.juliacateactiva', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Eslogan: Te activa' },
  { tipo: 'Radio', medio: 'Radio Sol de los Andes', frecuencia: '104.5 FM / 1460 AM', direccion: 'Jr. 2 de Mayo N° 209, Of. 406, Juliaca', telefono: '051-331414 / +51 978 591 586 / +51 951 540 453 (denuncias)', email: 'info@radiosoldelosandes.com.pe', web: 'https://www.radiosoldelosandes.com.pe', facebook: '@Radiosoldelosandesoficial', instagram: '@radio.soldelosandes', twitter: '', tiktok: '', youtube: '', notas: 'La radio que vive en el corazón del pueblo' },
  { tipo: 'Radio', medio: 'Radio Universal (Pusi – Huancané)', frecuencia: '101.7 FM', direccion: '', telefono: '+51 950 771 176', email: '', web: 'https://radiotvuniversalpusi.blogspot.com', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Sin redes sociales oficiales' },
  { tipo: 'Radio', medio: 'Radio Ilave', frecuencia: '', direccion: 'Av. Puno 578, barrio Cruzani, Ilave, El Collao', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'RUC: 20448173144 – Corp. Telecomunicaciones del Sur S.A.C.' },
  { tipo: 'Radio', medio: 'Radio Yunguyo', frecuencia: '98.1 FM', direccion: 'Yunguyo, Puno', telefono: '', email: '', web: 'https://www.radioyunguyo.com', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'La radio del pueblo aymara' },
  // TELEVISIÓN (8)
  { tipo: 'TV', medio: 'TV Latina Puno', frecuencia: '2.1 HD – 20 UHF', direccion: '', telefono: '', email: '', web: '', facebook: 'TV Latina Puno (fb.com/61558585286047)', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Red nacional Latina' },
  { tipo: 'TV', medio: 'TV UNA – Univ. Nacional del Altiplano', frecuencia: '', direccion: '', telefono: '', email: '', web: 'https://portal.unap.edu.pe', facebook: '@tvunaradio', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Señal integrada a plataforma digital UNA' },
  { tipo: 'TV', medio: 'TV Perú – Canal 7', frecuencia: '7.1 – 16 UHF', direccion: '', telefono: '(01) 615-7777 (IRTP Lima)', email: '', web: 'https://www.tvperu.gob.pe', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Filial Puno, contacto vía central IRTP' },
  { tipo: 'TV', medio: 'TV Global Puno', frecuencia: '9.1 – 22 UHF', direccion: '', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Señal nacional Grupo ATV' },
  { tipo: 'TV', medio: 'CTC HD (Juliaca)', frecuencia: '23.1 – 18 UHF', direccion: '', telefono: '', email: '', web: 'https://ctc.pe', facebook: 'CTC.pe', instagram: '@ctc.pe', twitter: '', tiktok: '@CTC.PE', youtube: '@ctcpe', notas: 'Compañía de TV Cusqueña' },
  { tipo: 'TV', medio: 'Satellite Latina HD (Juliaca)', frecuencia: '2.1 – 20 UHF', direccion: '', telefono: '', email: '', web: 'https://www.latina.pe', facebook: '', instagram: '', twitter: '@Latina_pe', tiktok: '', youtube: '', notas: 'Repetidor local de Latina TV' },
  { tipo: 'TV', medio: 'Global TV HD (Juliaca)', frecuencia: '5.1 – 22 UHF', direccion: '', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Señal nacional Grupo ATV' },
  { tipo: 'TV', medio: 'Panamericana HD / América HD / La Tele', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Contactos: centrales de América TV / Panamericana TV / ATV – Lima' },
  // PRENSA (3)
  { tipo: 'Prensa', medio: 'Diario Sin Fronteras – Puno', frecuencia: '', direccion: '', telefono: '', email: '', web: 'https://diariosinfronteras.com.pe/category/puno', facebook: 'Diario Sin Fronteras', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Sin WhatsApp publicado para Puno' },
  { tipo: 'Prensa', medio: 'Diario Correo Puno', frecuencia: '', direccion: 'Jr. Tacna 121, interior 516, Puno', telefono: '+51 950 727 666 / +51 951 960 688 / (051) 363 515 / +51 942 400 667 (WhatsApp denuncias)', email: 'correopuno@gmail.com', web: 'https://diariocorreo.pe/edicion/puno', facebook: '', instagram: '', twitter: '@diariocorreo', tiktok: '', youtube: '', notas: 'Central nacional: +51 1 708 9999' },
  { tipo: 'Prensa', medio: 'Diario La República – Puno', frecuencia: '', direccion: 'Jr. Camaná 320, Cercado de Lima (central)', telefono: '(01) 711 6000 (central)', email: 'jennifer.sernaque@glr.pe (comercial)', web: 'https://larepublica.pe', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Corresponsal Puno: Liubomir Fernández' },
  // DIGITAL (7)
  { tipo: 'Digital', medio: 'PBO – Radio y TV Online', frecuencia: '', direccion: 'Av. Angamos Oeste 651, Miraflores, Lima', telefono: '+51 1 644 9550 (WhatsApp/central)', email: '', web: 'https://pbo.pe', facebook: 'facebook.com/pboperu', instagram: '@pbo_digital', twitter: '@pboperu', tiktok: '', youtube: '@pbo', notas: '' },
  { tipo: 'Digital', medio: 'Puno Noticias', frecuencia: '', direccion: '', telefono: '', email: '', web: 'https://punonoticias.pe', facebook: 'Puno Noticias', instagram: 'Puno Noticias', twitter: 'Puno Noticias', tiktok: '', youtube: '', notas: '' },
  { tipo: 'Digital', medio: 'Puno En Línea', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: 'facebook.com/PunoEnLinea', instagram: '', twitter: '', tiktok: '', youtube: '', notas: '' },
  { tipo: 'Digital', medio: 'Puno al Día', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: 'Somos Puno Al Día', instagram: '', twitter: '', tiktok: '', youtube: '', notas: '' },
  { tipo: 'Digital', medio: 'Juliaca al Día', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: 'facebook.com/Juliacaaldia', instagram: '', twitter: '', tiktok: '', youtube: '', notas: '' },
  { tipo: 'Digital', medio: 'Altiplano Digital', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Solo referencia nominal, sin web/RS oficiales claras' },
  { tipo: 'Digital', medio: 'Portal Puno / Juliaca Informa', frecuencia: '', direccion: '', telefono: '', email: '', web: '', facebook: '', instagram: '', twitter: '', tiktok: '', youtube: '', notas: 'Solo referencia nominal, sin contactos formales' },
];

// Organizaciones sociales de Puno - COMPLETO (Fuente: E:\Base de datos\Organizaciones_Sociales_Puno.xlsx)
export interface OrganizacionSocial {
  categoria: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  facebookWeb: string;
  descripcion: string;
}

export const ORGANIZACIONES_SOCIALES: OrganizacionSocial[] = [
  // PROTECCIÓN ANIMAL (3)
  { categoria: 'Protección Animal', nombre: 'Escuadrón Patitas Puno', direccion: 'Clínica Veterinaria Scooby Doo - Av. El Sol N° 992', telefono: '964345090 / 915233380 / 051 774492', email: '', facebookWeb: 'Escuadrón patitas PUNO - PERÚ', descripcion: '250+ perros y gatos rescatados, esterilización, tratamiento y adopción' },
  { categoria: 'Protección Animal', nombre: 'Ángeles Sin Voz Puno', direccion: '', telefono: '', email: '', facebookWeb: '@AngelesSinVozPUNO', descripcion: 'Rescate y asistencia a animales' },
  { categoria: 'Protección Animal', nombre: 'Rescate Protección de Animales Región PUNO - JULIACA', direccion: '', telefono: '', email: '', facebookWeb: 'Grupo en Facebook', descripcion: 'Rescate, protección, adopción y búsqueda de animales' },
  // ONG - AMBIENTE/DESARROLLO (8)
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'SUMA MARKA - ONGD', direccion: '', telefono: '051-363236', email: '', facebookWeb: '', descripcion: 'Ambiente/Género' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'Centro de Capacitación Campesina de Puno (C.C.C.P.)', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Agropecuario/Ambiente/Gobernabilidad' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'Centro de Desarrollo Ambiental y Social (CEDAS)', direccion: 'Av. La Torre N° 346', telefono: '951618861', email: '', facebookWeb: '', descripcion: 'Ambiente' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'Centro de Investigación de Recursos Naturales y Medio Ambiente (CIRNMA)', direccion: 'Parque Industrial Salcedo', telefono: '051 366029', email: '', facebookWeb: '', descripcion: 'Recursos Naturales/Medio Ambiente' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'Centro de Desarrollo Humano (CEDEH)', direccion: 'Jr. Deza N° 767 Int. 02', telefono: '369146', email: '', facebookWeb: '', descripcion: 'Desarrollo Humano' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'CIDCSA PERÚ', direccion: 'Pj. Simón Bolívar N° 125 Barrio Chanu Chanu', telefono: '980151631', email: '', facebookWeb: '', descripcion: 'Ambiente/Inclusión Social' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'CIDISURP', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Ambiente/Educación/Salud' },
  { categoria: 'ONG - Ambiente/Desarrollo', nombre: 'CEPRODA - PERÚ', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Agropecuario/Género/Gobernabilidad' },
  // ONG - CULTURA/EDUCACIÓN (4)
  { categoria: 'ONG - Cultura/Educación', nombre: 'Asociación Qolla Aymara', direccion: '', telefono: '+51 997767129', email: '', facebookWeb: '', descripcion: 'Cultura/Género' },
  { categoria: 'ONG - Cultura/Educación', nombre: 'Asociación Suma Qamaña para la Educación y Desarrollo Sostenible', direccion: 'Mza. 8 Lote 22 Urb. Aziruni I Etapa', telefono: '051 367729', email: '', facebookWeb: '', descripcion: 'Educación/Desarrollo Sostenible' },
  { categoria: 'ONG - Cultura/Educación', nombre: 'SUMAQ-PERÚ', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Formación Agropecuaria/Artesanal/Cultural' },
  { categoria: 'ONG - Cultura/Educación', nombre: 'IDRA-PERU', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Investigación para el Desarrollo Rural' },
  // ORG. JUVENIL (9)
  { categoria: 'Org. Juvenil', nombre: 'Colectivo Juventudes Puno', direccion: '', telefono: '', email: '', facebookWeb: 'colectivojuventudespuno.blogspot.com', descripcion: 'Coordinador: Jeamil Esthiff Terán Toledo' },
  { categoria: 'Org. Juvenil', nombre: 'Red Interquorum Puno', direccion: 'Jr. Echave N° 295', telefono: '951904650', email: 'raul_29v@hotmail.com', facebookWeb: 'rediqpuno.org', descripcion: '' },
  { categoria: 'Org. Juvenil', nombre: 'Red Interquorum Juliaca', direccion: 'Av. Santa Rosa', telefono: '950763596', email: 'carlitos_lau@hotmail.com', facebookWeb: '', descripcion: '' },
  { categoria: 'Org. Juvenil', nombre: 'Red Interquorum Ayaviri', direccion: 'Jr. Tarapaca N° 930', telefono: '951075448', email: 'cupido_eroz28@hotmail.com', facebookWeb: '', descripcion: '' },
  { categoria: 'Org. Juvenil', nombre: 'Red Interquorum Umachiri', direccion: 'Plaza de Armas, Av. Arequipa N° 116', telefono: '951048163', email: 'greny_2880@hotmail.com', facebookWeb: '', descripcion: '' },
  { categoria: 'Org. Juvenil', nombre: 'ECOLÓGICAMENTE Q\'UMIR', direccion: 'Jr. German Humpiri, Juliaca', telefono: '993813019', email: 'ecologicamentequmir@gmail.com', facebookWeb: '', descripcion: 'Organización ecológica' },
  { categoria: 'Org. Juvenil', nombre: 'Parroquia de Caracoto', direccion: '', telefono: '354185 / 9801916', email: 'rv_ca@hotmail.com', facebookWeb: '', descripcion: 'Representante: Rosario Canal' },
  { categoria: 'Org. Juvenil', nombre: 'Red Universitaria Ambiental - UNA Puno', direccion: 'Av. Floral 1153', telefono: '', email: 'tatancito18@hotmail.com', facebookWeb: '', descripcion: '' },
  { categoria: 'Org. Juvenil', nombre: 'Consejo Distrital de la Juventud', direccion: 'Jr. María Jiménez N° 251', telefono: '', email: '', facebookWeb: '', descripcion: 'Cesar Cahuari Ticona' },
  // ORG. SOCIAL DE BASE (4)
  { categoria: 'Org. Social de Base', nombre: 'Barrio 4 de Noviembre', direccion: 'Jr. José Sabogal N° 241', telefono: '', email: '', facebookWeb: '', descripcion: 'Representante: Ricardo Huamaní Damián' },
  { categoria: 'Org. Social de Base', nombre: 'Urbanización Chanu Chanu III Etapa', direccion: '', telefono: '01202622', email: '', facebookWeb: '', descripcion: 'Representante: María Luisa Ortega Huanca' },
  { categoria: 'Org. Social de Base', nombre: 'Barrio Unión Llavini', direccion: 'Jr. Venezuela N° 122', telefono: '', email: '', facebookWeb: '', descripcion: 'Representante: Julio Cuno Mamani' },
  { categoria: 'Org. Social de Base', nombre: 'Red Interquorum', direccion: 'Jr. Pasco Turístico N° 315', telefono: '', email: '', facebookWeb: '', descripcion: 'Representante: Dino Yasmani Morales Paja' },
  // ORG. INDÍGENA/CAMPESINA (1)
  { categoria: 'Org. Indígena/Campesina', nombre: 'Unión Nacional de Comunidades Aymaras (UNCA)', direccion: 'Jr. Arequipa N° 1185, Puno', telefono: '900935669 / 951570922', email: 'uniondecomunidadesunca@hotmail.com', facebookWeb: '', descripcion: '' },
  // MESA DE CONCERTACIÓN (14)
  { categoria: 'Mesa de Concertación', nombre: 'Coordinación Regional - Mesa de Concertación', direccion: 'Jr. Cusco 142, Puno', telefono: '051-364939 / 943280578', email: 'puno@mesadeconcertacion.org.pe', facebookWeb: '', descripcion: 'Coordinadora: Hiliana Uribe Mendoza' },
  { categoria: 'Mesa de Concertación', nombre: 'ADEMUC', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Presidenta: Marcela Gonzales Yanqui' },
  { categoria: 'Mesa de Concertación', nombre: 'Awqa Warmi', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Presidenta: Yuly Del Pilar Quispe Cusicani' },
  { categoria: 'Mesa de Concertación', nombre: 'Centro Bartolomé de las Casas', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Coordinador: Sadia Huaman Lujan' },
  { categoria: 'Mesa de Concertación', nombre: 'Centro Yanapanakusun', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Coordinadora: Bertha Maron Salazar' },
  { categoria: 'Mesa de Concertación', nombre: 'CONREDES Puno', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Decana: Wilhen Rogger Limachi Viamonte' },
  { categoria: 'Mesa de Concertación', nombre: 'Coordinadora Rural', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Coordinador: Reynaldo Quispe Chambi' },
  { categoria: 'Mesa de Concertación', nombre: 'COREJU', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Presidente: Vidal Armando Roque Allca' },
  { categoria: 'Mesa de Concertación', nombre: 'FORO Salud', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Coordinador: Modesto Cutipa Yunga' },
  { categoria: 'Mesa de Concertación', nombre: 'Servicios Educativos Rurales', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Coordinador: Ronal Callacondo Mollo' },
  { categoria: 'Mesa de Concertación', nombre: 'Colegio de Psicólogos', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Decana: Bertha Elizabeth Huallpa Bendezu' },
  { categoria: 'Mesa de Concertación', nombre: 'Colegio de Sociólogos de Puno', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Decano: Clodoaldo Arturo Sánchez Justo' },
  { categoria: 'Mesa de Concertación', nombre: 'Comité de Transparencia y Vigilancia Ciudadana', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Presidente: Rosendo David Cuno Quispe' },
  { categoria: 'Mesa de Concertación', nombre: 'ICEM Maranata', direccion: '', telefono: '', email: '', facebookWeb: '', descripcion: 'Representante: Victoria Zarela Pineda Mazuelos' },
  // INST. EDUCATIVA (2)
  { categoria: 'Inst. Educativa', nombre: 'Universidad Nacional del Altiplano', direccion: 'Av. Ejército N° 329, Ciudad Universitaria', telefono: '352206', email: '', facebookWeb: '', descripcion: 'Universidad pública' },
  { categoria: 'Inst. Educativa', nombre: 'Universidad Andina Néstor Cáceres Velásquez', direccion: 'Ed. El Camping 3º Piso, Pasaje de La Cultura Plaza de Armas, Juliaca', telefono: '322213', email: '', facebookWeb: '', descripcion: 'Universidad privada' },
];

// Función para calcular estadísticas por provincia
export function getProvinceStats(): ProvinciaStats[] {
  const provincias = [...new Set(ELECTORAL_DATA.map(d => d.provincia))];

  return provincias.map(prov => {
    const distritos = ELECTORAL_DATA.filter(d => d.provincia === prov);
    const coords = PROVINCE_LOCATIONS[prov] || { lat: -15.5, lng: -70.0 };

    return {
      nombre: prov,
      electores: distritos.reduce((sum, d) => sum + d.electores, 0),
      varones: distritos.reduce((sum, d) => sum + d.varones, 0),
      mujeres: distritos.reduce((sum, d) => sum + d.mujeres, 0),
      jovenes: distritos.reduce((sum, d) => sum + d.jovenes, 0),
      mayores70: distritos.reduce((sum, d) => sum + d.mayores70, 0),
      distritos: distritos.length,
      lat: coords.lat,
      lng: coords.lng,
      distritosData: distritos
    };
  }).sort((a, b) => b.electores - a.electores);
}

// Función para obtener distritos de una provincia
export function getDistritosByProvincia(provincia: string): DistritoElectoral[] {
  return ELECTORAL_DATA
    .filter(d => d.provincia === provincia)
    .sort((a, b) => b.electores - a.electores);
}

// Escalas de color para visualización
export const COLOR_SCALES = {
  electores: ['#e0f2fe', '#7dd3fc', '#38bdf8', '#0284c7', '#0369a1'],
  jovenes: ['#dcfce7', '#86efac', '#4ade80', '#22c55e', '#15803d'],
  mayores: ['#ffedd5', '#fdba74', '#fb923c', '#ea580c', '#c2410c'],
  mujeres: ['#fce7f3', '#f9a8d4', '#f472b6', '#ec4899', '#be185d'],
  apoyo: ['#fee2e2', '#fca5a5', '#f87171', '#ef4444', '#dc2626']
};

// Función para obtener color según valor
export function getColorByValue(value: number, maxValue: number, scale: string[]): string {
  const normalized = value / maxValue;
  const idx = Math.min(Math.floor(normalized * scale.length), scale.length - 1);
  return scale[Math.max(0, idx)];
}

// Calcular prioridad de distrito basado en electores
export function calculatePriority(electores: number): 'Alta' | 'Media' | 'Baja' {
  if (electores >= 10000) return 'Alta';
  if (electores >= 5000) return 'Media';
  return 'Baja';
}

// Generar metas territoriales sugeridas
export function generateSuggestedMetas(): MetaTerritorial[] {
  return ELECTORAL_DATA.map(d => ({
    provincia: d.provincia,
    distrito: d.distrito,
    electores: d.electores,
    metaAfiliados: Math.round(d.electores * 0.05), // 5% de electores
    metaVoluntarios: Math.round(d.electores * 0.01), // 1% de electores
    prioridad: calculatePriority(d.electores),
    responsable: '',
    estado: 'Pendiente' as const,
    apoyoActual: 0
  }));
}
