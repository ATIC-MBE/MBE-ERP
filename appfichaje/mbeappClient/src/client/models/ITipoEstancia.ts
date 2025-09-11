import { IModel } from "../helpers/IModel"

export interface ITipoEstancia extends IModel {
    id: number
    codigo: string
    nombre: string
    minimo: number
    maximo?: number 
    estado: number
    observacion: string
}