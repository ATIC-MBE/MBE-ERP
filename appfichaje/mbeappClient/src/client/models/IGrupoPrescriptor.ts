import { IModel } from "../helpers/IModel"
import { IPrescriptorLayout } from "../modellayout/IPrescriptorLayout"
import { user } from "../types/globalTypes"

export interface IGrupoPrescriptor extends IModel {
    id: number
    nombre: string
    whatsapp: string
    nro_visitas: number
    nro_reservas: number
    valor: number
    valor_propietario: number
    next_step: string

    // fields de prescriptores contratados
    acceso_intranet?: string

    // Data prescriptores no DB on table
    prescriptores: Array<IPrescriptorLayout>
    flag_vr: string

    // Data suceso no DB on table
    comentario_suceso: string

    // Prescriptores to Lead
    prescriptores_to_lead: Array<number>

    total_visitas?: number
    total_reservas?: number
    total_valor_propietario?: number
}