import { deleteRequest, getRequest, getRequestQuery, patchRequest, postRequest } from "../helpers/Util"
import { JSONObject, RequestErrorHandler } from '../types/globalTypes'
import { ILead } from "../models/ILead";

class LeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<ILead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<ILead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async getAllWithFilter(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<Array<ILead> | undefined> {
        try {
                let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<ILead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async getById(path: string, id: BigInt, handleError?: RequestErrorHandler): Promise<ILead | undefined> {
        try {
                let _result = await getRequest(`${path}${id}`, handleError)
                if (!_result) return undefined
                return _result.data.data as ILead
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async update(path: string, data: ILead, handleError?: RequestErrorHandler): Promise<ILead | undefined> {
        try {
                let _result = await patchRequest(`${path}${data.id!}`, data, null, handleError)
                if (!_result) return undefined
                return _result.data.data as ILead
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async create(path: string, data: ILead, handleError?: RequestErrorHandler): Promise<ILead | undefined> {
        try {
                data.id = 0
                let _result = await postRequest(`${path}`, data, null, handleError)
                if (!_result) return undefined
                return _result.data.data as ILead
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    // async delete(path: string, id: BigInt, handleError?: RequestErrorHandler): Promise<IPiso | undefined> {
    //     try {
    //             let _result = await deleteRequest(`${path}${id}`, null, handleError)
    //             if (!_result) return undefined
    //             return _result.data.data as IPiso
    //     } catch (err) {
    //             console.log('Error al retornar datos DB!')
    //     }
    //     return undefined
    // }
}

const LeadServiceInstance = new LeadService()
Object.freeze(LeadServiceInstance)

export default LeadServiceInstance