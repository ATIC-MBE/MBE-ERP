import { IModel } from "../helpers/IModel"

export interface IVacaciones extends IModel{
    id?: number
    nombre_completo : string
    fecha_inicio : string
    fecha_final : string
    estado ?: number 
    descripcion : string
    dias ? : string
    fecha_creacion? : string
    estado_solicitud? : number
}