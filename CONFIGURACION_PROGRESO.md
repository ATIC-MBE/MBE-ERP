# Configuración de Progreso de Empleados - MBE ERP

## ✅ Estado Actual
- ✅ Botón "Progreso" agregado a todos los menús laterales
- ✅ Página de progreso creada y funcionando
- ✅ Google Sheets ID configurado: `1zkUYa2EIJ1Ll5Sz8QMHr97-mYpHF7NWnNCoa2Oxd4iU`
- ✅ Pestaña configurada: "Progreso"
- ⏳ **Pendiente**: Configurar API Key de Google

## 📊 Estructura del Google Sheets

Tu documento debe tener esta estructura en la pestaña **"Progreso"**:

| A (ID Empleado) | B (Suma Bruto) | C (Acciones) | D (Vac. Totales) | E (Vac. Disponibles) | F (Años Ant.) | G (Meses Ant.) |
|-----------------|----------------|--------------|------------------|----------------------|---------------|----------------|
| JoseMBE         | 45750.50       | 120          | 22               | 8                    | 2             | 7              |
| María           | 38900.25       | 85           | 22               | 15                   | 1             | 3              |

## 🔧 Configuración Requerida

### Paso 1: Obtener API Key de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita **Google Sheets API**:
   - APIs y servicios → Biblioteca
   - Busca "Google Sheets API" → Habilitar
4. Crear credenciales:
   - APIs y servicios → Credenciales
   - "Crear credenciales" → "Clave de API"
   - Copia la clave generada

### Paso 2: Configurar la API Key

1. Edita el archivo `.env.local` en `/appfichaje/mbeappClient/`
2. Reemplaza `TU_API_KEY_AQUI` con tu API Key real:
   ```env
   GOOGLE_SHEETS_API_KEY=tu_api_key_real_aqui
   ```

### Paso 3: Verificar permisos del Google Sheets

1. Abre tu Google Sheets: `1zkUYa2EIJ1Ll5Sz8QMHr97-mYpHF7NWnNCoa2Oxd4iU`
2. Comparte como "Visible para cualquiera con el enlace"
3. Permisos: Solo lectura

## 🚀 Uso

Una vez configurado:

1. **Acceder**: http://localhost:6969
2. **Login** con usuario del sistema
3. **Hacer clic** en "Progreso" en el menú lateral
4. **Ver datos** del empleado logueado

## 📋 Datos Mostrados

La página mostrará:
- 💰 **Suma Bruto Acumulada**: Formato en euros
- 🎯 **Acciones Acumuladas**: Bonos y recompensas
- 🏢 **Antigüedad**: Años y meses de servicio
- 📅 **Vacaciones Totales**: Días anuales
- 🌴 **Vacaciones Disponibles**: Días restantes
- 📊 **Progreso de Vacaciones**: Barra visual

## 🔍 Depuración

Si hay problemas:

1. **Verificar logs** en la consola del navegador
2. **Revisar logs** del servidor en el terminal
3. **Comprobar** que el Google Sheets sea público
4. **Validar** que la API Key sea correcta

## 📞 Testing

Para probar con datos específicos:
```
http://localhost:6969/api/employee-data?employeeId=JoseMBE
```

## 🔄 Fallback

Si Google Sheets no funciona:
- Se mostrarán datos de ejemplo
- No habrá errores en la aplicación
- Se registrarán warnings en los logs

## ⚡ Estado de Servicios

Servicios ejecutándose:
- ✅ mbeApi: http://localhost:3006
- ✅ mbeappClient: http://localhost:6969
- ✅ mbeapp: http://localhost:3005

## 📝 Próximo Paso

**Solo falta configurar la API Key de Google para conectar con datos reales.**

¡Una vez configurada la API Key, el sistema mostrará los datos reales del Google Sheets!