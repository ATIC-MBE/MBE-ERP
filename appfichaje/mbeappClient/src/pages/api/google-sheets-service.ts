import { google } from 'googleapis'
import path from 'path'

interface GoogleSheetsConfig {
  spreadsheetId: string
  ranges: {
    sumaBruto: string
    acciones: string
    vacaciones: string
    antiguedad: string
  }
}

const SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '1zkUYa2EIJ1Ll5Sz8QMHr97-mYpHF7NWnNCoa2Oxd4iU',
  ranges: {
    sumaBruto: 'Progreso!B:B',
    acciones: 'Progreso!C:C',
    vacaciones: 'Progreso!D:E',
    antiguedad: 'Progreso!F:G'
  }
}

export interface EmployeeData {
  sumaBruto: number
  accionesAcumuladas: number
  vacacionesTotales: number
  vacacionesDisponibles: number
  antiguedadAnios: number
  antiguedadMeses: number
  antiguedadDias: number
  fechaInicio: string
  fechaFin: string
  porcentajeProgreso: number
  tipoJornada: string
}

class GoogleSheetsService {
  private auth: any
  private sheets: any

  private normalizeString(str: any): string {
    if (!str && str !== 0) return ''
    try {
      return String(str).normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase()
    } catch (e) {
      return String(str).replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    }
  }

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
      this.auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      })

      this.sheets = google.sheets({ version: 'v4', auth: this.auth })
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
      throw error
    }
  }

  private async getSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
    try {
      if (!this.sheets) {
        await this.initializeAuth()
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      })

      return response.data.values || []
    } catch (error: any) {
      console.error(`Error obteniendo datos del rango ${range}:`, error)
      throw new Error(`Error en Google Sheets API: ${error?.response?.data?.error?.message || error?.message || 'Unknown error'}`)
    }
  }

  async getEmployeeData(employeeId: string): Promise<EmployeeData> {
    try {
      if (!SHEETS_CONFIG.spreadsheetId) {
        throw new Error('ID del documento de Google Sheets no configurado')
      }

      const employeeRowProgreso = await this.findEmployeeRow(employeeId, 'Progreso')

      const rangeProgreso = `Progreso!A${employeeRowProgreso}:H${employeeRowProgreso}`
      const employeeRowDataProgreso = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, rangeProgreso)

      if (!employeeRowDataProgreso || employeeRowDataProgreso.length === 0) {
        throw new Error(`No se encontraron datos para el empleado ${employeeId} en Progreso`)
      }

      const rowDataProgreso = employeeRowDataProgreso[0]
      console.log('Datos de Progreso para', employeeId, ':', rowDataProgreso)

      let sumaBruto = 0
      let accionesPorMes = 0
      let employeeRowHistorico = null
      try {
        employeeRowHistorico = await this.findEmployeeRow(employeeId, 'HISTORICO')
        console.log('Empleado', employeeId, 'encontrado en HISTORICO en la fila:', employeeRowHistorico)

        const rangeHistorico = `HISTORICO!I${employeeRowHistorico}:J${employeeRowHistorico}`
        const employeeRowDataHistorico = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, rangeHistorico)

        if (employeeRowDataHistorico && employeeRowDataHistorico.length > 0) {
          const rowDataHistorico = employeeRowDataHistorico[0]
          accionesPorMes = this.parseNumber(rowDataHistorico[0]) // Columna I
          sumaBruto = this.parseNumber(rowDataHistorico[1]) // Columna J
          console.log('Datos HISTORICO para', employeeId, '- Acciones:', accionesPorMes, 'Suma bruto:', sumaBruto)
        }
      } catch (error) {
        console.log('No se encontraron datos en HISTORICO para', employeeId, '- manteniendo valores en 0')
      }

      // Leer vacaciones totales de la columna D de Progreso
      let vacacionesTotales = 0
      try {
        const vacacionesTotalesRange = `Progreso!D${employeeRowProgreso}:D${employeeRowProgreso}`
        const vacacionesTotalesData = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, vacacionesTotalesRange)
        if (vacacionesTotalesData && vacacionesTotalesData.length > 0) {
          vacacionesTotales = this.parseNumber(vacacionesTotalesData[0][0]) || 0
        }
      } catch (error) {
        console.log('No se pudieron obtener datos de vacaciones totales desde Progreso, manteniendo en 0')
      }

      // Leer vacaciones disponibles de la columna O de HISTORICO
      let vacacionesDisponibles = 0
      if (employeeRowHistorico) {
        try {
          const vacacionesDisponiblesRange = `HISTORICO!O${employeeRowHistorico}:O${employeeRowHistorico}`
          console.log('Leyendo vacaciones disponibles desde range:', vacacionesDisponiblesRange)
          const vacacionesDisponiblesData = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, vacacionesDisponiblesRange)
          console.log('Datos brutos de vacaciones disponibles:', vacacionesDisponiblesData)
          if (vacacionesDisponiblesData && vacacionesDisponiblesData.length > 0) {
            const rawValue = vacacionesDisponiblesData[0][0]
            console.log('Valor bruto de vacaciones disponibles:', rawValue, 'tipo:', typeof rawValue)
            vacacionesDisponibles = this.parseNumber(rawValue) || 0
            console.log('Vacaciones disponibles parseadas desde HISTORICO columna O para', employeeId, ':', vacacionesDisponibles)
          } else {
            console.log('No hay datos en la columna O para', employeeId)
          }
        } catch (error) {
          console.log('Error obteniendo datos de vacaciones disponibles desde HISTORICO:', error)
        }
      } else {
        console.log('No se encontró fila en HISTORICO para', employeeId, ', no se pueden leer vacaciones disponibles')
      }

      // Leer tipo de jornada de la columna P de HISTORICO
      let tipoJornada = ''
      if (employeeRowHistorico) {
        try {
          const tipoJornadaRange = `HISTORICO!P${employeeRowHistorico}:P${employeeRowHistorico}`
          console.log('Leyendo tipo de jornada desde range:', tipoJornadaRange)
          const tipoJornadaData = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, tipoJornadaRange)
          console.log('Datos brutos de tipo de jornada:', tipoJornadaData)

          if (tipoJornadaData && tipoJornadaData.length > 0) {
            tipoJornada = tipoJornadaData[0][0] || ''
            console.log('Tipo de jornada desde HISTORICO columna P para', employeeId, ':', tipoJornada)
          } else {
            console.log('No hay datos en la columna P de HISTORICO para', employeeId)
          }
        } catch (error) {
          console.log('Error obteniendo tipo de jornada desde HISTORICO:', error)
        }
      } else {
        console.log('No se encontró fila en HISTORICO para', employeeId, ', no se puede leer tipo de jornada')
      }

      // Leer fecha de fin de la columna J de la pestaña Progreso
      let fechaFin = ''
      let porcentajeProgreso = 0
      try {
        const fechaFinRange = `Progreso!J${employeeRowProgreso}:J${employeeRowProgreso}`
        console.log('Leyendo fecha de fin desde range:', fechaFinRange)
        const fechaFinData = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, fechaFinRange)
        console.log('Datos brutos de fecha de fin:', fechaFinData)

        if (fechaFinData && fechaFinData.length > 0) {
          const rawFechaFin = this.parseDate(fechaFinData[0][0]) || ''
          fechaFin = this.formatDateToStandard(rawFechaFin)
          console.log('Fecha de fin desde Progreso columna J para', employeeId, 'raw:', rawFechaFin, 'formatted:', fechaFin)

          // Calcular porcentaje de progreso basado en fechas
          const fechaInicioStr = this.parseDate(rowDataProgreso[4]) || ''
          if (fechaInicioStr && fechaFin) {
            porcentajeProgreso = this.calculateProgressPercentage(fechaInicioStr, fechaFin)
            console.log('Porcentaje de progreso calculado:', porcentajeProgreso)
          }
        } else {
          console.log('No hay datos en la columna J de Progreso para', employeeId)
        }
      } catch (error) {
        console.log('Error obteniendo fecha de fin desde Progreso:', error)
      }

      // También voy a leer sumaBruto de la columna B si no hay datos en HISTORICO
      if (sumaBruto === 0) {
        try {
          const salarioRange = `Progreso!B${employeeRowProgreso}:B${employeeRowProgreso}`
          const salarioData = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, salarioRange)
          if (salarioData && salarioData.length > 0) {
            sumaBruto = this.parseNumber(salarioData[0][0]) || 0
          }
        } catch (error) {
          console.log('No se pudieron obtener datos de salario desde Progreso')
        }
      }

      const employeeData: EmployeeData = {
        sumaBruto: sumaBruto,
        accionesAcumuladas: accionesPorMes,
        vacacionesTotales: vacacionesTotales,
        fechaInicio: this.parseDate(rowDataProgreso[4]) || '',
        fechaFin: fechaFin,
        vacacionesDisponibles: vacacionesDisponibles,
        antiguedadAnios: this.parseNumber(rowDataProgreso[5]),
        antiguedadMeses: this.parseNumber(rowDataProgreso[6]), // Columna G
        antiguedadDias: this.parseNumber(rowDataProgreso[7]), // Columna H
        porcentajeProgreso: porcentajeProgreso,
        tipoJornada: tipoJornada
      }

      console.log('Datos finales para', employeeId, ':', {
        sumaBruto,
        accionesPorMes,
        vacacionesTotales,
        vacacionesDisponibles,
        antiguedadAnios: this.parseNumber(rowDataProgreso[5]),
        antiguedadMeses: this.parseNumber(rowDataProgreso[6]),
        antiguedadDias: this.parseNumber(rowDataProgreso[7])
      })

      return employeeData
    } catch (error) {
      console.error('Error en GoogleSheetsService.getEmployeeData:', error)
      throw new Error('No se pudieron obtener los datos de Google Sheets')
    }
  }

  private parseNumber(value: any): number {
    console.log('parseNumber input:', value, 'type:', typeof value)
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.,]/g, '')
      console.log('cleaned:', cleaned)
      const number = parseFloat(cleaned.replace(',', '.'))
      console.log('parsed number:', number, 'isNaN:', isNaN(number))
      return isNaN(number) ? 0 : number
    }
    return 0
  }

  private parseDate(value: any): string {
    if (!value) return ''
    if (typeof value === 'string') {
      return value
    }
    return value.toString()
  }

  private formatDateToStandard(dateStr: string): string {
    if (!dateStr) return ''

    // Si ya está en formato DD/MM/YYYY, devolverlo tal como está
    if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return dateStr
    }

    // Convertir formato DDmmmYY (ej: 31ago25) a DD/MM/YYYY
    const monthMap: { [key: string]: string } = {
      'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
    }

    const match = dateStr.match(/^(\d{1,2})([a-z]{3})(\d{2})$/i)
    if (match) {
      const day = match[1].padStart(2, '0')
      const month = monthMap[match[2].toLowerCase()]
      const year = '20' + match[3] // Asumimos 20XX
      if (month) {
        return `${day}/${month}/${year}`
      }
    }

    // Si no se puede convertir, devolver tal como está
    return dateStr
  }

  private calculateProgressPercentage(fechaInicio: string, fechaFin: string): number {
    try {
      // Parsear las fechas (múltiples formatos)
      const parseDate = (dateStr: string): Date => {
        // Formato DD/MM/YYYY
        const slashParts = dateStr.split('/')
        if (slashParts.length === 3) {
          return new Date(parseInt(slashParts[2]), parseInt(slashParts[1]) - 1, parseInt(slashParts[0]))
        }

        // Formato DDmmmYY (ej: 31ago25)
        const monthMap: { [key: string]: number } = {
          'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
        }

        const match = dateStr.match(/^(\d{1,2})([a-z]{3})(\d{2})$/i)
        if (match) {
          const day = parseInt(match[1])
          const month = monthMap[match[2].toLowerCase()]
          const year = 2000 + parseInt(match[3]) // Asumimos 20XX
          if (month !== undefined) {
            return new Date(year, month, day)
          }
        }

        return new Date(dateStr)
      }

      const inicio = parseDate(fechaInicio)
      const fin = parseDate(fechaFin)
      const ahora = new Date()


      // Si las fechas no son válidas, retornar 0
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return 0
      }

      // Si la fecha de fin ya pasó, progreso del 100%
      if (ahora >= fin) {
        return 100
      }

      // Si aún no ha comenzado, progreso del 0%
      if (ahora <= inicio) {
        return 0
      }

      // Calcular progreso entre inicio y fin
      const tiempoTotal = fin.getTime() - inicio.getTime()
      const tiempoTranscurrido = ahora.getTime() - inicio.getTime()
      const porcentaje = Math.round((tiempoTranscurrido / tiempoTotal) * 100)


      // Asegurar que esté entre 0 y 100
      return Math.max(0, Math.min(100, porcentaje))
    } catch (error) {
      console.error('Error calculando porcentaje de progreso:', error)
      return 0
    }
  }

  async findEmployeeRow(employeeId: string, sheetName: string): Promise<number> {
    try {
      const columnsToTry = ['C', 'A'] // buscar en C primero (antiguo), luego en A (config recomendado)
      const normalizedTarget = this.normalizeString(employeeId)

      for (const col of columnsToTry) {
        const range = `${sheetName}!${col}:${col}`
        const data = await this.getSheetData(SHEETS_CONFIG.spreadsheetId, range)

        for (let i = 0; i < data.length; i++) {
          const cell = data[i][0]
          const normalizedCell = this.normalizeString(cell)
          if (!normalizedCell && !normalizedTarget) continue

          if (
            normalizedCell === normalizedTarget ||
            normalizedCell.includes(normalizedTarget) ||
            normalizedTarget.includes(normalizedCell)
          ) {
            const row = i + 1
            console.log(`Empleado ${employeeId} encontrado en ${sheetName} columna ${col} fila ${row} (valor hoja: "${cell}")`)
            return row
          }
        }
      }

      throw new Error(`Empleado ${employeeId} no encontrado en ${sheetName} (se buscaron columnas C y A)`)
    } catch (error) {
      console.error(`Error buscando empleado en ${sheetName}:`, error)
      throw error
    }
  }
}

export default GoogleSheetsService