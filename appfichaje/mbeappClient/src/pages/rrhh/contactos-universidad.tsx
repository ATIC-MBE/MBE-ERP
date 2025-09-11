
import { useEffect, useState, useContext } from 'react';
import UserContext from '@/client/context/UserContext';
import { Layout } from '@/components/Layout';
import {
  getContactosUniversidad,
  getContactoUniversidad,
  createContactoUniversidad,
  updateContactoUniversidad,
  deleteContactoUniversidad,
} from '@/client/services/contactosUniversidadService';
import ContactosUniversidadForm from '@/components/rrhh/ContactosUniversidadForm';
import ContactosUniversidadTable from '@/components/rrhh/ContactosUniversidadTable';
import ContactosUniversidadHistorial, { HistoricoContacto } from '@/components/rrhh/ContactosUniversidadHistorial';
import { getHistorialContactoUniversidad } from '@/client/services/contactosUniversidadHistorialService';

const departamentos = ['ATIC', 'ADE', 'RRHH', 'MYD', 'ACA', 'TODOS'];

export default function ContactosUniversidadPage() {
  const userCtx = useContext(UserContext);
  const [contactos, setContactos] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterUniversidad, setFilterUniversidad] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [historial, setHistorial] = useState<HistoricoContacto[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);

  const fetchContactos = async () => {
    setLoading(true);
    setContactos(await getContactosUniversidad());
    setLoading(false);
  };

  useEffect(() => { fetchContactos(); }, []);

  const handleChange = (e: any) => {
    if (e.target.name === 'departamento') {
      // Si el value ya es un array, lo usamos directamente (viene de los botones)
      setForm({ ...form, departamento: e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = async (c: any) => {
    setEditId(c.id);
    // Siempre pedir el contacto actualizado al backend
    const contactoActualizado = await getContactoUniversidad(c.id);
    let depArr = contactoActualizado.departamento;
    if (typeof depArr === 'string') {
      depArr = depArr.split(',').map((d: string) => d.trim()).filter((d: string) => d);
    }
    if (!depArr) depArr = [];
    setForm({ ...contactoActualizado, departamento: depArr, notas: '' });
    setShowForm(true);
    setLoadingHist(true);
    try {
      const hist = await getHistorialContactoUniversidad(c.id);
      setHistorial(hist);
    } catch {
      setHistorial([]);
    }
    setLoadingHist(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar contacto?')) {
      await deleteContactoUniversidad(id);
      fetchContactos();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let usuario = 'RRHH';
    if (userCtx && (userCtx.userData?.username || userCtx.userData?.nombre)) {
      usuario = userCtx.userData.username || userCtx.userData.nombre;
    }
    
    // Preparar datos de forma más robusta
    const safeForm: any = {
      // Campos de texto básicos
      nombre: form.nombre || '',
      apellido: form.apellido || '',
      telefono: form.telefono || '',
      telefono2: form.telefono2 || '',
      universidad: form.universidad || '',
      tipo: form.tipo || '',
      puesto: form.puesto || '',
      email: form.email || '',
      portal_web: form.portal_web || '',
      usuario_portal: form.usuario_portal || '',
      contrasena_portal: form.contrasena_portal || '',
      firma_convenio_link: form.firma_convenio_link || '',
      altas_social: form.altas_social || '',
      notas: form.notas || '',
      
      // Campos de fecha - convertir strings vacíos a null
      ultima_actualizacion: form.ultima_actualizacion || null,
      siguiente_paso: form.siguiente_paso || null,
      ultima_llamada: form.ultima_llamada || null,
      firma_convenio_fecha: form.firma_convenio_fecha || null,
      vencimiento_convenio: form.vencimiento_convenio || null,
      
      // Campo departamento - convertir array a string
      departamento: Array.isArray(form.departamento) 
        ? form.departamento.join(',') 
        : (form.departamento || ''),
      
      // Usuario
      usuario: usuario
    };

    console.log('=== DATOS DEL FORMULARIO PREPARADOS ===');
    console.log('Form original:', form);
    console.log('Datos preparados para enviar:', safeForm);
    
    try {
      if (editId) {
        console.log('=== ACTUALIZANDO CONTACTO ===');
        console.log('ID a actualizar:', editId);
        const updated = await updateContactoUniversidad(editId, safeForm);
        console.log('Resultado actualización:', updated);
        
        if (!updated || updated.error) {
          console.error('Error en actualización:', updated);
          alert(`Error actualizando el contacto: ${updated?.error || 'Error desconocido'}`);
          return;
        }
        
        // Refrescar el contacto actualizado
        const contactoActualizado = await getContactoUniversidad(editId);
        let depArr = contactoActualizado.departamento;
        if (typeof depArr === 'string') {
          depArr = depArr.split(',').map((d: string) => d.trim()).filter((d: string) => d);
        }
        if (!depArr) depArr = [];
        setForm({ ...contactoActualizado, departamento: depArr, notas: '' });
        
        await fetchContactos();
        
        // Refrescar historial
        setLoadingHist(true);
        try {
          const hist = await getHistorialContactoUniversidad(editId);
          setHistorial(hist);
        } catch {
          setHistorial([]);
        }
        setLoadingHist(false);
        
        alert('Contacto actualizado exitosamente');
      } else {
        console.log('=== CREANDO NUEVO CONTACTO ===');
        const created = await createContactoUniversidad(safeForm);
        console.log('Resultado de creación:', created);
        
        if (!created || created.error) {
          console.error('Error en creación:', created);
          alert(`Error creando el contacto: ${created?.error || 'Error desconocido. Revisa la consola para más detalles.'}`);
          return;
        }
        
        // Éxito - limpiar formulario
        console.log('=== CONTACTO CREADO EXITOSAMENTE ===');
        setForm({});
        setEditId(null);
        setShowForm(false);
        setHistorial([]);
        await fetchContactos();
        alert('Contacto creado exitosamente');
      }
    } catch (error) {
      console.error('=== ERROR INESPERADO EN HANDLESUBMIT ===');
      console.error('Error completo:', error);
      alert(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Filtros y búsqueda
  const filteredContactos = contactos.filter(c => {
    const matchesSearch =
      !search ||
      (c.nombre && c.nombre.toLowerCase().includes(search.toLowerCase())) ||
      (c.apellido && c.apellido.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.telefono && c.telefono.toLowerCase().includes(search.toLowerCase()));
    const matchesUniversidad = !filterUniversidad || (c.universidad && c.universidad.toLowerCase().includes(filterUniversidad.toLowerCase()));
    // Mejorar filtro de departamento: buscar aunque sea string separado por comas
    let depArr = c.departamento;
    if (typeof depArr === 'string') {
      depArr = depArr.split(',').map((d: string) => d.trim()).filter((d: string) => d);
    }
    const matchesDepartamento = !filterDepartamento || (Array.isArray(depArr) ? depArr.includes(filterDepartamento) : depArr === filterDepartamento);
    return matchesSearch && matchesUniversidad && matchesDepartamento;
  });

  // Detectar rol para la X de salir
  let rol = 'rrhh';
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('rrhhmaster')) rol = 'rrhhmaster';
    else if (path.includes('rrhh')) rol = 'rrhh';
  }

  return (
    <Layout>
      <div className="c-bg-main-100 min-h-screen flex flex-col items-center justify-start py-8">
    <div className="w-full max-w-7xl relative px-2 md:px-8">
          {/* Botón de salir arriba a la derecha */}
          <button
            onClick={() => window.location.href = `/${rol}`}
            className="absolute top-0 right-0 mt-4 mr-4 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-blue-100 hover:scale-110 transition-all duration-200 border-2 border-blue-200 z-20"
            title="Salir a menú"
            aria-label="Salir"
            style={{ boxShadow: '0 4px 16px 0 #2580b533' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15" fill="#fff" stroke="#0077bd" strokeWidth="2" />
              <line x1="11" y1="11" x2="21" y2="21" stroke="#6f8d9fff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="21" y1="11" x2="11" y2="21" stroke="#1d3d53ff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          <h1
            className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg"
            style={{
              color: '#c9ac7e',
              background: 'rgba(0,83,96,0.70)',
              padding: '0.7rem 2.5rem',
              borderRadius: '1.2rem',
              letterSpacing: '0.03em',
              textShadow: '0 2px 8px #00536099, 0 1px 0 #fff',
              display: 'inline-block',
            }}
          >
            Contactos de Universidades (RRHH)
          </h1>
          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center items-center">
            <input
              className="rounded-full p-2 outline-blue-800 border border-blue-200"
              placeholder="Buscar por nombre, apellido, email o teléfono"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 220 }}
            />
            <input
              className="rounded-full p-2 outline-blue-800 border border-blue-200"
              placeholder="Filtrar por universidad"
              value={filterUniversidad}
              onChange={e => setFilterUniversidad(e.target.value)}
              style={{ minWidth: 180 }}
            />
            <select
              className="rounded-full p-2 outline-blue-800 border border-blue-200"
              value={filterDepartamento}
              onChange={e => setFilterDepartamento(e.target.value)}
              style={{ minWidth: 160 }}
            >
              <option value="">Todos los departamentos</option>
              {departamentos.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          {/* Botón para mostrar/ocultar formulario */}
          <div className="flex justify-center mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition-all"
              style={{
                background: showForm ? 'rgba(201,172,126,0.85)' : '#005360',
                color: showForm ? '#ddf3f6ff' : '#c9ac7e',
                border: showForm ? '2px solid #c9ac7e' : 'none',
                boxShadow: showForm ? '0 2px 8px 0 #c9ac7e55' : undefined,
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#c9ac7e';
                (e.currentTarget as HTMLButtonElement).style.color = '#005360';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.background = showForm ? 'rgba(201,172,126,0.85)' : '#005360';
                (e.currentTarget as HTMLButtonElement).style.color = showForm ? '#005360' : '#c9ac7e';
              }}
              onClick={() => {
                setShowForm(f => {
                  // Si se va a mostrar el formulario (abrir para nuevo contacto), limpiar el form y el editId
                  if (!showForm) {
                    setForm({});
                    setEditId(null);
                    setHistorial([]);
                  }
                  return !f;
                });
              }}
            >
              {showForm ? (
                <>
                  <span style={{color: showForm ? '#005360' : '#c9ac7e', fontWeight: 700, letterSpacing: '0.02em', textShadow: '0 2px 8px #fff8, 0 1px 0 #005360'}}>
                    Ocultar formulario
                  </span>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </>
              ) : (
                <>
                  <span style={{color: showForm ? '#005360' : '#c9ac7e', fontWeight: 700, letterSpacing: '0.02em', textShadow: '0 2px 8px #fff8, 0 1px 0 #005360'}}>
                    Nuevo contacto
                  </span>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </>
              )}
            </button>
          </div>
          {showForm && (
            <>
              <ContactosUniversidadForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                editId={editId}
                onCancel={() => { setEditId(null); setForm({}); setShowForm(false); setHistorial([]); }}
                departamentos={departamentos}
              />
              {editId && (
                <div className="mt-2">
                  <ContactosUniversidadHistorial historial={historial} />
                  {loadingHist && <div className="text-center text-blue-700">Cargando historial...</div>}
                </div>
              )}
            </>
          )}
          {/* Tabla */}
          <ContactosUniversidadTable
            data={filteredContactos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}
