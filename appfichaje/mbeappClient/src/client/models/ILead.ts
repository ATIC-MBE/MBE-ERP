export interface ILead {
    id: number
    lead_id?: string
    timestamp: string
    next_step: string
    last_step: string
    semana?: string
    nombre?: string
    apellido?: string
    nombre_completo?: string
    grupo_wpp?: string
    referencia?: string
    precio?: string
    m2?: string
    codigo_postal?: string
    direccion?: string
    nro_edificio?: string
    nro_piso?: string
    localidad?: string
    estatus?: number
    nro_llamadas?: number
    fecha_creacion: string
    fecha_ult_cambio: string

    idtipoavance?: number
    idresponsable?: number
    idtipoocupacion?: number
    idtipointeresa?: number
    idusuario_creacion: number
    idusuario_ult_cambio: number

    // data agentes
    idcategoria?:number
    tipo_lead: string
    empresa?: string

    // Listado de telefonos y correos
    telefono?: string
    telefonos: Array<{ id: number, numero: string }>
    correo?: string
    correos: Array<{ id: number, correo: string }>

    responsable?: string
    comentario?: string
    historico: Array<{ id: number, comentario: string, responsable: string, fecha_creacion: string, fecha_creacion_short: string }>

    tipo_accion?: string

    // Field no DB
    name_tavance?: string
    name_tocupacion?: string
    name_tinteresa?: string
    persona?: string
    personahtml?: boolean
    telefonos_str?: string
    lbl_orden?: string

    // data del grupo
    grupo?: { id: number, nombre: string }
}