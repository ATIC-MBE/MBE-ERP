import { getRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'
import { IAvanceLead } from "../models/IAvanceLead";

class AvanceLeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<IAvanceLead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<IAvanceLead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    
}

const AvanceLeadServiceInstance = new AvanceLeadService()
Object.freeze(AvanceLeadServiceInstance)

export default AvanceLeadServiceInstance