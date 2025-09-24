import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { department } = req.query;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh','rrhhmaster', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!department || !validDepartments.includes(department as string)) {
      return res.status(400).json({
        error: 'Departamento no válido o no especificado',
        validDepartments
      });
    }

    // Crear cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Generar URL de autorización
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: department as string, // Pasamos el departamento en el state
      prompt: 'consent' // Forzar consent para obtener refresh_token
    });

    res.json({
      success: true,
      authUrl,
      department,
      message: 'Redirige al usuario a esta URL para autorizar el acceso al calendario'
    });

  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({
      error: 'Error al generar URL de autorización',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
