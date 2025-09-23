import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const department = req.query.department as string;

    // Validar departamento
    const validDepartments = ['admin', 'aca', 'atic', 'rrhh', 'ceo', 'ade', 'myd', 'propietario', 'superadmin'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        error: 'Departamento no válido',
        validDepartments
      });
    }

    const { getDepartmentCalendarId } = require('../../../../services/GoogleCalendarService');
    const calendarId = getDepartmentCalendarId(department);

    // Verificar si hay tokens configurados
    const hasTokens = process.env[`GOOGLE_ACCESS_TOKEN_${department.toUpperCase()}`] ? true : false;

    res.json({
      success: true,
      department,
      calendarId,
      hasTokens,
      isConfigured: hasTokens && calendarId !== 'primary'
    });

  } catch (error) {
    console.error('Error checking department config:', error);
    res.status(500).json({
      error: 'Error al verificar configuración del departamento',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}