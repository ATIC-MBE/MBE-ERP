import { IModel } from "../helpers/IModel"

export interface IDevice extends IModel {
    id: number
    idpiso?: number
    idtipodispositivo: number
    codigo: string
    nombre: string
    ubicacion?: string
    ref_dispositivo?: string
    etiqueta_dispositivo?: string
    descripcion?: string
    estado?: number

    // Fields no DB
    type?: string
    data_son?: Array<any>
    etiqueta?: string
    tdevice?: string
    nametdevice?: string
    estado_piso?: number
    info_extra?: any

    // Data Lock
    mac?: string
    codigo_permanente?: string
    bateria?: number

    // Data Telefonillo
    ip_arduino?: string

    //Data Movil
    version_app?: string
    ip?: string
    macwifi?: string

}