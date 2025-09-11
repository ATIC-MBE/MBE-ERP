import { IModel } from "../helpers/IModel";

export interface IEstadisticaDn extends IModel {
      id?: number 
      fecha_creacion?: string
      tipo: string
      idusuario?: number
      data?: any
      estadistica: number,
      usr_responsable?: string
}