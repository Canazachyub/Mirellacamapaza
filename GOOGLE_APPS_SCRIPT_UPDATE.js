// ============================================
// API REST - Dra. Mirella Camapaza Campaign
// Archivo principal: Code.gs
// VERSIÓN ACTUALIZADA CON TAREAS Y VOLUNTARIOS DE EQUIPO
// ============================================

const CONFIG = {
  SPREADSHEET_ID: '1bPkTQFf8LGnnEtddu6_9jnsgFKPJ1gkdOqov8lgPLho',
  DRIVE_FOLDER_ID: '1hqMByYLDMgMEw_AG_cqb1EpBsWeBEY1l',
  ADMIN_EMAIL: 'dra.mirella.camapaza.4@gmail.com',
  WHATSAPP: '51964271720',
  // IA APIs - DeepSeek es más económico y sin límites estrictos
  DEEPSEEK_API_KEY: 'sk-2ca24b58d27b4a6887f8fed970f5d0be',  // DeepSeek API
  GEMINI_API_KEY: 'AIzaSyCH13cyGl_KuYx61sO8kcbiqoXEQKsmKK4',  // Backup
  AI_PROVIDER: 'deepseek',  // 'deepseek' o 'gemini'
};

const SHEETS = {
  AFFILIATES: 'Afiliados',
  MESSAGES: 'Mensajes',
  VOLUNTEERS: 'Voluntarios',
  TEAMS: 'Equipos',
  EVENTS: 'Eventos',
  CONFIG: 'Configuracion',
  TASKS: 'Tareas',
  SENTIMENTS: 'Sentimientos',  // Análisis de sentimientos
};

// ============================================
// CONTEXTO DE CAMPAÑA PARA IA
// ============================================

// Contexto simplificado de la candidata
const CANDIDATA_INFO = {
  nombre: 'Dra. Mirella Shirley Camapaza Quispe',
  cargo: 'Candidata al Congreso por Puno',
  numero: 4,
  partido: 'Ahora Nacion',
  titulos: 'Abogada y Contadora Publica',
  experiencia: 'SUNAT, SUNARP, MTC, Congreso, EsSalud',
  propuestas: 'Salud descentralizada, Educacion con tecnologia, Apoyo a PYMES, Infraestructura vial'
};

// ============================================
// HANDLERS HTTP
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getAffiliates':
        result = getAffiliates(e.parameter);
        break;
      case 'getAffiliate':
        result = getAffiliateById(e.parameter.id);
        break;
      case 'getMessages':
        result = getMessages(e.parameter);
        break;
      case 'getMessage':
        result = getMessageById(e.parameter.id);
        break;
      case 'getVolunteers':
        result = getVolunteers(e.parameter);
        break;
      case 'getVolunteer':
        result = getVolunteerById(e.parameter.id);
        break;
      case 'getTeams':
        result = getTeams();
        break;
      case 'getEvents':
        result = getEvents(e.parameter);
        break;
      case 'getFiles':
        result = getFiles(e.parameter.folderId);
        break;
      case 'getStats':
        result = getStats();
        break;
      case 'getConfig':
        result = getConfig();
        break;
      case 'validateLogin':
        result = validateLogin(e.parameter.password);
        break;
      case 'ping':
        result = { success: true, message: 'API activa', timestamp: new Date().toISOString() };
        break;
      // ====== TAREAS Y EQUIPOS ======
      case 'getTasks':
        result = getTasks(e.parameter);
        break;
      case 'getTeamVolunteers':
        result = getTeamVolunteers(e.parameter);
        break;
      // ====== SENTIMIENTOS ======
      case 'getSentiments':
        result = getSentiments(e.parameter);
        break;
      case 'getSentimentStats':
        result = getSentimentStats();
        break;
      // ==============================
      default:
        result = { success: false, error: 'Acción no válida' };
    }
  } catch (error) {
    result = { success: false, error: error.message };
  }

  return createJsonResponse(result);
}

function doPost(e) {
  const action = e.parameter.action;
  let data;
  let result;

  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return createJsonResponse({ success: false, error: 'JSON inválido' });
  }

  try {
    switch (action) {
      case 'addAffiliate':
        result = addAffiliate(data);
        break;
      case 'updateAffiliate':
        result = updateAffiliate(data);
        break;
      case 'deleteAffiliate':
        result = deleteAffiliate(data.id);
        break;
      case 'addMessage':
        result = addMessage(data);
        break;
      case 'updateMessage':
        result = updateMessage(data);
        break;
      case 'replyMessage':
        result = replyMessage(data);
        break;
      case 'deleteMessage':
        result = deleteMessage(data.id);
        break;
      case 'addVolunteer':
        result = addVolunteer(data);
        break;
      case 'updateVolunteer':
        result = updateVolunteer(data);
        break;
      case 'deleteVolunteer':
        result = deleteVolunteer(data.id);
        break;
      case 'addTeam':
        result = addTeam(data);
        break;
      case 'updateTeam':
        result = updateTeam(data);
        break;
      case 'deleteTeam':
        result = deleteTeam(data.id);
        break;
      case 'addEvent':
        result = addEvent(data);
        break;
      case 'updateEvent':
        result = updateEvent(data);
        break;
      case 'deleteEvent':
        result = deleteEvent(data.id);
        break;
      case 'uploadFile':
        result = uploadFile(data);
        break;
      case 'deleteFile':
        result = deleteFile(data.fileId);
        break;
      case 'createFolder':
        result = createFolder(data);
        break;
      case 'updateConfig':
        result = updateConfig(data);
        break;
      // ====== NUEVOS ENDPOINTS ======
      case 'addTask':
        result = addTask(data);
        break;
      case 'updateTask':
        result = updateTask(data);
        break;
      case 'toggleTaskComplete':
        result = toggleTaskComplete(data);
        break;
      case 'deleteTask':
        result = deleteTask(data);
        break;
      case 'addVolunteerToTeam':
        result = addVolunteerToTeam(data);
        break;
      case 'removeVolunteerFromTeam':
        result = removeVolunteerFromTeam(data);
        break;
      // ====== GEMINI AI ======
      case 'generateAIResponse':
        result = generateAIResponse(data);
        break;
      // ==============================
      default:
        result = { success: false, error: 'Acción no válida' };
    }
  } catch (error) {
    result = { success: false, error: error.message };
  }

  return createJsonResponse(result);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ============================================
// FUNCIONES DE AFILIADOS
// ============================================

