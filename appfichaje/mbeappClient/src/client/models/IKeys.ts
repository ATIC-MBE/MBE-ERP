export interface IKeys {
    id: number
    ubicacion: string
    tipo_tarjeta: string
    idqr: string
    qr: string
    imagenqr: string
    estado: number
    observacion: string
    fecha_creacion: string
    fecha_ultimo_cambio: string
    nro_locks:number

    //Fields No DB
    etiqueta?: string 
    estado_piso?: number
    pisos_str?:string 
    
    //PISOS
    pisos: Array<string>
}