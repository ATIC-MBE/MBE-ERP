import { IModel } from "../helpers/IModel"

export interface IFichaje extends IModel {
    id?: number
    full_name?: string
    fecha?: string
    entrada?: string
    salida?: string
    idusuario?: number
    observacion?: string

    idrol?: string
    namerol?: string

    
    h_entrada?: string
    h_salida?: string

    fecha_str?: string
    
}