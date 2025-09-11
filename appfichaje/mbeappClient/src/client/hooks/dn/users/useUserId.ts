import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, DN_APARTMENT_PATH, ALERT_MSG_SAVE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { UserSignup, rolenum, user } from '@/client/types/globalTypes'
import UserService from '@/client/services/UserService'
import RoleServiceInstance from '@/client/services/RoleService'

// Constants
const dataControl = {
    pais: { label: 'Pais', required: true, isError: false, msgDefault: 'Campo requerido' },
    ciudad: { label: 'Ciudad', required: true, isError: false },
    codigo_postal: { label: 'Código Postal', required: true, isError: false },
    direccion: { label: 'Dirección', required: true, isError: false },
    nro_edificio: { label: 'Nro Edificio', required: true, isError: false },
    nro_piso: { label: 'Nro Piso', required: false, isError: false },
    id_dispositivo_ref: { label: 'Código', required: true, isError: false }
}

const useUserId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<user>({
        id: 0,
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: 1,
        idrol: '',
        roles: []
    })

    const [roles, setRoles] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    // const handleCancel = async () => {
    //     router.push('/dn/users/')
    // }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        // dataDB.propietarios = dataDB.idpropietario? [{ id: parseInt(dataDB.idpropietario.toString()) || 0 }]:[]
        const result = await ( id ? new UserService().setUser('/api/dn/users', id, dataDB as UserSignup, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
            : ''
            // new UserService().addUser('/api/dn/users', dataDB as UserSignup, (err) => {
            //     // Se ejecuta para status diferente de 200
            //     const { status, data } = err.response!
            //     // Errores de validación del servidor [API]
            //     if ( status === 409 ) {
            //         let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
            //         if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
            //         else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
            //         setErrorValidate((previousValue) => !previousValue)
            //     }
            // })
        )

        // // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/dn/users/')
        }
    }

    useEffect(() => {
        let statusHttpSById = 200
        id && new UserService().getById(id, '/api/dn/users/', (err) => {
            const { status } = err.response!
            statusHttpSById = status
        }).then( data => {
            if ( statusHttpSById === 200 && data ) {
                setDataDB( { ...data, idrol: ((data.roles && data.roles.length !== 0) ? data.roles[0].id :'NA') as rolenum, } )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})

        RoleServiceInstance.getAll().then( data => {
            data && setRoles( data.filter(el => ['propietario', 'colaborador'].includes(el.id)).map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        roles,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/dn/users/', router),
        errorValidate,
        msgError,
        dataControl
    }
}

export default useUserId;