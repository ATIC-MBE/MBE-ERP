export interface IResponsableLead {
    id: number
    codigo: string
    nombre: string
    observacion: string
    estado: number
    idusuario_resp?: number
    responsable?: string
    tipo_lead: string
    orden?: number
    nro_leads?: number
}