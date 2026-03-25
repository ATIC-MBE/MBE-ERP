import React, { useEffect, useState, useCallback, useRef } from "react";
import { JSONObject, user, profile, rolenum } from "../types/globalTypes";
import UserContext from "./UserContext";
import UserService from '@/client/services/UserService'
import { NextRouter, useRouter } from "next/router";
import { PATH } from "../helpers/Path";
import { useLocalState } from "../helpers/Util";
import FetchApiServiceInstance from "../services/FetchApiService";
import { IData } from "../models/IData";
import axios from "axios";
import FilterInstance from "../helpers/Filter";

const parseEnvNumber = (value: string | undefined, fallback: number) => {
    const parsed = Number.parseInt(value ?? '', 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

const CURFEW_HOUR = parseEnvNumber(process.env.NEXT_PUBLIC_SESSION_FORCE_LOGOUT_HOUR, 20)
const CURFEW_MINUTE = parseEnvNumber(process.env.NEXT_PUBLIC_SESSION_FORCE_LOGOUT_MINUTE, 0)
const CURFEW_MESSAGE = process.env.NEXT_PUBLIC_SESSION_FORCE_LOGOUT_MESSAGE ??
    'Tu sesión se ha cerrado automáticamente a las 20:00.'

const SESSION_EXPIRY_STORAGE_KEY = 'session_force_logout_at'
const SESSION_MESSAGE_STORAGE_KEY = 'session_force_logout_message'
const SESSION_TOKEN_STORAGE_KEY = 'session_token'

if (typeof window !== 'undefined') {
    const existingToken = window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
    if (existingToken) {
        axios.defaults.headers.common['token'] = existingToken
    }
}

const INITIAL_PROFILE_STATE: profile = {
        id: 0,
        nombre: '',
        apellido: '',
        email: '',
        estado: 0,
        roles: []
    }

const UserState = (props: JSONObject) => {

    const { children } = props
    const router = useRouter()
    const userService = new UserService()

    const [userDataGetter, setUserDataRaw] = useLocalState<profile>(INITIAL_PROFILE_STATE, 'user_data')
    const userData = userDataGetter

    // Para contar el numero de solicitudes pendientes solo para rmg
    const [solPendientesRMG, setSolPendientesRMG] = useState(0)
    const updateSolPendientesRMG = useCallback(() => {
        let statusHttpUS = 200
        FetchApiServiceInstance.getSingleDataWithFilter(`/api/share/data/totaldata/`, { tipo: 'total_solicitides_pl_pendientes' }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then(data => {
            if (statusHttpUS === 200 && data) {
                const _data = data as unknown as IData
                setSolPendientesRMG(_data.total_data)
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => { })
    }, [])

    const initialRolState = ''
    const localRolKey = 'current_rol'

    const [getCurrentRol, changeCurrentRol] = useLocalState<rolenum>(initialRolState, localRolKey)

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const logoutTimerRef = useRef<number | null>(null)
    const isLoggingOutRef = useRef(false)

    const persistExpiry = useCallback((timestamp: number | null) => {
        if (typeof window === 'undefined') return
        if (timestamp && Number.isFinite(timestamp)) {
            localStorage.setItem(SESSION_EXPIRY_STORAGE_KEY, timestamp.toString())
        } else {
            localStorage.removeItem(SESSION_EXPIRY_STORAGE_KEY)
        }
    }, [])

    const clearLogoutTimer = useCallback(() => {
        if (typeof window === 'undefined') return
        if (logoutTimerRef.current !== null) {
            window.clearTimeout(logoutTimerRef.current)
            logoutTimerRef.current = null
        }
    }, [])

    const computeNextCurfewTimestamp = useCallback(() => {
        const now = new Date()
        const target = new Date(now)
        target.setHours(CURFEW_HOUR, CURFEW_MINUTE, 0, 0)
        if (target.getTime() <= now.getTime()) {
            target.setDate(target.getDate() + 1)
        }
        return target.getTime()
    }, [])

    const performLogout = useCallback(async (options?: { origin?: 'manual' | 'curfew'; message?: string }) => {
        if (typeof window === 'undefined') return
        if (isLoggingOutRef.current) return

        isLoggingOutRef.current = true

        const origin = options?.origin ?? 'manual'
        const message = options?.message ?? (origin === 'curfew' ? CURFEW_MESSAGE : undefined)

        try {
            clearLogoutTimer()
            persistExpiry(null)

            const shouldCallApiLogout = (() => {
                if (typeof window === 'undefined') return false
                const storedToken = window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
                const cookieString = document?.cookie ?? ''
                const hasSessionCookie = cookieString.split(';').some((raw) => raw.trim().startsWith('session_token='))
                return Boolean(storedToken || hasSessionCookie)
            })()

            if (shouldCallApiLogout) {
                try {
                    await axios.get('/api/auth/logout')
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        console.info('[UserState] Sesión ya cerrada en el servidor')
                    } else {
                        console.error('[UserState] Error al cerrar sesión en la API', error)
                    }
                }
            }

            delete axios.defaults.headers.common['token']
            localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY)
            FilterInstance.resetLogout()
            sessionStorage.removeItem(SESSION_MESSAGE_STORAGE_KEY)
            if (message) {
                sessionStorage.setItem(SESSION_MESSAGE_STORAGE_KEY, message)
            }

            setUserDataRaw(INITIAL_PROFILE_STATE)
            changeCurrentRol(initialRolState)
            localStorage.removeItem('idlogin')
            setIsMobileMenuOpen(false)

            if (router.asPath !== '/login') {
                await router.push('/login')
            }
        } finally {
            isLoggingOutRef.current = false
        }
    }, [changeCurrentRol, clearLogoutTimer, persistExpiry, router, setIsMobileMenuOpen, setUserDataRaw])

    const scheduleLogout = useCallback((timestamp: number) => {
        if (typeof window === 'undefined') return
        clearLogoutTimer()
        const msUntil = timestamp - Date.now()
        if (msUntil <= 0) {
            performLogout({ origin: 'curfew' })
            return
        }
        logoutTimerRef.current = window.setTimeout(() => {
            performLogout({ origin: 'curfew' })
        }, msUntil)
    }, [clearLogoutTimer, performLogout])

    const isProfile = (candidate: unknown): candidate is profile => {
        if (!candidate || typeof candidate !== 'object') return false
        const data = candidate as profile
        return typeof data.id === 'number' && data.id > 0
    }

    const setUserData = useCallback(async (value: profile | '' | null | undefined) => {
        if (typeof window === 'undefined') return

        if (!isProfile(value)) {
            setUserDataRaw(INITIAL_PROFILE_STATE)
            sessionStorage.removeItem(SESSION_MESSAGE_STORAGE_KEY)
            persistExpiry(null)
            clearLogoutTimer()
            localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY)
            delete axios.defaults.headers.common['token']
            return
        }

        setUserDataRaw(value)
        sessionStorage.removeItem(SESSION_MESSAGE_STORAGE_KEY)
        clearLogoutTimer()
        const expiryTimestamp = computeNextCurfewTimestamp()
        persistExpiry(expiryTimestamp)
        scheduleLogout(expiryTimestamp)
    }, [clearLogoutTimer, computeNextCurfewTimestamp, persistExpiry, scheduleLogout, setUserDataRaw])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const storedProfileRaw = localStorage.getItem('user_data')
        if (!storedProfileRaw) {
            persistExpiry(null)
            clearLogoutTimer()
            return
        }

        try {
            const storedProfile = JSON.parse(storedProfileRaw) as profile
            if (!isProfile(storedProfile)) {
                persistExpiry(null)
                clearLogoutTimer()
                return
            }
        } catch (error) {
            console.error('[UserState] Error al parsear el perfil almacenado', error)
            persistExpiry(null)
            clearLogoutTimer()
            return
        }

        const storedExpiryRaw = localStorage.getItem(SESSION_EXPIRY_STORAGE_KEY)
        if (!storedExpiryRaw) {
            const expiryTimestamp = computeNextCurfewTimestamp()
            persistExpiry(expiryTimestamp)
            scheduleLogout(expiryTimestamp)
            return
        }

        const storedExpiry = Number.parseInt(storedExpiryRaw, 10)
        if (Number.isNaN(storedExpiry)) {
            persistExpiry(null)
            clearLogoutTimer()
            return
        }

        scheduleLogout(storedExpiry)
    }, [clearLogoutTimer, computeNextCurfewTimestamp, persistExpiry, scheduleLogout])

    useEffect(() => {
        return () => {
            clearLogoutTimer()
        }
    }, [clearLogoutTimer])

    const isRoleAllowed = (router: NextRouter, callback: () => void) => {
        const basePath = '/' + router.pathname.split('/')[1]
        if (!PATH[basePath]) return callback()

        const localValue = typeof window !== 'undefined' ? localStorage.getItem(localRolKey) : undefined

        if (PATH[basePath].isAllowed(getCurrentRol() != initialRolState ? getCurrentRol() : localValue && localValue !== 'undefined' ? JSON.parse(localValue as string) : getCurrentRol())) return callback()

        return router.push('/error/unauthorized')

    }

    const useAllowedEffect = (router: NextRouter, callback: () => void) => {
        useEffect(() => {
            (async () => {
                const response = await userService.getProfile((error) => {
                    console.error(error)
                    router.push('/login')

                })
                if (response) {
                    // Store the profile data in userData state
                    setUserData(response)
                    isRoleAllowed(router, callback)
                }

            }
            )()

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    }
    const updatePinsLocally = (amount: number) => {
        // Asumiendo que tu estado de usuario se maneja con 'setLoginData' o similar.
        // Adaptaremos el objeto del usuario que está en memoria.
        const currentUser = userData(); // Tu función existente que devuelve el usuario
        if (currentUser) {
            currentUser.pins = (currentUser.pins || 0) + amount;
            // Forzamos un re-render actualizando el estado de React que contiene al usuario
            // (Si usas setUserState, setState, setLoginData, etc., ponlo aquí si no se actualiza la UI sola)
        }
    };

    return (
        <UserContext.Provider value={{
            updatePinsLocally,
            solPendientesRMG,
            updateSolPendientesRMG,
            userData,
            setUserData,
            logout: performLogout,
            getCurrentRol,
            changeCurrentRol,
            isRoleAllowed,
            useAllowedEffect,
            isMobileMenuOpen,
            setIsMobileMenuOpen
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState