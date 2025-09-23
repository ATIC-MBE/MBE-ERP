import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const department = req.query.department as string;

  // Validar departamento
  const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'mydmaster', 'rrhhmaster', 'propietario', 'superadmin'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      error: 'Departamento no válido',
      validDepartments
    });
  }

  if (req.method === 'GET') {
    try {
      const { getDepartmentCalendarService, getDepartmentCalendarId } = await import('../../../../services/GoogleCalendarService');

      const { timeMin, timeMax, maxResults = 500 } = req.query;

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

  } else if (req.method === 'POST') {
    try {
      const { getDepartmentCalendarService, getDepartmentCalendarId } = await import('../../../../services/GoogleCalendarService');

      const eventData = req.body;

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

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}