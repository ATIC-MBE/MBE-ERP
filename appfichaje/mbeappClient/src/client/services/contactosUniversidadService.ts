const resolveApiBase = () => {
  const devFallback = process.env.API_END_POINT_DEV || 'http://localhost:3006';
  const prodFallback = process.env.API_END_POINT_PROD || devFallback;

  // When running on the server (SSR/SSG) we cannot inspect window, so rely on env defaults
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? prodFallback : devFallback;
  }

  const { protocol, hostname, port } = window.location;

  // Local development: explicitly point to the backend dev server
  if (hostname === 'localhost' && (port === '6969' || port === '3000')) {
    return devFallback;
  }

  // Allow overriding via browser-exposed env var if present
  const browserOverride = process.env.NEXT_PUBLIC_API_END_POINT;
  let base = browserOverride || (process.env.NODE_ENV === 'production' ? prodFallback : devFallback);

  // Avoid mixed-content issues when the app runs under HTTPS but the configured API uses HTTP
  if (protocol === 'https:' && base.startsWith('http://')) {
    base = base.replace('http://', 'https://');
    console.warn('[contactosUniversidadService] Forcing HTTPS API base to avoid mixed-content:', base);
  }

  return base || `${protocol}//${window.location.host}`;
};

const API_BASE = resolveApiBase();
export const API_CONTACTOS_UNIVERSIDAD_URL = `${API_BASE}/api/contactos-universidad`;
export const API_CONTACTOS_UNIVERSIDAD_SHEETS_URL = `${API_BASE}/api/contactos-universidad/sheets`;

export const getContactosUniversidad = async () => {
  try {
    const res = await fetch(API_CONTACTOS_UNIVERSIDAD_SHEETS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error al obtener contactos: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error obteniendo contactos desde Google Sheets:', error);
    throw error;
  }
};

export const getContactoUniversidad = async (id: number) => {
  try {
    const res = await fetch(`${API_CONTACTOS_UNIVERSIDAD_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error al obtener contacto: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error obteniendo contacto:', error);
    throw error;
  }
};


// Ensure departamento is sent as a string (comma-separated) if it's an array

// Normaliza los campos de fecha vacíos a null
function normalizeContactoDates(obj: any) {
  const dateFields = [
    'ultima_actualizacion',
    'siguiente_paso',
    'ultima_llamada',
    'firma_convenio_fecha',
    'vencimiento_convenio'
  ];
  const out = { ...obj };
  dateFields.forEach(f => {
    if (out[f] === '' || out[f] === undefined) out[f] = null;
  });
  return out;
}

export const createContactoUniversidad = async (data: any) => {
  try {
    const normalizedData = normalizeContactoDates({
      ...data,
      departamento: Array.isArray(data.departamento) ? data.departamento.join(',') : data.departamento
    });
    
    console.log('=== ENVIANDO DATOS AL BACKEND ===');
    console.log('URL:', API_CONTACTOS_UNIVERSIDAD_URL);
    console.log('Datos normalizados:', JSON.stringify(normalizedData, null, 2));
    
    const response = await fetch(API_CONTACTOS_UNIVERSIDAD_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(normalizedData),
    });

    console.log('=== RESPUESTA DEL SERVIDOR ===');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error ${response.status}`;
        console.error('Error JSON del servidor:', errorData);
      } catch {
        errorMessage = await response.text();
        console.error('Error texto del servidor:', errorMessage);
      }
      return { error: errorMessage };
    }

    const result = await response.json();
    console.log('=== RESULTADO EXITOSO ===');
    console.log('Resultado:', result);
    return result;
  } catch (error) {
    console.error('=== ERROR DE RED O PARSING ===');
    console.error('Error completo:', error);
    return { error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}` };
  }
};

export const updateContactoUniversidad = async (id: number, data: any) => {
  try {
    const normalizedData = normalizeContactoDates({
      id,
      ...data,
      departamento: Array.isArray(data.departamento) ? data.departamento.join(',') : data.departamento
    });
    
    console.log('=== ACTUALIZANDO CONTACTO ===');
    console.log('ID:', id);
    console.log('URL:', API_CONTACTOS_UNIVERSIDAD_URL);
    console.log('Datos normalizados:', JSON.stringify(normalizedData, null, 2));
    
    const response = await fetch(API_CONTACTOS_UNIVERSIDAD_URL, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(normalizedData),
    });

    console.log('=== RESPUESTA DEL SERVIDOR (UPDATE) ===');
    console.log('Status:', response.status);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error ${response.status}`;
        console.error('Error JSON del servidor:', errorData);
      } catch {
        errorMessage = await response.text();
        console.error('Error texto del servidor:', errorMessage);
      }
      return { error: errorMessage };
    }

    const result = await response.json();
    console.log('=== ACTUALIZACIÓN EXITOSA ===');
    console.log('Resultado:', result);
    return result;
  } catch (error) {
    console.error('=== ERROR DE RED O PARSING (UPDATE) ===');
    console.error('Error completo:', error);
    return { error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}` };
  }
};

export const deleteContactoUniversidad = async (id: number) => {
  try {
    const res = await fetch(API_CONTACTOS_UNIVERSIDAD_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    if (!res.ok) {
      throw new Error(`Error al eliminar contacto: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error eliminando contacto:', error);
    throw error;
  }
};
