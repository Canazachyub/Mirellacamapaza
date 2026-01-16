/**
 * =====================================================
 * CÓDIGO PARA AGREGAR A GOOGLE APPS SCRIPT
 * =====================================================
 *
 * INSTRUCCIONES:
 * 1. Ve a Google Apps Script: https://script.google.com
 * 2. Abre el proyecto de tu API
 * 3. Crea una nueva hoja en Google Sheets llamada "Tareas" con estas columnas:
 *    ID | Fecha | Titulo | EquipoID | EquipoNombre | AsignadoA | AsignadoNombre | Completado | FechaCompletado | FechaCreacion
 *
 * 4. Copia las funciones de abajo y agrégalas a tu código existente
 * 5. Actualiza el router doGet/doPost con los nuevos casos
 * 6. Despliega una nueva versión de la API
 */

// ============================================
// AGREGAR ESTOS CASOS AL ROUTER doGet
// ============================================

/*
En tu función doGet, agrega estos casos en el switch:

case 'getTasks':
  return jsonResponse(getTasks(params));

case 'getTeamVolunteers':
  return jsonResponse(getTeamVolunteers(params));
*/

// ============================================
// AGREGAR ESTOS CASOS AL ROUTER doPost
// ============================================

/*
En tu función doPost, agrega estos casos en el switch:

case 'addTask':
  return jsonResponse(addTask(data));

case 'updateTask':
  return jsonResponse(updateTask(data));

case 'toggleTaskComplete':
  return jsonResponse(toggleTaskComplete(data));

case 'deleteTask':
  return jsonResponse(deleteTask(data));

case 'addVolunteerToTeam':
  return jsonResponse(addVolunteerToTeam(data));

case 'removeVolunteerFromTeam':
  return jsonResponse(removeVolunteerFromTeam(data));
*/

// ============================================
// FUNCIONES PARA TAREAS DIARIAS
// ============================================

/**
 * Obtiene las tareas filtradas por equipo y/o fecha
 */
