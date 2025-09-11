import { IModel } from "../helpers/IModel"

export interface ISolicitudPrecio extends IModel {
    id: number
    limite_precio: number
    porcentaje_limite_precio: number
    estado?: number
    estado_solicitud?: number
    observacion?: string

    // filds extras
    f_fecha_creacion?: string
    lbl_estado_solicitud?: string
    propietario?: string
    piso?: string
}