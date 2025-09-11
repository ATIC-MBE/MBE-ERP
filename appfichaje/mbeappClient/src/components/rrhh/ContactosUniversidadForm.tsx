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
  FaUsers
} from 'react-icons/fa';

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
  portal_web?: string;
  usuario_portal?: string;
  contrasena_portal?: string;
  firma_convenio_link?: string;
  firma_convenio_fecha?: string;
  vencimiento_convenio?: string;
  altas_social?: string;
  ultima_actualizacion?: string;
  ultima_llamada?: string;
  siguiente_paso?: string;
  departamento?: string[] | string;
  notas?: string;
};

interface ContactosUniversidadFormProps {
  form: ContactoUniversidad;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editId: number | null;
  onCancel: () => void;
  departamentos: string[];
}

const ContactosUniversidadForm = ({ form, onChange, onSubmit, editId, onCancel, departamentos }: ContactosUniversidadFormProps) => (
  <div className="bg-[#5da7d5c0] rounded-2xl p-8 mb-8 w-full max-w-5xl mx-auto shadow-2xl">
    <h2 className="text-xl text-[#005360] font-bold mb-6 text-center">Datos de Contacto Universidad</h2>
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Universidad */}
      <div className="relative">
        <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="universidad" placeholder="Universidad" value={form.universidad||''} onChange={onChange} required />
      </div>
      {/* 2. Tipo */}
      <div className="relative">
        <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="tipo" placeholder="Tipo" value={form.tipo||''} onChange={onChange} />
      </div>
      {/* 3. Puesto */}
      <div className="relative">
        <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="puesto" placeholder="Puesto" value={form.puesto||''} onChange={onChange} />
      </div>
      {/* 4. Nombre */}
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="nombre" placeholder="Nombre" value={form.nombre||''} onChange={onChange} required />
      </div>
      {/* 5. Apellido(s) */}
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="apellido" placeholder="Apellidos" value={form.apellido||''} onChange={onChange} />
      </div>
      {/* 6. Email */}
      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="email" placeholder="Email" value={form.email||''} onChange={onChange} />
      </div>
      {/* 7. Teléfono */}
      <div className="relative">
        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="telefono" placeholder="Teléfono" value={form.telefono||''} onChange={onChange} />
      </div>
      {/* 8. Teléfono 2 */}
      <div className="relative">
        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="telefono2" placeholder="Teléfono 2" value={form.telefono2||''} onChange={onChange} />
      </div>
      {/* 9. Portal/Web */}
      <div className="relative">
        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="portal_web" placeholder="Portal/Web" value={form.portal_web||''} onChange={onChange} />
      </div>
      {/* 10. Usuario Portal */}
      <div className="relative">
        <FaUserLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="usuario_portal" placeholder="Usuario Portal" value={form.usuario_portal||''} onChange={onChange} />
      </div>
      {/* 11. Contraseña Portal */}
      <div className="relative">
        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="contrasena_portal" placeholder="Contraseña Portal" value={form.contrasena_portal||''} onChange={onChange} />
      </div>
      {/* 12. Última Actualización y Siguiente Paso */}
      <div className="flex flex-col md:col-span-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaCalendarAlt className="text-blue-600" />Última Actualización</label>
            <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="ultima_actualizacion" type="date" value={(form.ultima_actualizacion||'').slice(0,10)} onChange={onChange} />
          </div>
          <div className="flex-1 relative">
            <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaArrowRight className="text-green-700" />Siguiente Paso</label>
            <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="siguiente_paso" type="date" value={(form.siguiente_paso||'').slice(0,10)} onChange={onChange} />
          </div>
        </div>
      </div>
      {/* 13. Última Llamada */}
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaPhone className="text-blue-600" />Última Llamada</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="ultima_llamada" type="date" value={(form.ultima_llamada||'').slice(0,10)} onChange={onChange} />
      </div>
      {/* 14. Firma Convenio */}
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaCalendarAlt className="text-blue-600" />Firma Convenio</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="firma_convenio_fecha" type="date" value={(form.firma_convenio_fecha||'').slice(0,10)} onChange={onChange} />
      </div>
      {/* 15. Vencimiento Convenio */}
      <div className="flex flex-col relative">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2"><FaCalendarAlt className="text-red-600" />Vencimiento Convenio</label>
        <input className="rounded-full p-2 pl-8 outline-blue-800 w-full" name="vencimiento_convenio" type="date" value={(form.vencimiento_convenio||'').slice(0,10)} onChange={onChange} />
      </div>
      {/* 16. Link Convenio */}
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
        <input className="rounded-full p-2 pl-10 outline-blue-800 w-full" name="firma_convenio_link" placeholder="Link Convenio" value={form.firma_convenio_link||''} onChange={onChange} />
      </div>
      {/* 17. Alta Seguridad Social */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2">
          <FaShieldAlt className="text-blue-700" /> Alta Seguridad Social
        </label>
        <input className="rounded-full p-2 outline-blue-800" name="altas_social" placeholder="Alta Seguridad Social" value={form.altas_social||''} onChange={onChange} />
      </div>
      {/* 18. Departamentos */}
      <div className="flex flex-col md:col-span-3">
        <label className="text-xs text-gray-600 mb-1 flex items-center gap-2">
          <FaUsers className="text-blue-600" />Departamentos (puedes elegir varios)
        </label>
        <div className="flex flex-wrap gap-2 mt-1 pb-2 w-full justify-start">
          {departamentos.map((dep: string) => {
            const selected = Array.isArray(form.departamento) ? form.departamento.includes(dep) : form.departamento === dep;
            return (
              <button
                type="button"
                key={dep}
                className={`px-4 py-2 rounded-full border font-semibold transition-all duration-150 ${selected ? 'bg-[#c9ac7e] text-[#005360] border-[#c9ac7e] ring-2 ring-[#c9ac7e]' : 'bg-[#005360] text-[#fff] border-[#005360] hover:bg-[#c9ac7e] hover:text-[#005360] hover:border-[#c9ac7e]'}`}
                style={{ minWidth: 90, letterSpacing: '0.02em' }}
                onClick={() => {
                  let newDeps: string[] = Array.isArray(form.departamento) ? [...form.departamento] : [];
                  if (selected) {
                    newDeps = newDeps.filter(d => d !== dep);
                  } else {
                    newDeps.push(dep);
                  }
                  onChange({
                    target: {
                      name: 'departamento',
                      value: newDeps
                    }
                  } as any);
                }}
              >
                {dep}
              </button>
            );
          })}
        </div>
      </div>
      {/* 19. Notas */}
      <div className="md:col-span-3 relative">
        <FaStickyNote className="absolute left-3 top-3 text-blue-600" />
        <textarea className="rounded-2xl p-2 pl-10 outline-blue-800 w-full" name="notas" placeholder="Notas" value={form.notas||''} onChange={onChange} />
      </div>
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
