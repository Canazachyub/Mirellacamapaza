# Plataforma Web - Dra. Mirella Camapaza Quispe

Sitio web oficial de campaña para la Dra. Mirella Camapaza Quispe, candidata a Diputada por Puno N°4 con el partido Ahora Nación.

**URL de Producción:** https://mirellacamapaza.com

## Tecnologías

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** TailwindCSS
- **Animaciones:** Framer Motion
- **Formularios:** React Hook Form + Zod
- **Estado:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Mapas:** Leaflet + React Leaflet
- **Backend:** Google Apps Script + Google Sheets
- **Hosting:** GitHub Pages

## Estructura del Proyecto

```
mirella-camapaza-web/
├── public/
│   ├── CNAME              # Dominio personalizado
│   └── 404.html           # Redirect para SPA en GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/        # Componentes reutilizables (Button, Card, Input, Modal, etc.)
│   │   ├── forms/         # Formularios (AffiliateForm, ContactForm, VolunteerForm)
│   │   ├── layout/        # Layouts (Header, Footer, DashboardLayout)
│   │   └── sections/      # Secciones de página (Hero, Proposals, Documents, etc.)
│   ├── pages/
│   │   ├── auth/          # Páginas de autenticación (Login)
│   │   ├── dashboard/     # Panel administrativo (14 módulos)
│   │   └── public/        # Páginas públicas
│   ├── services/
│   │   └── api.ts         # Cliente API para Google Apps Script
│   ├── store/
│   │   ├── authStore.ts   # Estado de autenticación
│   │   └── uiStore.ts     # Estado de UI (toasts, modals)
│   ├── types/
│   │   └── index.ts       # Tipos TypeScript
│   └── utils/
│       ├── constants.ts     # Constantes y configuración
│       ├── helpers.ts       # Funciones auxiliares
│       ├── electoralData.ts # Datos electorales 2021/2026 (110 distritos, 13 provincias)
│       └── efemerides.ts    # Efemérides de la Región Puno (130+ eventos)
├── GOOGLE_APPS_SCRIPT_UPDATE.js  # Código del backend Google Apps Script
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions para despliegue automático
└── index.html
```

## Páginas Públicas

### 1. Inicio (`/`)
- **Hero:** GIF animado de fondo con nombre, cargo y slogan
- **Propuestas destacadas:** Grid de 6 propuestas principales
- **Sobre la candidata:** Foto y descripción breve
- **Contador regresivo:** Días restantes para las elecciones (12 de abril 2026)
- **Sección de sedes:** Mapa con ubicaciones de las sedes
- **CTAs:** Botones para afiliarse y ser voluntario

### 2. Conóceme (`/conoceme`)
- **Biografía completa:** Historia personal y profesional
- **Formación académica:**
  - Abogada - Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)
  - Contadora Pública - Universidad Andina del Cusco (UAC)
  - Maestría en Gestión Pública - Universidad del Pacífico
  - Máster en Cooperación Internacional - Universidad de la Rioja (España)
- **Especializaciones:** ESAN, PUCP, Universidad del Pacífico, etc.
- **Experiencia laboral:**
  - EsSalud (Sub Gerente, Asesora de Cooperación Internacional)
  - Congreso de la República (Asistente Parlamentario)
  - MTC (Especialista Administrativo)
  - SUNAT, SUNARP
  - Municipalidades de Puno (Lampa, Salcedo)
- **Valores y visión**

### 3. Propuestas (`/propuestas`)
- **Salud:** Centros de salud rurales, brigadas médicas
- **Educación:** Infraestructura, capacitación docente, becas
- **Desarrollo Económico:** Apoyo a MYPEs, turismo, agroindustria
- **Infraestructura:** Carreteras, agua, saneamiento, conectividad
- **Agricultura:** Riego tecnificado, créditos, mejoramiento genético
- **Medio Ambiente:** Descontaminación Lago Titicaca, residuos sólidos

### 4. Galería (`/galeria`)
- Fotos y videos de campaña
- Eventos y actividades
- Filtros por categoría

### 5. Sedes (`/sedes`)
- **Mapa interactivo** con todas las sedes
- **Sede Principal:** Jr. Prolongación Arboleda Manzana Ñ Lote 6, Parque Industrial Salcedo, Puno
- **Sede Juliaca - Deustua:** Jr. Deustua 434
- **Sede Juliaca - Gonzales Prada:** Jr. Gonzales Prada 368
- **Sede Collao - Ilave:** Jr. Los Mártires 162

