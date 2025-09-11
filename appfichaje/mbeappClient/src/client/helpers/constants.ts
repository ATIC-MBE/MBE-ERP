export const menu_aca: Array<MenuLeftType> = [
	{ key: 'aca_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/aca', codeIcon: 'home' },
	// { key: 'aca_contactos', isActive: false, propID: 'Contactos', order: 2, menuPath: '/aca/contactos', codeIcon: 'contactos' }, // Oculto temporalmente
	{ key: 'aca_solicitudes', isActive: false, propID: 'Solicitudes', order: 3, menuPath: '/aca/solicitudes', codeIcon: 'solicitudes' },
];
// === RUTA APARTAMENTOS MYD ===
export const MYD_APARTMENT_PATH = '/api/myd/apartments/';
// Alias y constantes para MYD (Marketing y Desarrollo)
// ...existing code...
// Estados comerciales genéricos para MYD
export const STATES_PISO_COMERCIAL = [
	{ key: '1', name: 'Disponible' },
	{ key: '2', name: 'Ocupado' },
	{ key: '3', name: 'Mantenimiento' }
];
export const STATES_APLICA_COMERCIAL = [
	{ key: '1', name: 'Sí aplica' },
	{ key: '0', name: 'No aplica' }
];
export const STATES_ESTADO_MYD_COMERCIAL = [
	{ key: '1', name: 'Activo' },
	{ key: '0', name: 'Inactivo' }
];
export const menu_myd_master: Array<MenuLeftType> = [
	{ key: 'myd_master_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/mydmaster', codeIcon: 'home' },
	{ key: 'myd_master_users', isActive: false, propID: 'Usuarios', order: 2, menuPath: '/mydmaster/users/', codeIcon: 'user' },
	{ key: 'myd_master_contactos', isActive: false, propID: 'Contactos', order: 3, menuPath: '/mydmaster/contactos', codeIcon: 'contactos' },
	{ key: 'myd_master_solicitudes', isActive: false, propID: 'Solicitudes', order: 4, menuPath: '/mydmaster/solicitudes', codeIcon: 'solicitudes' },
];
export const menu_myd: Array<MenuLeftType> = [
	{ key: 'myd_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/myd', codeIcon: 'home' },
	// { key: 'myd_contactos', isActive: false, propID: 'Contactos', order: 3, menuPath: '/myd/contactos', codeIcon: 'contactos' }, // Oculto temporalmente
	{ key: 'myd_solicitudes', isActive: false, propID: 'Solicitudes', order: 4, menuPath: '/myd/solicitudes', codeIcon: 'solicitudes' },
];
// Menú lateral ADE Master
export const menu_ade_master: Array<MenuLeftType> = [
	{ key: 'ade_master_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/ademaster', codeIcon: 'home' },
	{ key: 'ade_master_users', isActive: false, propID: 'Usuarios', order: 2, menuPath: '/ademaster/users/', codeIcon: 'user' },
	{ key: 'ade_master_contactos', isActive: false, propID: 'Contactos', order: 3, menuPath: '/ademaster/contactos', codeIcon: 'contactos' },
	{ key: 'ade_master_solicitudes', isActive: false, propID: 'Solicitudes', order: 4, menuPath: '/ademaster/solicitudes', codeIcon: 'solicitudes' },
];
// Estados administrativos
export const STATES_ADMIN = [
	{ key: '-1', name: 'Eliminado' },
	{ key: '1', name: 'Alta' },
	{ key: '0', name: 'Baja' }
];
// Alias para compatibilidad legacy
export const STATES = STATES_ADMIN;
export const ALERT_DANGER = 'danger';
// Mensaje de error de campo
export const MSG_ERROR_FIELD = 'Error en los campos requeridos';
// Endpoint para roles de superadmin
export const SA_ROLES_PATH = '/api/share/roles';
// Booleanos para selects
export const STATES_BOOLEAN = [
	{ key: 'true', name: 'Si' },
	{ key: 'false', name: 'No' }
];
// Departamentos de usuario
export const USER_DEPARMENT = [
	{ key: 'ATIC', name: 'ATIC' },
	{ key: 'RRHH', name: 'RRHH' },
	{ key: 'MYD', name: 'MYD' },
	{ key: 'ADE', name: 'ADE' },
	{ key: 'ACA', name: 'ACA' }
];
// Mensajes de alerta
export const ALERT_MSG_SAVE_DATA = 'La información ha sido registrada exitosamente!';
export const ALERT_MSG_CONFIR_DELETE_DATA = '¿Está seguro de eliminar el registro?';
export const ALERT_MSG_CONTRATAR_DELETE_DATA = '¿Está seguro de ejecutar la contratación?';
export const ALERT_MSG_MOVER_LEADS = '¿Está seguro de mover los leads?';
export const ALERT_MSG_CONFIR_RESET_PASSWORD = `¿Está seguro de resetear el password?`;
export const ALERT_MSG_RESET_PASSWORD_OK = `El password ha sido reseteado exitosamente!`;

