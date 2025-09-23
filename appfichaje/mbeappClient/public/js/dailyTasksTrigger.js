/**
 * Script para disparar la notificación de tareas diarias
 * Este archivo debe ser incluido en el sistema donde se manejan las notificaciones de "examen diario"
 */

// Función para mostrar las tareas diarias después de cerrar el examen diario
function showDailyTasksNotification() {
    // Crear y disparar evento personalizado
    const event = new CustomEvent('showDailyTasks');
    window.dispatchEvent(event);

    console.log('✅ Evento showDailyTasks disparado - Se mostrará la notificación de tareas diarias');
}

// Función para ser llamada cuando se cierre la notificación de examen diario
function onExamDiarioClose() {
    // Pequeño delay para dar tiempo a que se cierre la notificación anterior
    setTimeout(() => {
        showDailyTasksNotification();
    }, 500);
}

// Exportar para uso global
window.showDailyTasksNotification = showDailyTasksNotification;
window.onExamDiarioClose = onExamDiarioClose;

// También agregar al objeto global para fácil acceso
if (typeof window.MBE === 'undefined') {
    window.MBE = {};
}

window.MBE.showDailyTasks = showDailyTasksNotification;
window.MBE.onExamClose = onExamDiarioClose;