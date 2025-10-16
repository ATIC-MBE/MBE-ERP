import React, { useMemo, useState, useEffect } from 'react';

type ContactoUniversidad = {
  id?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  universidad?: string;
  tipo?: string;
  puesto?: string;
  email?: string;
  convenio?: string;
  ultima_llamada?: string;
};

interface ContactosUniversidadTableProps {
  data: ContactoUniversidad[];
  onEdit: (c: ContactoUniversidad) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const THIRTY_DAYS = 30;

type ModalState =
  | {
      university: string;
      contacts: ContactoUniversidad[];
      mode: 'llamada' | 'portal';
    }
  | {
      university: string;
      contact: ContactoUniversidad;
      mode: 'universidad';
    };

const ContactosUniversidadTable = ({ data, onEdit, onDelete, loading }: ContactosUniversidadTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    column: 'universidad' | 'ultima_llamada' | 'ult_act_port';
    direction: 'asc' | 'desc';
  } | null>(null);

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
  const ultimaDate = parseDate(firstContact.ultima_llamada);
  const ultActDate = parseDate((firstContact as any).ult_act_port);
        const daysUltLlamada = ultimaDate ? Math.floor((Date.now() - ultimaDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
        const daysUltActPort = ultActDate ? Math.floor((Date.now() - ultActDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
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
          ultimaDate,
          ultActDate,
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
        ultimaDate: Date | null;
        ultActDate: Date | null;
      }>;
  }, [data]);

  const rows = useMemo(() => {
    const sorted = [...filteredUniversities];
    if (!sortConfig) return sorted;
    const directionFactor = sortConfig.direction === 'asc' ? 1 : -1;
    const compareDates = (aDate: Date | null, bDate: Date | null) => {
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return (aDate.getTime() - bDate.getTime()) * directionFactor;
    };
    sorted.sort((a, b) => {
      switch (sortConfig.column) {
        case 'universidad': {
          const aValue = a.university || '';
          const bValue = b.university || '';
          return aValue.localeCompare(bValue, 'es', { sensitivity: 'base' }) * directionFactor;
        }
        case 'ultima_llamada': {
          return compareDates(a.ultimaDate, b.ultimaDate);
        }
        case 'ult_act_port': {
          return compareDates(a.ultActDate, b.ultActDate);
        }
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredUniversities, sortConfig]);

  const toggleSort = (column: 'universidad' | 'ultima_llamada' | 'ult_act_port') => {
    setSortConfig((prev) => {
      if (prev?.column === column) {
        const nextDirection = prev.direction === 'asc' ? 'desc' : 'asc';
        return { column, direction: nextDirection };
      }
      return { column, direction: column === 'universidad' ? 'asc' : 'asc' };
    });
  };

  const getSortIndicator = (column: 'universidad' | 'ultima_llamada' | 'ult_act_port') => {
    if (sortConfig?.column !== column) return '';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getDateCellClass = (isStale: boolean) => (isStale ? 'text-red-600 font-semibold' : 'text-gray-900');

  const [modalData, setModalData] = useState<ModalState | null>(null);
  
  // Agregar event listener para cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalData) {
        setModalData(null);
      }
    };

    if (modalData) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalData]);
  
  const headerButtonClass = 'flex items-center gap-1 uppercase text-xs bg-transparent transition-colors focus:outline-none contactos-header-button';

  const FIELD_LABELS: Record<string, string> = {
    universidad: 'Universidad',
    tipo: 'Tipo',
    puesto: 'Puesto',
    nota_personal: 'Nota personal',
    nombre: 'Nombre',
    apellido: 'Apellidos',
    telefono: 'Teléfono',
    email: 'Email',
    historico: 'Histórico',
    ultima_llamada: 'Última llamada',
    ultima_actualizacion: 'Última actualización',
    myd: 'MYD',
    ade: 'ADE',
    rrhh: 'RRHH',
    aca: 'ACA',
    atic: 'ATIC',
    estado_ofertas: 'Estado ofertas',
    portal_web: 'Portal web',
    usuario_portal: 'Usuario portal',
    clave: 'Contraseña portal',
    firma_convenio_fecha: 'Fecha firma convenio',
    notas_ofertas: 'Notas ofertas',
    anexos: 'Anexos',
    convocatorias: 'Convocatorias',
  };

  const UNIVERSITY_FIELD_ORDER = [
    'tipo',
    'puesto',
    'nombre',
    'apellido',
    'telefono',
    'email',
    'nota_personal',
    'historico',
    'ultima_llamada',
    'ult_act_port',
    'estado_ofertas',
    'myd',
    'ade',
    'rrhh',
    'aca',
    'atic',
    'portal_web',
    'usuario_portal',
    'clave',
    'ultima_actualizacion',
    'firma_convenio_fecha',
    'convocatorias',
    'anexos',
    'notas_ofertas',
  ];

  const FIELD_SPANS: Record<string, number> = {
    tipo: 1,
    puesto: 1,
    nombre: 1,
    apellido: 1,
    telefono: 1,
    email: 1,
    ultima_llamada: 1,
    usuario: 1,
    clave: 1,
    myd: 1,
    ade: 1,
    rrhh: 1,
    aca: 1,
    atic: 1,
    ult_act_port: 1,
    usuario_portal: 1,
    contrasena_portal: 1,
    ultima_actualizacion: 1,
    firma_convenio: 1,
  };

  const COMPACT_FIELDS = new Set(['myd', 'ade', 'rrhh', 'aca', 'atic']);
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
        onClick={onClick ? handleClick : undefined}
      >
        {value}
        {suffix}
      </span>
    );
  };

  return (
    <div className="space-y-6">
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
                <th className="px-2 py-2 font-bold text-left uppercase text-xs">
                  <button
                    type="button"
                    className={headerButtonClass}
                    onClick={() => toggleSort('universidad')}
                  >
                    Universidad {getSortIndicator('universidad')}
                  </button>
                </th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Tipo</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs">Puesto</th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs whitespace-nowrap">
                  <button
                    type="button"
                    className={headerButtonClass}
                    onClick={() => toggleSort('ultima_llamada')}
                  >
                    Ult. llamada {getSortIndicator('ultima_llamada')}
                  </button>
                </th>
                <th className="px-2 py-2 font-bold text-left text-white uppercase text-xs whitespace-nowrap">
                  <button
                    type="button"
                    className={headerButtonClass}
                    onClick={() => toggleSort('ult_act_port')}
                  >
                    Ult. act. port {getSortIndicator('ult_act_port')}
                  </button>
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
                    <td className="px-3 py-2 text-xs sm:text-sm font-semibold">
                      <span
                        className="cursor-pointer underline underline-offset-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          setModalData({ university, contact, mode: 'universidad' });
                        }}
                      >
                        {university}
                      </span>
                    </td>
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
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-4">No hay registros para los filtros seleccionados.</div>
        ) : (
          rows.map(({ university, contact, contacts, daysUltLlamada, daysUltActPort, isUltLlamadaStale, isUltActPortStale }) => (
            <div key={university} className="bg-white rounded-2xl shadow p-3 mb-3 flex flex-col gap-2 border-2 border-[#005360]">
              <div>
                <span className="font-bold text-[#005360]">Universidad:</span>{' '}
                <span
                  className="underline underline-offset-2 cursor-pointer"
                  onClick={() => setModalData({ university, contact, mode: 'universidad' })}
                >
                  {university}
                </span>
              </div>
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
              {modalData.mode === 'universidad' && modalData.contact ? (
                <div className="rounded-2xl border border-gray-400 bg-gray-200 p-4 shadow-inner">
                  {(() => {
                    const contactRecord = modalData.contact as Record<string, unknown>;
                    const allKeys = Array.from(
                      new Set([
                        ...UNIVERSITY_FIELD_ORDER,
                        ...Object.keys(contactRecord),
                      ]),
                    ).filter((key) => 
                      key !== 'id' && 
                      key !== 'rowIndex' && 
                      key !== '_rowIndex' && 
                      key !== 'universidad' && // Ya se muestra en el encabezado
                      key !== 'ult_act_port'   // Campo del Excel no incluido en FIELD_LABELS
                    );

                    const formatValue = (key: string) => {
                      const rawValue = contactRecord[key];
                      if (Array.isArray(rawValue)) return rawValue.join(', ');
                      if (rawValue === null || rawValue === undefined) return '';
                      if (typeof rawValue === 'object') return JSON.stringify(rawValue);
                      return String(rawValue);
                    };

                    const renderField = (key: string, className: string) => {
                      const label = FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
                      return (
                        <div key={key} className={className}>
                          <label className="block text-xs font-semibold text-[#005360] uppercase">{label}</label>
                          <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line break-words">
                            {formatValue(key)}
                          </p>
                        </div>
                      );
                    };

                    const nodes: React.ReactNode[] = [];
                    let index = 0;
                    let compactCounter = 0;

                    while (index < allKeys.length) {
                      const key = allKeys[index];
                      if (COMPACT_FIELDS.has(key)) {
                        const compactKeys: string[] = [];
                        while (index < allKeys.length && COMPACT_FIELDS.has(allKeys[index])) {
                          compactKeys.push(allKeys[index]);
                          index += 1;
                        }

                        if (compactKeys.length > 0) {
                          nodes.push(
                            <div key={`compact-${compactCounter}`} className="sm:col-span-2">
                              <div
                                className="grid gap-3 grid-cols-1 sm:grid-cols-5"
                                style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
                              >
                                {compactKeys.map((compactKey) => renderField(compactKey, ''))}
                              </div>
                            </div>,
                          );
                          compactCounter += 1;
                        }
                        continue;
                      }

                      const span = FIELD_SPANS[key] ?? 2;
                      const className = span === 1 ? 'sm:col-span-1' : 'sm:col-span-2';
                      nodes.push(renderField(key, className));
                      index += 1;
                    }

                    return (
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {nodes}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                modalData.mode !== 'universidad' && modalData.contacts?.map((c, idx) => (
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
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Telefono</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).telefono || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Email</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{c.email || ''}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Nota Personal</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">{(c as any).nota_personal || ''}</p>
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
                      <div>
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Estado ofertas</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).estado_ofertas || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Histórico</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).historico || ''}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#005360] uppercase">Notas ofertas</label>
                        <p className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-line">{(c as any).notas_ofertas || ''}</p>
                      </div>
                    </div>
                  )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactosUniversidadTable;
