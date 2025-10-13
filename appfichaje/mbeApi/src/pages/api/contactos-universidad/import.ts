import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';
import ContactoUniversidadBLL from '../../../api/business/ContactoUniversidadBLL';

const SPREADSHEET_ID = '1_tWh4nGZ9qwl_Ns6AfTunQ2_MhQtZ4778qCrkpU3ZzU';
const SHEET_NAME = 'contactos universidades';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('=== INICIANDO IMPORTACIÓN DE GOOGLE SHEETS ===');

    // Crear instancia del servicio de Google Sheets
    const sheetsService = new GoogleSheetsService();

    // Obtener contactos del Google Sheet
    console.log('Obteniendo datos del Google Sheet...');
    const contactosFromSheet = await sheetsService.getContactosUniversidad(SPREADSHEET_ID, SHEET_NAME);

    console.log(`Contactos obtenidos del Sheet: ${contactosFromSheet.length}`);

    // Obtener contactos existentes de la BD
    const contactosExistentes = await ContactoUniversidadBLL.getAll();

    let insertados = 0;
    let actualizados = 0;
    let errores = 0;
    const erroresDetalle: any[] = [];

    // Procesar cada contacto del Sheet
    for (const contactoSheet of contactosFromSheet) {
      try {
        // Buscar si ya existe un contacto con el mismo nombre, apellido y universidad
        const existente = contactosExistentes.find(
          (c: any) =>
            c.nombre?.toLowerCase() === contactoSheet.nombre?.toLowerCase() &&
            c.apellido?.toLowerCase() === contactoSheet.apellido?.toLowerCase() &&
            c.universidad?.toLowerCase() === contactoSheet.universidad?.toLowerCase()
        );

        if (existente) {
          // Actualizar contacto existente
          await ContactoUniversidadBLL.update(existente.id, {
            ...contactoSheet,
            usuario: 'IMPORT_SHEETS',
          });
          actualizados++;
          console.log(`✓ Actualizado: ${contactoSheet.nombre} ${contactoSheet.apellido} - ${contactoSheet.universidad}`);
        } else {
          // Insertar nuevo contacto
          await ContactoUniversidadBLL.insert({
            ...contactoSheet,
            usuario: 'IMPORT_SHEETS',
          });
          insertados++;
          console.log(`+ Insertado: ${contactoSheet.nombre} ${contactoSheet.apellido} - ${contactoSheet.universidad}`);
        }
      } catch (error: any) {
        errores++;
        erroresDetalle.push({
          contacto: `${contactoSheet.nombre} ${contactoSheet.apellido}`,
          error: error.message,
        });
        console.error(`✗ Error en: ${contactoSheet.nombre} ${contactoSheet.apellido}`, error.message);
      }
    }

    console.log('=== IMPORTACIÓN COMPLETADA ===');
    console.log(`Insertados: ${insertados}`);
    console.log(`Actualizados: ${actualizados}`);
    console.log(`Errores: ${errores}`);

    return res.status(200).json({
      success: true,
      total: contactosFromSheet.length,
      insertados,
      actualizados,
      errores,
      erroresDetalle: errores > 0 ? erroresDetalle : undefined,
    });
  } catch (error: any) {
    console.error('=== ERROR EN IMPORTACIÓN ===');
    console.error(error);
    return res.status(500).json({
      error: 'Error al importar contactos',
      details: error.message,
    });
  }
}
