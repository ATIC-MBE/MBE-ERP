import React, { useContext, useEffect, useReducer, useState, useCallback } from "react";
import { JSONObject, user, profile, rolenum } from "../types/globalTypes";
import UserContext from "./UserContext";
import UserService from '@/client/services/UserService'
import { NextRouter, useRouter } from "next/router";
import { PATH } from "../helpers/Path";
import { useLocalState } from "../helpers/Util";
import FetchApiServiceInstance from "../services/FetchApiService";
import { IData } from "../models/IData";

const UserState = (props: JSONObject) => {

    const { children } = props
    const userService = new UserService()

    const initialState: profile = {
        id: 0,
        nombre: '',
        apellido: '',
        email: '',
        estado: 0,
        roles: []
    }

    const [userData, setUserData] = useLocalState<profile>(initialState, 'user_data')

    // Para contar el numero de solicitudes pendientes solo para rmg
    const [solPendientesRMG, setSolPendientesRMG] = useState(0); // Crea el state del carrito
    const updateSolPendientesRMG = useCallback(() => {
        let statusHttpUS = 200
        FetchApiServiceInstance.getSingleDataWithFilter(`/api/share/data/totaldata/`, { tipo: 'total_solicitides_pl_pendientes' }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = data as IData
                setSolPendientesRMG(_data.total_data)
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, []);


    const initialRolState = ''
    const localRolKey = 'current_rol'

    const [getCurrentRol, changeCurrentRol] = useLocalState<rolenum>(initialRolState, localRolKey)

    const isRoleAllowed = (router: NextRouter, callback: () => void) => {
        const basePath = '/'+router.pathname.split('/')[1]
        if (!PATH[basePath]) return callback()

        const localValue = localStorage.getItem(localRolKey)

        if (PATH[basePath].isAllowed(getCurrentRol() != initialRolState ? getCurrentRol() : localValue && localValue != 'undefined' ? JSON.parse(localValue as string) : getCurrentRol())) return callback()

        return router.push('/error/unauthorized')

    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const useAllowedEffect = (router: NextRouter, callback: () => void) => {
        useEffect(() => {
            (async () => {
                const response = await userService.getProfile((error) => {
                    console.error(error)
                    router.push('/login')

                })
                if(response){
                    isRoleAllowed(router, callback)
                }
                
            }
            )()

        }, [])
    }

    return (
        <UserContext.Provider value={{
            solPendientesRMG,
            updateSolPendientesRMG,
            userData,
            setUserData,
            getCurrentRol,
            changeCurrentRol,
            isRoleAllowed,
            useAllowedEffect,
            isMobileMenuOpen, 
            setIsMobileMenuOpen
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserState