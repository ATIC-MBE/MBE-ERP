import { Layout } from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import UserContext from '@/client/context/UserContext'
import { useContext } from 'react'
import { JSONObject, profile } from '@/client/types/globalTypes'
import { useRouter } from 'next/router'

const RolSelector = () => {

    const router = useRouter()

    let { userData, setUserData, changeCurrentRol, getCurrentRol } = useContext(UserContext)

    useEffect(() => {

        if (getCurrentRol()) {
            router.push(`/${getCurrentRol()}`)
        }

    }, [])

    const handleRolChange = ({ target }: JSONObject) => {

        changeCurrentRol(target.value)
        router.push(`/${target.value}`)

    }

    return (
        <Layout>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-[20rem] h-[20rem] bg-[#ffffff55] rounded-3xl p-10 flex flex-col justify-center items-center">
                    <h1>Selecciona el rol a utilizar</h1>
                    <select className="w-full px-1 py-2 rounded" id="inline-password" name="" onChange={handleRolChange}>
                        <option>Elegir</option>
                        {
                            userData().roles.map(({ nombre, id }: JSONObject, i: number) => (
                                <option key={i} value={id}>{nombre}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </Layout>
    )
}

export default RolSelector