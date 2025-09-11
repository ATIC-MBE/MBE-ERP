import axios, { AxiosError, AxiosResponse } from "axios";
import { NextRouter } from "next/router";
import { Context, useEffect, useState } from "react";
import { JSONObject, RequestCallback, RequestErrorHandler, rolenum } from '../types/globalTypes'
import { PATH } from "./Path";
import { useRouter } from 'next/router'

export const classNames = (...classes: Array<string>) => classes.filter(Boolean).join(' ')

export const getRequest = async (path: string, errorHandler?: RequestErrorHandler) => {
    try {
        const response: AxiosResponse<any, any> = await axios.get(path);

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
        const response: AxiosResponse<any, any> = await axios.get(path, { params: dataFilter });
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

export const postRequest = async (path: string, data: any, config?: any, errorHandler?: RequestErrorHandler) => {
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
        const response: AxiosResponse<any, any> = await axios.post(path, data, config);

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

export const patchRequest = async (path: string, data: any, config?: any, errorHandler?: RequestErrorHandler) => {
    try {
        const response: AxiosResponse<any, any> = await axios.patch(path, data, config)

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

export const deleteRequest = async (path: string, config?: any, errorHandler?: RequestErrorHandler) => {
    try {
        const response: AxiosResponse<any, any> = await axios.delete(path)
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

        if (state && JSON.stringify(state) != JSON.stringify(initial)) return state

        if (typeof window != 'undefined') {

            let localState = localStorage.getItem(localStorageKey)

            if (localState)
                try {

                    const localCurrentState = JSON.parse(localState as string) as T

                    if (localCurrentState) {

                        setState((cState) => {
                            return localCurrentState
                        })

                        return state
                    }

                } catch (error) {
                    return state
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