// Rutas de usuario
export const ADMIN_USERS_PATH = '/api/admin/users';
export const RRHH_USERS_PATH = '/api/rrhh/users';

// Acción especial
export const ACTION_GO_BACK_LEAD = 'go_back_lead';
// Opción por defecto para selects
export const NO_SELECTED = { key: '', name: 'Seleccionar...' };
// Menu lateral superadmin (igual que atic)
export const menu_superadmin: Array<MenuLeftType> = [
	{ key: 'superadmin_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/superadmin', codeIcon: 'home' },
	{ key: 'superadmin_users', isActive: false, propID: 'Usuarios', order: 3, menuPath: '/superadmin/users/', codeIcon: 'user' },
	{ key: 'superadmin_solicitudes', isActive: false, propID: 'Solicitudes', order: 4, menuPath: '/superadmin/solicitudes', codeIcon: 'solicitudes' },
];
import type { MenuLeftType } from '@/client/types/globalTypes';

// === VISIBILIDAD DE PDF POR RUTA ===
// Define qué roles pueden ver PDFs en cada ruta. Ejemplo: { '/rrhhmaster': ['rrhh', 'admin'] }
export const pdfVisibility: Record<string, string[]> = {};
// === ACCESOS DIRECTOS POR ROL ===
// Puedes personalizar los accesos directos por rol aquí. Cada clave es un rol y su valor es un array de accesos.
// Estructura de acceso: { label: string, link: string, codeIcon: string, orden: number }
export type AccesoDirecto = {
	label: string;
	link: string;
	codeIcon: string;
	orden: number;
};
export const acceso_directos: Record<string, AccesoDirecto[]> = {
	share: [],
	admin: [],
	rrhh: [
		{
			orden: 1,
			label: 'PINS',
			codeIcon: 'exclamacion',
			link: 'https://docs.google.com/spreadsheets/d/1CwzkZejBDcQ8sOCHDWEj9k9cZbYI2PjZGYSpxLHaE1Y/edit?gid=0#gid=0'
		},
        {
			orden: 2,
			label: 'Claves y Contactos',
			codeIcon: 'contactos',
			link: 'https://docs.google.com/spreadsheets/d/1_tWh4nGZ9qwl_Ns6AfTunQ2_MhQtZ4778qCrkpU3ZzU/edit?gid=1508133306#gid=1508133306'
		},
		{
			orden: 3,
			label: 'JAIME',
			codeIcon: 'bot',
			link: 'https://mbemadrid.short.gy/JaimeBot'
		}
	],
	rrhhmaster: [
		{
			orden: 1,
			label: 'PINS',
			codeIcon: 'exclamacion',
			link: 'https://docs.google.com/spreadsheets/d/1CwzkZejBDcQ8sOCHDWEj9k9cZbYI2PjZGYSpxLHaE1Y/edit?gid=0#gid=0'
		},
        {
			orden: 2,
			label: 'Claves y Contactos',
			codeIcon: 'contactos',
			link: 'https://docs.google.com/spreadsheets/d/1_tWh4nGZ9qwl_Ns6AfTunQ2_MhQtZ4778qCrkpU3ZzU/edit?gid=1508133306#gid=1508133306'
		},
		{
			orden: 3,
			label: 'JAIME',
			codeIcon: 'bot',
			link: 'https://mbemadrid.short.gy/JaimeBot'
		}
	],
	ade: [],
	atic: [
		{ orden: 1, label: 'Gantt', codeIcon: 'tareas', link: 'https://docs.google.com/spreadsheets/d/1D1o3il-OINA1qW8Sgs45FrmWYg2fLJ4g4A_UfoqeVE4/edit?pli=1&gid=1115838130#gid=1115838130' }, // pon aquí tu link
		{ orden: 2, label: 'Claves & Contactos', codeIcon: 'contactos', link: 'https://docs.google.com/spreadsheets/d/18sAXYbiglkx1fdG52O1RP2bSyUFWuLL6O8vC4pkZpnU/edit?gid=0#gid=0' }, // pon aquí tu link
		{ orden: 3, label: 'P1N', codeIcon: 'alerta', link: 'https://docs.google.com/spreadsheets/d/1CwzkZejBDcQ8sOCHDWEj9k9cZbYI2PjZGYSpxLHaE1Y/edit?gid=0#gid=0' } // pon aquí tu link
	],
	aticmaster: [
		{ orden: 1, label: 'Gantt', codeIcon: 'tareas', link: 'https://docs.google.com/spreadsheets/d/1D1o3il-OINA1qW8Sgs45FrmWYg2fLJ4g4A_UfoqeVE4/edit?pli=1&gid=1115838130#gid=1115838130' }, // pon aquí tu link
		{ orden: 2, label: 'Claves & Contactos', codeIcon: 'contactos', link: 'https://docs.google.com/spreadsheets/d/18sAXYbiglkx1fdG52O1RP2bSyUFWuLL6O8vC4pkZpnU/edit?gid=0#gid=0' }, // pon aquí tu link
		{ orden: 3, label: 'P1N', codeIcon: 'alerta', link: 'https://docs.google.com/spreadsheets/d/1CwzkZejBDcQ8sOCHDWEj9k9cZbYI2PjZGYSpxLHaE1Y/edit?gid=0#gid=0' } // pon aquí tu link
	],
	aca: [],
	myd: [],
	superadmin: [],
	// Agrega más roles según necesidad
};
// === ICONOS Y LOGOS ===
export const LOGO_MCH_B64 = '';
export const MARGINS_REPORT = { top: 10, bottom: 10, left: 10, right: 10 };
export const CROSS_REPORT = '';
export const CHECK_REPORT = '';

