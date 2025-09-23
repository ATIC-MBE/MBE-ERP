import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        error: 'Código de autorización no proporcionado'
      });
    }

    let department: string;
    try {
      const stateData = JSON.parse(state as string);
      department = stateData.department;
    } catch (error) {
      return res.status(400).json({
        error: 'State inválido'
      });
    }

    if (!department) {
      return res.status(400).json({
        error: 'Departamento no especificado en state'
      });
    }

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'rrhhmaster', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    // Crear cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Intercambiar código por tokens
    const { tokens } = await oauth2Client.getToken(code as string);

    if (!tokens.access_token) {
      return res.status(400).json({
        error: 'No se pudo obtener access token'
      });
    }

    // Actualizar archivo .env con los tokens
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';

    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      console.error('Error reading .env file:', error);
      return res.status(500).json({
        error: 'Error al leer archivo de configuración'
      });
    }

    // Actualizar o agregar tokens en el archivo .env
    const accessTokenKey = `GOOGLE_ACCESS_TOKEN_${department.toUpperCase()}`;
    const refreshTokenKey = `GOOGLE_REFRESH_TOKEN_${department.toUpperCase()}`;

    // Remover líneas existentes de tokens para este departamento
    envContent = envContent
      .split('\n')
      .filter(line => !line.startsWith(accessTokenKey) && !line.startsWith(refreshTokenKey))
      .join('\n');

    // Agregar nuevos tokens
    envContent += `\n${accessTokenKey}=${tokens.access_token}`;
    if (tokens.refresh_token) {
      envContent += `\n${refreshTokenKey}=${tokens.refresh_token}`;
    }

    // Escribir archivo .env actualizado
    try {
      fs.writeFileSync(envPath, envContent);
    } catch (error) {
      console.error('Error writing .env file:', error);
      return res.status(500).json({
        error: 'Error al guardar configuración'
      });
    }

    // También actualizar las variables de entorno en runtime
    process.env[accessTokenKey] = tokens.access_token;
    if (tokens.refresh_token) {
      process.env[refreshTokenKey] = tokens.refresh_token;
    }

    // Verificar acceso al calendario
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      await calendar.calendarList.list();
    } catch (error) {
      console.error('Error testing calendar access:', error);
      return res.status(500).json({
        error: 'Error al verificar acceso al calendario',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    // Respuesta HTML de éxito
    const successHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Autorización Exitosa - MBE ERP</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          .success { color: #28a745; }
          .department {
            background: #007bff;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin: 10px 0;
          }
          .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✓ Autorización Exitosa</h1>
          <p>El calendario de Google ha sido configurado correctamente para el departamento:</p>
          <div class="department">${department.toUpperCase()}</div>
          <p>Ahora puedes cerrar esta ventana y regresar al ERP.</p>
          <p><small>Los tokens de acceso han sido guardados automáticamente.</small></p>
          <a href="/" class="btn" onclick="window.close()">Cerrar Ventana</a>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(successHtml);

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);

    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error de Autorización - MBE ERP</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          .error { color: #dc3545; }
          .btn {
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">✗ Error de Autorización</h1>
          <p>Hubo un problema al configurar el calendario de Google.</p>
          <p><small>${error instanceof Error ? error.message : 'Error desconocido'}</small></p>
          <a href="/" class="btn" onclick="window.close()">Cerrar Ventana</a>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}