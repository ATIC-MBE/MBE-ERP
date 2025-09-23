import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  creator?: {
    email: string;
    displayName?: string;
  };
}

export class GoogleCalendarService {
  private calendar;
  private auth: OAuth2Client;

  constructor() {
    // Configurar OAuth2
    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  // Configurar tokens de acceso para un usuario/departamento
  setCredentials(tokens: any) {
    this.auth.setCredentials(tokens);
  }

  // Obtener eventos de un calendario específico
  async getEvents(
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string,
    maxResults: number = 50
  ): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Sin título',
        description: event.description,
        start: {
          dateTime: event.start?.dateTime || event.start?.date,
          timeZone: event.start?.timeZone,
        },
        end: {
          dateTime: event.end?.dateTime || event.end?.date,
          timeZone: event.end?.timeZone,
        },
        location: event.location,
        attendees: event.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.displayName,
        })),
        creator: {
          email: event.creator?.email,
          displayName: event.creator?.displayName,
        },
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Error al obtener eventos del calendario');
    }
  }

  // Crear un nuevo evento
  async createEvent(
    calendarId: string = 'primary',
    eventData: {
      title: string;
      description?: string;
      startDateTime: string;
      endDateTime: string;
      timeZone?: string;
      location?: string;
      attendees?: string[];
    }
  ): Promise<CalendarEvent> {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'Europe/Madrid',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'Europe/Madrid',
        },
        location: eventData.location,
        attendees: eventData.attendees?.map(email => ({ email })),
      };

      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      return {
        id: response.data.id!,
        title: response.data.summary!,
        description: response.data.description || undefined,
        start: {
          dateTime: response.data.start!.dateTime || response.data.start!.date || '',
          timeZone: response.data.start!.timeZone || undefined,
        },
        end: {
          dateTime: response.data.end!.dateTime || response.data.end!.date || '',
          timeZone: response.data.end!.timeZone || undefined,
        },
        location: response.data.location || undefined,
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Error al crear evento en el calendario');
    }
  }

  // Obtener lista de calendarios disponibles
  async getCalendarsList() {
    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items?.map((calendar: any) => ({
        id: calendar.id,
        summary: calendar.summary,
        description: calendar.description,
        primary: calendar.primary || false,
        backgroundColor: calendar.backgroundColor,
      })) || [];
    } catch (error) {
      console.error('Error fetching calendars list:', error);
      throw new Error('Error al obtener lista de calendarios');
    }
  }

  // Actualizar un evento existente
  async updateEvent(
    calendarId: string = 'primary',
    eventId: string,
    eventData: Partial<{
      title: string;
      description: string;
      startDateTime: string;
      endDateTime: string;
      timeZone: string;
      location: string;
      attendees: string[];
    }>
  ): Promise<CalendarEvent> {
    try {
      const event: any = {};

      if (eventData.title) event.summary = eventData.title;
      if (eventData.description !== undefined) event.description = eventData.description;
      if (eventData.location !== undefined) event.location = eventData.location;

      if (eventData.startDateTime) {
        event.start = {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'Europe/Madrid',
        };
      }

      if (eventData.endDateTime) {
        event.end = {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'Europe/Madrid',
        };
      }

      if (eventData.attendees) {
        event.attendees = eventData.attendees.map(email => ({ email }));
      }

      const response = await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });

      return {
        id: response.data.id!,
        title: response.data.summary!,
        description: response.data.description || undefined,
        start: {
          dateTime: response.data.start!.dateTime || response.data.start!.date || '',
          timeZone: response.data.start!.timeZone || undefined,
        },
        end: {
          dateTime: response.data.end!.dateTime || response.data.end!.date || '',
          timeZone: response.data.end!.timeZone || undefined,
        },
        location: response.data.location || undefined,
      };
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Error al actualizar evento del calendario');
    }
  }

  // Eliminar un evento
  async deleteEvent(calendarId: string = 'primary', eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Error al eliminar evento del calendario');
    }
  }
}

// Configuración de calendarios por departamento
export const DEPARTMENT_CALENDARS = {
  admin: process.env.CALENDAR_ADMIN_ID || 'primary',
  aca: process.env.CALENDAR_ACA_ID || 'primary',
  atic: process.env.CALENDAR_ATIC_ID || 'primary',
  rrhh: process.env.CALENDAR_RRHH_ID || 'primary',
  rrhhmaster: process.env.CALENDAR_RRHHMASTER_ID || 'primary',
  ceo: process.env.CALENDAR_CEO_ID || 'primary',
  ade: process.env.CALENDAR_ADE_ID || 'primary',
  myd: process.env.CALENDAR_MYD_ID || 'primary',
  mydmaster: process.env.CALENDAR_MYD_ID || 'primary', // mydmaster usa el mismo calendario que myd
  propietario: process.env.CALENDAR_PROPIETARIO_ID || 'primary',
  superadmin: process.env.CALENDAR_SUPERADMIN_ID || 'primary',
};

// Configuración de tokens por departamento
export const DEPARTMENT_TOKENS = {
  admin: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_ADMIN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_ADMIN,
  },
  aca: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_ACA,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_ACA,
  },
  atic: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_ATIC,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_ATIC,
  },
  rrhh: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_RRHH,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_RRHH,
  },
  rrhhmaster: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_RRHHMASTER,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_RRHHMASTER,
  },
  ceo: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_CEO,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_CEO,
  },
  ade: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_ADE,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_ADE,
  },
  myd: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_MYD,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_MYD,
  },
  mydmaster: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_MYD,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_MYD,
  }, // mydmaster usa los mismos tokens que myd
  propietario: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_PROPIETARIO,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_PROPIETARIO,
  },
  superadmin: {
    access_token: process.env.GOOGLE_ACCESS_TOKEN_SUPERADMIN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_SUPERADMIN,
  },
};

// Función para obtener servicio de calendario configurado para un departamento
export function getDepartmentCalendarService(department: string): GoogleCalendarService {
  const service = new GoogleCalendarService();
  const tokens = DEPARTMENT_TOKENS[department as keyof typeof DEPARTMENT_TOKENS];

  if (tokens && tokens.access_token) {
    service.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }

  return service;
}

// Función para obtener el ID de calendario de un departamento
export function getDepartmentCalendarId(department: string): string {
  return DEPARTMENT_CALENDARS[department as keyof typeof DEPARTMENT_CALENDARS] || 'primary';
}

export default GoogleCalendarService;