function getAffiliates(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.AFFILIATES);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [], total: 0 };

  const headers = data[0];
  let affiliates = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtros
  if (params.estado) {
    affiliates = affiliates.filter((a) => a.Estado === params.estado);
  }
  if (params.distrito) {
    affiliates = affiliates.filter((a) => a.Distrito === params.distrito);
  }
  if (params.provincia) {
    affiliates = affiliates.filter((a) => a.Provincia === params.provincia);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    affiliates = affiliates.filter(
      (a) =>
        (a.Nombre && a.Nombre.toLowerCase().includes(search)) ||
        (a.Apellidos && a.Apellidos.toLowerCase().includes(search)) ||
        (a.DNI && a.DNI.toString().includes(search)) ||
        (a.Email && a.Email.toLowerCase().includes(search))
    );
  }

  // Ordenar por fecha (más recientes primero)
  affiliates.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

  // Paginación
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 50;
  const start = (page - 1) * limit;
  const paginatedData = affiliates.slice(start, start + limit);

  return {
    success: true,
    data: paginatedData,
    total: affiliates.length,
    page,
    limit,
    totalPages: Math.ceil(affiliates.length / limit),
  };
}

function getAffiliateById(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.AFFILIATES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return { success: true, data: rowToObject(headers, data[i]) };
    }
  }

  return { success: false, error: 'Afiliado no encontrado' };
}

function addAffiliate(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.AFFILIATES);
  const id = Utilities.getUuid();
  const timestamp = new Date();

  // Verificar DNI duplicado
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][4] === data.dni) {
      return { success: false, error: 'Este DNI ya está registrado' };
    }
  }

  const row = [
    id,
    timestamp,
    data.nombre,
    data.apellidos,
    data.dni,
    data.telefono,
    data.email || '',
    data.direccion || '',
    data.distrito || '',
    data.provincia || '',
    'Pendiente',
  ];

  sheet.appendRow(row);

  // Enviar notificación si está habilitado
  if (shouldNotify('NOTIFICAR_AFILIADOS')) {
    sendAffiliateNotification(data);
  }

  return {
    success: true,
    message: '¡Registro exitoso! Gracias por unirte a Ahora Nación',
    id: id,
  };
}

function updateAffiliate(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.AFFILIATES);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      if (data.nombre) sheet.getRange(rowNum, 3).setValue(data.nombre);
      if (data.apellidos) sheet.getRange(rowNum, 4).setValue(data.apellidos);
      if (data.dni) sheet.getRange(rowNum, 5).setValue(data.dni);
      if (data.telefono) sheet.getRange(rowNum, 6).setValue(data.telefono);
      if (data.email !== undefined) sheet.getRange(rowNum, 7).setValue(data.email);
      if (data.direccion !== undefined) sheet.getRange(rowNum, 8).setValue(data.direccion);
      if (data.distrito) sheet.getRange(rowNum, 9).setValue(data.distrito);
      if (data.provincia) sheet.getRange(rowNum, 10).setValue(data.provincia);
      if (data.estado) sheet.getRange(rowNum, 11).setValue(data.estado);
      return { success: true, message: 'Afiliado actualizado' };
    }
  }

  return { success: false, error: 'Afiliado no encontrado' };
}

function deleteAffiliate(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.AFFILIATES);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Afiliado eliminado' };
    }
  }

  return { success: false, error: 'Afiliado no encontrado' };
}

// ============================================
// FUNCIONES DE MENSAJES
// ============================================

function getMessages(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [], total: 0, unread: 0 };

  const headers = data[0];
  let messages = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtros
  if (params.estado) {
    messages = messages.filter((m) => m.Estado === params.estado);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    messages = messages.filter(
      (m) =>
        (m.Nombre && m.Nombre.toLowerCase().includes(search)) ||
        (m.Asunto && m.Asunto.toLowerCase().includes(search)) ||
        (m.Mensaje && m.Mensaje.toLowerCase().includes(search))
    );
  }

  // Ordenar por fecha (más recientes primero)
  messages.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

  // Contar no leídos (antes de paginar)
  const unread = messages.filter((m) => m.Estado === 'Nuevo').length;

  // Paginación
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 20;
  const start = (page - 1) * limit;
  const paginatedData = messages.slice(start, start + limit);

  return {
    success: true,
    data: paginatedData,
    total: messages.length,
    unread,
    page,
    limit,
    totalPages: Math.ceil(messages.length / limit),
  };
}

function getMessageById(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // Marcar como leído si es nuevo
      if (data[i][7] === 'Nuevo') {
        sheet.getRange(i + 1, 8).setValue('Leido');
        data[i][7] = 'Leido';
      }
      return { success: true, data: rowToObject(headers, data[i]) };
    }
  }

  return { success: false, error: 'Mensaje no encontrado' };
}

function addMessage(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const id = Utilities.getUuid();
  const timestamp = new Date();

  const row = [
    id,
    timestamp,
    data.nombre,
    data.email || '',
    data.telefono || '',
    data.asunto || 'Sin asunto',
    data.mensaje,
    'Nuevo',
    '',
    '',
  ];

  sheet.appendRow(row);

  // Enviar notificación si está habilitado
  if (shouldNotify('NOTIFICAR_MENSAJES')) {
    sendMessageNotification(data);
  }

  return {
    success: true,
    message: 'Mensaje enviado correctamente. Te responderemos pronto.',
    id: id,
  };
}

function updateMessage(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      if (data.estado) sheet.getRange(i + 1, 8).setValue(data.estado);
      return { success: true, message: 'Mensaje actualizado' };
    }
  }

  return { success: false, error: 'Mensaje no encontrado' };
}

function replyMessage(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const recipientEmail = dataRange[i][3];
      const recipientName = dataRange[i][2];

      // Actualizar en la hoja
      sheet.getRange(i + 1, 8).setValue('Respondido');
      sheet.getRange(i + 1, 9).setValue(data.respuesta);
      sheet.getRange(i + 1, 10).setValue(new Date());

      // Enviar email de respuesta
      if (recipientEmail) {
        sendReplyEmail(recipientEmail, recipientName, data.respuesta);
      }

      return { success: true, message: 'Respuesta enviada correctamente' };
    }
  }

  return { success: false, error: 'Mensaje no encontrado' };
}

function deleteMessage(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.MESSAGES);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Mensaje eliminado' };
    }
  }

  return { success: false, error: 'Mensaje no encontrado' };
}

// ============================================
// FUNCIONES DE VOLUNTARIOS
// ============================================

