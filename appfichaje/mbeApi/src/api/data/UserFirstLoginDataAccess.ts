import Constants from "../helpers/Constants";
import DbConnection from "../helpers/DbConnection";
import { IErrorResponse } from "../modelsextra/IErrorResponse";
import { IUserFirstLogin } from "../modelsextra/IUserFirstLogin";

class UserFirstLoginDataAccess {
      public client: DbConnection;

      constructor() {
            this.client = new DbConnection();
      }

      async getByUserId(idusuario: number): Promise<IUserFirstLogin | IErrorResponse | undefined> {
            const queryData = {
                  name: "user-first-login-by-user",
                  text: `SELECT ufl.*
                        FROM ${Constants.tbl_usuario_first_login_sql} ufl
                        WHERE ufl.idusuario = $1
                        ORDER BY ufl.first_login_at ASC
                        LIMIT 1`,
                  values: [idusuario]
            };

            const data = (await this.client.exeQuery(queryData)) as Array<IUserFirstLogin | IErrorResponse>;
            return data[0];
      }

      async insert(record: IUserFirstLogin): Promise<IUserFirstLogin | IErrorResponse | undefined> {
            const metadata = record.metadata ? JSON.stringify(record.metadata) : JSON.stringify({});
            const queryData = {
                  name: "user-first-login-insert",
                  text: `INSERT INTO ${Constants.tbl_usuario_first_login_sql}
                        (idusuario, first_login_ip, first_login_user_agent, source, metadata)
                        VALUES ($1, $2, $3, $4, $5::jsonb)
                        ON CONFLICT (idusuario) DO NOTHING
                        RETURNING *`,
                  values: [
                        record.idusuario,
                        record.first_login_ip || null,
                        record.first_login_user_agent || null,
                        record.source || null,
                        metadata
                  ]
            };

            const data = (await this.client.exeQuery(queryData)) as Array<IUserFirstLogin | IErrorResponse>;
            return data[0];
      }

      async getAll(): Promise<Array<IUserFirstLogin> | IErrorResponse> {
            const queryData = {
                  name: "user-first-login-all",
                  text: `SELECT
                              ufl.id,
                              ufl.idusuario,
                              ufl.first_login_at,
                              ufl.first_login_ip,
                              ufl.first_login_user_agent,
                              ufl.source,
                              ufl.metadata,
                              ufl.created_at,
                              usu.username,
                              usu.nombre_completo,
                              usu.email,
                              usu.department,
                              usu.estado
                        FROM ${Constants.tbl_usuario_first_login_sql} ufl
                        INNER JOIN ${Constants.tbl_usuario_sql} usu ON usu.id = ufl.idusuario
                        ORDER BY ufl.first_login_at DESC`,
                  values: []
            };

            return (await this.client.exeQuery(queryData)) as Array<IUserFirstLogin> | IErrorResponse;
      }

      async getByDate(date: string): Promise<Array<IUserFirstLogin> | IErrorResponse> {
            const queryData = {
                  name: "user-first-login-by-date",
                  text: `SELECT
                              ufl.id,
                              ufl.idusuario,
                              ufl.first_login_at,
                              ufl.first_login_ip,
                              ufl.first_login_user_agent,
                              ufl.source,
                              ufl.metadata,
                              ufl.created_at,
                              usu.username,
                              usu.nombre_completo,
                              usu.email,
                              usu.department,
                              usu.estado
                        FROM ${Constants.tbl_usuario_first_login_sql} ufl
                        INNER JOIN ${Constants.tbl_usuario_sql} usu ON usu.id = ufl.idusuario
                        WHERE DATE(ufl.first_login_at) = $1::date
                        ORDER BY ufl.first_login_at ASC`,
                  values: [date]
            };

            return (await this.client.exeQuery(queryData)) as Array<IUserFirstLogin> | IErrorResponse;
      }
}

export default UserFirstLoginDataAccess;
