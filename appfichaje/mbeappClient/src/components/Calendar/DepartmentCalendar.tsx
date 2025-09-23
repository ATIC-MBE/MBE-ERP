import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css';
import EventModal from './EventModal';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
  description?: string;
  location?: string;
}

interface DepartmentCalendarProps {
  department: string;
  userRole?: string;
}

const DepartmentCalendar: React.FC<DepartmentCalendarProps> = ({
  department,
  userRole
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estados para el modal de enlaces
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalData, setLinkModalData] = useState<{
    event: CalendarEvent;
    googleLink?: string;
    descriptionLinks: string[];
  } | null>(null);

  // Cargar eventos del calendario
  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calcular rango de fechas según la vista actual
      let timeMin: string;
      let timeMax: string;

      // Usar rango fijo amplio para cargar todos los eventos
      // Septiembre completo más un margen
      timeMin = '2025-09-01T00:00:00.000Z';
      timeMax = '2025-09-30T23:59:59.999Z';

      console.log('🗓️ Loading events for:', department);
      console.log('📅 Date range:', { timeMin, timeMax });
      console.log('🔗 API URL:', `/api/calendar/events/${department}?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=500`);

      const response = await fetch(
        `/api/calendar/events/${department}?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=500`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar eventos del calendario');
      }

      const data = await response.json();

      if (data.success) {
        console.log('✅ API Response successful:', data);
        console.log('📊 Events received:', data.events.length);
        console.log('📋 All raw events from API:', data.events.slice(0, 10)); // Mostrar primeros 10 eventos

        // Convertir eventos a formato react-big-calendar
        const formattedEvents: CalendarEvent[] = data.events.map((event: any) => {
          console.log('🔧 Processing event:', event);

          // Manejar diferentes formatos de fecha de Google Calendar
          let startDate: string;
          let endDate: string;

          // Google Calendar puede devolver dateTime (con hora) o date (solo fecha)
          if (event.start) {
            startDate = event.start.dateTime || event.start.date;
          } else {
            startDate = event.startTime || event.start || new Date().toISOString();
          }

          if (event.end) {
            endDate = event.end.dateTime || event.end.date;
          } else {
            endDate = event.endTime || event.end || new Date().toISOString();
          }

          console.log('📅 Start date:', startDate, 'End date:', endDate);

          // Crear fechas válidas
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);

          // Verificar que las fechas sean válidas
          if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            console.warn('⚠️ Invalid date detected for event:', event.id, { startDate, endDate });
            return null; // Saltar este evento si las fechas no son válidas
          }

          const formattedEvent = {
            id: event.id || `event-${Math.random()}`,
            title: event.summary || event.title || 'Sin título',
            start: startDateObj,
            end: endDateObj,
            resource: {
              description: event.description,
              location: event.location,
              creator: event.creator,
              attendees: event.attendees,
              htmlLink: event.htmlLink,
              status: event.status
            }
          };

          console.log('✨ Formatted event:', formattedEvent);
          return formattedEvent;
        }).filter(Boolean); // Filtrar eventos nulos

        console.log('🎯 Formatted events:', formattedEvents.slice(0, 3)); // Log first 3 events
        console.log('📊 Total formatted events count:', formattedEvents.length);
        console.log('🔍 Sample event structure:', formattedEvents[0]);
        setEvents(formattedEvents);
      } else {
        throw new Error(data.message || 'Error al procesar eventos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar eventos cuando cambie el departamento, la fecha o la vista
  useEffect(() => {
    if (department) {
      loadEvents();
    }
  }, [department, date, view]);

  // Configurar mensajes en español
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este período',
    showMore: (total: number) => `+ Ver ${total} más`,
  };

  // Estilos personalizados para eventos - Tema Oscuro ERP
  const eventStyleGetter = () => {
    const departmentColors: { [key: string]: { primary: string, secondary: string, accent: string } } = {
      admin: { primary: '#dc3545', secondary: '#c82333', accent: '#ff6b7a' },
      aca: { primary: '#fd7e14', secondary: '#e55100', accent: '#ff9800' },
      atic: { primary: '#20c997', secondary: '#17a2b8', accent: '#4dd0e7' },
      rrhh: { primary: '#007bff', secondary: '#0056b3', accent: '#66b3ff' },
      ceo: { primary: '#6c757d', secondary: '#545b62', accent: '#9ca3af' },
      ade: { primary: '#28a745', secondary: '#1e7e34', accent: '#5cb85c' },
      myd: { primary: '#ffc107', secondary: '#e0a800', accent: '#ffdd57' },
      propietario: { primary: '#17a2b8', secondary: '#138496', accent: '#5bc0de' },
      superadmin: { primary: '#6f42c1', secondary: '#59359a', accent: '#9575cd' },
    };

    const colors = departmentColors[department] || departmentColors.atic;

    return {
      style: {
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: `2px solid ${colors.accent}40`,
        display: 'block',
        fontSize: '11px',
        fontWeight: '700',
        padding: '6px 10px',
        boxShadow: `0 4px 12px ${colors.primary}40, 0 2px 4px rgba(0,0,0,0.4)`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        minHeight: '24px',
        lineHeight: '1.4'
      }
    };
  };

  // Manejar selección de slot (crear evento)
  const handleSelectSlot = (slotInfo: any) => {
    if (userRole && ['admin', 'superadmin', 'master'].some(role =>
      userRole.includes(role) || userRole.endsWith('master')
    )) {
      // TODO: Abrir modal para crear evento
      console.log('Crear evento:', slotInfo);
    }
  };

  // Función para extraer enlaces de texto
  const extractLinksFromText = (text: string) => {
    if (!text) return [];

    // Regex más precisa para URLs
    const urlRegex = /https?:\/\/[^\s\n\r<>\[\](){}'"]+[^\s\n\r<>\[\](){}.,;:!?'"]/g;
    const matches = text.match(urlRegex) || [];

    // Limpiar y normalizar enlaces
    const cleanedMatches = matches.map(link => {
      // Decodificar caracteres URL y limpiar
      let cleaned = link.trim();

      // Remover caracteres de cierre comunes al final
      cleaned = cleaned.replace(/[.,;:!?\])}]+$/, '');

      return cleaned;
    });

    // Eliminar duplicados exactos y parciales
    const uniqueLinks: string[] = [];
    for (const link of cleanedMatches) {
      // Verificar que no sea un subconjunto de un enlace ya existente
      const isDuplicate = uniqueLinks.some(existingLink =>
        existingLink.includes(link) || link.includes(existingLink)
      );

      if (!isDuplicate) {
        uniqueLinks.push(link);
      }
    }

    console.log('🔍 Enlaces encontrados:', { original: matches, cleaned: cleanedMatches, unique: uniqueLinks });
    return uniqueLinks;
  };

  // Manejar selección de evento (ver detalles)
  const handleSelectEvent = (event: CalendarEvent) => {
    const hasGoogleLink = event.resource?.htmlLink && event.resource.htmlLink !== 'No disponible';
    const description = event.resource?.description || '';
    const descriptionLinks = extractLinksFromText(description);
    const hasDescriptionLinks = descriptionLinks.length > 0;

    // Si hay enlaces disponibles, abrir modal
    if (hasGoogleLink || hasDescriptionLinks) {
      setLinkModalData({
        event,
        googleLink: hasGoogleLink ? event.resource.htmlLink : undefined,
        descriptionLinks
      });
      setLinkModalOpen(true);
    } else {
      // Solo mostrar información si no hay enlaces
      const eventDetails = `
📅 EVENTO: ${event.title}

🕐 INICIO: ${moment(event.start).format('dddd DD/MM/YYYY HH:mm')}
🕐 FIN: ${moment(event.end).format('dddd DD/MM/YYYY HH:mm')}

📝 DESCRIPCIÓN: ${description || 'Sin descripción'}

📍 UBICACIÓN: ${event.resource?.location || 'No especificada'}

👤 CREADOR: ${event.resource?.creator?.email || 'No disponible'}

✅ ESTADO: ${event.resource?.status || 'No especificado'}
      `.trim();
      alert(eventDetails);
    }

    console.log('Ver evento completo:', event);
    console.log('Enlaces en descripción:', descriptionLinks);
  };

  if (loading) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarLoading}>
          <div className={styles.loadingSpinner}></div>
          <span>Cargando calendario...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarError}>
          <h4>Error al cargar el calendario</h4>
          <p>{error}</p>
          <button onClick={loadEvents}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Log final antes de renderizar
  console.log('🎭 Rendering Calendar with events:', events.length, 'events:', events.slice(0, 2));

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h1 className={styles.calendarTitle}>
          Calendario {department.toUpperCase()}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className={styles.departmentBadge}>
            {department.toUpperCase()}
          </span>
          <button
            onClick={loadEvents}
            style={{
              background: '#20c997',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#17a085'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#20c997'}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div style={{ height: '650px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          view={view}
          views={['month', 'week', 'day', 'agenda']}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          selectable={true}
          popup={true}
          showMultiDayTimes={true}
          step={30}
          timeslots={2}
          dayLayoutAlgorithm="no-overlap"
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            dayHeaderFormat: 'dddd DD/MM',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`
          }}
          tooltipAccessor={(event) => `${event.title}\n${event.resource?.description || ''}`}
        />
      </div>

      <div style={{
        marginTop: '24px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(30, 35, 41, 0.9), rgba(45, 55, 72, 0.9))',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(32, 201, 151, 0.3)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '0.95rem',
          color: '#ffffff',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          📅 <strong style={{ color: '#20c997' }}>{events.length}</strong> eventos cargados
        </div>
        {userRole && ['admin', 'superadmin', 'master'].some(role =>
          userRole.includes(role) || userRole.endsWith('master')
        ) && (
          <div style={{
            fontSize: '0.9rem',
            background: 'linear-gradient(135deg, #20c997, #17a2b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '600',
            textShadow: 'none'
          }}>
            💡 Haz clic en un espacio vacío para crear un evento
          </div>
        )}
      </div>

      {/* Modal de enlaces */}
      {linkModalOpen && linkModalData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 35, 41, 0.95), rgba(45, 55, 72, 0.95))',
            borderRadius: '16px',
            padding: '24px',
            minWidth: '450px',
            maxWidth: '90vw',
            width: 'fit-content',
            border: '2px solid rgba(32, 201, 151, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            maxHeight: '85vh',
            overflow: 'auto'
          }}>
            {/* Título del modal */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              borderBottom: '2px solid rgba(32, 201, 151, 0.3)',
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(135deg, #20c997, #17a2b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '80%'
              }}>
                📅 {linkModalData.event.title}
              </h3>
              <button
                onClick={() => setLinkModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = 'transparent'}
              >
                ✕
              </button>
            </div>

            {/* Información del evento */}
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(20, 25, 30, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(32, 201, 151, 0.2)'
            }}>
              <p style={{ margin: '8px 0', color: '#ffffff', fontSize: '0.95rem' }}>
                🕐 <strong style={{ color: '#20c997' }}>Inicio:</strong> {moment(linkModalData.event.start).format('dddd DD/MM/YYYY HH:mm')}
              </p>
              <p style={{ margin: '8px 0', color: '#ffffff', fontSize: '0.95rem' }}>
                🕐 <strong style={{ color: '#20c997' }}>Fin:</strong> {moment(linkModalData.event.end).format('dddd DD/MM/YYYY HH:mm')}
              </p>
              <p style={{ margin: '8px 0', color: '#ffffff', fontSize: '0.95rem' }}>
                📍 <strong style={{ color: '#20c997' }}>Ubicación:</strong> {linkModalData.event.resource?.location || 'No especificada'}
              </p>
              {linkModalData.event.resource?.description && (
                <p style={{
                  margin: '8px 0',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  📝 <strong style={{ color: '#20c997' }}>Descripción:</strong> {linkModalData.event.resource.description}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{
                color: '#ffffff',
                fontSize: '1.1rem',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                🔗 Enlaces disponibles
              </h4>

              {linkModalData.googleLink && (
                <button
                  onClick={() => {
                    window.open(linkModalData.googleLink, '_blank', 'noopener,noreferrer');
                    setLinkModalOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #4285f4, #1a73e8)',
                    border: 'none',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(66, 133, 244, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.4)';
                  }}
                >
                  📅 Abrir en Google Calendar
                </button>
              )}

              {linkModalData.descriptionLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    window.open(link, '_blank', 'noopener,noreferrer');
                    setLinkModalOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #20c997, #17a2b8)',
                    border: 'none',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(32, 201, 151, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(32, 201, 151, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(32, 201, 151, 0.4)';
                  }}
                >
                  🔗 Ir al enlace {linkModalData.descriptionLinks.length > 1 ? `${index + 1}` : ''}
                </button>
              ))}

              <button
                onClick={() => setLinkModalOpen(false)}
                style={{
                  background: 'rgba(108, 117, 125, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '8px'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(108, 117, 125, 1)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(108, 117, 125, 0.8)';
                }}
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentCalendar;