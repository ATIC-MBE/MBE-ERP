import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IChangePassword } from '@/client/models/IChangePassword'
import { user } from '@/client/types/globalTypes'

const usePassword = (pathBack: string, id: number) => {
    const router = useRouter()

    const [dataDB, setDataDB] = useState<IChangePassword>({
        id: 0,
        password_current: '',
        password_new: '',
        nombre_completo: ''
    })

    const [userDB, setUserDB] = useState<user>({
        id: 0,
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: 1,
        idrol: '',
        roles: [],
        nombre_completo: ''
    })

    const [flagPassword, setFlagPassword] = useState<{flagPasswordCurrent: boolean, flagPasswordNew: boolean}>({
        flagPasswordCurrent: false,
        flagPasswordNew: false
    })
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        let _val = e.target.value

        setDataDB({
            ...dataDB,
            [e.target.name]: _val
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        const result = await ( FetchApiServiceInstance.update(`/api/auth/users/${id}/password/change`, { ...dataDB, id }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        return `${el.label || ''}: ${el.msg}`
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )

        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push(`${pathBack}`)
        }
    }

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/admin/users/${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( statusDataId === 200 && data ) {
                let _data = data as user
                setUserDB( {..._data})
            }
        }).catch(err => {}).finally(()=>{})
    }, [id])

    const handlerFlagPassword = (nameTag: string) => {
        setFlagPassword((current) => {
            const _value = nameTag === 'flagPasswordCurrent' ? current.flagPasswordCurrent: current.flagPasswordNew
            return { ...current,  [nameTag]: !_value }
        })
    }

    return {
        flagPassword,
        dataDB,
        userDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel(pathBack, router),
        errorValidate,
        msgError,
        handlerFlagPassword
    }
}

export default usePassword;