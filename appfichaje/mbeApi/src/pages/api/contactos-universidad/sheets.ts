import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../services/GoogleSheetsService';

const SPREADSHEET_ID = '1_tWh4nGZ9qwl_Ns6AfTunQ2_MhQtZ4778qCrkpU3ZzU';
const SHEET_NAME = 'contactos universidades';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('=== LEYENDO DATOS DE GOOGLE SHEETS ===');

    // Crear instancia del servicio de Google Sheets
    const sheetsService = new GoogleSheetsService();

    // Obtener contactos del Google Sheet
    const contactos = await sheetsService.getContactosUniversidad(SPREADSHEET_ID, SHEET_NAME);

    console.log(`Contactos obtenidos del Sheet: ${contactos.length}`);

    return res.status(200).json(contactos);
  } catch (error: any) {
    console.error('=== ERROR LEYENDO GOOGLE SHEETS ===');
    console.error(error);
    return res.status(500).json({
      error: 'Error al leer contactos del Google Sheet',
      details: error.message,
    });
  }
}
