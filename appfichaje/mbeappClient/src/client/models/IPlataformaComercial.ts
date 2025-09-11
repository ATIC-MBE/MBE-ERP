import { IModel } from "../helpers/IModel"

export interface IPlataformaComercial extends IModel {
    id: number
    codigo: string
    nombre: string
    comision: string
    contacto?: string
    correo_contacto?: string
    telefono_contacto?: string
    link: string
    observacion?: string
    estado: number
    fecha_creacion?: string
    fecha_ultimo_cambio?: string
}