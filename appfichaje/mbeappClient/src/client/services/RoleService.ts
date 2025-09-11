import { SA_ROLES_PATH } from "../helpers/constants";
import { getRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'
import { IRole } from "../models/IRole";

class RoleService {
      async getAll(): Promise<Array<IRole> | undefined> {
            try {
                  let _result = await getRequest(`${SA_ROLES_PATH}`)
                  if ( !_result ) return undefined
                  return _result.data.data as Array<IRole>
            } catch(err) {
                  console.log('Error al retornar datos DB!')
            }
            return undefined
      }
}

const RoleServiceInstance = new RoleService()
Object.freeze(RoleServiceInstance)

export default RoleServiceInstance