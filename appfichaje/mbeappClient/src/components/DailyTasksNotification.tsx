import React, { useState, useEffect, useContext } from 'react';
import { FaCalendarAlt, FaTimes, FaBell } from 'react-icons/fa';
import UserContext from '@/client/context/UserContext';
import { CalendarEvent } from '@/client/types/globalTypes';

interface DailyTasksNotificationProps {
  onClose: () => void;
}

const DailyTasksNotification: React.FC<DailyTasksNotificationProps> = ({ onClose }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCurrentRol } = useContext(UserContext);

  useEffect(() => {
    fetchTodayEvents();
  }, []);

  const fetchTodayEvents = async () => {
    try {
      const currentRole = getCurrentRol();
      if (!currentRole) return;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const response = await fetch(
        `/api/calendar/events/${currentRole}?timeMin=${startOfDay}&timeMax=${endOfDay}&maxResults=10`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        throw new Error('Error al cargar eventos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005360]"></div>
            <span className="ml-3 text-gray-700">Cargando tareas del día...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#005360] text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="mr-2" />
            <h2 className="text-lg font-semibold">📋 Tareas Programadas para Hoy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white hover:bg-[#004050] rounded-full p-1 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {error ? (
            <div className="text-center py-8">
              <div className="text-[#005360] mb-2">
                <FaCalendarAlt size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-[#005360] mb-2">
                <FaCalendarAlt size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">¡No hay tareas programadas para hoy!</p>
              <p className="text-gray-500 text-sm mt-1">Perfecto para enfocarte en otras prioridades.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-700 mb-4">
                Tienes <span className="font-semibold text-[#005360]">{events.length}</span>
                {events.length === 1 ? ' tarea programada' : ' tareas programadas'} para hoy:
              </p>

              {events.map((event, index) => (
                <div
                  key={event.id || index}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center text-gray-500 text-sm">
                        <FaCalendarAlt className="mr-1 text-[#005360]" size={12} />
                        {formatTime(event.start.dateTime)}
                        {event.end.dateTime && (
                          <span> - {formatTime(event.end.dateTime)}</span>
                        )}
                      </div>

                      {event.location && (
                        <p className="text-gray-500 text-sm mt-1">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-center">
            <div className="blocking-modal-button-container blocking-modal-button-container--wide">
              <span className="blocking-modal-button-label" aria-hidden="true">
                Entendido
              </span>
              <button type="button" onClick={onClose} aria-label="Entendido">
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasksNotification;