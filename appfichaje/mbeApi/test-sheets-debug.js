const fetch = require('node-fetch');

async function testSheets() {
  const spreadsheetId = '1_tWh4nGZ9qwl_Ns6AfTunQ2_MhQtZ4778qCrkpU3ZzU';
  const gid = '1469213301';
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  
  const response = await fetch(url);
  const csvText = await response.text();
  const rows = csvText.split('\n').map(row => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  });
  
  console.log('\n=== HEADERS (Fila 2) - Primeras 15 columnas ===');
  for (let i = 0; i < 15; i++) {
    const col = String.fromCharCode(65 + i);
    console.log(`${col}: "${rows[1][i]}"`);
  }
  
  // Buscar ATRIUM
  let atriumIdx = -1;
  for (let i = 2; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toUpperCase().trim() === 'ATRIUM') {
      atriumIdx = i;
      break;
    }
  }
  
  if (atriumIdx >= 0) {
    console.log(`\n=== Primeras 3 filas de ATRIUM (empezando en fila ${atriumIdx + 1}) ===`);
    for (let j = 0; j < 3 && (atriumIdx + j) < rows.length; j++) {
      console.log(`\n--- Fila ${atriumIdx + j + 1} ---`);
      const row = rows[atriumIdx + j];
      for (let i = 0; i < 15; i++) {
        const col = String.fromCharCode(65 + i);
        console.log(`  ${col}: "${row[i] || ''}"`);
      }
    }
  }
}

testSheets().catch(console.error);
