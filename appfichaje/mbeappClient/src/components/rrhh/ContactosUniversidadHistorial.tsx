import React from 'react';
import { FaUserEdit, FaRegCalendarCheck, FaRegStickyNote, FaPhoneAlt, FaArrowRight, FaUserShield, FaUniversity, FaUserTie, FaUser, FaUsers, FaEnvelope, FaLink, FaKey, FaCalendarCheck, FaCalendarTimes, FaFileSignature, FaCheckCircle, FaExclamationCircle, FaCommentDots } from 'react-icons/fa';

export type HistoricoContacto = {
  id: number;
  usuario: string;
  fecha: string;
  notas?: string;
  ultima_llamada?: string;
  siguiente_paso?: string;
  universidad?: string;
  tipo?: string;
  puesto?: string;
  departamento?: string;
  email?: string;
  telefono?: string;
  telefono2?: string;
  portal?: string;
  usuario_portal?: string;
  contrasena_portal?: string;
  ultima_actualizacion?: string;
  firma_convenio?: string;
  vencimiento_convenio?: string;
  link_convenio?: string;
  alta_seguridad_social?: string;
};

interface Props {
  historial: HistoricoContacto[];
}

const ContactosUniversidadHistorial: React.FC<Props> = ({ historial }) => (
  <div className="bg-[#e3f1fa] rounded-2xl p-6 w-full max-w-5xl mx-auto mt-4 shadow">
    <h2 className="text-2xl text-[#0077bd] font-bold mb-6 flex items-center gap-3">
      <FaRegCalendarCheck className="text-blue-700 text-2xl" /> Historial de Cambios
    </h2>
    {historial.length === 0 ? (
      <div className="text-gray-500 text-center text-lg">Sin historial</div>
    ) : (
      <ul className="space-y-6">
        {historial.map((h) => (
          <li key={h.id} className="bg-white rounded-2xl p-6 shadow flex flex-col gap-2 border-l-8 border-blue-400 relative">
            <div className="flex flex-wrap gap-6 items-center mb-2">
              <span className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                <FaUserEdit className="text-blue-700 text-xl" /> {h.usuario || 'RRHH'}
              </span>
              <span className="text-base text-gray-500 flex items-center gap-1"><FaCalendarCheck /> {new Date(h.fecha).toLocaleString()}</span>
              {h.universidad && (
                <span className="flex items-center gap-2 text-base text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
                  <FaUniversity /> {h.universidad}
                </span>
              )}
              {h.tipo && (
                <span className="flex items-center gap-2 text-base text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                  <FaUserTie /> {h.tipo}
                </span>
              )}
              {h.puesto && (
                <span className="flex items-center gap-2 text-base text-pink-800 bg-pink-100 px-3 py-1 rounded-full">
                  <FaUser /> {h.puesto}
                </span>
              )}
              {h.departamento && (
                <span className="flex items-center gap-2 text-base text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                  <FaUsers /> {h.departamento}
                </span>
              )}
              {h.email && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaEnvelope /> {h.email}
                </span>
              )}
              {h.telefono && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaPhoneAlt /> {h.telefono}
                </span>
              )}
              {h.telefono2 && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaPhoneAlt /> {h.telefono2}
                </span>
              )}
              {h.portal && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaLink /> {h.portal}
                </span>
              )}
              {h.usuario_portal && (
                <span className="flex items-center gap-2 text-base text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  <FaUser /> {h.usuario_portal}
                </span>
              )}
              {h.contrasena_portal && (
                <span className="flex items-center gap-2 text-base text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  <FaKey /> {h.contrasena_portal}
                </span>
              )}
              {h.ultima_actualizacion && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaCalendarCheck /> Últ. actualización: {h.ultima_actualizacion}
                </span>
              )}
              {h.ultima_llamada && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaPhoneAlt /> Últ. llamada: {h.ultima_llamada}
                </span>
              )}
              {h.firma_convenio && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaFileSignature /> Firma convenio: {h.firma_convenio}
                </span>
              )}
              {h.vencimiento_convenio && (
                <span className="flex items-center gap-2 text-base text-red-800 bg-red-100 px-3 py-1 rounded-full">
                  <FaCalendarTimes /> Vencimiento: {h.vencimiento_convenio}
                </span>
              )}
              {h.link_convenio && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaLink /> {h.link_convenio}
                </span>
              )}
              {h.alta_seguridad_social && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaUserShield /> Alta SS: {h.alta_seguridad_social}
                </span>
              )}
              {h.siguiente_paso && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaArrowRight /> Siguiente paso: {h.siguiente_paso}
                </span>
              )}
            </div>
            {h.notas && (
              <div className="flex items-center gap-3 text-blue-900 text-lg mt-1 font-medium">
                <FaCommentDots className="text-blue-400 text-xl" />
                <span>{h.notas}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ContactosUniversidadHistorial;
