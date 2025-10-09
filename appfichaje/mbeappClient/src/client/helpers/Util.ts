import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { NextRouter } from "next/router";
import { Context, useEffect, useState } from "react";
import { JSONObject, RequestCallback, RequestErrorHandler, rolenum } from '../types/globalTypes'
import { PATH } from "./Path";
import { useRouter } from 'next/router'

// Configurar axios para incluir cookies en todas las peticiones
axios.defaults.withCredentials = true;

const SESSION_TOKEN_STORAGE_KEY = 'session_token'

const buildAuthConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
    const authHeaders: Record<string, string> = {}

    if (typeof window !== 'undefined') {
        try {
            const storedToken = window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
            if (storedToken) {
                authHeaders.token = storedToken
            }
        } catch (error) {
            console.warn('[Util.buildAuthConfig] No se pudo leer localStorage', error)
        }
    }

    const defaultToken = axios.defaults.headers.common['token'] as string | undefined
    if (!authHeaders.token && defaultToken) {
        authHeaders.token = defaultToken
    }

    if (!authHeaders.token) {
        return config ?? {}
    }

    return {
        ...config,
        headers: {
            ...(config?.headers || {}),
            ...authHeaders
        }
    }
}

export const classNames = (...classes: Array<string>) => classes.filter(Boolean).join(' ')

export const getRequest = async (path: string, errorHandler?: RequestErrorHandler) => {
    try {
    const response: AxiosResponse<any, any> = await axios.get(path, buildAuthConfig());

        // Do something with the response

        return response

    } catch (error) {
        if (axios.isAxiosError(error)) {
            error as AxiosError

            console.log(error)
            // Do something with this error...
            if (errorHandler) errorHandler(error)

        } else {
            // Not axios error
            console.error(error);
        }
    }
}

export const getRequestQuery = async (path: string, dataFilter: JSONObject, errorHandler?: RequestErrorHandler) => {
    try {
    const response: AxiosResponse<any, any> = await axios.get(path, buildAuthConfig({ params: dataFilter }));
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            error as AxiosError

            console.log(error)
            // Do something with this error...
            if (errorHandler) errorHandler(error)

        } else {
            // Not axios error
            console.error(error);
        }
    }
}

export const postRequest = async (path: string, data: any, config?: AxiosRequestConfig, errorHandler?: RequestErrorHandler) => {
    try {
        // const _config = {
        //     ...config,
        //     url: `${path}`,
        //     method: 'POST',
        //     headers: {
        //         'Access-Control-Allow-Credentials': true,
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Methods': 'GET,OPTIONS,DELETE,PATCH,POST,PUT',
        //         'Access-Control-Allow-Headers': 'Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        //         'Content-Type': 'application/json'
        //     },
        //     data: JSON.stringify(data),
        // };
        // const response = await axios(_config)
    const response: AxiosResponse<any, any> = await axios.post(path, data, buildAuthConfig(config));

        // Do something with the response

        return response

    } catch (error) {
        if (axios.isAxiosError(error)) {
            error as AxiosError

            // Do something with this error...
            if (errorHandler) errorHandler(error)

        } else {
            // Not axios error
            console.error(error);
        }
    }
}

export const patchRequest = async (path: string, data: any, config?: AxiosRequestConfig, errorHandler?: RequestErrorHandler) => {
    try {
        const response: AxiosResponse<any, any> = await axios.patch(path, data, buildAuthConfig(config))

        // Do something with the response

        return response

    } catch (error) {
        if (axios.isAxiosError(error)) {
            error as AxiosError

            // Do something with this error...
            if (errorHandler) errorHandler(error)

        } else {
            // Not axios error
            console.error(error);
        }
    }
}

export const deleteRequest = async (path: string, config?: AxiosRequestConfig, errorHandler?: RequestErrorHandler) => {
    try {
        const response: AxiosResponse<any, any> = await axios.delete(path, buildAuthConfig(config))
        // Do something with the response
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            error as AxiosError
            // Do something with this error...
            if (errorHandler) errorHandler(error)
        } else {
            // Not axios error
            console.error(error);
        }
    }
}

export function useLocalState<T>(initial: T, localStorageKey: string): [() => T, (value: T) => void] {

    let localInitial : T = initial

    if(typeof window != 'undefined'){
        localInitial = JSON.parse(localStorage.getItem(localStorageKey) as string) as T
    }

    const [state, setState] = useState<T>(localInitial ? localInitial : initial )

    const getCurrentState: () => T = () => {

        if (state && JSON.stringify(state) !== JSON.stringify(initial)) {
            return state
        }

        if (typeof window !== 'undefined') {
            const localState = localStorage.getItem(localStorageKey)
            if (localState) {
                try {
                    const localCurrentState = JSON.parse(localState) as T
                    if (localCurrentState !== undefined && localCurrentState !== null) {
                        return localCurrentState
                    }
                } catch (error) {
                    return state
                }
            }
        }

        return state
    }

    const changeCurrentState = (value: T) => {

        setState(value)
        localStorage.setItem(localStorageKey, JSON.stringify(value))

    }

    return [getCurrentState, changeCurrentState]

}

export const detailsNormalAlert = (title: string) => {
    return `<span className="font-medium"><b>${title}</b></span>`
}

export const detailsListAlert = (title: string, data: Array<string>) => {
    let _fields = data.map(el => (`<li>${el || ''}</li>`).trim()).join('').trim()
    return `<span className="font-medium"><b>${title}</b></span>
            <ul className="mt-1.5 ml-4 list-disc list-inside">${_fields}</ul>`
}

export const handleCancel = async (path: string, router: any) => {
    router.push(path)
}