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
  const [showForm, setShowForm] = useState(false);
  const [historial, setHistorial] = useState<HistoricoContacto[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchContactos = async () => {
    setLoading(true);
    setContactos(await getContactosUniversidad());
    setLoading(false);
  };

  useEffect(() => { fetchContactos(); }, []);

  const handleImportFromSheets = async () => {
    if (!confirm('¿Deseas importar los contactos desde Google Sheets? Esto puede tomar unos momentos.')) {
      return;
    }

    setImporting(true);
    try {
      let API_BASE = '';
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '6969') {
        API_BASE = 'http://localhost:3006';
      } else if (process.env.NODE_ENV === 'production') {
        API_BASE = process.env.API_END_POINT_PROD || 'http://185.252.233.57:3002';
      } else {
        API_BASE = process.env.API_END_POINT_DEV || 'http://localhost:3006';
      }

      const response = await fetch(`${API_BASE}/api/contactos-universidad/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Importación exitosa!\n\nTotal: ${result.total}\nInsertados: ${result.insertados}\nActualizados: ${result.actualizados}\nErrores: ${result.errores}`);
        await fetchContactos();
      } else {
        alert(`Error en la importación: ${result.error || result.details || 'Error desconocido'}`);
      }
    } catch (error: any) {
      console.error('Error importando desde Google Sheets:', error);
      alert(`Error de conexión: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

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
      (c.puesto && c.puesto.toLowerCase().includes(search.toLowerCase())) ||
      (c.universidad && c.universidad.toLowerCase().includes(search.toLowerCase())) ||
      (c.tipo && c.tipo.toLowerCase().includes(search.toLowerCase())) ||
      (c.ultima_actualizacion && c.ultima_actualizacion.toLowerCase().includes(search.toLowerCase())) ||
      (c.ultima_llamada && c.ultima_llamada.toLowerCase().includes(search.toLowerCase())) ||
      (c.nombre && c.nombre.toLowerCase().includes(search.toLowerCase())) ||
      (c.apellido && c.apellido.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.telefono && c.telefono.toLowerCase().includes(search.toLowerCase()));
    // Mejorar filtro de departamento: buscar aunque sea string separado por comas
    return matchesSearch;
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
              className="rounded-full p-2 outline-blue-800 border border-blue-200 w-full md:w-80"
              placeholder="Buscar por nombre, tipo, fecha..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 260 }}
            />
            {/* Botón de importar desde Google Sheets */}
            <button
              className="group flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition-all bg-green-600 hover:bg-green-700 text-white border-2 border-green-600 hover:border-[#c9ac7e]"
              onClick={handleImportFromSheets}
              disabled={importing}
            >
              {importing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white group-hover:text-[#c9ac7e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="transition-colors group-hover:text-[#c9ac7e]">Importando...</span>
                </>
              ) : (
                <>
                  <svg
                    className="transition-colors text-white group-hover:text-[#c9ac7e]"
                    width="20" height="20"
                    fill="none"
                    stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span
                    className="transition-colors group-hover:text-[#c9ac7e]"
                    style={{ fontWeight: 700, letterSpacing: '0.02em' }}
                  >
                    Importar desde Excel
                  </span>
                </>
              )}
            </button>
          </div>
          {/* Botones para mostrar/ocultar formulario e importar */}
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
