import { NextApiRequest, NextApiResponse } from 'next';
import GoogleCalendarService, { DEPARTMENT_CALENDARS } from '../../../services/GoogleCalendarService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const calendarService = new GoogleCalendarService();
  const { eventId } = req.query;
  const department = req.query.department as string || req.headers['x-user-department'] as string;

  if (!department) {
    return res.status(400).json({
      error: 'Departamento requerido',
      message: 'Debe especificar el departamento para acceder al calendario'
    });
  }

  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({
      error: 'ID de evento requerido',
      message: 'Debe especificar un ID de evento válido'
    });
  }

  const calendarId = DEPARTMENT_CALENDARS[department as keyof typeof DEPARTMENT_CALENDARS];

  if (!calendarId) {
    return res.status(400).json({
      error: 'Departamento no válido',
      message: 'El departamento especificado no tiene calendario configurado'
    });
  }

  try {
    switch (req.method) {
      case 'PUT':
        return await updateEvent(req, res, calendarService, calendarId, eventId);

      case 'DELETE':
        return await deleteEvent(req, res, calendarService, calendarId, eventId);

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    console.error('Calendar API Error:', error);
    return res.status(500).json({
      error: 'Error del servidor',
      message: 'Error interno al procesar la solicitud del calendario'
    });
  }
}

async function updateEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  calendarService: GoogleCalendarService,
  calendarId: string,
  eventId: string
) {
  try {
    const { title, description, startDateTime, endDateTime, location, attendees } = req.body;

    // TODO: Configurar credenciales OAuth2
    // calendarService.setCredentials(tokens);

    const event = await calendarService.updateEvent(calendarId, eventId, {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      attendees
    });

    return res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({
      error: 'Error al actualizar evento',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}

async function deleteEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  calendarService: GoogleCalendarService,
  calendarId: string,
  eventId: string
) {
  try {
    // TODO: Configurar credenciales OAuth2
    // calendarService.setCredentials(tokens);

    await calendarService.deleteEvent(calendarId, eventId);

    return res.status(200).json({
      success: true,
      message: 'Evento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({
      error: 'Error al eliminar evento',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}