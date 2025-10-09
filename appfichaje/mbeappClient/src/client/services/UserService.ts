import axios from "axios"
import { JSONObject, profile, RequestErrorHandler, user, UserSignup, USERS_PATH } from "../types/globalTypes";
import { getRequest, getRequestQuery, patchRequest, postRequest } from "../helpers/Util"
import { ADMIN_USERS_PATH, AUTH_LOGIN_PATH, SHARE_PROFILE_PATH } from "../helpers/constants";

export default class UserService {

    constructor() {
    }

    private readonly TOKEN_STORAGE_KEY = 'session_token'

    private persistAuthToken(token?: string) {
        if (!token) return
        axios.defaults.headers.common['token'] = token
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_STORAGE_KEY, token)
        }
    }

    private normalizeProfile(payload: any): profile {
        if (!payload) {
            return {
                id: 0,
                nombre: '',
                apellido: '',
                email: '',
                estado: 0,
                roles: []
            }
        }

        const rawId = payload.id
        const numericId = typeof rawId === 'number'
            ? rawId
            : Number.parseInt(String(rawId ?? '0'), 10)

        const safeRoles = Array.isArray(payload.roles) ? payload.roles : []

        return {
            ...payload,
            id: Number.isFinite(numericId) ? numericId : 0,
            roles: safeRoles
        }
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

        const { token, data } = response.data ?? {}
        if (token) {
            this.persistAuthToken(token)
        }

        console.info('[UserService.authUser] Response status:', response.status)
        console.debug('[UserService.authUser] Response.data:', response.data)
        console.groupEnd()

        return this.normalizeProfile(data)
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

        const response = await getRequest(`${SHARE_PROFILE_PATH}`, handleError)
        if (!response) {
            return undefined as unknown as profile
        }

        return this.normalizeProfile(response.data?.data)
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
            await postRequest(`${path}`, user, undefined, handleError)
        )?.data as JSONObject
    }

    // Update an existing user: path: USERS_PATH
    async setUser(path: string, userId:any ,updatedUser: UserSignup, handleError?: RequestErrorHandler): Promise<JSONObject> {
        return (
            await patchRequest(`${path}/${userId}`, updatedUser, undefined, handleError)
        )?.data as JSONObject
    }
}