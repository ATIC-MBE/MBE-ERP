import { IModel } from "../helpers/IModel"
import { IPropietarioLayout } from "../modellayout/IPropietarioLayout"
import { user } from "../types/globalTypes"

export interface IGrupoPropietario extends IModel {
    id: number
    nombre: string
    nro_llamadas: number
    whatsapp: string
    next_step: string

    // Fiels propietarios contratados
    administrador?: string
    presidente?: string
    vecinos?: string
    portero?: string
    otros?: string
    acceso_intranet?: string

    // Data prescriptores no DB on table
    propietarios: Array<IPropietarioLayout>

    // Data suceso no DB on table
    comentario_suceso: string
    
    // propietario to lead
    propietarios_to_lead: Array<number>
}