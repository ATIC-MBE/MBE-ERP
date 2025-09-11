import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { UserSignup, rolenum, user } from '@/client/types/globalTypes';
import UserService from '@/client/services/UserService';
import RoleServiceInstance from '@/client/services/RoleService';


const useUserId = (pathGoToBack: string) => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<user>({
        id: 0,
        username: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        nombre_completo: '',
        estado: 1,
        idrol: '',
        roles: []
    })

    const [roles, setRoles] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    // Var for Model
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }    

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        // console.log(dataDB)
        // return

        const result = await ( id ? new UserService().setUser('/api/rrhh/users', id, dataDB as UserSignup, (err) => {
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
            : 
            new UserService().addUser('/api/rrhh/users', dataDB as UserSignup, (err) => {
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
        )

        // // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            // alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push(`${pathGoToBack}`)
        }
    }

    useEffect(() => {
        let statusHttpSById = 200
        id && new UserService().getById(id, '/api/rrhh/users/', (err) => {
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
            data && setRoles( data.filter(el => (el.id.toString() !== 'propietario' && el.id.toString() !== 'colaborador')).map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel(`${pathGoToBack}`, router),
        errorValidate,
        msgError,
        roles,
        isModalOpen,
        toggleModal
    }
}

export default useUserId;