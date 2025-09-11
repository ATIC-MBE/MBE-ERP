import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
  // Ordenar por siguiente_paso ascendente (los más próximos primero)
  const sortedData = [...data].sort((a, b) => {
    if (a.siguiente_paso && b.siguiente_paso) {
      return new Date(a.siguiente_paso).getTime() - new Date(b.siguiente_paso).getTime();
    }
    if (a.siguiente_paso) return -1;
    if (b.siguiente_paso) return 1;
    return 0;
  });
  return (
    <div className="bg-[#badaed] border border-blue rounded-2xl p-2 sm:p-4 w-full max-w-7xl mx-auto mt-4 overflow-x-auto">
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
      {/* Responsive tabla: horizontal en desktop, vertical en móvil */}
    <div className="hidden sm:block w-full">
      <div className="overflow-x-visible w-full">
            <table className="w-full text-xs sm:text-sm whitespace-normal break-words">
              <thead style={{background: '#3e7f82'}}>
                <tr>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Universidad</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Puesto</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Nombre</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Apellido</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Tipo</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Email</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Teléfono</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Teléfono 2</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Última Llamada</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Siguiente Paso</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Vencimiento Convenio</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Altas Social</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Departamentos</th>
                  <th className="px-3 py-2 font-bold text-left text-[#c9ac7e] uppercase">Acciones</th>
                </tr>
              </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={14} className="text-center py-4">Cargando...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={14} className="text-center py-4">No hay registros</td></tr>
          ) : sortedData.map((c: ContactoUniversidad, i: number) => {
            // Resaltar rojo si la fecha es pasada
            const hoy = new Date();
            let siguientePasoRojo = false;
            let vencimientoRojo = false;
            if (c.siguiente_paso) {
              const fechaSP = new Date(c.siguiente_paso);
              siguientePasoRojo = fechaSP < new Date(hoy.toISOString().slice(0,10));
            }
            if (c.vencimiento_convenio) {
              const fechaVC = new Date(c.vencimiento_convenio);
              vencimientoRojo = fechaVC < new Date(hoy.toISOString().slice(0,10));
            }
            return (
              <tr key={c.id || i} className="even:bg-[#e3f1fa] hover:bg-blue-100 transition-colors">
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[120px]">{c.universidad}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[100px]">{c.puesto}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[100px]">{c.nombre}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[100px]">{c.apellido}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[80px]">{c.tipo}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[140px]">{c.email}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[90px]">{c.telefono}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[90px]">{c.telefono2}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[100px]">{c.ultima_llamada ? c.ultima_llamada.slice(0,10) : ''}</td>
                <td className={`px-1 py-1 sm:px-2 sm:py-2 font-bold max-w-[100px] ${siguientePasoRojo ? 'text-red-600' : ''}`}>{c.siguiente_paso ? c.siguiente_paso.slice(0,10) : ''}</td>
                <td className={`px-1 py-1 sm:px-2 sm:py-2 font-bold max-w-[100px] ${vencimientoRojo ? 'text-red-600' : ''}`}>{c.vencimiento_convenio ? c.vencimiento_convenio.slice(0,10) : ''}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[90px]">{c.altas_social}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 break-words max-w-[120px]">{Array.isArray(c.departamento) ? c.departamento.join(', ') : c.departamento}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 min-w-[70px] flex flex-row gap-1 items-center justify-center">
                  <button className="bg-blue-600 hover:bg-blue-800 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 shadow transition-all text-xs sm:text-base" title="Editar" onClick={() => onEdit(c)}><FaEdit /></button>
                  <button className="bg-red-500 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 shadow transition-all text-xs sm:text-base" title="Eliminar" onClick={() => c.id && onDelete(c.id)}><FaTrash /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
    {/* Mobile vertical cards */}
    <div className="block sm:hidden w-full">
      {sortedData.map((c: ContactoUniversidad, i: number) => {
        const hoy = new Date();
        let siguientePasoRojo = false;
        let vencimientoRojo = false;
        if (c.siguiente_paso) {
          const fechaSP = new Date(c.siguiente_paso);
          siguientePasoRojo = fechaSP < new Date(hoy.toISOString().slice(0,10));
        }
        if (c.vencimiento_convenio) {
          const fechaVC = new Date(c.vencimiento_convenio);
          vencimientoRojo = fechaVC < new Date(hoy.toISOString().slice(0,10));
        }
        return (
          <div
            key={c.id || i}
            className="bg-white rounded-2xl shadow p-3 mb-3 flex flex-col gap-1 border border-blue-200 cursor-pointer active:ring-2 active:ring-blue-400"
            onClick={e => {
              // Evitar que el click en el botón eliminar dispare editar
              if ((e.target as HTMLElement).closest('button')) return;
              onEdit(c);
            }}
          >
            <div><span className="font-bold text-blue-700">Universidad:</span> {c.universidad}</div>
            <div><span className="font-bold text-blue-700">Puesto:</span> {c.puesto}</div>
            <div><span className="font-bold text-blue-700">Nombre:</span> {c.nombre}</div>
            <div><span className="font-bold text-blue-700">Apellido:</span> {c.apellido}</div>
            <div><span className="font-bold text-blue-700">Tipo:</span> {c.tipo}</div>
            <div><span className="font-bold text-blue-700">Email:</span> {c.email}</div>
            <div><span className="font-bold text-blue-700">Teléfono:</span> {c.telefono}</div>
            <div><span className="font-bold text-blue-700">Teléfono 2:</span> {c.telefono2}</div>
            <div><span className="font-bold text-blue-700">Última Llamada:</span> {c.ultima_llamada ? c.ultima_llamada.slice(0,10) : ''}</div>
            <div><span className={`font-bold text-blue-700`}>Siguiente Paso:</span> <span className={siguientePasoRojo ? 'text-red-600 font-bold' : ''}>{c.siguiente_paso ? c.siguiente_paso.slice(0,10) : ''}</span></div>
            <div><span className={`font-bold text-blue-700`}>Vencimiento Convenio:</span> <span className={vencimientoRojo ? 'text-red-600 font-bold' : ''}>{c.vencimiento_convenio ? c.vencimiento_convenio.slice(0,10) : ''}</span></div>
            <div><span className="font-bold text-blue-700">Altas Social:</span> {c.altas_social}</div>
            <div><span className="font-bold text-blue-700">Departamentos:</span> {Array.isArray(c.departamento) ? c.departamento.join(', ') : c.departamento}</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow transition-all text-xs" title="Editar" onClick={e => {e.stopPropagation(); onEdit(c);}}><FaEdit /></button>
              <button className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow transition-all text-xs" title="Eliminar" onClick={e => {e.stopPropagation(); c.id && onDelete(c.id);}}><FaTrash /></button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default ContactosUniversidadTable;