// === BOTONES GENERALES ===
export const BTN_CREATE = 'Crear';
export const BTN_EDIT = 'Editar';
export const BTN_DELETE = 'Eliminar';
export const BTN_SAVE = 'Guardar';
export const BTN_CANCEL = 'Cancelar';
export const BTN_CLOSE = 'Cerrar';
export const BTN_EXPORT = 'Exportar';
export const BTN_IMPORT = 'Importar';
export const BTN_SEARCH = 'Buscar';
export const BTN_BACK = 'Volver';

// === MENÚS Y LINKS ===
export const MENU_DASHBOARD = 'Dashboard';
export const MENU_USERS = 'Usuarios';
export const MENU_DEPARTMENTS = 'Departamentos';
export const MENU_SETTINGS = 'Configuración';
export const MENU_LOGOUT = 'Cerrar sesión';

// === DEPARTAMENTOS PRINCIPALES ===
export const DEPARTMENTS = [
	{ key: 'MYD', name: 'MYD - Marketing y Desarrollo', path: '/departamentos/myd', color: '#005360' },
	{ key: 'ADE', name: 'ADE - Administración y Economía', path: '/departamentos/ade', color: '#005360' },
	{ key: 'ATIC', name: 'ATIC - Tecnología e Innovación', path: '/departamentos/atic', color: '#ed7233' },
	{ key: 'ACA', name: 'ACA - Académico', path: '/departamentos/aca', color: '#5da7d5' },
	{ key: 'RRHH', name: 'RRHH - Recursos Humanos', path: '/departamentos/rrhh', color: '#bdbdbd' },
];

