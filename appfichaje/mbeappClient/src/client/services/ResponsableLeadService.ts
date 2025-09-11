import { deleteRequest, getRequest, patchRequest, postRequest } from "../helpers/Util"
import { RequestErrorHandler } from '../types/globalTypes'
import { IResponsableLead } from "../models/IResponsableLead";

class ResponsableLeadService {
    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<IResponsableLead> | undefined> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<IResponsableLead>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async getById(path: string, id: BigInt, handleError?: RequestErrorHandler): Promise<IResponsableLead | undefined> {
        try {
                let _result = await getRequest(`${path}${id}`)
                if (!_result) return undefined
                return _result.data.data as IResponsableLead
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async update(path: string, data: IResponsableLead, handleError?: RequestErrorHandler): Promise<IResponsableLead | undefined> {
        try {
                let _result = await patchRequest(`${path}${data.id!}`, data, null, handleError)
                if (!_result) return undefined
                return _result.data.data as IResponsableLead
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async create(path: string, data: IResponsableLead, handleError?: RequestErrorHandler): Promise<IResponsableLead | undefined> {
        try {
                data.id = 0
                let _result = await postRequest(`${path}`, data, null, handleError)
                if (!_result) return undefined
                return _result.data.data as IResponsableLead
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

const ResponsableLeadServiceInstance = new ResponsableLeadService()
Object.freeze(ResponsableLeadServiceInstance)

export default ResponsableLeadServiceInstance