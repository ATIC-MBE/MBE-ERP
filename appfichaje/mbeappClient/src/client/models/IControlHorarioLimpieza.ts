import { IModel } from "../helpers/IModel"

export interface IControlHorarioLimpieza extends IModel {
    id: number
    fecha?: string
    entrada?: string
    salida?: string
    idusuario?: number
    idpiso: number
    exec_entrada_lock?: boolean
    exec_salida_lock?: boolean
    estado?: number
    observacion?: string

    idusuario_ultimo_cambio?: number
    fecha_ultimo_cambio?: string
    tipo_ejecucion?: string

    etiqueta_piso?: string

    // fields reporte
    full_name?: string
    str_lhorario?: string // nomenclatura <entrada>TO<salida>|<entrada>TO<salida>|....|<entrada>TO<salida>
    h_entrada?: string
    h_salida?: string

    // fields extra operation matematica
    t_total_horas?: string
}