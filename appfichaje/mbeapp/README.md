# MBE ERP Fichaje App

## Notificaciones por llegadas tardías

La aplicación puede avisar automáticamente al responsable cuando un usuario acumula **3 llegadas tardías** en la misma semana. El flujo queda preparado para activarse en cuanto dispongas de un correo remitente (usuario + contraseña de aplicación).

### Resumen del flujo

1. El front (`public/js/Fichar.js`) vigila el contador semanal. Cuando se alcanza el límite, lanza un `POST /api/share/app/mch/late-alert` una única vez por usuario/semana.
2. El backend (`app.js`) valida la solicitud y delega en `modules/services/NotificationService`.
3. `NotificationService` resuelve el responsable (usa el correo enviado por el cliente o el definido en variables de entorno) y usa **Nodemailer** para mandar el email. Si no hay SMTP configurado aún, devuelve 202 sin error y deja el envío pendiente.

### Variables de entorno requeridas

Configúralas en `.env` (o en la infraestructura) cuando tengas las credenciales:

| Variable | Descripción |
| --- | --- |
| `SMTP_HOST` | Host del servidor SMTP (ej. `smtp.gmail.com`). |
| `SMTP_PORT` | Puerto SMTP (587 para STARTTLS, 465 para SSL). |
| `SMTP_SECURE` | `true` si usas SSL directo, `false` para STARTTLS. |
| `SMTP_USER` | Usuario/correo del buzón técnico. |
| `SMTP_PASS` | Contraseña de aplicación o API key. |
| `LATE_ALERT_FROM` | Dirección remitente mostrada (opcional, por defecto `SMTP_USER`). |
| `LATE_ALERT_REPLY_TO` | Dirección para respuestas (opcional). |
| `LATE_ALERT_FALLBACK_RECIPIENT` | Correo del responsable si el cliente no envía uno. |
| `LATE_ALERT_FALLBACK_NAME` | Nombre descriptivo del responsable (opcional). |

### Endpoint

```
POST /api/share/app/mch/late-alert
Headers:
  token: <token sesión>
  x-username: <usuario>
  x-request-id: <id único>
Body JSON:
  {
    "userId": "usuario",
    "weekKey": "2025-W41",
    "count": 3,
    "limit": 3,
  "thresholdTime": "09:04:00",
    "lateInfo": { ... },
    "summaryDetails": [ ... ],
    "responsibleEmail": "responsable@dominio.com" // opcional
  }
Respuesta 200/202:
  {
    "status": "ok",
    "emailQueued": true|false,
    "responsible": { "email": "...", "name": "..." },
    "deduped": true|false,
    "messageId": "..." | null,
    "reason": "SMTP_NOT_CONFIGURED" | null
  }
```

### Pruebas sugeridas

1. **Sin credenciales SMTP**: forzar tres llegadas tardías en local; la API debe responder 202 `emailQueued: false` con motivo `SMTP_NOT_CONFIGURED`.
2. **Con SMTP real**: rellenar las variables, reiniciar el proceso y repetir la prueba. Debes recibir el correo y ver `emailQueued: true`.
3. Verificar en `localStorage` la clave `fichaje_late_alert_sent_<user>_<week>` para evitar duplicados en la misma semana.

### Dependencias

Se añadió `nodemailer` al proyecto (`npm install nodemailer`). Ejecuta `npm install` después de actualizar el repositorio para sincronizar dependencias.

### Notas

- El servicio mantiene un caché en memoria para evitar reenvíos durante el uptime actual. Si necesitas deduplicar entre reinicios, conecta `NotificationService` a la base de datos.
- El cliente aún no envía `responsibleEmail`; si decides resolverlo del lado del servidor, usa las APIs/servicios de RRHH dentro de `NotificationService`.
