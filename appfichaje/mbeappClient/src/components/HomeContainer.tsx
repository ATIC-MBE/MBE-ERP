import { pdfVisibility } from '@/client/helpers/constants';
import UserContext from '@/client/context/UserContext'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { user,rolenum  } from "@/client/types/globalTypes"
import React, { useContext, useState, useEffect } from 'react'

import { useRouter } from "next/router"

import dynamic from "next/dynamic"
import AccesoDirectoContainer from './AccesoDirectoContainer'

const HomeContainer = ( { data, children }: { data?:user, children?: any } ) => {
    const { userData, changeCurrentRol, getCurrentRol } = useContext(UserContext)
    const [userLogin, setUserLogin] = useState<user>({
        id: 0,
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: 0,
        idrol: '' as rolenum,
        roles: [],
        multilogin: false
    })
    const [roleCurrent, setRoleCurrent] = useState<string>('')
    // Por ahora vamos a colocar aqui, pero deberia estar mejor organizado
    const [lastReport, setLastReport] = useState<any>()

    const router = useRouter()

    /**
     * Cambio de roles para los super admins
     * @param coderole 
     */
    const handlerChangeRoleDiego = async (coderole: string) => {
        await changeCurrentRol(coderole)
        setRoleCurrent( coderole )
        router.push(`/${coderole}`)
    }
    
    useEffect(() => {
        setUserLogin( userData() )
        setRoleCurrent( getCurrentRol() )
        let statusHttpUS = 200
        // Llamada al API REST
        FetchApiServiceInstance.getSingleData(`/api/share/reportdevices/lastreport/`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as unknown as Array<any>)
                setLastReport({ ..._data })
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            //setLoading(false)
        })
    }, [])

    useEffect(() => {
        console.log('user OK: ', userLogin)
    }, [userLogin])
    const canShowPdf = () => {
        // Ruta actual (sin query)
        const path = router.pathname;
        // Roles permitidos para esta ruta
        const allowed = pdfVisibility[path] || [];
        // Si no hay definición, interpretamos como “ninguna restricción”
        if (allowed.length === 0) return true;
        // Si alguno de los roles del usuario coincide
        return userLogin.roles.some((r: any) => allowed.includes(r.id as rolenum));
    };
    return (
        <div className="w-full min-h-[40vh] flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
            <div
                className="w-full max-w-7xl rounded-3xl shadow-2xl flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:px-16"
                style={{
                    background: 'rgba(0, 83, 96, 0.65)', // verde translúcido
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                }}
            >
                <header className="flex flex-col items-center gap-4 text-center">
                    <h1
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold flex flex-wrap items-center justify-center gap-1 px-4 sm:px-6 lg:px-10 py-4 rounded-2xl shadow-lg border-2 border-secondary bg-white/80 text-primary drop-shadow-lg"
                        style={{
                            background: 'linear-gradient(90deg, #ffffffcc 0%, #c9ac7e22 100%)',
                            boxShadow: '0 4px 24px 0 rgba(0,83,96,0.10), 0 1.5px 0 #c9ac7e',
                            border: '2.5px solid #c9ac7e',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Bienvenido
                        <b className="ml-2 text-primary drop-shadow">{userLogin.nombre_completo}</b>
                    </h1>
                    <span className="date-pill text-sm sm:text-base lg:text-lg font-semibold">
                        {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </header>
                <section className="flex flex-col gap-8">
                    <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-stretch justify-items-center">
                            {/* Cosas en comun con otros perfiles */}
                            {
                                Array.isArray(userLogin.roles) && userLogin.multilogin && userLogin.roles.length > 0 ? (
                                    <div
                                        key={`card-${2000}`}
                                        className="card-acceso-directo-xxx w-full max-w-[12rem] text-[1rem] rounded-xl border border-green-600 text-white"
                                    >
                                        <div className="w-full h-full min-h-[12rem] bg-green-50 rounded-xl shadow-sm grid">
                                            <div className="w-full h-full grid place-items-center px-4 py-5">
                                                <div className="flex flex-wrap items-center justify-center gap-2">
                                                    {
                                                        (userLogin.roles || []).sort((a, b) => a.id.localeCompare(b.id)).map((el, index) => {
                                                            const isActive = el.id.toLocaleLowerCase() === roleCurrent;
                                                            const classStr = isActive
                                                                ? '!bg-primary text-white font-semibold rounded-2xl px-3 py-1 shadow-sm'
                                                                : '!bg-transparent !text-primary border border-primary rounded-2xl px-3 py-1 hover:!bg-primary/10';
                                                            return (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handlerChangeRoleDiego(el.id)}
                                                                    className={`text-xs sm:text-sm style-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${classStr}`}
                                                                    key={`roles-${index}`}
                                                                >
                                                                    {el.id}
                                                                </button>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                            {/* Reporte dispositivos removido por requerimiento */}
                            {/* <AccesoDirectoContainer coderol={`${(userLogin.roles ? userLogin.roles[0] : {}).id}`}  /> */}
                            <div className="col-span-full w-full max-w-5xl mx-auto">
                                <AccesoDirectoContainer coderol={`${roleCurrent || 'na'}`} />
                            </div>
                        </div>
                </section>
            </div>
        </div>
    )
}

export default HomeContainer