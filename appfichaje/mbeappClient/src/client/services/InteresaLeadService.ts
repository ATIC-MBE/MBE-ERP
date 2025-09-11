import { getRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'
import { IInteresaLead } from "../models/IInteresaLead"

class InteresaLeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<IInteresaLead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<IInteresaLead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    
}

const InteresaLeadServiceInstance = new InteresaLeadService()
Object.freeze(InteresaLeadServiceInstance)

export default InteresaLeadServiceInstance