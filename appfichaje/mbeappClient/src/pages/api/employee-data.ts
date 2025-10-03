import { NextApiRequest, NextApiResponse } from 'next'
import GoogleSheetsService, { EmployeeData } from './google-sheets-service'

// MAPEOS MANUALES ELIMINADOS - SISTEMA AUTOMÁTICO PURO
// Debugging date calculation - October 2025

// Esta función ya no se usa - sistema automático puro

// Función para conectar con Google Sheets usando Service Account
async function fetchFromGoogleSheets(fullName: string): Promise<EmployeeData> {
  try {
    console.log(`=== SISTEMA AUTOMÁTICO ===`)
    console.log(`Buscando en Google Sheets: "${fullName}"`)
    console.log(`=========================`)

    // Verificar si tenemos el ID del Google Sheets configurado
    const hasGoogleSheetsConfig = process.env.GOOGLE_SHEETS_ID

    if (!hasGoogleSheetsConfig) {
      throw new Error('Google Sheets no configurado - no hay datos de ejemplo en modo automático')
    }

    // Usar el servicio real de Google Sheets con el nombre completo
    const sheetsService = new GoogleSheetsService()
    const employeeData = await sheetsService.getEmployeeData(fullName)

    return employeeData
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error)
    throw error
  }
}

// Función para obtener el nombre completo del usuario desde la base de datos
async function getUserFullNameFromDB(userIdentifier: string): Promise<string> {
  try {
    // Construir la URL del API de usuarios del backend principal
    const backendUrl = process.env.API_END_POINT_DEV || process.env.API_END_POINT_PROD || 'http://localhost:3006'

    // Intentar consultar por username primero
    let userApiUrl = `${backendUrl}/api/users/by-username/${userIdentifier}`
    console.log('Consultando nombre completo por username en:', userApiUrl)

    let response = await fetch(userApiUrl)

    // Si no funciona por username, intentar por ID
    if (!response.ok && !isNaN(Number(userIdentifier))) {
      userApiUrl = `${backendUrl}/api/users/${userIdentifier}`
      console.log('Reintentando por ID en:', userApiUrl)
      response = await fetch(userApiUrl)
    }

    if (!response.ok) {
      throw new Error(`Error consultando usuario: ${response.status}`)
    }

    const userData = await response.json()

    // Prioridad 1: nombre_completo si existe
    if (userData && userData.nombre_completo) {
      console.log(`Usuario ${userIdentifier} → Nombre completo: "${userData.nombre_completo}"`)
      return userData.nombre_completo
    }

    // Prioridad 2: nombre + apellido
    if (userData && userData.nombre && userData.apellido) {
      const fullName = `${userData.nombre} ${userData.apellido}`.trim()
      console.log(`Usuario ${userIdentifier} → Nombre + Apellido: "${fullName}"`)
      return fullName
    }

    // Prioridad 3: solo nombre
    if (userData && userData.nombre) {
      console.log(`Usuario ${userIdentifier} → Solo nombre: "${userData.nombre}"`)
      return userData.nombre
    }

    // Prioridad 4: username
    if (userData && userData.username) {
      console.log(`Usuario ${userIdentifier} → Username: "${userData.username}"`)
      return userData.username
    }

    throw new Error('No se encontraron datos de nombre para el usuario')

  } catch (error) {
    console.error('Error obteniendo nombre completo de la BD:', error)
    // Fallback: usar el userIdentifier original
    return userIdentifier
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    // Obtener el ID del empleado desde las cookies o headers de autenticación
    let employeeId = '' // Se obtendrá del parámetro de la URL o del UserContext

    // Intentar obtener el usuario desde las cookies del sistema actual
    const cookies = req.headers.cookie
    if (cookies) {
      // Buscar la cookie del usuario si existe
      const userCookie = cookies.split(';').find(cookie =>
        cookie.trim().startsWith('usuario=') ||
        cookie.trim().startsWith('user=') ||
        cookie.trim().startsWith('employee=')
      )

      if (userCookie) {
        employeeId = userCookie.split('=')[1] || employeeId
      }
    }

    // También verificar si viene en el query parameter
    if (req.query.employeeId) {
      employeeId = req.query.employeeId as string
    }

    // DEBUG: Ver qué employeeId llegó al API
    console.log('=== DEBUG API EMPLOYEE DATA ===')
    console.log('employeeId recibido:', employeeId)
    console.log('cookies:', cookies)
    console.log('req.query.employeeId:', req.query.employeeId)

    // Validar que tenemos un employeeId
    if (!employeeId || employeeId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'No se pudo identificar al empleado. Verifique que esté logueado correctamente.'
      })
    }

    // Determinar el nombre completo
    let fullName = ''

    // Si ya parece ser un nombre completo (contiene espacios), usarlo directamente
    if (employeeId.includes(' ') && employeeId.length > 3) {
      fullName = employeeId
      console.log(`Usando nombre completo recibido directamente: "${fullName}"`)
    } else {
      // Obtener el nombre completo desde la base de datos
      fullName = await getUserFullNameFromDB(employeeId)
      console.log(`Obtenido nombre completo de la BD: "${fullName}"`)
    }

    const employeeData = await fetchFromGoogleSheets(fullName)

    res.status(200).json({
      success: true,
      data: employeeData,
      userIdentifier: employeeId,
      fullName: fullName
    })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    })
  }
}