import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_SAVE_DATA, DN_RESPONSABLES_PATH, DN_GET_USERS_RESP_APP } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import UserService from '@/client/services/UserService'
import { IResponsableLead } from '@/client/models/IResponsableLead'
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService'

// Constants
const dataControl = {
    codigo: { label: 'Código', required: true, isError: false, msgDefault: 'Campo requerido' },
    nombre: { label: 'Nombre', required: true, isError: false },
    observacion: { label: 'Observación', required: false, isError: false },
    idusuario_resp: { label: 'Responsable', required: false, isError: false }
}

const useResponsableLeadId = () => {
    const router = useRouter()

    let id = BigInt(parseInt(router.query.id as string) || 0)
    // let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IResponsableLead>({
        id: 0,
        codigo: '',
        nombre: '',
        observacion: '',
        estado: 1,
        idusuario_resp: 0,
        tipo_lead: ''
    })

    // const [roles, setRoles] = useState<Array<{ key:string, name: string }>>([])
    const [usuarios, setUsuarios] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        // dataDB.propietarios = dataDB.idpropietario? [{ id: parseInt(dataDB.idpropietario.toString()) || 0 }]:[]
        const result = await ( id ? ResponsableLeadServiceInstance.update(`${DN_RESPONSABLES_PATH}`, dataDB as IResponsableLead, (err) => {
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
            ResponsableLeadServiceInstance.create(`${DN_RESPONSABLES_PATH}`, dataDB as IResponsableLead, (err) => {
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
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/dnmaster/settings/responsables')
        }
    }

    useEffect(() => {
        let statusHttpSById = 200
        let _existResponsable = false
        let _idResponsable = 0
        let _nameResponsable = ''
        // Edit
        id && ResponsableLeadServiceInstance.getById(`${DN_RESPONSABLES_PATH}`, id, (err) => {
            const { status } = err.response!
            statusHttpSById = status
        }).then( data => {
            _existResponsable = statusHttpSById === 200 && data != undefined && data.idusuario_resp != undefined
            if ( statusHttpSById === 200 && data ) {
                setDataDB( data )
                _idResponsable = data!.idusuario_resp!
                _nameResponsable = data!.responsable!
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            // let statusHttpUS = 200
            // new UserService().getAll(`${DN_GET_USERS_RESP_APP}`, (err) => {    
            //     const { status } = err.response!
            //     statusHttpUS = status
            //     let _d = []
            //     if ( _existResponsable ) _d.push({key: _idResponsable.toString(), name: _nameResponsable})
            //     setUsuarios( _d )
            // }).then( ldata => {
            //     let _d = ldata ? ldata.map(el => ({ key: el.id.toString(), name: `${el.nombre} ${el.apellido}`})) : []
            //     if ( _existResponsable ) _d.push({key: _idResponsable.toString(), name: _nameResponsable})
            //     statusHttpUS === 200 && setUsuarios( _d )
            // }).catch(err => {
            //     console.log('err: ', err)
            // }).finally(()=>{})
        })

        // Se cargaran todos los usuarios responsables
        let statusHttpUS = 200
        id || new UserService().getAll(`${DN_GET_USERS_RESP_APP}`, (err) => {    
            const { status } = err.response!
            statusHttpUS = status
        }).then( ldata => {
            let _d = ldata ? ldata.map(el => ({ key: el.id.toString(), name: `${el.nombre} ${el.apellido}`})) : []
            statusHttpUS === 200 && setUsuarios( _d )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/dnmaster/settings/responsables/', router),
        errorValidate,
        msgError,
        dataControl,
        usuarios
    }
}

export default useResponsableLeadId;