function getVolunteers(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [], total: 0 };

  const headers = data[0];
  let volunteers = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtros
  if (params.estado) {
    volunteers = volunteers.filter((v) => v.Estado === params.estado);
  }
  if (params.equipo) {
    volunteers = volunteers.filter((v) => v.Equipo === params.equipo);
  }
  if (params.distrito) {
    volunteers = volunteers.filter((v) => v.Distrito === params.distrito);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    volunteers = volunteers.filter(
      (v) =>
        (v.Nombre && v.Nombre.toLowerCase().includes(search)) ||
        (v.Apellidos && v.Apellidos.toLowerCase().includes(search)) ||
        (v.DNI && v.DNI.toString().includes(search))
    );
  }

  volunteers.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

  // Paginación
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 50;
  const start = (page - 1) * limit;
  const paginatedData = volunteers.slice(start, start + limit);

  return {
    success: true,
    data: paginatedData,
    total: volunteers.length,
    page,
    limit,
    totalPages: Math.ceil(volunteers.length / limit),
  };
}

function getVolunteerById(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return { success: true, data: rowToObject(headers, data[i]) };
    }
  }

  return { success: false, error: 'Voluntario no encontrado' };
}

function addVolunteer(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const id = Utilities.getUuid();
  const timestamp = new Date();

  const areasInteres = Array.isArray(data.areasInteres)
    ? data.areasInteres.join(', ')
    : data.areasInteres || '';

  const row = [
    id,
    timestamp,
    data.nombre,
    data.apellidos,
    data.dni || '',
    data.telefono,
    data.email || '',
    data.distrito || '',
    areasInteres,
    data.disponibilidad || '',
    'Activo',
    '',
  ];

  sheet.appendRow(row);

  // Enviar notificación si está habilitado
  if (shouldNotify('NOTIFICAR_VOLUNTARIOS')) {
    sendVolunteerNotification(data);
  }

  return {
    success: true,
    message: '¡Gracias por querer ser voluntario! Te contactaremos pronto.',
    id: id,
  };
}

function updateVolunteer(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      if (data.nombre) sheet.getRange(rowNum, 3).setValue(data.nombre);
      if (data.apellidos) sheet.getRange(rowNum, 4).setValue(data.apellidos);
      if (data.dni !== undefined) sheet.getRange(rowNum, 5).setValue(data.dni);
      if (data.telefono) sheet.getRange(rowNum, 6).setValue(data.telefono);
      if (data.email !== undefined) sheet.getRange(rowNum, 7).setValue(data.email);
      if (data.distrito) sheet.getRange(rowNum, 8).setValue(data.distrito);
      if (data.areasInteres) {
        const areas = Array.isArray(data.areasInteres)
          ? data.areasInteres.join(', ')
          : data.areasInteres;
        sheet.getRange(rowNum, 9).setValue(areas);
      }
      if (data.disponibilidad) sheet.getRange(rowNum, 10).setValue(data.disponibilidad);
      if (data.estado) sheet.getRange(rowNum, 11).setValue(data.estado);
      if (data.equipo !== undefined) sheet.getRange(rowNum, 12).setValue(data.equipo);
      return { success: true, message: 'Voluntario actualizado' };
    }
  }

  return { success: false, error: 'Voluntario no encontrado' };
}

function deleteVolunteer(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Voluntario eliminado' };
    }
  }

  return { success: false, error: 'Voluntario no encontrado' };
}

// ============================================
// FUNCIONES DE EQUIPOS
// ============================================

function getTeams() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [] };

  const headers = data[0];
  const teams = data.slice(1).map((row) => rowToObject(headers, row));

  return { success: true, data: teams };
}

function addTeam(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);
  const id = Utilities.getUuid();
  const timestamp = new Date();

  const row = [
    id,
    data.nombre,
    data.descripcion || '',
    data.lider || '',
    0,  // Miembros inicia en 0
    timestamp,
    'Activo',
  ];

  sheet.appendRow(row);

  return { success: true, message: 'Equipo creado', id: id };
}

function updateTeam(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      if (data.Nombre) sheet.getRange(rowNum, 2).setValue(data.Nombre);
      if (data.Descripcion !== undefined) sheet.getRange(rowNum, 3).setValue(data.Descripcion);
      if (data.Lider !== undefined) sheet.getRange(rowNum, 4).setValue(data.Lider);
      if (data.Miembros !== undefined) sheet.getRange(rowNum, 5).setValue(data.Miembros);
      if (data.Estado) sheet.getRange(rowNum, 7).setValue(data.Estado);
      return { success: true, message: 'Equipo actualizado' };
    }
  }

  return { success: false, error: 'Equipo no encontrado' };
}

function deleteTeam(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Equipo eliminado' };
    }
  }

  return { success: false, error: 'Equipo no encontrado' };
}

// ============================================
// FUNCIONES DE VOLUNTARIOS DE EQUIPO (NUEVO)
// ============================================

function getTeamVolunteers(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [] };

  const headers = data[0];
  let volunteers = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtrar por equipo (puede ser ID o nombre del equipo)
  volunteers = volunteers.filter(v =>
    v.Equipo === params.teamId ||
    v.Equipo === params.teamName
  );

  return { success: true, data: volunteers };
}

function addVolunteerToTeam(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.volunteerId) {
      // Columna 12 es Equipo (índice 11 + 1)
      sheet.getRange(i + 1, 12).setValue(data.teamName || data.teamId);

      // Actualizar contador de miembros del equipo
      updateTeamMemberCount(data.teamId, data.teamName);

      return { success: true, message: 'Voluntario agregado al equipo' };
    }
  }

  return { success: false, error: 'Voluntario no encontrado' };
}

function removeVolunteerFromTeam(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.volunteerId) {
      // Obtener el equipo actual antes de limpiar
      const currentTeam = dataRange[i][11]; // Columna Equipo (índice 11)

      // Limpiar el campo Equipo
      sheet.getRange(i + 1, 12).setValue('');

      // Actualizar contador de miembros del equipo anterior
      if (currentTeam) {
        updateTeamMemberCountByName(currentTeam);
      }

      return { success: true, message: 'Voluntario removido del equipo' };
    }
  }

  return { success: false, error: 'Voluntario no encontrado' };
}

function updateTeamMemberCount(teamId, teamName) {
  const volunteerSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.VOLUNTEERS);
  const teamSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);

  const volunteerData = volunteerSheet.getDataRange().getValues();
  const teamData = teamSheet.getDataRange().getValues();

  // Contar voluntarios en este equipo
  let count = 0;
  for (let i = 1; i < volunteerData.length; i++) {
    if (volunteerData[i][11] === teamId || volunteerData[i][11] === teamName) {
      count++;
    }
  }

  // Buscar y actualizar el equipo
  for (let i = 1; i < teamData.length; i++) {
    if (teamData[i][0] === teamId || teamData[i][1] === teamName) {
      teamSheet.getRange(i + 1, 5).setValue(count); // Columna Miembros
      break;
    }
  }
}

