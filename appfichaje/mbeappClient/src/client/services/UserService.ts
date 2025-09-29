import { JSONObject, profile, RequestErrorHandler, user, UserSignup, USERS_PATH } from "../types/globalTypes";
import { getRequest, getRequestQuery, patchRequest, postRequest } from "../helpers/Util"
import { ADMIN_USERS_PATH, AUTH_LOGIN_PATH, SHARE_PROFILE_PATH } from "../helpers/constants";

export default class UserService {

    constructor() {
    }

    /*--------------- General ---------------*/

    // Get token by login in
    async authUser(
        credentials: { user: string, password: string },
        handleError: RequestErrorHandler,
        metadata?: JSONObject
    ): Promise<profile> {
        console.groupCollapsed('[UserService.authUser] Sending login request')
        console.info('Endpoint:', AUTH_LOGIN_PATH)
        console.info('User:', credentials.user)
        console.debug('Metadata payload:', metadata)

        const response = await postRequest(
            `${AUTH_LOGIN_PATH}`,
            metadata ? { ...credentials, metadata } : { ...credentials },
            {},
            (error) => {
                console.error('[UserService.authUser] Request failed', error)
                handleError(error)
            }
        )

        if (!response) {
            console.warn('[UserService.authUser] No response received')
            console.groupEnd()
            return undefined as unknown as profile
        }

        console.info('[UserService.authUser] Response status:', response.status)
        console.debug('[UserService.authUser] Response.data:', response.data)
        console.groupEnd()

        return response.data?.data as profile
    }

    async resetPasswordUser (path: string, handleError?: RequestErrorHandler): Promise<boolean> {
        try {
                let _result = await getRequest(`${path}`, handleError)
                if ( !_result ) return false
                return true
        } catch(err) {
                console.log('Error al retornar datos DB!')
        }
        return false
    }

    // Get current user profile
    async getProfile(handleError: RequestErrorHandler): Promise<profile> {

        return (
            await getRequest(`${SHARE_PROFILE_PATH}`, handleError)
        )?.data.data as profile
    }

    /*--------------- MIX ---------------*/

    /*---------- ADMIN / RRHH -----------*/
    /*
    * For RRHH use "/api/rrhh/users"
    * For ADMIN use "/api/admin/users"
    */

    async getAll(path: string, handleError?: RequestErrorHandler): Promise<Array<user> | undefined> {
        try {
            //   let _result = await getRequest(`${DN_USERS_PATH}`)
            let _result = await getRequest(`${path}`, handleError)
            if (!_result) return undefined
            return _result.data.data as Array<user>
        } catch (err) {
            console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async getAllWithFilter(path: string, dataFilter: JSONObject, handleError?: RequestErrorHandler): Promise<Array<user> | undefined> {
        try {
                let _result = await getRequestQuery(`${path}`, dataFilter, handleError)
                if (!_result) return undefined
                return _result.data.data as Array<user>
        } catch (err) {
                console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    async getById(id: BigInt, path: string, handleError?: RequestErrorHandler): Promise<user | undefined> {
        try {
            let _result = await getRequest(`${path}${id}`)
            if ( !_result ) return undefined
            return _result.data.data as user
        } catch(err) {
            console.log('Error al retornar datos DB!')
        }
        return undefined
    }

    // Get every user in DB
    async getUsers(path: USERS_PATH): Promise<Array<user>> {

        return (
            await getRequest(`${path}`, (error) => { console.log(error) })
        )?.data.data as Array<user>
    }

    // Get an specific user by ID
    async getUser(path: USERS_PATH, userId: any): Promise<user> {
        console.log('userId', userId)
        return (
            await getRequest(`${path}/${userId}`, (error) => { console.log(error) })
        )?.data.data as user
    }

    // Signup a new user: path: USERS_PATH
    async addUser(path: string, user: UserSignup, handleError?: RequestErrorHandler): Promise<JSONObject> {
        return (
            await postRequest(`${path}`, user, null, handleError)
        )?.data as JSONObject
    }

    // Update an existing user: path: USERS_PATH
    async setUser(path: string, userId:any ,updatedUser: UserSignup, handleError?: RequestErrorHandler): Promise<JSONObject> {
        return (
            await patchRequest(`${path}/${userId}`, updatedUser, null, handleError)
        )?.data as JSONObject
    }
}