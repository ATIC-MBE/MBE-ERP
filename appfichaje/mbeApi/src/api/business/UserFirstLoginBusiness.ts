import UserFirstLoginDataAccess from "../data/UserFirstLoginDataAccess";
import { IErrorResponse } from "../modelsextra/IErrorResponse";
import { IUserFirstLogin } from "../modelsextra/IUserFirstLogin";

class UserFirstLoginBusiness {
      public dataAccess: UserFirstLoginDataAccess;

      constructor() {
            this.dataAccess = new UserFirstLoginDataAccess();
      }

      private resolveDate(date?: string): string {
            const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
            if (date && isoPattern.test(date)) {
                  const parsed = new Date(`${date}T00:00:00Z`);
                  if (!Number.isNaN(parsed.getTime())) {
                        return date;
                  }
            }

            return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
      }

      async ensureFirstLogin(record: IUserFirstLogin): Promise<{ created: boolean; data?: IUserFirstLogin | IErrorResponse }> {
            if (!record.idusuario) {
                  return { created: false, data: { error: "Invalid user id", data: [] } as IErrorResponse };
            }

            const existing = await this.dataAccess.getByUserId(record.idusuario);
            if (existing) {
                  if ((existing as IErrorResponse).error) {
                        return { created: false, data: existing as IErrorResponse };
                  }
                  return { created: false, data: existing as IUserFirstLogin };
            }

            const inserted = await this.dataAccess.insert(record);
            if (inserted) {
                  if ((inserted as IErrorResponse).error) {
                        return { created: false, data: inserted as IErrorResponse };
                  }
                  return { created: true, data: inserted as IUserFirstLogin };
            }

            // Si otro proceso insertó el registro en paralelo, lo obtenemos nuevamente
            const fallback = await this.dataAccess.getByUserId(record.idusuario);
            return { created: false, data: fallback };
      }

      async getAll(): Promise<Array<IUserFirstLogin> | IErrorResponse> {
            return this.dataAccess.getAll();
      }

      async getByDate(date?: string): Promise<Array<IUserFirstLogin> | IErrorResponse> {
            const targetDate = this.resolveDate(date);
            return this.dataAccess.getByDate(targetDate);
      }
}

export default UserFirstLoginBusiness;
