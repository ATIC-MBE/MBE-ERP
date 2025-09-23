import { IModel } from "../helpers/IModel"

export interface IVariablesReserva extends IModel {
    id: number
    aplica: string
    fecha_inicio_vigencia?: string
    fecha_fin_vigencia?: string
    estado: number
    precio_base?: number
    porcentaje_descuento?: number
    precio_limite: number
    precio_alquiler: number
    precio_muebles: number
    total: number
    estancia_min?: number
    estancia_max?: number
    duracion_estancia: number
    edad_min?: number
    edad_max?: number
    mascota: boolean
    observacion?: string

    // Relaciones
    idinfopisocom?: number
    idtipoestancia?: number

    // for layout
    n_estancia?: string

    // Función delete data
    delete(): void
}