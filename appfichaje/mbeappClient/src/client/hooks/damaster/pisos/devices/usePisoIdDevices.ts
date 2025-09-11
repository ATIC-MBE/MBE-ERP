import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { AsociarDevicesToPisoType } from '@/client/types/globalTypes'

const usePisoIdDevices = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<AsociarDevicesToPisoType>({
        id: 0,
        etiqueta: '',
        full_direccion: '',
        dispositivos: []
    })
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleSave = async() => {
        setErrorValidate(() => false)

        // /api/da/apartments/[id]/associate_devices
        const result = await ( id ?
            FetchApiServiceInstance.update(`/api/da/apartments/${id!}/associate_devices`, { lDispositivos: [ ...(dataDB.dispositivos.filter(el => el.action !== 'delete').map(el => el.id)) ] }, (err) => {
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
            }) :
            ''
        )

        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/da/apartments')
        }
    }

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/da/apartments/${id}/devices/asociar`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( statusDataId === 200 && data ) {
                let _data = data as AsociarDevicesToPisoType
                //console.log(_data)
                _data = {..._data, dispositivos: _data.dispositivos.map(el => ({...el, action: 'add'})) }
                setDataDB( { ..._data })
            }
        }).catch(err => {}).finally(()=>{})
    }, [id])

    return {
        dataDB,
        setDataDB,
        handleSave,
        handleCancel: () => handleCancel('/da/apartments', router)
    }
}

export default usePisoIdDevices;