# Configuración de Google Sheets para Datos de Empleados

Este documento explica cómo configurar Google Sheets para mostrar los datos de progreso de los empleados.

## 📋 Estructura del Google Sheets

El documento de Google Sheets debe tener las siguientes pestañas:

### 1. Pestaña "SumaBruto"
- **Columna A**: ID del empleado
- **Columna B**: Suma bruto acumulada (número)

Ejemplo:
```
A          B
empleado1  45750.50
empleado2  38900.25
```

### 2. Pestaña "Acciones"
- **Columna A**: ID del empleado
- **Columna B**: Acciones acumuladas (número entero)

Ejemplo:
```
A          B
empleado1  120
empleado2  85
```

### 3. Pestaña "Vacaciones"
- **Columna A**: ID del empleado
- **Columna B**: Vacaciones totales (días)
- **Columna C**: Vacaciones disponibles (días)

Ejemplo:
```
A          B    C
empleado1  22   8
empleado2  22   15
```

### 4. Pestaña "Empleados"
- **Columna A**: ID del empleado
- **Columna B**: Nombre
- **Columna C**: Email
- **Columna D**: Años de antigüedad
- **Columna E**: Meses adicionales de antigüedad

Ejemplo:
```
A          B           C                D    E
empleado1  Juan Pérez  juan@empresa.com 2    7
empleado2  Ana García  ana@empresa.com  1    3
```

## 🔐 Configuración de la API de Google Sheets

### Paso 1: Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**:
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Google Sheets API"
   - Haz clic en "Habilitar"

### Paso 2: Crear credenciales de API

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Copia la clave de API generada
4. (Opcional) Restringe la clave a solo Google Sheets API

### Paso 3: Configurar el documento de Google Sheets

1. Crea un nuevo documento de Google Sheets
2. Compártelo como "Visible para cualquiera con el enlace" (solo lectura)
3. Copia el ID del documento desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ID_DEL_DOCUMENTO]/edit
   ```

### Paso 4: Configurar variables de entorno

1. Copia el archivo `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Completa las variables:
   ```env
   GOOGLE_SHEETS_API_KEY=tu_api_key_de_google_cloud
   GOOGLE_SHEETS_ID=el_id_de_tu_documento_sheets
   ```

## 🔧 Personalización de Rangos

Si tu documento tiene una estructura diferente, puedes modificar los rangos en `google-sheets-service.ts`:

```typescript
const SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '',
  ranges: {
    sumaBruto: 'SumaBruto!A2:B2',        // Cambia estos rangos
    acciones: 'Acciones!A2:B2',          // según tu estructura
    vacaciones: 'Vacaciones!A2:D2',
    antiguedad: 'Empleados!A2:E2'
  }
}
```

## 📊 Estructura de Datos Esperada

El sistema espera los siguientes campos para cada empleado:

- **sumaBruto**: Número decimal (ej: 45750.50)
- **accionesAcumuladas**: Número entero (ej: 120)
- **vacacionesTotales**: Número entero (ej: 22)
- **vacacionesDisponibles**: Número entero (ej: 8)
- **antiguedadAnios**: Número entero (ej: 2)
- **antiguedadMeses**: Número entero (ej: 7)

## 🚀 Uso

Una vez configurado, el sistema:

1. Buscará automáticamente los datos del empleado logueado
2. Mostrará los datos en la página de "Progreso"
3. Actualizará los datos cada vez que se acceda a la página
4. Tendrá un botón "Actualizar Datos" para refrescar manualmente

## 🛠️ Fallback

Si Google Sheets no está configurado o hay errores:
- El sistema mostrará datos de ejemplo
- No se producirán errores en la aplicación
- Se registrarán warnings en los logs del servidor

## 📞 Soporte

Para configurar o resolver problemas:
1. Verifica que la API Key sea válida
2. Confirma que el documento esté compartido públicamente
3. Revisa los logs del servidor para errores específicos
4. Contacta al equipo de ATIC para asistencia técnica