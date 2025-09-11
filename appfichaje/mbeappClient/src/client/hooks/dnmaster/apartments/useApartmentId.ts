import { IPiso } from '@/client/models/IPiso'
import PisoServiceInstance from '@/client/services/PisoService'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DN_USERS_PATH, MSG_ERROR_FIELD, MSG_ERROR_SAVE, DN_APARTMENT_PATH, ALERT_MSG_SAVE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import UserService from '@/client/services/UserService'

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

const useApartmentId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IPiso>({
        id: 0,
        pais: '',
        ciudad: '',
        codigo_postal: '',
        direccion: '',
        nro_edificio: '',
        nro_piso: '',
        id_dispositivo_ref: '',
        ubicacion_mapa: '',
        observaciones: '',
        estado: 1,
        etiqueta: '',
        idpropietario: 0,
        propietarios: []
    })

    const [propietarios, setPropietarios] = useState<Array<{ key:string, name: string }>>([])
    
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

        dataDB.propietarios = dataDB.idpropietario? [{ id: parseInt(dataDB.idpropietario.toString()) || 0 }]:[]
        const result = await ( id ?
            PisoServiceInstance.update(dataDB, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) :
            PisoServiceInstance.create(DN_APARTMENT_PATH, dataDB, (err) => {
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
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/dnmaster/apartments/')
        }
    }

    useEffect(() => {
        id && PisoServiceInstance.getById(id).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            data && setDataDB( {    ...data, 
                                    idpropietario: ( (data.propietarios && data.propietarios.length !== 0)?data.propietarios[0].id:0 ), 
                                    ubicacion_mapa: data.ubicacion_mapa || '',
                                    observaciones: data.observaciones || ''
                            })
        }).catch(err => {}).finally(()=>{})
        
        // (new UserService())
        let statusHttpUS = 200
        new UserService().getAll(DN_USERS_PATH, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            console.log(data)
            statusHttpUS === 200 && data && setPropietarios( data.filter(el => el.nombrerol === 'Propietario').map(el => ({ key: el.id.toString(), name: `${el.nombre} ${el.apellido}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/dnmaster/apartments/', router),
        errorValidate,
        msgError,
        dataControl,
        propietarios
    }
}

export default useApartmentId;