function getTasks(params) {
  try {
    const sheet = getSheet('Tareas');
    if (!sheet) {
      return { success: false, error: 'Hoja Tareas no encontrada' };
    }

    const data = getSheetData(sheet);
    let tasks = data;

    // Filtrar por equipo
    if (params.equipoId) {
      tasks = tasks.filter(t => t.EquipoID === params.equipoId);
    }

    // Filtrar por fecha (por defecto hoy)
    const fecha = params.fecha || getTodayDate();
    tasks = tasks.filter(t => t.Fecha === fecha);

    // Filtrar por asignado
    if (params.asignadoA) {
      tasks = tasks.filter(t => t.AsignadoA === params.asignadoA);
    }

    // Convertir Completado a boolean
    tasks = tasks.map(t => ({
      ...t,
      Completado: t.Completado === true || t.Completado === 'true' || t.Completado === 'TRUE'
    }));

    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Crea una nueva tarea
 */
function addTask(data) {
  try {
    const sheet = getSheet('Tareas');
    if (!sheet) {
      return { success: false, error: 'Hoja Tareas no encontrada' };
    }

    const id = generateId();
    const now = new Date();
    const fecha = data.fecha || getTodayDate();

    const row = [
      id,                           // ID
      fecha,                        // Fecha
      data.titulo,                  // Titulo
      data.equipoId,                // EquipoID
      data.equipoNombre || '',      // EquipoNombre
      data.asignadoA,               // AsignadoA
      data.asignadoNombre,          // AsignadoNombre
      false,                        // Completado
      '',                           // FechaCompletado
      now.toISOString()             // FechaCreacion
    ];

    sheet.appendRow(row);
    return { success: true, data: { id } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza una tarea
 */
function updateTask(data) {
  try {
    const sheet = getSheet('Tareas');
    if (!sheet) {
      return { success: false, error: 'Hoja Tareas no encontrada' };
    }

    const rowIndex = findRowById(sheet, data.id);
    if (!rowIndex) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    const headers = getHeaders(sheet);

    // Actualizar campos proporcionados
    if (data.Titulo !== undefined) {
      const col = headers.indexOf('Titulo') + 1;
      if (col > 0) sheet.getRange(rowIndex, col).setValue(data.Titulo);
    }

    if (data.AsignadoA !== undefined) {
      const col = headers.indexOf('AsignadoA') + 1;
      if (col > 0) sheet.getRange(rowIndex, col).setValue(data.AsignadoA);
    }

    if (data.AsignadoNombre !== undefined) {
      const col = headers.indexOf('AsignadoNombre') + 1;
      if (col > 0) sheet.getRange(rowIndex, col).setValue(data.AsignadoNombre);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Cambia el estado completado de una tarea
 */
function toggleTaskComplete(data) {
  try {
    const sheet = getSheet('Tareas');
    if (!sheet) {
      return { success: false, error: 'Hoja Tareas no encontrada' };
    }

    const rowIndex = findRowById(sheet, data.id);
    if (!rowIndex) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    const headers = getHeaders(sheet);

    // Actualizar Completado
    const completadoCol = headers.indexOf('Completado') + 1;
    if (completadoCol > 0) {
      sheet.getRange(rowIndex, completadoCol).setValue(data.completado);
    }

    // Actualizar FechaCompletado
    const fechaCompletadoCol = headers.indexOf('FechaCompletado') + 1;
    if (fechaCompletadoCol > 0) {
      if (data.completado) {
        sheet.getRange(rowIndex, fechaCompletadoCol).setValue(new Date().toISOString());
      } else {
        sheet.getRange(rowIndex, fechaCompletadoCol).setValue('');
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Elimina una tarea
 */
function deleteTask(data) {
  try {
    const sheet = getSheet('Tareas');
    if (!sheet) {
      return { success: false, error: 'Hoja Tareas no encontrada' };
    }

    const rowIndex = findRowById(sheet, data.id);
    if (!rowIndex) {
      return { success: false, error: 'Tarea no encontrada' };
    }

    sheet.deleteRow(rowIndex);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// FUNCIONES PARA VOLUNTARIOS DE EQUIPO
// ============================================

/**
 * Obtiene los voluntarios de un equipo específico
 */
function getTeamVolunteers(params) {
  try {
    const sheet = getSheet('Voluntarios');
    if (!sheet) {
      return { success: false, error: 'Hoja Voluntarios no encontrada' };
    }

    const data = getSheetData(sheet);

    // Filtrar por equipo (puede ser ID o nombre del equipo)
    const volunteers = data.filter(v =>
      v.Equipo === params.teamId ||
      v.Equipo === params.teamName
    );

    return { success: true, data: volunteers };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Asigna un voluntario a un equipo
 */
function addVolunteerToTeam(data) {
  try {
    const sheet = getSheet('Voluntarios');
    if (!sheet) {
      return { success: false, error: 'Hoja Voluntarios no encontrada' };
    }

    const rowIndex = findRowById(sheet, data.volunteerId);
    if (!rowIndex) {
      return { success: false, error: 'Voluntario no encontrado' };
    }

    const headers = getHeaders(sheet);
    const equipoCol = headers.indexOf('Equipo') + 1;

    if (equipoCol > 0) {
      // Guardamos el nombre del equipo para facilitar la identificación
      sheet.getRange(rowIndex, equipoCol).setValue(data.teamName || data.teamId);
    }

    // Actualizar contador de miembros del equipo
    updateTeamMemberCount(data.teamId);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Remueve un voluntario de su equipo
 */
function removeVolunteerFromTeam(data) {
  try {
    const sheet = getSheet('Voluntarios');
    if (!sheet) {
      return { success: false, error: 'Hoja Voluntarios no encontrada' };
    }

    const rowIndex = findRowById(sheet, data.volunteerId);
    if (!rowIndex) {
      return { success: false, error: 'Voluntario no encontrado' };
    }

    const headers = getHeaders(sheet);
    const equipoCol = headers.indexOf('Equipo') + 1;

    // Obtener el equipo actual antes de limpiar
    let currentTeam = '';
    if (equipoCol > 0) {
      currentTeam = sheet.getRange(rowIndex, equipoCol).getValue();
      sheet.getRange(rowIndex, equipoCol).setValue('');
    }

    // Actualizar contador de miembros del equipo anterior
    if (currentTeam) {
      updateTeamMemberCountByName(currentTeam);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza el contador de miembros de un equipo
 */
function updateTeamMemberCount(teamId) {
  try {
    const volunteerSheet = getSheet('Voluntarios');
    const teamSheet = getSheet('Equipos');

    if (!volunteerSheet || !teamSheet) return;

    // Contar voluntarios en este equipo
    const volunteers = getSheetData(volunteerSheet);
    const teamData = getSheetData(teamSheet);

    // Buscar el equipo
    const team = teamData.find(t => t.ID === teamId);
    if (!team) return;

    const count = volunteers.filter(v =>
      v.Equipo === teamId ||
      v.Equipo === team.Nombre
    ).length;

    // Actualizar Miembros en la hoja de Equipos
    const teamRowIndex = findRowById(teamSheet, teamId);
    if (teamRowIndex) {
      const headers = getHeaders(teamSheet);
      const miembrosCol = headers.indexOf('Miembros') + 1;
      if (miembrosCol > 0) {
        teamSheet.getRange(teamRowIndex, miembrosCol).setValue(count);
      }
    }
  } catch (error) {
    console.error('Error updating team member count:', error);
  }
}

/**
 * Actualiza el contador de miembros de un equipo por nombre
 */
function updateTeamMemberCountByName(teamName) {
  try {
    const volunteerSheet = getSheet('Voluntarios');
    const teamSheet = getSheet('Equipos');

    if (!volunteerSheet || !teamSheet) return;

    const teamData = getSheetData(teamSheet);
    const team = teamData.find(t => t.Nombre === teamName);

    if (team) {
      updateTeamMemberCount(team.ID);
    }
  } catch (error) {
    console.error('Error updating team member count by name:', error);
  }
}

// ============================================
// FUNCIONES AUXILIARES (si no existen)
// ============================================

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene una hoja por nombre
 * (Si ya tienes esta función, no la dupliques)
 */
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

/**
 * Obtiene los datos de una hoja como array de objetos
 * (Si ya tienes esta función, no la dupliques)
 */
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Obtiene los headers de una hoja
 * (Si ya tienes esta función, no la dupliques)
 */
function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/**
 * Busca una fila por ID
 * (Si ya tienes esta función, no la dupliques)
 */
function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return i + 1; // +1 porque los arrays empiezan en 0 pero las filas en 1
    }
  }
  return null;
}

/**
 * Genera un ID único
 * (Si ya tienes esta función, no la dupliques)
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Respuesta JSON estándar
 * (Si ya tienes esta función, no la dupliques)
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
