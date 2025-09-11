
import axios from 'axios';

let API_BASE = '';
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '6969') {
  API_BASE = 'http://185.252.233.57:3002';
} else if (process.env.NODE_ENV === 'production') {
  API_BASE = process.env.API_END_POINT_PROD || 'http://185.252.233.57:3002';
} else {
  API_BASE = process.env.API_END_POINT_DEV || 'http://185.252.233.57:3002';
}
export const API_CONTACTOS_UNIVERSIDAD_URL = `${API_BASE}/api/contactos-universidad`;

export const getContactosUniversidad = async () => {
  const res = await axios.get(API_CONTACTOS_UNIVERSIDAD_URL);
  return res.data;
};

export const getContactoUniversidad = async (id: number) => {
  const res = await axios.get(`${API_CONTACTOS_UNIVERSIDAD_URL}?id=${id}`);
  return res.data;
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
  await axios.delete(API_CONTACTOS_UNIVERSIDAD_URL, { data: { id } });
};
