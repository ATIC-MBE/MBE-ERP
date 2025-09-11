import { IModel } from "../helpers/IModel"
import { user } from "../types/globalTypes"

export interface IPrescriptorLayout extends user, IModel {
    isSelected?: boolean
    empresa?: string
    idcategoria?: number
}