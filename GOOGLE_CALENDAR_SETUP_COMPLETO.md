# 📅 Configuración Completa de Google Calendar - MBE ERP

## Índice
1. [Configuración Inicial en Google Cloud](#1-configuración-inicial-en-google-cloud)
2. [Configuración del Proyecto](#2-configuración-del-proyecto)
3. [Autorización OAuth por Departamentos](#3-autorización-oauth-por-departamentos)
4. [Agregar Nuevos Departamentos](#4-agregar-nuevos-departamentos)
5. [URLs de Autorización](#5-urls-de-autorización)
6. [Verificación y Testing](#6-verificación-y-testing)
7. [Solución de Problemas](#7-solución-de-problemas)
8. [Mantenimiento](#8-mantenimiento)

---

## 1. Configuración Inicial en Google Cloud

### 1.1 Crear Proyecto de Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto

### 1.2 Habilitar Google Calendar API
1. En Google Cloud Console, ve a "APIs & Services" > "Library"
2. Busca "Google Calendar API"
3. Habilita la API

### 1.3 Crear Credenciales OAuth 2.0
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecciona "Web application"
4. Agrega estas URIs de redirección:
   - `http://185.252.233.57:3006/api/auth/google/callback`
   - `https://tu-dominio.com/api/auth/google/callback` (para producción)
5. Guarda el **Client ID** y **Client Secret**

---

## 2. Configuración del Proyecto

### 2.1 Configurar Variables de Entorno

Edita el archivo `.env` en `/appfichaje/mbeApi/.env`:

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=tu_google_client_id_aquí
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aquí
GOOGLE_REDIRECT_URI=http://185.252.233.57:3006/api/auth/google/callback

# Google Calendar IDs por departamento
CALENDAR_ADMIN_ID=primary
CALENDAR_ACA_ID=aca.mbe@gmail.com
CALENDAR_ATIC_ID=primary
CALENDAR_RRHH_ID=rrhh2@mbe.madrid
CALENDAR_RRHHMASTER_ID=rrhh1@mbe.madrid
CALENDAR_CEO_ID=ceo.mbe@gmail.com
CALENDAR_ADE_ID=ade.mbe@gmail.com
CALENDAR_MYD_ID=myd1@mbe.madrid
CALENDAR_PROPIETARIO_ID=propietario.mbe@gmail.com
CALENDAR_SUPERADMIN_ID=superadmin.mbe@gmail.com

# Google Calendar Access Tokens (se llenan automáticamente)
GOOGLE_ACCESS_TOKEN_ADMIN=
GOOGLE_REFRESH_TOKEN_ADMIN=
GOOGLE_ACCESS_TOKEN_ACA=
GOOGLE_REFRESH_TOKEN_ACA=
GOOGLE_ACCESS_TOKEN_ATIC=
GOOGLE_REFRESH_TOKEN_ATIC=
GOOGLE_ACCESS_TOKEN_RRHH=
GOOGLE_REFRESH_TOKEN_RRHH=
GOOGLE_ACCESS_TOKEN_RRHHMASTER=
GOOGLE_REFRESH_TOKEN_RRHHMASTER=
GOOGLE_ACCESS_TOKEN_CEO=
GOOGLE_REFRESH_TOKEN_CEO=
GOOGLE_ACCESS_TOKEN_ADE=
GOOGLE_REFRESH_TOKEN_ADE=
GOOGLE_ACCESS_TOKEN_MYD=
GOOGLE_REFRESH_TOKEN_MYD=
GOOGLE_ACCESS_TOKEN_PROPIETARIO=
GOOGLE_REFRESH_TOKEN_PROPIETARIO=
GOOGLE_ACCESS_TOKEN_SUPERADMIN=
GOOGLE_REFRESH_TOKEN_SUPERADMIN=
```

### ⚠️ IMPORTANTE:
- Reemplaza `tu_google_client_id_aquí` con tu Client ID real
- Reemplaza `tu_google_client_secret_aquí` con tu Client Secret real
- NO cambies `GOOGLE_REDIRECT_URI`

### 2.2 Reiniciar el Servidor
```bash
# En la terminal donde corre mbeApi:
Ctrl + C (para detener)
npm run dev (para reiniciar)
```

---

## 3. Autorización OAuth por Departamentos

### 3.1 Proceso de Autorización

Para cada departamento que quieras configurar:

1. **Acceder a la URL de autorización**:
   ```
   http://185.252.233.57:3006/api/auth/google/login?department=NOMBRE_DEPARTAMENTO
   ```

2. **Proceso en Google**:
   - Se abrirá Google OAuth
   - Inicia sesión con la cuenta correspondiente al departamento
   - Acepta todos los permisos (calendario, email, perfil)
   - Google redirigirá automáticamente al callback

3. **Verificación exitosa**:
   - Verás una página de "Autorización Exitosa"
   - Los tokens se guardan automáticamente en el `.env`

### 3.2 Departamentos Configurados Actualmente

| Departamento | Correo | Status |
|-------------|--------|---------|
| admin | primary | ⚪ No configurado |
| aca | aca.mbe@gmail.com | ⚪ No configurado |
| atic | primary | ✅ Configurado |
| rrhh | rrhh2@mbe.madrid | ✅ Configurado |
| rrhhmaster | rrhh1@mbe.madrid | ✅ Configurado |
| ceo | ceo.mbe@gmail.com | ⚪ No configurado |
| ade | ade.mbe@gmail.com | ✅ Configurado |
| myd | myd1@mbe.madrid | ✅ Configurado |
| propietario | propietario.mbe@gmail.com | ⚪ No configurado |
| superadmin | superadmin.mbe@gmail.com | ⚪ No configurado |

---

## 4. Agregar Nuevos Departamentos

### 4.1 Pasos para Agregar un Departamento

#### Paso 1: Configurar el .env
Agregar estas líneas al archivo `.env`:

```bash
# Reemplazar 'NUEVODEPARTAMENTO' con el nombre en MAYÚSCULAS
CALENDAR_NUEVODEPARTAMENTO_ID=correo@ejemplo.com
GOOGLE_ACCESS_TOKEN_NUEVODEPARTAMENTO=
GOOGLE_REFRESH_TOKEN_NUEVODEPARTAMENTO=
```

#### Paso 2: Actualizar lista de departamentos válidos
Editar `src/pages/api/auth/google/callback.ts` línea 38:

```typescript
const validDepartments = [
  'admin', 'aca', 'atic', 'rrhh', 'rrhhmaster',
  'ceo', 'ade', 'myd', 'propietario', 'superadmin',
  'nuevodepartamento'  // ← Agregar aquí
];
```

#### Paso 3: Autorizar
Usar la URL: `http://185.252.233.57:3006/api/auth/google/login?department=nuevodepartamento`

---

## 5. URLs de Autorización

### 5.1 URLs Rápidas por Departamento

```bash
# Admin
http://185.252.233.57:3006/api/auth/google/login?department=admin

# ACA
http://185.252.233.57:3006/api/auth/google/login?department=aca

# ATIC (ya configurado)
http://185.252.233.57:3006/api/auth/google/login?department=atic

# RRHH (ya configurado)
http://185.252.233.57:3006/api/auth/google/login?department=rrhh

# RRHHMASTER (ya configurado)
http://185.252.233.57:3006/api/auth/google/login?department=rrhhmaster

# CEO
http://185.252.233.57:3006/api/auth/google/login?department=ceo

# ADE (ya configurado)
http://185.252.233.57:3006/api/auth/google/login?department=ade

# MYD (ya configurado)
http://185.252.233.57:3006/api/auth/google/login?department=myd

# Propietario
http://185.252.233.57:3006/api/auth/google/login?department=propietario

# Superadmin
http://185.252.233.57:3006/api/auth/google/login?department=superadmin
```

---

## 6. Verificación y Testing

### 6.1 Verificar Configuración
```bash
# Verificar configuración de un departamento
curl http://185.252.233.57:3006/api/calendar/config/rrhh
```

**Respuesta esperada:**
```json
{
  "success": true,
  "department": "rrhh",
  "calendarId": "rrhh2@mbe.madrid",
  "hasTokens": true,
  "isConfigured": true
}
```

### 6.2 Verificar Tokens en .env
```bash
grep "GOOGLE_.*_DEPARTAMENTO" appfichaje/mbeApi/.env
```

### 6.3 Probar API del Calendario
```bash
# Obtener eventos de un departamento
curl http://185.252.233.57:3006/api/calendar/events/rrhh

# Obtener configuración
curl http://185.252.233.57:3006/api/calendar/config/rrhh
```

### 6.4 Verificar Todos los Departamentos
```bash
# Script para verificar todos los departamentos
for dept in admin aca atic rrhh rrhhmaster ceo ade myd propietario superadmin; do
  echo "Checking $dept..."
  curl "http://185.252.233.57:3006/api/calendar/config/$dept"
  echo -e "\n"
done
```

---

## 7. Solución de Problemas

### 7.1 Errores Comunes de OAuth

#### Error: "invalid_client"
- **Causa**: Client ID o Client Secret incorrectos
- **Solución**: Verificar credenciales en `.env` y Google Cloud Console

#### Error: "redirect_uri_mismatch"
- **Causa**: URI de redirección no configurada correctamente
- **Solución**: Verificar que en Google Cloud Console esté exactamente:
  `http://185.252.233.57:3006/api/auth/google/callback`

#### Error: "Departamento no válido"
- **Causa**: Departamento no está en la lista `validDepartments`
- **Solución**: Agregar departamento al array en `callback.ts`

#### Error: "State inválido"
- **Causa**: Problema con el parsing del JSON del state
- **Solución**: Limpiar cookies del navegador y intentar de nuevo

### 7.2 Problemas de Tokens

#### Los tokens no se guardan
- Verificar permisos de escritura en el archivo `.env`
- Revisar logs del servidor para errores de filesystem

#### Tokens expirados
- Los refresh tokens se usan automáticamente
- Si hay problemas persistentes, re-autorizar el departamento

#### Error: "No se pudo obtener access token"
- Verificar que la cuenta de Google tenga acceso al calendario
- Comprobar que las credenciales sean correctas

### 7.3 Problemas de Acceso al Calendario

#### Error: "hasTokens: false"
- El departamento no ha sido autorizado
- Ejecutar el proceso de autorización OAuth2

#### Error 403 en API calls
- Verificar que la cuenta tenga permisos en el calendario
- Comprobar que los scopes sean correctos

---

## 8. Mantenimiento

### 8.1 Renovación de Tokens
- Los access tokens expiran cada hora
- Los refresh tokens se usan automáticamente
- Si un refresh token expira, re-autorizar el departamento

### 8.2 Monitoreo
```bash
# Verificar estado de todos los departamentos
for dept in rrhh atic aca myd ade ceo superadmin propietario admin; do
  echo "=== $dept ==="
  curl -s "http://185.252.233.57:3006/api/calendar/config/$dept" | jq '.hasTokens'
done
```

### 8.3 Respaldo
- Hacer backup del archivo `.env` (sin commitear al repo)
- Documentar qué cuenta de Google usa cada departamento

### 8.4 Seguridad
- Los tokens se almacenan en `.env` (no commitear)
- Cada departamento tiene acceso solo a su calendario
- Usar `.env.example` para plantillas
- Rotar tokens periódicamente en producción

---

## 🚀 Inicio Rápido para Nuevos Departamentos

1. **Agregar al .env**:
```bash
CALENDAR_NUEVODEPT_ID=correo@nuevodept.com
GOOGLE_ACCESS_TOKEN_NUEVODEPT=
GOOGLE_REFRESH_TOKEN_NUEVODEPT=
```

2. **Agregar a validDepartments** en `callback.ts`

3. **Autorizar**: `http://185.252.233.57:3006/api/auth/google/login?department=nuevodept`

4. **Verificar**: `curl http://185.252.233.57:3006/api/calendar/events/nuevodept`

---

---

## 🔗 OAuth con SSH Tunnel - Solución Mixta

### 📋 Configuración Actual

#### ✅ **OAuth configurado para localhost**
- `GOOGLE_REDIRECT_URI=http://localhost:3006/api/auth/google/callback`
- **Google Cloud Console** debe tener: `http://localhost:3006/api/auth/google/callback`

#### ✅ **Resto del proyecto usa IP del servidor**
- APIs internas: `http://185.252.233.57:3006`
- Aplicaciones: `http://185.252.233.57:3005` y `:6969`

### 🚀 Cómo Autorizar Departamentos OAuth

#### Opción 1: Desde tu máquina local (Directo)

Si tienes el proyecto corriendo localmente:

```bash
# URLs de autorización directas
http://localhost:3006/api/auth/google/login?department=rrhh
http://localhost:3006/api/auth/google/login?department=rrhhmaster
http://localhost:3006/api/auth/google/login?department=ade
http://localhost:3006/api/auth/google/login?department=myd
```

#### Opción 2: SSH Tunnel al servidor (Recomendada)

Cuando necesites autorizar desde remoto o el servidor:

##### 1. Crear túnel SSH
```bash
# Desde tu máquina local
ssh -L 3006:localhost:3006 root@185.252.233.57

# O si usas otro usuario:
ssh -L 3006:localhost:3006 tu_usuario@185.252.233.57
```

##### 2. Mantener túnel activo
```bash
# En otra terminal, mientras mantienes el túnel SSH abierto
curl http://localhost:3006/api/calendar/config/rrhh
```

##### 3. Autorizar departamentos
Con el túnel activo, usar las URLs normales:
```bash
http://localhost:3006/api/auth/google/login?department=rrhh
http://localhost:3006/api/auth/google/login?department=rrhhmaster
http://localhost:3006/api/auth/google/login?department=ade
http://localhost:3006/api/auth/google/login?department=myd
```

##### 4. Cerrar túnel
```bash
# Ctrl+C en la terminal del SSH
```

### 🔧 Script Automatizado

Para facilitar el proceso, crea este script:

```bash
# tunnel-oauth.sh
#!/bin/bash

echo "🔗 Iniciando túnel SSH para OAuth..."
echo "💡 Mantén esta terminal abierta mientras autorizas"
echo ""
echo "📋 URLs disponibles:"
echo "   http://localhost:3006/api/auth/google/login?department=rrhh"
echo "   http://localhost:3006/api/auth/google/login?department=rrhhmaster"
echo "   http://localhost:3006/api/auth/google/login?department=ade"
echo "   http://localhost:3006/api/auth/google/login?department=myd"
echo ""
echo "⏹️  Para cerrar: Ctrl+C"
echo ""

ssh -L 3006:localhost:3006 root@185.252.233.57
```

**Hacer ejecutable:**
```bash
chmod +x tunnel-oauth.sh
./tunnel-oauth.sh
```

### 🎯 Flujo Completo de Autorización

1. **Ejecutar script de túnel**:
   ```bash
   ./tunnel-oauth.sh
   ```

2. **Abrir navegador** en:
   ```
   http://localhost:3006/api/auth/google/login?department=rrhh
   ```

3. **Autorizar con Google** usando cuenta `rrhh2@mbe.madrid`

4. **Verificar éxito**: Ver página "Autorización Exitosa"

5. **Verificar tokens**:
   ```bash
   curl http://localhost:3006/api/calendar/config/rrhh
   ```

6. **Repetir para otros departamentos**

7. **Cerrar túnel**: `Ctrl+C`

### 💡 Ventajas de esta solución

✅ **OAuth funciona** sin dominio
✅ **Seguro** - solo localhost para OAuth
✅ **Flexible** - puedes autorizar desde cualquier lugar
✅ **Sin costos** - no necesitas dominio
✅ **Fácil setup** - solo un comando SSH

---

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verificar que el servidor API esté corriendo en 185.252.233.57:3006
2. Comprobar los logs del servidor para errores específicos
3. Usar las URLs de verificación para diagnosticar problemas
4. Consultar la sección de solución de problemas
5. **Para OAuth**: Verificar que el túnel SSH esté activo

**Archivos clave:**
- `.env`: Configuración y tokens
- `callback.ts`: Lista de departamentos válidos
- `login.ts`: Generación de URLs de autorización