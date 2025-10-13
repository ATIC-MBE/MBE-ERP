import axios from 'axios';

export class GoogleSheetsService {
  /**
   * Obtener datos de una hoja de Google Sheets pública (sin autenticación)
   * @param spreadsheetId ID del Google Sheet
   * @param sheetName Nombre de la hoja
   * @returns Array de filas
   */
  async getSheetData(spreadsheetId: string, sheetName: string): Promise<any[][]> {
    try {
      // Usar la API de exportación CSV de Google Sheets
      // Esta API devuelve TODAS las filas, incluyendo las ocultas/contraídas
      // gid=1469213301 es el ID de la pestaña "contactos universidades"
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=1469213301`;

      console.log('=== LEYENDO GOOGLE SHEET (CSV) ===');
      console.log('URL:', csvUrl);

      const response = await axios.get(csvUrl, { responseType: 'text' });

      // Parsear el CSV manualmente
      const lines = response.data.split('\n');
      const rows: any[][] = [];

      for (const line of lines) {
        if (line.trim() === '') continue;

        // Parsear CSV considerando comillas
        const row: any[] = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"' && !inQuotes) {
            inQuotes = true;
          } else if (char === '"' && inQuotes && nextChar === '"') {
            currentField += '"';
            i++; // Skip next quote
          } else if (char === '"' && inQuotes) {
            inQuotes = false;
          } else if (char === ',' && !inQuotes) {
            row.push(currentField);
            currentField = '';
          } else {
            currentField += char;
          }
        }
        row.push(currentField); // Add last field
        rows.push(row);
      }

      console.log('Total de filas recibidas:', rows.length);

      // DEBUG: Mostrar estructura completa del documento
      if (rows.length > 0) {
        console.log('\n=== ESTRUCTURA COMPLETA DEL GOOGLE SHEET ===');
        console.log(`Total de filas: ${rows.length}`);
        console.log(`Total de columnas en header: ${rows[0].length}`);

        console.log('\n--- FILA 1 (Header superior) ---');
        const header1 = rows[0];
        for (let i = 0; i < header1.length; i++) {
          if (header1[i] && header1[i].trim() !== '') {
            const col = String.fromCharCode(65 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26));
            console.log(`Col ${i}: "${header1[i]}"`);
          }
        }

        console.log('\n--- FILA 2 (Header columnas) ---');
        if (rows.length > 1) {
          const header2 = rows[1];
          for (let i = 0; i < Math.min(header2.length, 30); i++) {
            const colName = i < 26
              ? String.fromCharCode(65 + i)
              : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26));
            console.log(`Col ${colName} (index ${i}): "${header2[i]}"`);
          }
        }

        console.log('\n--- FILA 3 (Primer registro ejemplo) ---');
        if (rows.length > 2) {
          const row3 = rows[2];
          for (let i = 0; i < Math.min(row3.length, 15); i++) {
            const colName = String.fromCharCode(65 + i);
            console.log(`Col ${colName} (index ${i}): "${row3[i]}"`);
          }
        }
      }

      return rows;
    } catch (error) {
      console.error('Error obteniendo datos de Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Convertir filas de Google Sheets en objetos con encabezados
   * @param rows Array de filas (la primera debe ser los encabezados)
   * @returns Array de objetos
   */
  convertRowsToObjects(rows: any[][]): any[] {
    if (rows.length === 0) return [];

    const headers = rows[0];
    const dataRows = rows.slice(1);

    return dataRows.map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  /**
   * Obtener contactos de universidad desde Google Sheets
   * @param spreadsheetId ID del Google Sheet
   * @param sheetName Nombre de la hoja (por defecto 'Hoja 1')
   * @returns Array de contactos
   */
  async getContactosUniversidad(spreadsheetId: string, sheetName: string = 'Hoja 1'): Promise<any[]> {
    try {
      // Leer datos de la hoja
      const rows = await this.getSheetData(spreadsheetId, sheetName);

      if (rows.length === 0) {
        return [];
      }

      // DEBUG: Mostrar los headers para ver todas las columnas disponibles
      console.log('\n=== HEADERS DEL SHEET ===');
      console.log('Fila 1 (header superior):', rows[0].slice(0, 25));
      console.log('\nFila 2 (headers de columnas):');
      for (let i = 0; i < Math.min(rows[1].length, 25); i++) {
        const col = i < 26 ? String.fromCharCode(65 + i) : `Col${i}`;
        console.log(`  ${col} (index ${i}): "${rows[1][i]}"`);
      }

      // Saltar las primeras 2 filas (fila 1 = header superior vacío, fila 2 = headers de columnas)
      // Los datos empiezan desde la fila 3
      const allContacts = rows.slice(2)
        .map((row, index) => {
          return {
            _rowIndex: index + 3, // Para debugging (fila en Excel, +3 porque saltamos 2 headers)
            universidad: (row[0] || '').toString().trim(), // Columna A - UNIVERSIDAD
            tipo: (row[1] || '').toString().trim(), // Columna B - TIPO
            puesto: (row[2] || '').toString().trim(), // Columna C - PUESTO
            nota_personal: (row[3] || '').toString().trim(), // Columna D - NOTA. PER
            nombre: (row[4] || '').toString().trim(), // Columna E - NOMBRE
            apellido: (row[5] || '').toString().trim(), // Columna F - APELLIDOS
            telefono: (row[6] || '').toString().trim(), // Columna G - TELEFONO
            email: (row[7] || '').toString().trim(), // Columna H - EMAIL
            historico: (row[8] || '').toString().trim(), // Columna I - HISTORICO
            ultima_llamada: (row[9] || '').toString().trim(), // Columna J - Ult. Llamada
            ult_act_port: (row[10] || '').toString().trim(), // Columna K - Ult.act.PORT
            myd: (row[11] || '').toString().trim(), // Columna L - MYD
            ade: (row[12] || '').toString().trim(), // Columna M - ADE
            rrhh: (row[13] || '').toString().trim(), // Columna N - RRHH
            aca: (row[14] || '').toString().trim(), // Columna O - ACA
            atic: (row[15] || '').toString().trim(), // Columna P - ATIC
            estado_ofertas: (row[16] || '').toString().trim(), // Columna Q - Estado Ofertas
            portal_web: (row[17] || '').toString().trim(), // Columna R - Portal/web
            user: (row[18] || '').toString().trim(), // Columna S - User
            clave: (row[19] || '').toString().trim(), // Columna T - Clave
            firma_convenio: (row[20] || '').toString().trim(), // Columna U - Firma convenio
            notas_ofertas: (row[21] || '').toString().trim(), // Columna V - NOTAS OFERTAS
            anexos: (row[22] || '').toString().trim(), // Columna W - ANEXOS
            convocatorias: (row[23] || '').toString().trim(), // Columna X - Convocatorias
            telefono2: '', // No existe en el Excel
            siguiente_paso: null,
            vencimiento_convenio: '',
            altas_social: '',
            departamento: '',
          };
        });

      const contactos = allContacts
        // Filtrar solo filas válidas
        .filter(c => {
          const uni = c.universidad.toLowerCase().trim();

          // Excluir filas completamente vacías
          if (!c.universidad || c.universidad === '') {
            return false;
          }

          // Excluir la fila de headers
          if (c.universidad.toUpperCase().includes('UNIVERSIDAD') || c.universidad.includes(',,,')) {
            return false;
          }

          // Excluir filas con universidad muy larga (probablemente notas) o que contengan frases largas
          if (c.universidad.length > 50) {
            return false;
          }

          // Excluir si tiene números al inicio (formato fecha como "03 dic", "08Jul24", "16Mar24")
          if (/^\d/.test(uni)) {
            return false;
          }

          // Excluir si contiene @ o : en el campo universidad (es una nota, no un nombre de universidad)
          if (c.universidad.includes('@') || c.universidad.includes(':')) {
            return false;
          }

          // Excluir filas que empiezan con palabras típicas de cursos
          if (/^(grado|máster|master|mba|diploma|bachelor)/i.test(c.universidad)) {
            return false;
          }

          // Excluir filas que contienen palabras típicas de cursos, grados o notas (no son nombres de universidades)
          const notasKeywords = [
            'hablamos', 'problema', 'ella ve', 'premios', 'semilla', 'contactamos', 'responden', 'escribo',
            'grado en', 'máster en', 'mba', 'diploma en', 'bachelor', 'enviaron', 'ofertas',
            'estudiantes', 'estudiantado', 'asignaturas', 'prácticas de', 'relaciones laborales'
          ];
          if (notasKeywords.some(keyword => uni.includes(keyword))) {
            return false;
          }

          // Debe tener un nombre de universidad razonable (más de 1 carácter)
          if (c.universidad.length < 2) {
            return false;
          }

          return true;
        });

      // DEBUG: Mostrar una fila completa para verificar mapeo de columnas
      const atriumRows = allContacts.filter(c => c.universidad.toUpperCase() === 'ATRIUM').slice(0, 3);
      if (atriumRows.length > 0) {
        const atriumIndex = allContacts.findIndex(c => c.universidad.toUpperCase() === 'ATRIUM');
        if (atriumIndex >= 0) {
          console.log('\n=== DEBUG: Primeras 3 filas de ATRIUM ===');
          for (let j = 0; j < 3; j++) {
            const idx = atriumIndex + j;
            if (idx < allContacts.length && rows[idx + 2]) {
              console.log(`\n--- Fila ${idx + 3} ---`);
              const rawRow = rows[idx + 2]; // +2 porque rows incluye las 2 filas de headers
              console.log('Primeras 20 columnas:');
              for (let i = 0; i < Math.min(rawRow.length, 20); i++) {
                const col = String.fromCharCode(65 + (i < 26 ? i : 0)) + (i >= 26 ? String.fromCharCode(65 + i - 26) : '');
                console.log(`  Col ${col} (index ${i}): "${rawRow[i]}"`);
              }
            }
          }
        }
      }

      console.log('\nTotal contactos válidos:', contactos.length);
      console.log('Primeros 5 contactos:', contactos.slice(0, 5).map(c => ({ uni: c.universidad, nombre: c.nombre, email: c.email })));

      return contactos;
    } catch (error) {
      console.error('Error obteniendo contactos de universidad:', error);
      throw error;
    }
  }

  /**
   * Parsear fechas del formato DD/MM/YYYY a YYYY-MM-DD
   */
  private parseDate(dateStr: string): string | null {
    if (!dateStr || dateStr.trim() === '') return null;

    // Intentar parsear formato DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Si ya está en formato YYYY-MM-DD
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }

    return null;
  }
}
