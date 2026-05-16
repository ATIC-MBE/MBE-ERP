import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

const SHEET_ID = process.env.P1N_SHEETS_ID || '1CwzkZejBDcQ8sOCHDWEj9k9cZbYI2PjZGYSpxLHaE1Y'
const SHEET_NAME = process.env.P1N_SHEETS_NAME || 'Hoja 1'

const ALLOWED_DEPTS = new Set(['RRHH', 'MYD', 'ATIC', 'ACA', 'ADE'])

const getAuthClient = () => {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!keyFile) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set')
  }

  return new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
}

const normalizeCell = (value: any) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const loadRows = async () => {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `${SHEET_NAME}!A:G`
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range
  })

  const values = response.data.values || []

  return values
    .map((row, index) => {
      const dept = normalizeCell(row[0]).toUpperCase()
      const tipo = normalizeCell(row[1])
      const p1n = normalizeCell(row[2])
      const solucion = normalizeCell(row[3])
      const estado = normalizeCell(row[4])
      const fecha = normalizeCell(row[5])
      const autor = normalizeCell(row[6])

      return {
        rowIndex: index,
        sheetRow: index + 1,
        dept,
        tipo,
        p1n,
        solucion,
        estado,
        fecha,
        autor
      }
    })
    .filter((row) => {
      if (!row.p1n) return false
      if (row.dept === 'DEPT' || row.dept === 'DEPARTAMENTO') return false
      if (row.dept && !ALLOWED_DEPTS.has(row.dept)) return false
      return true
    })
    .sort((a, b) => b.rowIndex - a.rowIndex)
    .map((row, index) => ({
      id: index + 1,
      sheetRow: row.sheetRow,
      dept: row.dept,
      tipo: row.tipo,
      p1n: row.p1n,
      solucion: row.solucion,
      estado: row.estado,
      fecha: row.fecha,
      autor: row.autor
    }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Metodo no permitido' })
  }

  try {
    if (req.method === 'GET') {
      const rows = await loadRows()
      return res.status(200).json({
        success: true,
        rows
      })
    }

    const dept = normalizeCell(req.body?.dept).toUpperCase()
    const tipo = normalizeCell(req.body?.tipo)
    const p1n = normalizeCell(req.body?.p1n)
    const solucion = normalizeCell(req.body?.solucion)
    const estado = normalizeCell(req.body?.estado)
    const fecha = normalizeCell(req.body?.fecha)
    const autor = normalizeCell(req.body?.autor)

    if (req.method === 'PUT') {
      const sheetRow = Number(req.body?.sheetRow)
      if (!sheetRow || Number.isNaN(sheetRow)) {
        return res.status(400).json({
          success: false,
          message: 'Fila invalida.'
        })
      }

      const auth = getAuthClient()
      const sheets = google.sheets({ version: 'v4', auth })

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A${sheetRow}:G${sheetRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[dept, tipo, p1n, solucion, estado, fecha, autor]]
        }
      })

      const rows = await loadRows()
      return res.status(200).json({
        success: true,
        rows
      })
    }

    if (!dept && !tipo && !p1n && !solucion) {
      return res.status(400).json({
        success: false,
        message: 'Completa al menos un campo.'
      })
    }

    const auth = getAuthClient()
    const sheets = google.sheets({ version: 'v4', auth })

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[dept, tipo, p1n, solucion, estado, fecha, autor]]
      }
    })

    const rows = await loadRows()
    const updatedRange = appendResponse.data.updates?.updatedRange || ''
    const match = updatedRange.match(/!A(\d+):/i)
    const appendedRow = match ? Number(match[1]) : null

    return res.status(200).json({
      success: true,
      rows,
      appendedRow
    })
  } catch (error) {
    console.error('P1N API error:', error)
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno'
    })
  }
}
