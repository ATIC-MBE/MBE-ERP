import { getRequestQuery } from "../helpers/Util"
import { JSONObject, RequestErrorHandler } from '../types/globalTypes'
import { IData } from "../models/IData";

class DataService {
    async getTotalData(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<IData | undefined> {
        try {
                let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                if (!_result) return undefined
                return _result.data.data as IData
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async moverLeads(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<IData | undefined> {
        try {
                let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                if (!_result) return undefined
                return _result.data.data as IData
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }
}

const DataServiceInstance = new DataService()
Object.freeze(DataServiceInstance)

export default DataServiceInstance