function updateTeamMemberCountByName(teamName) {
  const teamSheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TEAMS);
  const teamData = teamSheet.getDataRange().getValues();

  for (let i = 1; i < teamData.length; i++) {
    if (teamData[i][1] === teamName) {
      updateTeamMemberCount(teamData[i][0], teamName);
      break;
    }
  }
}

// ============================================
// FUNCIONES DE TAREAS DIARIAS (NUEVO)
// ============================================

function getTasks(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TASKS);

  if (!sheet) {
    return { success: false, error: 'Hoja Tareas no encontrada. Créala en Google Sheets.' };
  }

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [] };

  const headers = data[0];
  let tasks = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtrar por equipo (por ID o por nombre)
  if (params.equipoId || params.equipoNombre) {
    tasks = tasks.filter(t =>
      t.EquipoID === params.equipoId ||
      t.EquipoNombre === params.equipoId ||
      t.EquipoID === params.equipoNombre ||
      t.EquipoNombre === params.equipoNombre
    );
  }

  // Filtrar por fecha (por defecto hoy)
  const fecha = params.fecha || getTodayDate();
  tasks = tasks.filter(t => {
    // Manejar diferentes formatos de fecha
    const taskDate = t.Fecha instanceof Date
      ? formatDateToYMD(t.Fecha)
      : String(t.Fecha);
    return taskDate === fecha;
  });

  // Filtrar por asignado
  if (params.asignadoA) {
    tasks = tasks.filter(t => t.AsignadoA === params.asignadoA);
  }

  // Convertir Completado a boolean
  tasks = tasks.map(t => ({
    ...t,
    Completado: t.Completado === true || t.Completado === 'TRUE' || t.Completado === 'true'
  }));

  return { success: true, data: tasks };
}

function formatDateToYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addTask(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TASKS);

  if (!sheet) {
    return { success: false, error: 'Hoja Tareas no encontrada. Créala en Google Sheets.' };
  }

  // Generar ID legible: TAREA-YYYYMMDD-001
  const id = generateTaskId(sheet);
  const now = new Date();
  const fecha = data.fecha || getTodayDate();

  const row = [
    id,                           // ID
    fecha,                        // Fecha
    data.titulo,                  // Titulo
    data.equipoId,                // EquipoID
    data.equipoNombre || '',      // EquipoNombre
    data.asignadoA,               // AsignadoA
    data.asignadoNombre || '',    // AsignadoNombre
    false,                        // Completado
    '',                           // FechaCompletado
    now.toISOString()             // FechaCreacion
  ];

  sheet.appendRow(row);
  return { success: true, data: { id }, message: 'Tarea creada' };
}

function generateTaskId(sheet) {
  const today = new Date();
  const dateStr = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');

  const prefix = 'TAREA-' + dateStr + '-';

  // Contar tareas existentes de hoy para generar el número secuencial
  const data = sheet.getDataRange().getValues();
  let maxNum = 0;

  for (let i = 1; i < data.length; i++) {
    const existingId = String(data[i][0]);
    if (existingId.startsWith(prefix)) {
      const num = parseInt(existingId.replace(prefix, '')) || 0;
      if (num > maxNum) maxNum = num;
    }
  }

  return prefix + String(maxNum + 1).padStart(3, '0');
}

function updateTask(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TASKS);

  if (!sheet) {
    return { success: false, error: 'Hoja Tareas no encontrada' };
  }

  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      if (data.Titulo !== undefined) sheet.getRange(rowNum, 3).setValue(data.Titulo);
      if (data.AsignadoA !== undefined) sheet.getRange(rowNum, 6).setValue(data.AsignadoA);
      if (data.AsignadoNombre !== undefined) sheet.getRange(rowNum, 7).setValue(data.AsignadoNombre);
      return { success: true, message: 'Tarea actualizada' };
    }
  }

  return { success: false, error: 'Tarea no encontrada' };
}

function toggleTaskComplete(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TASKS);

  if (!sheet) {
    return { success: false, error: 'Hoja Tareas no encontrada' };
  }

  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      // Columna 8 es Completado
      sheet.getRange(rowNum, 8).setValue(data.completado);
      // Columna 9 es FechaCompletado
      if (data.completado) {
        sheet.getRange(rowNum, 9).setValue(new Date().toISOString());
      } else {
        sheet.getRange(rowNum, 9).setValue('');
      }
      return { success: true, message: 'Tarea actualizada' };
    }
  }

  return { success: false, error: 'Tarea no encontrada' };
}

function deleteTask(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.TASKS);

  if (!sheet) {
    return { success: false, error: 'Hoja Tareas no encontrada' };
  }

  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Tarea eliminada' };
    }
  }

  return { success: false, error: 'Tarea no encontrada' };
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// FUNCIONES DE EVENTOS
// ============================================

function getEvents(params) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.EVENTS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: [] };

  const headers = data[0];
  let events = data.slice(1).map((row) => rowToObject(headers, row));

  // Filtros
  if (params && params.estado) {
    events = events.filter((e) => e.Estado === params.estado);
  }
  if (params && params.upcoming === 'true') {
    const today = new Date();
    events = events.filter((e) => new Date(e.Fecha) >= today);
  }

  // Ordenar por fecha
  events.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

  return { success: true, data: events };
}

function addEvent(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.EVENTS);
  const id = Utilities.getUuid();

  const row = [
    id,
    data.titulo,
    data.descripcion || '',
    data.fecha,
    data.hora || '',
    data.lugar || '',
    data.responsable || '',
    'Programado',
  ];

  sheet.appendRow(row);

  return { success: true, message: 'Evento creado', id: id };
}

function updateEvent(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.EVENTS);
  const dataRange = sheet.getDataRange().getValues();

  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      const rowNum = i + 1;
      if (data.titulo) sheet.getRange(rowNum, 2).setValue(data.titulo);
      if (data.descripcion !== undefined) sheet.getRange(rowNum, 3).setValue(data.descripcion);
      if (data.fecha) sheet.getRange(rowNum, 4).setValue(data.fecha);
      if (data.hora !== undefined) sheet.getRange(rowNum, 5).setValue(data.hora);
      if (data.lugar !== undefined) sheet.getRange(rowNum, 6).setValue(data.lugar);
      if (data.responsable !== undefined) sheet.getRange(rowNum, 7).setValue(data.responsable);
      if (data.estado) sheet.getRange(rowNum, 8).setValue(data.estado);
      return { success: true, message: 'Evento actualizado' };
    }
  }

  return { success: false, error: 'Evento no encontrado' };
}

function deleteEvent(id) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.EVENTS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Evento eliminado' };
    }
  }

  return { success: false, error: 'Evento no encontrado' };
}

// ============================================
// FUNCIONES DE GOOGLE DRIVE
// ============================================