### 6. Contacto (`/contacto`)
- Formulario de contacto
- Información de contacto directo
- Redes sociales

### 7. Afiliación (`/afiliate`)
- Formulario completo de afiliación al partido
- Campos: datos personales, DNI, ubicación, ocupación

### 8. Voluntariado (`/voluntarios`)
- Formulario para unirse como voluntario
- Selección de áreas de interés
- Disponibilidad horaria

## Panel Administrativo (`/admin`)

### Acceso
- **URL:** https://mirellacamapaza.com/login
- **Contraseña:** `MirellaCamapaza2026!`

### Módulos del Dashboard

#### 1. Dashboard Principal (`/admin`)
- **Estadísticas generales:**
  - Total de afiliados
  - Total de voluntarios
  - Mensajes sin leer
  - Eventos próximos
- **Gráficos de crecimiento**
- **Actividad reciente**

#### 2. Mensajes (`/admin/mensajes`)
- Lista de mensajes recibidos del formulario de contacto
- Estados: Nuevo, Leído, Respondido, Archivado
- Funciones: Ver, Responder, Cambiar estado, Eliminar

#### 3. Afiliados (`/admin/afiliados`)
- Lista de personas afiliadas
- Filtros por estado, provincia, distrito
- Búsqueda por nombre o DNI
- Estados: Pendiente, Verificado, Activo, Inactivo
- Exportación de datos

#### 4. Voluntarios (`/admin/voluntarios`)
- Lista de voluntarios registrados
- Filtros por estado, equipo, área
- Asignación a equipos
- Estados: Activo, Inactivo, Pendiente

#### 5. Archivos (`/admin/archivos`)
- Gestor de archivos conectado a Google Drive
- Subir archivos
- Crear carpetas
- Visualizar documentos

#### 6. Galería (`/admin/galeria`)
- Gestión de imágenes y videos
- Subir multimedia
- Organizar por categorías

#### 7. Equipos (`/admin/equipos`)
- Crear y gestionar equipos de trabajo
- Asignar líder
- Ver miembros del equipo

#### 8. Mapa Electoral (`/admin/mapa-electoral`)
- **Mapa interactivo** de las 13 provincias de Puno con Leaflet
- Datos electorales 2021/2026 por provincia y distrito (110 distritos)
- Estadísticas: electores, varones, mujeres, jóvenes, mayores de 70
- Metas territoriales y seguimiento de apoyo
- Fuente: ONPE/JNE 2021, RENIEC 2026

#### 9. Estrategia (`/admin/estrategia`)
- Datos electorales consolidados 2021 y proyección 2026
- Congresistas elegidos 2021 por Puno (datos oficiales ONPE/JNE)
- Análisis de medios de comunicación regionales
- Organizaciones sociales y actores clave
- Planificación estratégica de campaña

#### 10. Eventos (`/admin/eventos`)
- **Calendario de Google integrado** (dra.mirella.camapaza.4@gmail.com)
- **Efemérides de la Región Puno:** 130+ eventos cronológicos
  - 13 provincias con fechas de creación política
  - 100+ distritos con aniversarios y base legal
  - 5 mercados y plazas feriales
  - 4 festividades principales (Candelaria, Carnavales de Juliaca, San Miguel Arcángel, Inmaculada Concepción)
  - Filtros por categoría (provincia, distrito, mercado, festividad)
  - Búsqueda por nombre y agrupación por mes
  - Indicador de próximo aniversario
- Crear eventos manualmente
- Estados: Programado, En Curso, Finalizado, Cancelado

#### 11. Redes Sociales (`/admin/redes-sociales`)
- Gestión de presencia en redes sociales
- Publicaciones y alcance

#### 12. Sentimientos (`/admin/sentimientos`)
- **Análisis de sentimiento** con Gemini AI
- Clasificación: positivo, negativo, neutro
- Categorías y etiquetas automáticas
- Nivel de riesgo por comentario
- Generación de respuestas con IA

#### 13. Reportes (`/admin/reportes`)
- Estadísticas detalladas
- Gráficos de crecimiento
- Exportación de reportes

