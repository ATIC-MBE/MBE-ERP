import { IModel } from "../helpers/IModel";

export interface ISucesoPropietario extends IModel {
      id: number
      fecha_creacion?: string
      comentario: string

      // fields no db
      responsable?: string
      fecha_creacion_short?: string
}