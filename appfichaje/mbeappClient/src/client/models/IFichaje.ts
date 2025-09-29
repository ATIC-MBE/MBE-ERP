import { IModel } from "../helpers/IModel"

export interface IFichaje extends IModel {
    id?: number
    full_name?: string
    fecha?: string
    entrada?: string
    salida?: string
    first_login?: string
    idusuario?: number
    observacion?: string

    idrol?: string
    namerol?: string

    
    h_entrada?: string
    h_salida?: string
    h_first_login?: string

    fecha_str?: string
    
}