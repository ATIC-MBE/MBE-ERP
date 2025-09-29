import { IModel } from "../helpers/IModel";

export interface IUserFirstLogin extends IModel {
      id?: number;
      idusuario: number;
      first_login_at?: string;
      first_login_ip?: string;
      first_login_user_agent?: string;
      source?: string;
      metadata?: any;
      created_at?: string;
      username?: string;
      nombre_completo?: string;
      email?: string;
      department?: string;
      estado?: number;
}
