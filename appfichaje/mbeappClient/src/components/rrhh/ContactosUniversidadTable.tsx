import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';

type ContactoUniversidad = {
  id?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  telefono2?: string;
  universidad?: string;
  tipo?: string;
  puesto?: string;
  email?: string;
  departamento?: string[] | string;
  vencimiento_convenio?: string;
  altas_social?: string;
  ultima_llamada?: string;
  siguiente_paso?: string;
};

interface ContactosUniversidadTableProps {
  data: ContactoUniversidad[];
  onEdit: (c: ContactoUniversidad) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const ContactosUniversidadTable = ({ data, onEdit, onDelete, loading }: ContactosUniversidadTableProps) => {
  // Agrupar por universidad manteniendo el orden original del Excel
  const groupedByUniversity = data.reduce((acc, contact) => {
    const uni = contact.universidad || 'Sin Universidad';
    if (!acc[uni]) {
      acc[uni] = [];
    }
    acc[uni].push(contact);
    return acc;
  }, {} as Record<string, ContactoUniversidad[]>);

  // Ordenar las universidades alfabéticamente
  const universities = Object.keys(groupedByUniversity).sort();

  // Estado para controlar qué universidades están expandidas - inicializar con todas expandidas
  const [expandedUniversities, setExpandedUniversities] = useState<Set<string>>(new Set(universities));

  // Actualizar universidades expandidas cuando cambie la data
  useEffect(() => {
    setExpandedUniversities(new Set(universities));
  }, [data.length]);

  // Toggle para expandir/contraer
  const toggleUniversity = (uni: string) => {
    const newExpanded = new Set(expandedUniversities);
    if (newExpanded.has(uni)) {
      newExpanded.delete(uni);
    } else {
      newExpanded.add(uni);
    }
    setExpandedUniversities(newExpanded);
  };

  // Expandir/contraer todas
  const expandAll = () => {
    setExpandedUniversities(new Set(universities));
  };

  const collapseAll = () => {
    setExpandedUniversities(new Set());
  };

  const renderRow = (c: ContactoUniversidad, i: number, isFirstInGroup: boolean) => {
    // Estilo diferente para la primera fila (datos generales de la universidad)
    const rowClass = isFirstInGroup
      ? "bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 border-b border-gray-300 font-semibold"
      : "even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition-colors text-gray-900 border-b border-gray-100";

    return (
      <tr key={c.id || i} className={rowClass}>
        <td className={`px-1 py-1 break-words max-w-[120px] text-xs ${!isFirstInGroup ? 'pl-6' : ''}`}>
          {isFirstInGroup ? c.universidad : ''}
        </td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{c.tipo}</td>
        <td className="px-1 py-1 break-words max-w-[120px] text-xs">{c.puesto}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{(c as any).nota_personal || ''}</td>
        <td className="px-1 py-1 break-words max-w-[100px] text-xs">{c.nombre}</td>
        <td className="px-1 py-1 break-words max-w-[100px] text-xs">{c.apellido}</td>
        <td className="px-1 py-1 break-words max-w-[90px] text-xs">{c.telefono}</td>
        <td className="px-1 py-1 break-words max-w-[130px] text-xs">{c.email}</td>
        <td className="px-1 py-1 break-words max-w-[150px] text-xs">{(c as any).historico || ''}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{c.ultima_llamada || ''}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{(c as any).ult_act_port || ''}</td>
        <td className="px-1 py-1 break-words max-w-[60px] text-xs">{(c as any).myd || ''}</td>
        <td className="px-1 py-1 break-words max-w-[60px] text-xs">{(c as any).ade || ''}</td>
        <td className="px-1 py-1 break-words max-w-[60px] text-xs">{(c as any).rrhh || ''}</td>
        <td className="px-1 py-1 break-words max-w-[60px] text-xs">{(c as any).aca || ''}</td>
        <td className="px-1 py-1 break-words max-w-[60px] text-xs">{(c as any).atic || ''}</td>
        <td className="px-1 py-1 break-words max-w-[90px] text-xs">{(c as any).estado_ofertas || ''}</td>
        <td className="px-1 py-1 break-words max-w-[100px] text-xs">{(c as any).portal_web || ''}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{(c as any).user || ''}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{(c as any).clave || ''}</td>
        <td className="px-1 py-1 break-words max-w-[80px] text-xs">{(c as any).firma_convenio || ''}</td>
        <td className="px-1 py-1 break-words max-w-[150px] text-xs">{(c as any).notas_ofertas || ''}</td>
        <td className="px-1 py-1 break-words max-w-[100px] text-xs">{(c as any).anexos || ''}</td>
        <td className="px-1 py-1 break-words max-w-[100px] text-xs">{(c as any).convocatorias || ''}</td>
      </tr>
    );
  };

  const renderMobileCard = (c: ContactoUniversidad, i: number) => {
    return (
      <div
        key={c.id || i}
        className="bg-white rounded-2xl shadow p-3 mb-3 flex flex-col gap-1 border-2 border-[#005360]"
      >
        <div><span className="font-bold text-[#005360]">Universidad:</span> {c.universidad}</div>
        <div><span className="font-bold text-[#005360]">Tipo:</span> {c.tipo}</div>
        <div><span className="font-bold text-[#005360]">Puesto:</span> {c.puesto}</div>
        <div><span className="font-bold text-[#005360]">Nota.Per:</span> {(c as any).nota_personal || ''}</div>
        <div><span className="font-bold text-[#005360]">Nombre:</span> {c.nombre}</div>
        <div><span className="font-bold text-[#005360]">Apellidos:</span> {c.apellido}</div>
        <div><span className="font-bold text-[#005360]">Teléfono:</span> {c.telefono}</div>
        <div><span className="font-bold text-[#005360]">Email:</span> {c.email}</div>
        <div><span className="font-bold text-[#005360]">Historico:</span> {(c as any).historico || ''}</div>
        <div><span className="font-bold text-[#005360]">Última Llamada:</span> {c.ultima_llamada || ''}</div>
        <div><span className="font-bold text-[#005360]">Ult.act.PORT:</span> {(c as any).ult_act_port || ''}</div>
      </div>
    );
  };

  return (
    <div className="bg-[#005360]/10 border border-[#005360] rounded-3xl p-2 sm:p-4 w-full max-w-7xl mx-auto mt-4 overflow-x-auto">
      <h2
        className="text-2xl font-extrabold mb-4 drop-shadow-lg"
        style={{
          color: '#c9ac7e',
          background: 'rgba(0,83,96,0.70)',
          padding: '0.5rem 1.5rem',
          borderRadius: '1rem',
          letterSpacing: '0.03em',
          textShadow: '0 2px 8px #00536099, 0 1px 0 #fff',
          display: 'inline-block',
        }}
      >
        Contactos de Universidad (RRHH)
      </h2>

      {/* Botones para expandir/contraer todo */}
      <div className="hidden sm:flex gap-2 mb-3">
        <button
          onClick={expandAll}
          className="bg-[#005360] hover:bg-[#006b7a] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow border border-[#005360] hover:border-[#006b7a]"
        >
          Expandir Todo
        </button>
        <button
          onClick={collapseAll}
          className="bg-[#005360] hover:bg-[#006b7a] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow border border-[#005360] hover:border-[#006b7a]"
        >
          Contraer Todo
        </button>
      </div>

      {/* Responsive tabla: horizontal en desktop, vertical en móvil */}
      <div className="hidden sm:block w-full">
        <div className="overflow-x-visible w-full rounded-2xl overflow-hidden">
          <table className="w-full text-xs sm:text-sm whitespace-normal break-words">
            <thead className="bg-[#005360]">
              <tr>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Universidad</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Tipo</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Puesto</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Nota.Per</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Nombre</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Apellidos</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Teléfono</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Email</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Historico</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Ult.Llamada</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Ult.act.PORT</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">MYD</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">ADE</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">RRHH</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">ACA</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">ATIC</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Estado Ofertas</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Portal/web</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">User</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Clave</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Firma convenio</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Notas Ofertas</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Anexos</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Convocatorias</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={24} className="text-center py-4">Cargando...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={24} className="text-center py-4">No hay registros</td></tr>
              ) : (
                universities.map((uni) => {
                  const contacts = groupedByUniversity[uni];
                  const isExpanded = expandedUniversities.has(uni);
                  return (
                    <React.Fragment key={uni}>
                      {/* Fila de cabecera de universidad */}
                      <tr
                        className="bg-[#005360] cursor-pointer hover:bg-[#006b7a] transition-all"
                        onClick={() => toggleUniversity(uni)}
                      >
                        <td colSpan={24} className="px-3 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <FaChevronDown className="text-white text-lg" />
                            ) : (
                              <FaChevronRight className="text-white text-lg" />
                            )}
                            <span className="text-white font-bold text-base">
                              {uni} ({contacts.length} contacto{contacts.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </td>
                      </tr>
                      {/* Filas de contactos (solo si está expandida) */}
                      {isExpanded && contacts.map((contact, idx) => renderRow(contact, idx, idx === 0))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile vertical cards */}
      <div className="block sm:hidden w-full">
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-4">No hay registros</div>
        ) : (
          universities.map((uni) => {
            const contacts = groupedByUniversity[uni];
            const isExpanded = expandedUniversities.has(uni);
            return (
              <div key={uni} className="mb-4">
                {/* Cabecera de universidad para móvil */}
                <div
                  className="bg-[#005360] hover:bg-[#006b7a] rounded-xl p-3 mb-2 cursor-pointer flex items-center gap-2 transition-all shadow"
                  onClick={() => toggleUniversity(uni)}
                >
                  {isExpanded ? (
                    <FaChevronDown className="text-white text-lg" />
                  ) : (
                    <FaChevronRight className="text-white text-lg" />
                  )}
                  <span className="text-white font-bold text-base">
                    {uni} ({contacts.length})
                  </span>
                </div>
                {/* Cards de contactos */}
                {isExpanded && contacts.map((contact, idx) => renderMobileCard(contact, idx))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactosUniversidadTable;