// === RUTAS DEPARTAMENTOS ===
export const MYD_PATH = '/departamentos/myd';
export const ADE_PATH = '/departamentos/ade';
export const ATIC_PATH = '/departamentos/atic';
export const ACA_PATH = '/departamentos/aca';
export const RRHH_PATH = '/departamentos/rrhh';

// === BOTONES DE DEPARTAMENTOS ===
export const BTN_MAKE_REQUEST = 'Solicitar';
export const BTN_VIEW_MEMBERS = 'Ver miembros';
export const BTN_DEPT_SETTINGS = 'Configurar departamento';

// === RUTAS DE API Y NAVEGACIÓN ===
export const USERS_PATH = '/api/users';
export const DEPARTMENTS_PATH = '/api/departments';
export const PROFILE_PATH = '/api/profile';
export const SHARE_PROFILE_PATH = '/api/share/profile';
export const LOGIN_PATH = '/login';
export const DASHBOARD_PATH = '/dashboard';
// Ruta real de login para la API
export const AUTH_LOGIN_PATH = '/api/auth/login';

// === MENSAJES Y ALERTAS ===
export const MSG_TABLE_LOADING = 'Cargando...';
export const MSG_TABLE_EMPTY = 'No hay resultados que mostrar!!';
export const MSG_ERROR_SAVE = 'Error al guardar. Inténtalo de nuevo.';
export const MSG_SUCCESS_SAVE = 'Guardado correctamente.';
export const MSG_CONFIRM_DELETE = '¿Seguro que deseas eliminar este registro?';
export const MSG_DELETED = 'Registro eliminado correctamente.';
export const MSG_ERROR_GENERIC = 'Ha ocurrido un error inesperado.';

// === MENÚS LATERALES ===


export const menu_rrhh_master: Array<MenuLeftType> = [
	{ key: 'rrhh_master_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rrhhmaster', codeIcon: 'home' },
	{ key: 'rrhh_master_users', isActive: false, propID: 'Usuarios', order: 2, menuPath: '/rrhhmaster/users/', codeIcon: 'user' },
	{ key: 'rrhh_master_contactos_universidad', isActive: false, propID: 'Universidades', order: 3, menuPath: '/rrhhmaster/contactos-universidad', codeIcon: 'birrete' },
    { key: 'rrhh_master_fichaje', isActive: false, propID: 'Fichaje', order: 4, menuPath: '/rrhhmaster/fichaje', codeIcon: 'fichaje' },
    { key: 'rrhh_master_esquema', isActive: false, propID: 'Esquema', order: 5, menuPath: '/rrhhmaster/esquema', codeIcon: 'esquema' },
    { key: 'rrhh_master_vacaciones', isActive: false, propID: 'Vacaciones', order: 6, menuPath: '/rrhhmaster/vacaciones', codeIcon: 'vacaciones' },
    { key: 'rrhh_master_solicitudes', isActive: false, propID: 'Solicitudes', order: 7, menuPath: '/rrhhmaster/solicitudes', codeIcon: 'solicitudes' },
];

export const menu_rrhh: Array<MenuLeftType> = [
	{ key: 'rrhh_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rrhh', codeIcon: 'home' },
	{ key: 'rrhh_users', isActive: false, propID: 'Usuarios', order: 2, menuPath: '/rrhh/users/', codeIcon: 'user' },
	{ key: 'rrhh_contactos_universidad', isActive: false, propID: 'Universidades', order: 3, menuPath: '/rrhh/contactos-universidad', codeIcon: 'birrete' },
    { key: 'rrhh_solicitudes', isActive: false, propID: 'Solicitudes', order: 4, menuPath: '/rrhh/solicitudes', codeIcon: 'solicitudes' },
];

export const menu_atic: Array<MenuLeftType> = [
	{ key: 'atic_home', isActive: false, propID: 'Inicio', order: 1, menuPath: '/atic', codeIcon: 'home' },
	{ key: 'atic_solicitudes', isActive: false, propID: 'Solicitudes', order: 2, menuPath: '/atic/solicitudes', codeIcon: 'solicitudes' },
];
