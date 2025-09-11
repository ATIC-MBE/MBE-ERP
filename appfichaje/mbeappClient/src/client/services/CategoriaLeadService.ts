import { getRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'
import { ICategoriaLead } from "../models/ICategoriaLead"

class CategoriaLeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<ICategoriaLead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<ICategoriaLead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    
}

const CategoriaLeadServiceInstance = new CategoriaLeadService()
Object.freeze(CategoriaLeadServiceInstance)

export default CategoriaLeadServiceInstance