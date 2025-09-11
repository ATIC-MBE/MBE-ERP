import { deleteRequest, getRequest, getRequestQuery, patchRequest, postRequest } from "../helpers/Util"
import { JSONObject, RequestErrorHandler } from '../types/globalTypes'
import { IModel } from "../helpers/IModel";

class FetchApiService {
        async getAllData(path: string, handleError?: RequestErrorHandler): Promise<Array<IModel> | undefined> {
                try {
                        let _result = await getRequest(`${path}`, handleError)
                        if (!_result) return undefined
                        return _result.data.data as Array<IModel>
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async getAllWithFilter(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<Array<IModel> | undefined> {
                try {
                        let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                        if (!_result) return undefined
                        return _result.data.data as Array<IModel>
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async getSingleData(path: string, handleError?: RequestErrorHandler): Promise<IModel | undefined> {
                try {
                        let _result = await getRequest(`${path}`, handleError)
                        if (!_result) return undefined
                        return _result.data.data as IModel
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async getSingleDataWithFilter(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<IModel | undefined> {
                try {
                        let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                        if (!_result) return undefined
                        return _result.data.data as IModel
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async create(path: string, data: IModel, handleError?: RequestErrorHandler): Promise<IModel | undefined> {
                try {
                        let _result = await postRequest(`${path}`, data, null, handleError)
                        if (!_result) return undefined
                        return _result.data.data as IModel
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async update(path: string, data: IModel, handleError?: RequestErrorHandler): Promise<IModel | undefined> {
                try {
                        let _result = await patchRequest(`${path}`, data, null, handleError)
                        if (!_result) return undefined
                        return _result.data.data as IModel
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }

        async delete(path: string, handleError?: RequestErrorHandler): Promise<IModel | undefined> {
                try {
                        let _result = await deleteRequest(`${path}`, null, handleError)
                        if (!_result) return undefined
                        return _result.data.data as IModel
                } catch (err) {
                        console.log('Error al retornar datos DB!')
                }
                return undefined
        }
}

const FetchApiServiceInstance = new FetchApiService()
Object.freeze(FetchApiServiceInstance)

export default FetchApiServiceInstance