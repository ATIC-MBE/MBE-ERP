import React from 'react';

// Definimos los props del componente para que sea reutilizable
interface RegistroSucesosCardProps {
  driveLink: string;
  ultimaActualizacion?: string;
  onClose?: () => void; // Opcional, por si lo quieres usar como modal y poder cerrarlo
}

export const RegistroSucesosCard: React.FC<RegistroSucesosCardProps> = ({ 
  driveLink, 
  ultimaActualizacion = 'hace 3 horas',
  onClose
}) => {
  return (
    /* Contenedor principal: estilo de tarjeta blanca flotante con sombra */
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 max-w-md w-full flex flex-col items-center text-center relative border border-gray-100 z-50">
      
      {/* Botón opcional de cerrar (X) en la esquina superior derecha */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Título de la tarjeta */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Registro de Sucesos Existentes
      </h2>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-6 leading-relaxed px-2">
        Accede a los informes detallados y logs de sucesos operacionales y log de incidencias registradas en la empresa.
      </p>

      {/* Botón verde con enlace a Drive */}
      <a 
        href={driveLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#2D8C5A] hover:bg-[#24754a] text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm"
      >
        {/* Ícono de Google Drive (SVG) */}
        <svg 
          viewBox="0 0 87.3 78" 
          className="w-5 h-5 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M58.3 52H29L14.4 78h29.2L58.3 52zm14.6-26l-14.5 26H29.1L43.7 26h29.2zM29.1 0L0 52l14.6 26L43.7 26 29.1 0z"/>
        </svg>
        Ver Registro en Drive
      </a>

      {/* Texto de última actualización */}
      <span className="text-xs text-gray-400 mt-4 block">
        Última actualización: {ultimaActualizacion}
      </span>
    </div>
  );
};

export default RegistroSucesosCard;