function getFiles(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId || CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const folders = folder.getFolders();

    const result = {
      currentFolder: {
        id: folder.getId(),
        name: folder.getName(),
      },
      files: [],
      folders: [],
    };

    while (files.hasNext()) {
      const file = files.next();
      result.files.push({
        id: file.getId(),
        name: file.getName(),
        mimeType: file.getMimeType(),
        size: file.getSize(),
        url: file.getUrl(),
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.getId()}`,
        thumbnail: getThumbnailUrl(file),
        createdAt: file.getDateCreated().toISOString(),
        updatedAt: file.getLastUpdated().toISOString(),
      });
    }

    while (folders.hasNext()) {
      const subfolder = folders.next();
      result.folders.push({
        id: subfolder.getId(),
        name: subfolder.getName(),
        url: subfolder.getUrl(),
      });
    }

    // Ordenar archivos por fecha
    result.files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Error al obtener archivos: ' + error.message };
  }
}

function getThumbnailUrl(file) {
  const mimeType = file.getMimeType();
  if (mimeType.startsWith('image/')) {
    return `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w400`;
  }
  return null;
}

function uploadFile(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId || CONFIG.DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.content),
      data.mimeType,
      data.name
    );

    const file = folder.createFile(blob);

    return {
      success: true,
      message: 'Archivo subido correctamente',
      file: {
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.getId()}`,
      },
    };
  } catch (error) {
    return { success: false, error: 'Error al subir archivo: ' + error.message };
  }
}

function deleteFile(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { success: true, message: 'Archivo eliminado' };
  } catch (error) {
    return { success: false, error: 'Error al eliminar archivo: ' + error.message };
  }
}

function createFolder(data) {
  try {
    const parentFolder = DriveApp.getFolderById(data.parentId || CONFIG.DRIVE_FOLDER_ID);
    const newFolder = parentFolder.createFolder(data.name);

    return {
      success: true,
      message: 'Carpeta creada',
      folder: {
        id: newFolder.getId(),
        name: newFolder.getName(),
        url: newFolder.getUrl(),
      },
    };
  } catch (error) {
    return { success: false, error: 'Error al crear carpeta: ' + error.message };
  }
}

// ============================================
// FUNCIONES DE ESTADÍSTICAS
// ============================================

function getStats() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // Conteos básicos
  const affiliatesSheet = spreadsheet.getSheetByName(SHEETS.AFFILIATES);
  const messagesSheet = spreadsheet.getSheetByName(SHEETS.MESSAGES);
  const volunteersSheet = spreadsheet.getSheetByName(SHEETS.VOLUNTEERS);
  const eventsSheet = spreadsheet.getSheetByName(SHEETS.EVENTS);

  const totalAffiliates = Math.max(0, affiliatesSheet.getLastRow() - 1);
  const totalMessages = Math.max(0, messagesSheet.getLastRow() - 1);
  const totalVolunteers = Math.max(0, volunteersSheet.getLastRow() - 1);
  const totalEvents = Math.max(0, eventsSheet.getLastRow() - 1);

  // Mensajes no leídos
  let unreadMessages = 0;
  if (totalMessages > 0) {
    const messagesData = messagesSheet.getDataRange().getValues();
    unreadMessages = messagesData.slice(1).filter((row) => row[7] === 'Nuevo').length;
  }

  // Afiliados por distrito
  const affiliatesByDistrict = {};
  // Afiliados por provincia
  const affiliatesByProvince = {};
  // Afiliados por estado
  const affiliatesByStatus = {};

  if (totalAffiliates > 0) {
    const affiliatesData = affiliatesSheet.getDataRange().getValues();
    affiliatesData.slice(1).forEach((row) => {
      // Por distrito
      const distrito = row[8] || 'Sin especificar';
      affiliatesByDistrict[distrito] = (affiliatesByDistrict[distrito] || 0) + 1;

      // Por provincia
      const provincia = row[9] || 'Sin especificar';
      affiliatesByProvince[provincia] = (affiliatesByProvince[provincia] || 0) + 1;

      // Por estado
      const estado = row[10] || 'Pendiente';
      affiliatesByStatus[estado] = (affiliatesByStatus[estado] || 0) + 1;
    });
  }

  // Afiliados últimos 7 días
  let recentAffiliates = 0;
  // Afiliados últimos 30 días
  let monthlyAffiliates = 0;
  if (totalAffiliates > 0) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const affiliatesData = affiliatesSheet.getDataRange().getValues();
    affiliatesData.slice(1).forEach((row) => {
      const fecha = new Date(row[1]);
      if (fecha >= sevenDaysAgo) recentAffiliates++;
      if (fecha >= thirtyDaysAgo) monthlyAffiliates++;
    });
  }

  // Voluntarios por área
  const volunteersByArea = {};
  // Voluntarios por estado
  const volunteersByStatus = {};
  if (totalVolunteers > 0) {
    const volunteersData = volunteersSheet.getDataRange().getValues();
    volunteersData.slice(1).forEach((row) => {
      // Por área
      const areas = (row[8] || '').split(', ');
      areas.forEach((area) => {
        if (area) {
          volunteersByArea[area] = (volunteersByArea[area] || 0) + 1;
        }
      });

      // Por estado
      const estado = row[10] || 'Pendiente';
      volunteersByStatus[estado] = (volunteersByStatus[estado] || 0) + 1;
    });
  }

  // Próximos eventos
  let upcomingEvents = 0;
  if (totalEvents > 0) {
    const today = new Date();
    const eventsData = eventsSheet.getDataRange().getValues();
    upcomingEvents = eventsData.slice(1).filter((row) => {
      return new Date(row[3]) >= today && row[7] !== 'Cancelado';
    }).length;
  }

  return {
    success: true,
    data: {
      totalAffiliates,
      totalMessages,
      totalVolunteers,
      totalEvents,
      unreadMessages,
      recentAffiliates,
      monthlyAffiliates,
      upcomingEvents,
      affiliatesByDistrict,
      affiliatesByProvince,
      affiliatesByStatus,
      volunteersByArea,
      volunteersByStatus,
      lastUpdated: new Date().toISOString(),
    },
  };
}

// ============================================
// FUNCIONES DE CONFIGURACIÓN
// ============================================

function getConfig() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.CONFIG);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { success: true, data: {} };

  const config = {};
  data.slice(1).forEach((row) => {
    if (row[0]) {
      config[row[0]] = {
        value: row[1],
        description: row[2],
      };
    }
  });

  return { success: true, data: config };
}

function updateConfig(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(SHEETS.CONFIG);
  const sheetData = sheet.getDataRange().getValues();

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === data.key) {
      sheet.getRange(i + 1, 2).setValue(data.value);
      return { success: true, message: 'Configuración actualizada' };
    }
  }

  // Si no existe, agregar nueva
  sheet.appendRow([data.key, data.value, data.description || '']);
  return { success: true, message: 'Configuración agregada' };
}

function validateLogin(password) {
  const config = getConfig();
  if (config.success && config.data.ADMIN_PASSWORD) {
    if (config.data.ADMIN_PASSWORD.value === password) {
      return { success: true, message: 'Login exitoso' };
    }
  }
  return { success: false, error: 'Contraseña incorrecta' };
}

function shouldNotify(configKey) {
  const config = getConfig();
  if (config.success && config.data[configKey]) {
    return config.data[configKey].value === 'true';
  }
  return true; // Por defecto, notificar
}

// ============================================
// FUNCIONES DE EMAIL
// ============================================

function sendAffiliateNotification(data) {
  const subject = `🎉 Nuevo Afiliado: ${data.nombre} ${data.apellidos}`;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Nuevo Afiliado</h1>
        <p style="color: white; margin: 5px 0;">Ahora Nación - Puno</p>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #dc2626; margin-top: 0;">Datos del Afiliado</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 140px;">Nombre:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.nombre} ${data.apellidos}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">DNI:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.dni}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.telefono}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email || 'No proporcionado'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Dirección:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.direccion || 'No proporcionada'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Distrito:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.distrito || 'No especificado'}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Provincia:</td><td style="padding: 10px;">${data.provincia || 'No especificada'}</td></tr>
        </table>
      </div>
      <div style="background: #1f2937; padding: 15px; text-align: center; color: white;">
        <p style="margin: 5px 0;">📅 Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
        <p style="margin: 10px 0; font-size: 12px; color: #9ca3af;">Dra. Mirella Camapaza - Candidata N° 4</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    subject: subject,
    htmlBody: body,
  });
}

function sendMessageNotification(data) {
  const subject = `📩 Nuevo Mensaje: ${data.asunto || 'Sin asunto'}`;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Nuevo Mensaje</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p><strong>De:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email || 'No proporcionado'}</p>
        <p><strong>Teléfono:</strong> ${data.telefono || 'No proporcionado'}</p>
        <p><strong>Asunto:</strong> ${data.asunto || 'Sin asunto'}</p>
        <hr style="border: 1px solid #ddd; margin: 15px 0;">
        <p><strong>Mensaje:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
          ${data.mensaje}
        </div>
      </div>
      <div style="background: #1f2937; padding: 15px; text-align: center; color: white;">
        <p style="margin: 5px 0;">📅 Recibido: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    subject: subject,
    htmlBody: body,
  });
}

function sendVolunteerNotification(data) {
  const subject = `🤝 Nuevo Voluntario: ${data.nombre} ${data.apellidos}`;
  const areasInteres = Array.isArray(data.areasInteres)
    ? data.areasInteres.join(', ')
    : data.areasInteres || 'No especificadas';

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Nuevo Voluntario</h1>
        <p style="color: white; margin: 5px 0;">Ahora Nación - Puno</p>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 140px;">Nombre:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.nombre} ${data.apellidos}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">DNI:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.dni || 'No proporcionado'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.telefono}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email || 'No proporcionado'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Distrito:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.distrito || 'No especificado'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Áreas de interés:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${areasInteres}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Disponibilidad:</td><td style="padding: 10px;">${data.disponibilidad || 'No especificada'}</td></tr>
        </table>
      </div>
      <div style="background: #1f2937; padding: 15px; text-align: center; color: white;">
        <p style="margin: 5px 0;">📅 Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    subject: subject,
    htmlBody: body,
  });
}

function sendReplyEmail(to, name, message) {
  const subject = 'Respuesta - Dra. Mirella Camapaza | Ahora Nación';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Dra. Mirella Camapaza</h1>
        <p style="color: white; margin: 5px 0;">Candidata a Diputada por Puno N° 4</p>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <p>Estimado/a <strong>${name}</strong>,</p>
        <p>Gracias por comunicarte con nosotros. A continuación nuestra respuesta:</p>
        <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 4px;">
          ${message}
        </div>
        <p>Si tienes alguna otra consulta, no dudes en contactarnos.</p>
        <p style="margin-top: 20px;"><strong>¡Juntos por un Puno mejor!</strong></p>
      </div>

      <div style="background: #1f2937; padding: 20px; text-align: center; color: white;">
        <p style="margin: 5px 0;">📱 WhatsApp: +51 964 271 720</p>
        <p style="margin: 5px 0;">📧 dra.mirella.camapaza.4@gmail.com</p>
        <p style="margin: 15px 0;">
          <a href="https://www.facebook.com/ahoranacionilave/" style="color: #60a5fa; margin: 0 10px; text-decoration: none;">Facebook</a> |
          <a href="https://www.instagram.com/dramirellacamapaza/" style="color: #60a5fa; margin: 0 10px; text-decoration: none;">Instagram</a> |
          <a href="https://www.tiktok.com/@dramirellacamapaza" style="color: #60a5fa; margin: 0 10px; text-decoration: none;">TikTok</a>
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">AHORA NACIÓN - Elecciones 2026</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: to,
    subject: subject,
    htmlBody: body,
  });
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj;
}

// Función de prueba
function testApi() {
  Logger.log('=== Test de API ===');
  Logger.log('Config: ' + JSON.stringify(getConfig()));
  Logger.log('Stats: ' + JSON.stringify(getStats()));
}

// ============================================
// FUNCIONES DE SENTIMIENTOS
// ============================================

/**
 * Obtiene los sentimientos con filtros opcionales
 * Columnas: Autor, Responde_A, Comentario, Sentimiento, Tema,
 * Categoria, Etiquetas, Nivel_Riesgo, Todas_Categorias, Detalle, Tiempo, Editado
 */