#### 14. Configuración (`/admin/configuracion`)
- Configuración general del sitio
- Cambio de contraseña
- Ajustes de notificaciones

## API - Google Apps Script

### Endpoints Disponibles

```
Base URL: https://script.google.com/macros/s/[ID]/exec
```

#### Afiliados
- `GET ?action=getAffiliates` - Listar afiliados
- `GET ?action=getAffiliate&id=X` - Obtener afiliado
- `POST ?action=addAffiliate` - Crear afiliado
- `POST ?action=updateAffiliate` - Actualizar afiliado
- `POST ?action=deleteAffiliate` - Eliminar afiliado

#### Mensajes
- `GET ?action=getMessages` - Listar mensajes
- `GET ?action=getMessage&id=X` - Obtener mensaje
- `POST ?action=addMessage` - Crear mensaje
- `POST ?action=updateMessage` - Actualizar estado
- `POST ?action=replyMessage` - Responder mensaje
- `POST ?action=deleteMessage` - Eliminar mensaje

#### Voluntarios
- `GET ?action=getVolunteers` - Listar voluntarios
- `GET ?action=getVolunteer&id=X` - Obtener voluntario
- `POST ?action=addVolunteer` - Crear voluntario
- `POST ?action=updateVolunteer` - Actualizar voluntario
- `POST ?action=deleteVolunteer` - Eliminar voluntario

#### Equipos
- `GET ?action=getTeams` - Listar equipos
- `POST ?action=addTeam` - Crear equipo
- `POST ?action=updateTeam` - Actualizar equipo
- `POST ?action=deleteTeam` - Eliminar equipo

#### Eventos
- `GET ?action=getEvents` - Listar eventos
- `POST ?action=addEvent` - Crear evento
- `POST ?action=updateEvent` - Actualizar evento
- `POST ?action=deleteEvent` - Eliminar evento

#### Archivos
- `GET ?action=getFiles` - Listar archivos
- `POST ?action=uploadFile` - Subir archivo
- `POST ?action=deleteFile` - Eliminar archivo
- `POST ?action=createFolder` - Crear carpeta

#### Tareas Diarias
- `GET ?action=getTasks` - Listar tareas
- `POST ?action=addTask` - Crear tarea
- `POST ?action=updateTask` - Actualizar tarea
- `POST ?action=toggleTaskComplete` - Marcar como completada
- `POST ?action=deleteTask` - Eliminar tarea

#### Bases Territoriales
- `GET ?action=getBases` - Listar bases territoriales
- `GET ?action=getBaseStats` - Estadísticas de bases
- `POST ?action=addBase` - Crear base
- `POST ?action=updateBase` - Actualizar base
- `POST ?action=deleteBase` - Eliminar base

#### Sentimientos
- `GET ?action=getSentiments` - Listar análisis de sentimiento
- `GET ?action=getSentimentStats` - Estadísticas de sentimiento

#### Gemini AI
- `POST ?action=generateAIResponse` - Generar respuesta con IA

#### Estadísticas
- `GET ?action=getStats` - Obtener estadísticas generales

#### Configuración
- `GET ?action=getConfig` - Obtener configuración
- `POST ?action=updateConfig` - Actualizar configuración
- `GET ?action=validateLogin` - Validar contraseña de acceso

## Información de Contacto

- **WhatsApp:** +51 964 271 720
- **Email:** dra.mirella.camapaza.4@gmail.com
- **TikTok:** @dramirellacamapaza
- **Instagram:** @dramirellacamapaza
- **Facebook:** Ahora Nación Ilave

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## Despliegue

El sitio se despliega automáticamente a GitHub Pages cuando se hace push a la rama `main`.

### Workflow de GitHub Actions
1. Checkout del código
2. Setup de Node.js 20
3. Instalación de dependencias (`npm ci`)
4. Build del proyecto (`npm run build`)
5. Deploy a GitHub Pages

## Configuración DNS

### Registros A (GitHub Pages)
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Registro CNAME
```
www -> canazachyub.github.io
```

## Slogan de Campaña

> "Mano dura contra el crimen y manos limpias para gobernar"

## Fecha de Elecciones

**12 de abril de 2026**

---

Desarrollado para la campaña de la Dra. Mirella Camapaza Quispe - Candidata a Diputada por Puno N°4 - Ahora Nación
