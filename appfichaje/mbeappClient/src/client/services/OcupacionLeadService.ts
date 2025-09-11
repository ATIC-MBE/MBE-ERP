import { getRequest } from "../helpers/Util"
import { IOcupacionLead } from "../models/IOcupacionLead"
import { RequestErrorHandler } from '../types/globalTypes'

class OcupacionLeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<IOcupacionLead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<IOcupacionLead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    
}

const OcupacionLeadServiceInstance = new OcupacionLeadService()
Object.freeze(OcupacionLeadServiceInstance)

export default OcupacionLeadServiceInstance