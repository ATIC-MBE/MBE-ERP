import React from 'react';
import { FaUserEdit, FaRegCalendarCheck, FaRegStickyNote, FaPhoneAlt, FaArrowRight, FaUserShield, FaUniversity, FaUserTie, FaUser, FaUsers, FaEnvelope, FaLink, FaKey, FaCalendarCheck, FaCalendarTimes, FaFileSignature, FaCheckCircle, FaExclamationCircle, FaCommentDots } from 'react-icons/fa';

export type HistoricoContacto = {
  // Campos específicos del histórico
  id: number;
  usuario: string;
  fecha: string;
  notas?: string;
  id_contacto?: number;
  // Campos base del contacto (coinciden exactamente con IContactoUniversidad)
  universidad?: string;
  tipo?: string;
  puesto?: string;
  nota_personal?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  historico?: string;
  ultima_llamada?: string;
  ultima_actualizacion?: string;
  myd?: string;
  ade?: string;
  rrhh?: string;
  aca?: string;
  atic?: string;
  estado_ofertas?: string;
  portal_web?: string;
  usuario_portal?: string;
  clave?: string;
  firma_convenio_fecha?: string;
  notas_ofertas?: string;
  anexos?: string;
  convocatorias?: string;
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
              {h.myd && (
                <span className="flex items-center gap-2 text-base text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  <FaUsers /> MYD: {h.myd}
                </span>
              )}
              {h.ade && (
                <span className="flex items-center gap-2 text-base text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  <FaUsers /> ADE: {h.ade}
                </span>
              )}
              {h.rrhh && (
                <span className="flex items-center gap-2 text-base text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  <FaUsers /> RRHH: {h.rrhh}
                </span>
              )}
              {h.aca && (
                <span className="flex items-center gap-2 text-base text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  <FaUsers /> ACA: {h.aca}
                </span>
              )}
              {h.atic && (
                <span className="flex items-center gap-2 text-base text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  <FaUsers /> ATIC: {h.atic}
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
              {h.portal_web && (
                <span className="flex items-center gap-2 text-base text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                  <FaLink /> {h.portal_web}
                </span>
              )}
              {h.usuario_portal && (
                <span className="flex items-center gap-2 text-base text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  <FaUser /> {h.usuario_portal}
                </span>
              )}
              {h.clave && (
                <span className="flex items-center gap-2 text-base text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  <FaKey /> {h.clave}
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
              {h.firma_convenio_fecha && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaFileSignature /> Firma convenio: {h.firma_convenio_fecha}
                </span>
              )}
              {h.estado_ofertas && (
                <span className="flex items-center gap-2 text-base text-green-800 bg-green-100 px-3 py-1 rounded-full">
                  <FaCheckCircle /> Estado ofertas: {h.estado_ofertas}
                </span>
              )}
              {h.anexos && (
                <span className="flex items-center gap-2 text-base text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                  <FaFileSignature /> Anexos: {h.anexos}
                </span>
              )}
              {h.convocatorias && (
                <span className="flex items-center gap-2 text-base text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
                  <FaUsers /> Convocatorias: {h.convocatorias}
                </span>
              )}
            </div>
            {h.notas && (
              <div className="flex items-center gap-3 text-blue-900 text-lg mt-1 font-medium">
                <FaCommentDots className="text-blue-400 text-xl" />
                <span>{h.notas}</span>
              </div>
            )}
            {h.nota_personal && (
              <div className="flex items-center gap-3 text-blue-700 text-base mt-1">
                <FaRegStickyNote className="text-blue-500 text-lg" />
                <span><strong>Nota personal:</strong> {h.nota_personal}</span>
              </div>
            )}
            {h.historico && (
              <div className="flex items-center gap-3 text-gray-700 text-base mt-1">
                <FaRegCalendarCheck className="text-gray-500 text-lg" />
                <span><strong>Histórico:</strong> {h.historico}</span>
              </div>
            )}
            {h.notas_ofertas && (
              <div className="flex items-center gap-3 text-green-700 text-base mt-1">
                <FaCheckCircle className="text-green-500 text-lg" />
                <span><strong>Notas ofertas:</strong> {h.notas_ofertas}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ContactosUniversidadHistorial;
