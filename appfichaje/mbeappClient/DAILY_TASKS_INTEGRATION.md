# Integración de Notificación de Tareas Diarias

## 📋 Resumen
Sistema de notificación que muestra las tareas del día de Google Calendar después de cerrar la notificación de "examen diario".

## 🔧 Cómo Funciona

### 1. **Trigger Automático**
La notificación de tareas diarias se activa automáticamente cuando el sistema externo (que maneja "examen diario") llama a una de estas funciones:

```javascript
// Opción 1: Función simple
window.showDailyTasksNotification();

// Opción 2: Función con delay (recomendada)
window.onExamDiarioClose();

// Opción 3: Usando el namespace MBE
window.MBE.showDailyTasks();
window.MBE.onExamClose();
```

### 2. **Integración Sugerida**
En el código donde se cierra la notificación de "examen diario", agregar:

```javascript
// Al cerrar el modal/notificación de examen diario
function cerrarExamenDiario() {
    // ... código existente para cerrar el examen ...

    // Disparar tareas diarias después de cerrar
    if (typeof window.onExamDiarioClose === 'function') {
        window.onExamDiarioClose();
    }
}
```

### 3. **Funcionamiento Interno**
1. El sistema externo llama a `onExamDiarioClose()`
2. Se ejecuta un delay de 500ms para suavizar la transición
3. Se dispara un evento personalizado `showDailyTasks`
4. El Layout React escucha este evento y muestra la notificación
5. La notificación obtiene los eventos del día desde Google Calendar
6. Se muestran las tareas filtradas por departamento del usuario

## 🎯 Beneficios

- **Secuencia Natural**: Aparece después del examen diario
- **Sin Interferencias**: No interrumpe otras notificaciones
- **Filtrado Inteligente**: Solo eventos del día actual por departamento
- **Responsive**: Funciona en todos los dispositivos
- **No Invasivo**: Se puede cerrar fácilmente

## 🔄 Flujo de Usuario

1. Usuario hace login
2. Aparece notificación de "atención"
3. Aparece notificación de "examen diario"
4. Usuario cierra "examen diario"
5. **→ Aparece automáticamente "Tareas Programadas para Hoy"**
6. Usuario revisa sus tareas y cierra la notificación

## 🛠️ Archivos Modificados

- `Layout.tsx`: Listener de eventos y gestión de estado
- `DailyTasksNotification.tsx`: Componente de notificación
- `dailyTasksTrigger.js`: Script de integración global
- `globalTypes.ts`: Tipos para CalendarEvent

## ⚡ Pruebas

Para probar manualmente la funcionalidad:

```javascript
// En la consola del navegador
window.showDailyTasksNotification();
```

La notificación debería aparecer inmediatamente mostrando las tareas del día.