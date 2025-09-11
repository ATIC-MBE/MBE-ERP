import { IModel } from "../helpers/IModel"

export interface IArticulo extends IModel {
    id: number
    tag: string
    mobiliario: string
    descripcion: string
    estado: boolean
    depreciacion: number
    fecha_compra: string
    fecha_registro: string 
    meses_antiguedad: number
    notas: string
    precio: number
    propietario: string
    stock: number
    total: number
    url_imagen: string
    valor_depreciacion: number
}