function getSentiments(params) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.SENTIMENTS);

  if (!sheet) {
    return { success: false, error: 'Hoja de Sentimientos no encontrada' };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return { success: true, data: [], total: 0 };
  }

  const headers = data[0];
  let sentiments = [];

  // Mapear indices de columnas
  const colIndex = {
    Autor: headers.indexOf('Autor'),
    Responde_A: headers.indexOf('Responde_A'),
    Comentario: headers.indexOf('Comentario'),
    Sentimiento: headers.indexOf('Sentimiento'),
    Tema: headers.indexOf('Tema'),
    Categoria: headers.indexOf('Categoria'),
    Etiquetas: headers.indexOf('Etiquetas'),
    Nivel_Riesgo: headers.indexOf('Nivel_Riesgo'),
    Todas_Categorias: headers.indexOf('Todas_Categorias'),
    Detalle: headers.indexOf('Detalle'),
    Tiempo: headers.indexOf('Tiempo'),
    Editado: headers.indexOf('Editado'),
  };

  // Procesar filas
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const sentiment = {
      ID: String(i),
      Autor: colIndex.Autor >= 0 ? String(row[colIndex.Autor] || '') : '',
      Responde_A: colIndex.Responde_A >= 0 ? String(row[colIndex.Responde_A] || '') : '',
      Comentario: colIndex.Comentario >= 0 ? String(row[colIndex.Comentario] || '') : '',
      Sentimiento: colIndex.Sentimiento >= 0 ? String(row[colIndex.Sentimiento] || 'neutro').toLowerCase() : 'neutro',
      Tema: colIndex.Tema >= 0 ? String(row[colIndex.Tema] || '') : '',
      Categoria: colIndex.Categoria >= 0 ? String(row[colIndex.Categoria] || '') : '',
      Etiquetas: colIndex.Etiquetas >= 0 ? String(row[colIndex.Etiquetas] || '') : '',
      Nivel_Riesgo: colIndex.Nivel_Riesgo >= 0 ? String(row[colIndex.Nivel_Riesgo] || '') : '',
      Todas_Categorias: colIndex.Todas_Categorias >= 0 ? String(row[colIndex.Todas_Categorias] || '') : '',
      Detalle: colIndex.Detalle >= 0 ? String(row[colIndex.Detalle] || '') : '',
      Tiempo: colIndex.Tiempo >= 0 ? String(row[colIndex.Tiempo] || '') : '',
      Editado: colIndex.Editado >= 0 ? String(row[colIndex.Editado] || '') : '',
    };

    // Solo agregar si tiene comentario
    if (sentiment.Comentario.trim()) {
      sentiments.push(sentiment);
    }
  }

  // Aplicar filtros
  if (params.sentimiento) {
    sentiments = sentiments.filter(s => s.Sentimiento === params.sentimiento.toLowerCase());
  }

  if (params.categoria) {
    sentiments = sentiments.filter(s =>
      s.Categoria.toLowerCase().includes(params.categoria.toLowerCase())
    );
  }

  if (params.nivelRiesgo) {
    sentiments = sentiments.filter(s =>
      s.Nivel_Riesgo.toLowerCase().includes(params.nivelRiesgo.toLowerCase())
    );
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    sentiments = sentiments.filter(s =>
      s.Comentario.toLowerCase().includes(searchLower) ||
      s.Autor.toLowerCase().includes(searchLower) ||
      s.Tema.toLowerCase().includes(searchLower)
    );
  }

  // Ordenar por mas recientes primero (ID descendente)
  sentiments.sort((a, b) => parseInt(b.ID) - parseInt(a.ID));

  // Paginacion
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 50;
  const startIndex = (page - 1) * limit;
  const paginatedData = sentiments.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedData,
    total: sentiments.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(sentiments.length / limit),
  };
}

/**
 * Obtiene estadisticas de sentimientos
 */
function getSentimentStats() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.SENTIMENTS);

  if (!sheet) {
    return { success: false, error: 'Hoja de Sentimientos no encontrada' };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return {
      success: true,
      data: {
        total: 0,
        positivos: 0,
        negativos: 0,
        neutros: 0,
        categorias: {},
        nivelesRiesgo: {},
      },
    };
  }

  const headers = data[0];
  const sentimientoCol = headers.indexOf('Sentimiento');
  const categoriaCol = headers.indexOf('Categoria');
  const riesgoCol = headers.indexOf('Nivel_Riesgo');

  let stats = {
    total: 0,
    positivos: 0,
    negativos: 0,
    neutros: 0,
    categorias: {},
    nivelesRiesgo: {},
  };

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Contar por sentimiento
    const sentimiento = sentimientoCol >= 0 ? String(row[sentimientoCol] || '').toLowerCase() : '';
    if (sentimiento) {
      stats.total++;
      if (sentimiento === 'positivo') stats.positivos++;
      else if (sentimiento === 'negativo') stats.negativos++;
      else stats.neutros++;
    }

    // Contar por categoria
    const categoria = categoriaCol >= 0 ? String(row[categoriaCol] || '') : '';
    if (categoria) {
      stats.categorias[categoria] = (stats.categorias[categoria] || 0) + 1;
    }

    // Contar por nivel de riesgo
    const riesgo = riesgoCol >= 0 ? String(row[riesgoCol] || '') : '';
    if (riesgo) {
      stats.nivelesRiesgo[riesgo] = (stats.nivelesRiesgo[riesgo] || 0) + 1;
    }
  }

  return { success: true, data: stats };
}

// ============================================
// FUNCIONES DE GEMINI AI
// ============================================

/**
 * Genera una respuesta usando Gemini AI
 */
function generateAIResponse(data) {
  const { comentario, tono = 'profesional' } = data;

  if (!comentario || !comentario.trim()) {
    return { success: false, error: 'El comentario es requerido' };
  }

  try {
    const respuesta = callGeminiAPI(comentario, tono);
    return {
      success: true,
      data: {
        respuesta: respuesta,
        tono: tono,
        puntosClave: [],
      },
    };
  } catch (error) {
    return { success: false, error: 'Error al generar respuesta: ' + error.message };
  }
}

/**
 * Llama a la API de IA configurada (DeepSeek o Gemini)
 */
function callGeminiAPI(comentario, tono) {
  // Usar el proveedor configurado
  if (CONFIG.AI_PROVIDER === 'deepseek') {
    return callDeepSeekAPI(comentario, tono);
  }
  return callGeminiAPIReal(comentario, tono);
}

/**
 * Llama a la API de DeepSeek (más económica y sin límites estrictos)
 * Formato compatible con OpenAI
 */
function callDeepSeekAPI(comentario, tono) {
  const apiKey = CONFIG.DEEPSEEK_API_KEY;
  const apiUrl = 'https://api.deepseek.com/chat/completions';

  // Construir el prompt con contexto de campaña
  const prompt = buildCampaignPrompt(comentario, tono);

  const payload = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente de campaña política. Responde de forma concisa y profesional.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 256,
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode !== 200) {
    Logger.log('DeepSeek Error: ' + responseText);
    throw new Error(`Error de API DeepSeek: ${responseCode} - ${responseText}`);
  }

  const responseData = JSON.parse(responseText);

  // Extraer la respuesta (formato OpenAI)
  if (responseData.choices &&
      responseData.choices[0] &&
      responseData.choices[0].message &&
      responseData.choices[0].message.content) {
    return responseData.choices[0].message.content;
  }

  throw new Error('Respuesta inesperada de DeepSeek API');
}

