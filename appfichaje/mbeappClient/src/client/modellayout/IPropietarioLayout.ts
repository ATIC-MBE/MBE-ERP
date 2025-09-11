import { IModel } from "../helpers/IModel"
import { user } from "../types/globalTypes"

export interface IPropietarioLayout extends user, IModel {
    isSelected?: boolean
}