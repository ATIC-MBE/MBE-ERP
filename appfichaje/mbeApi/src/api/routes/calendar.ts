import { Router } from 'express';
import { getDepartmentCalendarService, getDepartmentCalendarId } from '../../services/GoogleCalendarService';

const router = Router();

// Obtener eventos de calendario por departamento
router.get('/events/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const { timeMin, timeMax, maxResults = 50 } = req.query;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const calendarService = getDepartmentCalendarService(department);
    const calendarId = getDepartmentCalendarId(department);

    const events = await calendarService.getEvents(
      calendarId,
      timeMin as string,
      timeMax as string,
      parseInt(maxResults as string)
    );

    res.json({
      success: true,
      department,
      calendarId,
      events,
      count: events.length
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({
      error: 'Error al obtener eventos del calendario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Crear nuevo evento en calendario departamental
router.post('/events/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const eventData = req.body;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    // Validar datos del evento
    if (!eventData.title || !eventData.startDateTime || !eventData.endDateTime) {
      return res.status(400).json({
        error: 'Datos del evento incompletos',
        required: ['title', 'startDateTime', 'endDateTime']
      });
    }

    const calendarService = getDepartmentCalendarService(department);
    const calendarId = getDepartmentCalendarId(department);

    const newEvent = await calendarService.createEvent(calendarId, eventData);

    res.status(201).json({
      success: true,
      department,
      calendarId,
      event: newEvent
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({
      error: 'Error al crear evento en el calendario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Actualizar evento existente
router.put('/events/:department/:eventId', async (req, res) => {
  try {
    const { department, eventId } = req.params;
    const eventData = req.body;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const calendarService = getDepartmentCalendarService(department);
    const calendarId = getDepartmentCalendarId(department);

    const updatedEvent = await calendarService.updateEvent(calendarId, eventId, eventData);

    res.json({
      success: true,
      department,
      calendarId,
      event: updatedEvent
    });

  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({
      error: 'Error al actualizar evento del calendario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Eliminar evento
router.delete('/events/:department/:eventId', async (req, res) => {
  try {
    const { department, eventId } = req.params;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const calendarService = getDepartmentCalendarService(department);
    const calendarId = getDepartmentCalendarId(department);

    await calendarService.deleteEvent(calendarId, eventId);

    res.json({
      success: true,
      department,
      calendarId,
      message: 'Evento eliminado correctamente'
    });

  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({
      error: 'Error al eliminar evento del calendario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Obtener lista de calendarios disponibles para un departamento
router.get('/calendars/:department', async (req, res) => {
  try {
    const { department } = req.params;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const calendarService = getDepartmentCalendarService(department);
    const calendars = await calendarService.getCalendarsList();

    res.json({
      success: true,
      department,
      calendars
    });

  } catch (error) {
    console.error('Error fetching calendars list:', error);
    res.status(500).json({
      error: 'Error al obtener lista de calendarios',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint para verificar configuración de departamento
router.get('/config/:department', async (req, res) => {
  try {
    const { department } = req.params;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const calendarId = getDepartmentCalendarId(department);

    // Verificar si hay tokens configurados
    const hasTokens = process.env[`GOOGLE_ACCESS_TOKEN_${department.toUpperCase()}`] ? true : false;

    res.json({
      success: true,
      department,
      calendarId,
      hasTokens,
      isConfigured: hasTokens && calendarId !== 'primary'
    });

  } catch (error) {
    console.error('Error checking department config:', error);
    res.status(500).json({
      error: 'Error al verificar configuración del departamento',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;