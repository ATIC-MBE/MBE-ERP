import { AxiosError, AxiosResponse } from "axios"

export type rolenum =   'admin' | 
                        'propietario' | 
                        'colaborador' | 
                        'aca' | 
                        'default' | 
                        'superadmin' | 
                        'dn' | 
                        'atic' | 
                        'oficina' | 
                        'rrhh' | 
                        'ceo' | 
                        'dnmaster' |
                        'myd' |
                        'rrhhmaster' |
                        'da' |
                        'ade' | 
                        'acamaster' |
                        'aticmaster' |
                        'mydmaster' |
                        'myd' |
                        'mydmaster' |
                        'acamaster' |
                        'aticmaster' |
                        'damaster' |
                        'ademaster' |
                        ''
export class path {

    roles: Array<rolenum>

    constructor(...roles: Array<rolenum>) {
        this.roles = roles
    }

    isAllowed(currentRole: rolenum) {
        return this.roles.includes(currentRole)
    }
}

export type PathList = { [key: string]: path }

type role = { id: rolenum, nombre: string, ismain?: boolean }

export type user = {
    id: number,
    username: string,
    password: string,
    nombre: string,
    apellido: string,
    email: string,
    estado: number,
    idusuario?: number,
    idrol: rolenum,
    roles: Array<{id:string,nombre:string, ismain: boolean}>
    telefono?: string
    nombre_completo?: string

    // Fields extras
    fullname?: string
    roles_str?: string
    ref_lead?: string
    nombrerol?: string
    nombrerol_str?: string
    fecha_inicio?: string
    years?:string
    meses?:string
    dias?:string
    fecha_fin?:string
    alta_ss?:string
    email_per?:string
    detalles?:string
    departamento?:string

    // Campos RRHH 
    cumpleanyos?: string
    correo_personal ? : string
    jornada ?: string
    fecha_cambio_jornada?: string
    etapa? : string
    horario? : string
    total? : {hours: string , minutes : string}


    // Fields for multilogin DIEGO
    multilogin?: boolean
}

export interface profile {
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    estado: number,
    roles: Array<role>
}

export type UserSignup = {
    email:string;
    password:string;
    nombre:string;
    idrol:string;
    username:string;
    apellido:string;
}

export type MenuLeftType = {
    key: string
    isActive: boolean
    propID: string
    order: number
    menuPath: string
    codeIcon: string
}

//Menu DAContainer para info y mantenimiento
/*export type MenuDA ={
    //key: string
    isActive: boolean
    /*propID: string
    order: number
    menuPath: string
    codeIcon: string   
}*/

export type USERS_PATH = '/api/admin/users' | '/api/rrhh/users'

export type RequestCallback = (response: AxiosResponse) => void

export type RequestErrorHandler = (error: AxiosError) => void

export type JSONObject = {[key:string]:any}

export type tAlert = 'info' | 'danger' | 'success' | 'warning' | 'dark'

export type ModalPropsType = { children: JSX.Element, title: string, isOpen: boolean, acceptHandler?: () => any, cancelHandler?: () => any }

export type RMGPropiertieCardType = {piso:string, estado:string, alquiler:number, muebles:number, total:number, limite:number}


// Type para reporte detalle
export type ReportDetailsType = {
    id: number,
    etiqueta: string,
    dispositivos: Array<ReportDetailsDeviceType>
}

export type ReportDetailsDeviceType = {
    id: number,
    type: string,
    state: string,
    iddetallereporte: number
}

export type AccesoDirectoType = {
    orden: number,
    label: string,
    codeIcon: string,
    link: string
}

export type DeviceType = {
    id: number, 
    codigo: string, 
    nombre: string, 
    type: string,
    estado: number
    action?: string
}

export type AsociarDevicesToPisoType = {
    id: number,
    etiqueta: string,
    full_direccion: string,
    dispositivos: Array<DeviceType>
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: {
        dateTime: string;
        timeZone?: string;
    };
    end: {
        dateTime: string;
        timeZone?: string;
    };
    location?: string;
    attendees?: Array<{ email: string; displayName?: string }>;
    creator?: {
        email: string;
        displayName?: string;
    };
}