/**
 * Llama a la API de Gemini (backup)
 */
function callGeminiAPIReal(comentario, tono) {
  const apiKey = CONFIG.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

  const prompt = buildCampaignPrompt(comentario, tono);

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode !== 200) {
    throw new Error(`Error de API Gemini: ${responseCode} - ${responseText}`);
  }

  const responseData = JSON.parse(responseText);

  if (responseData.candidates &&
      responseData.candidates[0] &&
      responseData.candidates[0].content &&
      responseData.candidates[0].content.parts &&
      responseData.candidates[0].content.parts[0]) {
    return responseData.candidates[0].content.parts[0].text;
  }

  throw new Error('Respuesta inesperada de Gemini API');
}

/**
 * Construye el prompt simplificado
 */
function buildCampaignPrompt(comentario, tono) {
  const c = CANDIDATA_INFO;
  return `Responde este comentario de redes sociales defendiendo a ${c.nombre}, ${c.cargo} N°${c.numero} del partido ${c.partido}. Es ${c.titulos} con experiencia en ${c.experiencia}. Propuestas: ${c.propuestas}. Tono ${tono}. Maximo 2-3 oraciones. Sin emojis. Solo el texto de respuesta.

Comentario: "${comentario}"

Respuesta:`;
}

// Función para probar la API de Gemini y solicitar permisos
function testGeminiAPI() {
  try {
    const testComment = "Este es un comentario de prueba";
    const result = generateAIResponse({ comentario: testComment, tono: 'profesional' });
    Logger.log('Resultado: ' + JSON.stringify(result));
    return result;
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// FUNCIÓN DE DIAGNÓSTICO - EJECUTAR DESDE EL EDITOR
// ============================================

/**
 * Ejecuta esta función para probar DeepSeek
 * Menú: Ejecutar > diagnosticoDeepSeek
 */
function diagnosticoDeepSeek() {
  Logger.log('=== DIAGNÓSTICO DE DEEPSEEK API ===');
  Logger.log('');

  // 1. Verificar API Key
  const hasKey = CONFIG.DEEPSEEK_API_KEY && CONFIG.DEEPSEEK_API_KEY !== 'TU_DEEPSEEK_API_KEY_AQUI';
  Logger.log('1. API Key configurada: ' + (hasKey ? 'SI' : 'NO - Configura tu API key en CONFIG.DEEPSEEK_API_KEY'));

  if (!hasKey) {
    Logger.log('');
    Logger.log('=== NECESITAS CONFIGURAR LA API KEY ===');
    Logger.log('1. Ve a https://platform.deepseek.com/');
    Logger.log('2. Crea una cuenta o inicia sesión');
    Logger.log('3. Ve a "API Keys" y crea una nueva');
    Logger.log('4. Copia la key y reemplaza "TU_DEEPSEEK_API_KEY_AQUI" en CONFIG');
    return { success: false, error: 'API Key no configurada' };
  }

  Logger.log('2. Proveedor activo: ' + CONFIG.AI_PROVIDER);
  Logger.log('');
  Logger.log('3. Probando conexión con DeepSeek API...');

  try {
    const apiUrl = 'https://api.deepseek.com/chat/completions';

    const payload = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Responde solo: OK' }],
      max_tokens: 10,
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + CONFIG.DEEPSEEK_API_KEY },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const code = response.getResponseCode();
    const body = response.getContentText();

    Logger.log('4. Código de respuesta: ' + code);

    if (code === 200) {
      const data = JSON.parse(body);
      if (data.choices && data.choices[0]) {
        const text = data.choices[0].message.content;
        Logger.log('5. ÉXITO - Respuesta: ' + text);
        Logger.log('');
        Logger.log('=== DEEPSEEK FUNCIONA CORRECTAMENTE ===');
        return { success: true, message: 'DeepSeek API funciona correctamente', response: text };
      }
    } else {
      Logger.log('5. ERROR - Respuesta: ' + body);
      const errorData = JSON.parse(body);
      Logger.log('6. Mensaje de error: ' + (errorData.error?.message || 'Desconocido'));
      Logger.log('');
      Logger.log('=== HAY UN PROBLEMA ===');
      return { success: false, code: code, error: errorData };
    }
  } catch (error) {
    Logger.log('ERROR DE CONEXIÓN: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecuta esta función desde el editor para diagnosticar Gemini
 * Menú: Ejecutar > diagnosticoGemini
 */
function diagnosticoGemini() {
  Logger.log('=== DIAGNÓSTICO DE GEMINI API ===');
  Logger.log('');

  // 1. Verificar API Key
  Logger.log('1. API Key configurada: ' + (CONFIG.GEMINI_API_KEY ? 'SI (' + CONFIG.GEMINI_API_KEY.substring(0, 10) + '...)' : 'NO'));

  // 2. Verificar URL del modelo
  const expectedModel = 'gemini-2.0-flash-lite';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${expectedModel}:generateContent`;
  Logger.log('2. Modelo esperado: ' + expectedModel);
  Logger.log('3. URL base: ' + apiUrl);

  // 3. Probar conexión simple
  Logger.log('');
  Logger.log('4. Probando conexión con Gemini API...');

  try {
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${expectedModel}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: 'Responde solo: OK' }] }],
      generationConfig: { maxOutputTokens: 10 }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(testUrl, options);
    const code = response.getResponseCode();
    const body = response.getContentText();

    Logger.log('5. Código de respuesta: ' + code);

    if (code === 200) {
      const data = JSON.parse(body);
      if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        Logger.log('6. ÉXITO - Respuesta: ' + text);
        Logger.log('');
        Logger.log('=== TODO FUNCIONA CORRECTAMENTE ===');
        return { success: true, message: 'Gemini API funciona correctamente', response: text };
      }
    } else {
      Logger.log('6. ERROR - Respuesta: ' + body);
      const errorData = JSON.parse(body);
      Logger.log('7. Mensaje de error: ' + (errorData.error?.message || 'Desconocido'));
      Logger.log('');
      Logger.log('=== HAY UN PROBLEMA ===');
      return { success: false, code: code, error: errorData };
    }
  } catch (error) {
    Logger.log('ERROR DE CONEXIÓN: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Lista los modelos disponibles de Gemini
 */
function listarModelosGemini() {
  Logger.log('=== MODELOS DISPONIBLES ===');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${CONFIG.GEMINI_API_KEY}`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    Logger.log('Modelos que soportan generateContent:');
    data.models.forEach(model => {
      if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
        Logger.log('- ' + model.name + ' (displayName: ' + model.displayName + ')');
      }
    });

    return data.models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
  } catch (error) {
    Logger.log('Error: ' + error.message);
    return { error: error.message };
  }
}
