import { IModel } from "../helpers/IModel";

export interface ISucesosDn extends IModel {
      id: number
      fecha_creacion?: string
      descripcion: string
      idrol: string

      // fields no db
      nombre_usu_creacion?: string
}