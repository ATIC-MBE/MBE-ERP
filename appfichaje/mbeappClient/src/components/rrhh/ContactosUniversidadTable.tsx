import React, { useMemo, useState } from 'react';

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

const THIRTY_DAYS = 30;

const ContactosUniversidadTable = ({ data, onEdit, onDelete, loading }: ContactosUniversidadTableProps) => {
  const [filterUltLlamadaStale, setFilterUltLlamadaStale] = useState(false);
  const [filterUltActPortStale, setFilterUltActPortStale] = useState(false);

  const MONTH_MAP: Record<string, number> = {
    ene: 0,
    enero: 0,
    feb: 1,
    febrero: 1,
    mar: 2,
    marzo: 2,
    abr: 3,
    abril: 3,
    may: 4,
    mayo: 4,
    jun: 5,
    junio: 5,
    jul: 6,
    julio: 6,
    ago: 7,
    agosto: 7,
    set: 8,
    sept: 8,
    sep: 8,
    septiembre: 8,
    oct: 9,
    octubre: 9,
    nov: 10,
    noviembre: 10,
    dic: 11,
    diciembre: 11,
  };

  const parseDate = (value?: string) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .toLowerCase();

    const textMonthMatch = normalized.match(/^([0-9]{1,2})\s*([a-zñ]+)\s*([0-9]{2,4})$/i);
    if (textMonthMatch) {
      const day = parseInt(textMonthMatch[1], 10);
      const monthKey = textMonthMatch[2].toLowerCase();
      const yearVal = textMonthMatch[3];
      const monthIndex = MONTH_MAP[monthKey];
      if (monthIndex !== undefined) {
        const year = parseInt(yearVal.length === 2 ? `20${yearVal}` : yearVal, 10);
        const parsed = new Date(year, monthIndex, day);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }
    }

    const compactTextMonthMatch = normalized.match(/^([0-9]{1,2})([a-zñ]+)([0-9]{2,4})$/i);
    if (compactTextMonthMatch) {
      const day = parseInt(compactTextMonthMatch[1], 10);
      const monthKey = compactTextMonthMatch[2].toLowerCase();
      const yearVal = compactTextMonthMatch[3];
      const monthIndex = MONTH_MAP[monthKey];
      if (monthIndex !== undefined) {
        const year = parseInt(yearVal.length === 2 ? `20${yearVal}` : yearVal, 10);
        const parsed = new Date(year, monthIndex, day);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }
    }

    const direct = new Date(trimmed);
    if (!Number.isNaN(direct.getTime())) return direct;
    const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (!match) return null;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3].length === 2 ? `20${match[3]}` : match[3], 10);
    const parsed = new Date(year, month, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const daysFromToday = (value?: string) => {
    const date = parseDate(value);
    if (!date) return null;
    const diffMs = Date.now() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  const filteredUniversities = useMemo(() => {
    const grouped = data.reduce((acc, contact) => {
      const key = contact.universidad || 'Sin Universidad';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(contact);
      return acc;
    }, {} as Record<string, ContactoUniversidad[]>);

    return Object.keys(grouped)
      .sort()
      .map((uni) => {
        const contacts = grouped[uni];
        const firstContact = contacts[0];
        if (!firstContact) return null;
        const daysUltLlamada = daysFromToday(firstContact.ultima_llamada);
        const daysUltActPort = daysFromToday((firstContact as any).ult_act_port);
        const isUltLlamadaStale = daysUltLlamada !== null && daysUltLlamada > THIRTY_DAYS;
        const isUltActPortStale = daysUltActPort !== null && daysUltActPort > THIRTY_DAYS;
        return {
          university: uni,
          contact: firstContact,
          contacts,
          daysUltLlamada,
          daysUltActPort,
          isUltLlamadaStale,
          isUltActPortStale,
        };
      })
      .filter(Boolean) as Array<{
        university: string;
        contact: ContactoUniversidad;
        contacts: ContactoUniversidad[];
        daysUltLlamada: number | null;
        daysUltActPort: number | null;
        isUltLlamadaStale: boolean;
        isUltActPortStale: boolean;
      }>;
  }, [data]);

  const rows = useMemo(() => {
    return filteredUniversities.filter((row) => {
      if (filterUltLlamadaStale && !row.isUltLlamadaStale) return false;
      if (filterUltActPortStale && !row.isUltActPortStale) return false;
      return true;
    });
  }, [filteredUniversities, filterUltLlamadaStale, filterUltActPortStale]);

  const getDateCellClass = (isStale: boolean) => (isStale ? 'text-red-600 font-semibold' : 'text-gray-900');

  const [modalData, setModalData] = useState<{
    university: string;
    contacts: ContactoUniversidad[];
    mode: 'llamada' | 'portal';
  } | null>(null);

  const renderDate = (
    value: string | undefined,
    daysDiff: number | null,
    isStale: boolean,
    onClick?: () => void,
  ) => {
    if (!value) return '';
    const suffix = daysDiff !== null ? ` (${daysDiff} días)` : '';
    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      onClick?.();
    };

    return (
      <span
        className={`${getDateCellClass(isStale)} ${isStale && onClick ? 'cursor-pointer underline underline-offset-2' : ''}`}
        onClick={isStale && onClick ? handleClick : undefined}
      >
        {value}
        {suffix}
      </span>
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
        Alertas de Contactos Universidad
      </h2>

      <div className="hidden sm:block w-full">
        <div className="overflow-x-visible w-full rounded-2xl overflow-hidden">
          <table className="w-full text-xs sm:text-sm whitespace-normal break-words">
            <thead className="bg-[#005360]">
              <tr>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Universidad</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Tipo</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Puesto</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs whitespace-nowrap">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <span>Ult. llamada</span>
                    <label className="flex items-center gap-1 text-[10px] font-normal uppercase">
                      <input
                        type="checkbox"
                        className="accent-[#c9ac7e] h-3 w-3 cursor-pointer"
                        checked={filterUltLlamadaStale}
                        onChange={(event) => setFilterUltLlamadaStale(event.target.checked)}
                        aria-label="Filtrar última llamada con más de 30 días"
                      />
                      <span className="tracking-wide">+30d</span>
                    </label>
                  </div>
                </th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs whitespace-nowrap">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <span>Ult. act. port</span>
                    <label className="flex items-center gap-1 text-[10px] font-normal uppercase">
                      <input
                        type="checkbox"
                        className="accent-[#c9ac7e] h-3 w-3 cursor-pointer"
                        checked={filterUltActPortStale}
                        onChange={(event) => setFilterUltActPortStale(event.target.checked)}
                        aria-label="Filtrar última actualización del portal con más de 30 días"
                      />
                      <span className="tracking-wide">+30d</span>
                    </label>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-4">Cargando...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">No hay registros para los filtros seleccionados.</td></tr>
              ) : (
                rows.map(({ university, contact, contacts, daysUltLlamada, daysUltActPort, isUltLlamadaStale, isUltActPortStale }) => (
                  <tr
                    key={university}
                    className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition-colors text-gray-900 border-b border-gray-200 cursor-pointer"
                    onClick={() => contact.id && onEdit(contact)}
                  >
                    <td className="px-3 py-2 text-xs sm:text-sm font-semibold">{university}</td>
                    <td className="px-3 py-2 text-xs sm:text-sm">{contact.tipo || ''}</td>
                    <td className="px-3 py-2 text-xs sm:text-sm">{contact.puesto || ''}</td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {renderDate(contact.ultima_llamada, daysUltLlamada, isUltLlamadaStale, () =>
                        setModalData({ university, contacts, mode: 'llamada' }),
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {renderDate((contact as any).ult_act_port, daysUltActPort, isUltActPortStale, () =>
                        setModalData({ university, contacts, mode: 'portal' }),
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block sm:hidden w-full">
        <div className="flex items-center justify-center gap-4 mb-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#005360] uppercase">
            <input
              type="checkbox"
              className="accent-[#c9ac7e] h-4 w-4"
              checked={filterUltLlamadaStale}
              onChange={(event) => setFilterUltLlamadaStale(event.target.checked)}
            />
            <span>Ult. llamada +30d</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#005360] uppercase">
            <input
              type="checkbox"
              className="accent-[#c9ac7e] h-4 w-4"
              checked={filterUltActPortStale}
              onChange={(event) => setFilterUltActPortStale(event.target.checked)}
            />
            <span>Ult. act. port +30d</span>
          </label>
        </div>
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-4">No hay registros para los filtros seleccionados.</div>
        ) : (
          rows.map(({ university, contact, contacts, daysUltLlamada, daysUltActPort, isUltLlamadaStale, isUltActPortStale }) => (
            <div key={university} className="bg-white rounded-2xl shadow p-3 mb-3 flex flex-col gap-2 border-2 border-[#005360]">
              <div><span className="font-bold text-[#005360]">Universidad:</span> {university}</div>
              <div><span className="font-bold text-[#005360]">Tipo:</span> {contact.tipo || ''}</div>
              <div><span className="font-bold text-[#005360]">Puesto:</span> {contact.puesto || ''}</div>
              <div>
                <span className="font-bold text-[#005360]">Ult. llamada:</span>{' '}
                {renderDate(contact.ultima_llamada, daysUltLlamada, isUltLlamadaStale, () =>
                  setModalData({ university, contacts, mode: 'llamada' }),
                )}
              </div>
              <div>
                <span className="font-bold text-[#005360]">Ult. act. port:</span>{' '}
                {renderDate((contact as any).ult_act_port, daysUltActPort, isUltActPortStale, () =>
                  setModalData({ university, contacts, mode: 'portal' }),
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {modalData && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] p-6 flex flex-col">
            <div className="sticky top-0 flex items-center justify-between gap-4 bg-white pb-3 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-[#005360]">{modalData.university}</h3>
              <button
                type="button"
                className="text-base font-semibold drop-shadow !text-[#c9ac7e] hover:!text-[#ffff] focus:!text-[#c9ac7e] !bg-[rgba(0,83,96,0.70)] hover:!bg-[rgba(0,83,96,0.70)] focus:!bg-[rgba(0,83,96,0.70)]"
                style={{
                  padding: '0.3rem 0.9rem',
                  borderRadius: '0.75rem',
                  letterSpacing: '0.02em',
                  textShadow: '0 2px 6px #00536099, 0 1px 0 #fff',
                  border: 'none',
                  textTransform: 'none',
                }}
                onClick={() => setModalData(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="mt-4 space-y-6 overflow-y-auto pr-2">
              {modalData.contacts.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="rounded-2xl border border-gray-400 bg-gray-200 p-4 shadow-inner"
                >
                  {modalData.mode === 'llamada' ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Nombre</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.nombre || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Apellidos</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.apellido || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Puesto</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.puesto || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Última llamada</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.ultima_llamada || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Nota.Per</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).nota_personal || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Email</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.email || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Histórico</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).historico || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Firma convenio</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).firma_convenio || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Convocatorias</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).convocatorias || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Anexos</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).anexos || ''}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Portal web</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).portal_web || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">User</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).user || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Clave</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).clave || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">MYD</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).myd || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">ADE</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).ade || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">RRHH</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).rrhh || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">ACA</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).aca || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">ATIC</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).atic || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Histórico</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).historico || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Estado ofertas</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).estado_ofertas || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Notas ofertas</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).notas_ofertas || ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactosUniversidadTable;
