import React from 'react';
import { 
  FaShieldAlt, 
  FaArrowRight, 
  FaUniversity, 
  FaBriefcase, 
  FaUser, 
  FaUserTie, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaUserLock, 
  FaKey,
  FaCalendarAlt,
  FaLink,
  FaStickyNote,
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaBuilding
} from 'react-icons/fa';

// Interface local que coincide con IContactoUniversidad
type ContactoUniversidad = {
  id?: number;
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

interface ContactosUniversidadFormProps {
  form: ContactoUniversidad;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editId: number | null;
  onCancel: () => void;
}

const ContactosUniversidadForm = ({ form, onChange, onSubmit, editId, onCancel }: ContactosUniversidadFormProps) => (
  <div className="bg-[#5da7d5c0] rounded-2xl p-8 mb-8 w-full max-w-6xl mx-auto shadow-2xl">
    <h2 className="text-xl text-[#005360] font-bold mb-6 text-center">Datos de Contacto Universidad</h2>
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* 1: Datos Básicos Universidad */}
      <div className="relative">
        <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="universidad" placeholder="Universidad" value={form.universidad||''} onChange={onChange} required />
      </div>
      <div className="relative">
        <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="tipo" placeholder="Tipo" value={form.tipo||''} onChange={onChange} />
      </div>
      <div className="relative">
        <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="puesto" placeholder="Puesto" value={form.puesto||''} onChange={onChange} />
      </div>

      {/* 2: Datos Personales */}
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="nombre" placeholder="Nombre" value={form.nombre||''} onChange={onChange} required />
      </div>
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="apellido" placeholder="Apellidos" value={form.apellido||''} onChange={onChange} />
      </div>
      <div className="relative">
        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="telefono" placeholder="Teléfono" value={form.telefono||''} onChange={onChange} />
      </div>

      {/* 3: Contacto */}
      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="email" placeholder="Email" value={form.email||''} onChange={onChange} />
      </div>
      <div className="relative">
        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="portal_web" placeholder="Portal/Web" value={form.portal_web||''} onChange={onChange} />
      </div>
      <div className="relative">
        <FaUserLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="usuario_portal" placeholder="Usuario Portal" value={form.usuario_portal||''} onChange={onChange} />
      </div>

      {/* 4: Credenciales y Fechas */}
      <div className="relative">
        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="clave" placeholder="Clave Portal" value={form.clave||''} onChange={onChange} />
      </div>
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaCalendarAlt className="text-blue-600" />Última Actualización</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="ultima_actualizacion" type="date" value={(form.ultima_actualizacion||'').slice(0,10)} onChange={onChange} />
      </div>
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaPhone className="text-blue-600" />Última Llamada</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="ultima_llamada" type="date" value={(form.ultima_llamada||'').slice(0,10)} onChange={onChange} />
      </div>

      {/* 5: Departamentos (5 campos en línea) */}
      <div className="md:col-span-3">
        <div className="grid grid-cols-5 gap-2">
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" />
            <input className="rounded-full p-2 pl-10 outline-orange-600 w-full text-sm" name="myd" placeholder="MYD" value={form.myd||''} onChange={onChange} />
          </div>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" />
            <input className="rounded-full p-2 pl-10 outline-orange-600 w-full text-sm" name="ade" placeholder="ADE" value={form.ade||''} onChange={onChange} />
          </div>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" />
            <input className="rounded-full p-2 pl-10 outline-orange-600 w-full text-sm" name="rrhh" placeholder="RRHH" value={form.rrhh||''} onChange={onChange} />
          </div>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" />
            <input className="rounded-full p-2 pl-10 outline-orange-600 w-full text-sm" name="aca" placeholder="ACA" value={form.aca||''} onChange={onChange} />
          </div>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" />
            <input className="rounded-full p-2 pl-10 outline-orange-600 w-full text-sm" name="atic" placeholder="ATIC" value={form.atic||''} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* 6: Estado y Ofertas */}
      <div className="relative">
        <FaClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
        <input className="rounded-full p-2 pl-10 outline-green-600 w-full" name="estado_ofertas" placeholder="Estado Ofertas" value={form.estado_ofertas||''} onChange={onChange} />
      </div>
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaCalendarAlt className="text-blue-600" />Firma Convenio</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="firma_convenio_fecha" type="date" value={(form.firma_convenio_fecha||'').slice(0,10)} onChange={onChange} />
      </div>
      <div className="relative">
        <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" />
        <input className="rounded-full p-2 pl-10 outline-purple-600 w-full" name="anexos" placeholder="Anexos" value={form.anexos||''} onChange={onChange} />
      </div>

      {/* 7: Convocatorias */}
      <div className="md:col-span-2 relative">
        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" />
        <input className="rounded-full p-2 pl-10 outline-purple-600 w-full" name="convocatorias" placeholder="Convocatorias" value={form.convocatorias||''} onChange={onChange} />
      </div>

      {/* 8: Áreas de Texto */}
      <div className="md:col-span-3 relative">
        <FaStickyNote className="absolute left-3 top-3 text-blue-600" />
        <textarea className="rounded-2xl p-2 pl-10 outline-blue-800 w-full" name="nota_personal" placeholder="Nota Personal" value={form.nota_personal||''} onChange={onChange} />
      </div>
      <div className="md:col-span-3 relative">
        <FaFileAlt className="absolute left-3 top-3 text-gray-600" />
        <textarea className="rounded-2xl p-2 pl-10 outline-gray-600 w-full" name="historico" placeholder="Histórico" value={form.historico||''} onChange={onChange} />
      </div>
      <div className="md:col-span-3 relative">
        <FaClipboardList className="absolute left-3 top-3 text-green-600" />
        <textarea className="rounded-2xl p-2 pl-10 outline-green-600 w-full" name="notas_ofertas" placeholder="Notas Ofertas" value={form.notas_ofertas||''} onChange={onChange} />
      </div>

      {/* Botones */}
      <div className="md:col-span-3 flex gap-4 justify-center mt-2">
        <button
          type="submit"
          className="px-6 py-2 rounded-full font-semibold shadow transition-all duration-150"
          style={{
            background: editId ? '#0077bd' : '#005360',
            color: editId ? '#fff' : '#c9ac7e',
            border: `2px solid #c9ac7e`,
            letterSpacing: '0.02em',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#c9ac7e';
            (e.currentTarget as HTMLButtonElement).style.color = '#005360';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background = editId ? '#0077bd' : '#005360';
            (e.currentTarget as HTMLButtonElement).style.color = editId ? '#fff' : '#c9ac7e';
          }}
        >
          {editId ? 'Actualizar' : 'Crear'}
        </button>
        {editId && <button type="button" className="bg-gray-300 px-6 py-2 rounded-full font-semibold shadow" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  </div>
);

export default ContactosUniversidadForm;
