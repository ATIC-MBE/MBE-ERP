import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    // Configurar OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Definir scopes necesarios para Google Calendar
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    // Generar URL de autorización
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Para obtener refresh token
      scope: scopes,
      prompt: 'consent', // Forzar pantalla de consentimiento para obtener refresh token
      state: JSON.stringify({
        timestamp: Date.now(),
        department: req.query.department || 'unknown'
      })
    });

    // Redirigir al usuario a Google
    return res.redirect(authUrl);

  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudo generar la URL de autenticación'
    });
  }
}