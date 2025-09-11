import { IModel } from "../helpers/IModel";

export interface ISucesoPrescriptor extends IModel {
      id: number
      fecha_creacion?: string
      comentario: string

      // fields no db [ responsable que registro el suceso ]
      responsable?: string
      fecha_creacion_short?: string
}