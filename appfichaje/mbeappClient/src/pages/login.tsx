import React, { useState, useContext } from 'react'
import UserContext from '@/client/context/UserContext'
import { useRouter } from "next/router"
import UserService from '@/client/services/UserService'
import type { JSONObject } from '@/client/types/globalTypes'

const buildLoginMetadata = (): JSONObject => {
    if (typeof window === 'undefined') {
        return { source: 'mbeappClient-web' }
    }

    const nav = window.navigator
    const scr = window.screen
    const intlOptions = Intl.DateTimeFormat().resolvedOptions()
    const metadata: JSONObject = {
        source: 'mbeappClient-web',
        userAgent: nav?.userAgent || '',
        language: nav?.language || '',
        platform: nav?.platform || '',
        timezone: intlOptions?.timeZone || '',
        location: window.location?.href || '',
        referrer: document?.referrer || '',
    }

    if (typeof nav?.hardwareConcurrency === 'number') {
        metadata.hardwareConcurrency = nav.hardwareConcurrency
    }

    const deviceMemory = (nav as any)?.deviceMemory
    if (typeof deviceMemory === 'number') {
        metadata.deviceMemory = deviceMemory
    }

    if (scr) {
        metadata.screen = {
            width: scr.width,
            height: scr.height,
            availWidth: scr.availWidth,
            availHeight: scr.availHeight,
            orientation: (scr as any)?.orientation?.type || undefined
        }
    }

    if (window.history) {
        metadata.historyLength = window.history.length
    }

    const connection = (nav as any)?.connection || (nav as any)?.mozConnection || (nav as any)?.webkitConnection
    if (connection) {
        metadata.connection = {
            downlink: connection.downlink,
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            saveData: connection.saveData
        }
    }

    return metadata
}

const Login = () => {

    let userService = new UserService()

    const { setUserData, changeCurrentRol } = useContext(UserContext)
    const router = useRouter()

    const [isError, setIsError] = useState(false)
    const [credentials, setCredentials] = useState({ user: '', password: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const metadata = buildLoginMetadata()
        console.groupCollapsed('[Login] handleSubmit')
        console.info('Usuario intentando login:', credentials.user)
        console.debug('Metadata construida:', metadata)
        const Response = await userService.authUser(
            credentials,
            () => {
                console.warn('[Login] Credenciales inválidas o error de autenticación')
                setIsError(true)
            },
            metadata
        )
        if (!Response) {
            console.warn('[Login] Sin respuesta válida de la API de login')
            console.groupEnd()
            return
        }

        const _rolMain = Response?.roles.find(el => el.ismain === true)

        console.info('[Login] Respuesta recibida para usuario', {
            id: Response?.id,
            nombre: Response?.nombre,
            email: Response?.email,
            roles: Response?.roles?.map(r => ({ id: r.id, ismain: r.ismain }))
        })

        if (Response && _rolMain) {
            await setUserData(Response)
            await changeCurrentRol(_rolMain?.id)

            router.push('/' + _rolMain?.id)
            localStorage.setItem('idlogin', Response.id.toString())
            console.info('[Login] Navegando al dashboard del rol:', _rolMain?.id)
        }
        console.groupEnd()
    }

    return (
        <div className="min-h-screen w-full overflow-y-auto bg-no-repeat bg-cover c-bg-main-100">
            <div className="container mx-auto min-h-screen flex items-center justify-center py-6">
                <div className="c-login-form c-rounded-large c-shadow-large">
                    <div className="card-body flex flex-col items-center text-primary">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                                <img
                                        src="/img/ico/LogoWhite.svg"
                                        className='c-logo-login'
                                        style={{width: 150}}
                                        alt="Logo"
                                />
                                <div className="login-claim mb-6">
                                    <span>Formamos emprendedores,</span>
                                    <span>Creamos realidades</span>
                                </div>
                            <div className="w-full mb-4 px-4">
                                <input
                                    type="text"
                                    name="user"
                                    className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full"
                                    id="user"
                                    placeholder="Usuario:"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-full mb-4 px-4">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control c-rounded-large c-form-input font-weight-bold p-4 w-full"
                                    id="password"
                                    placeholder="Contraseña:"
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="login-arrow-btn mt-4 transform hover:scale-110 transition-transform duration-200">
                                <img
                                    className='c-btnLogin'
                                    src="/img/ico/icoArrow.svg"
                                    style={{width: 120, height: 120}}
                                    alt="Login"
                                />
                            </button>
                            {isError && (
                                <p className="text-red-500 mt-4 text-center">
                                    Usuario o contraseña incorrectos
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
