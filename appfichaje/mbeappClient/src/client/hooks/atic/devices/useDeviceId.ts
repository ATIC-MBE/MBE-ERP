import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, DN_APARTMENT_PATH, SHARE_GET_PROPIETARIOS_PATH, DA_APARTMENT_PATH, ALERT_MSG_CONFIR_DELETE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { IDevice } from '@/client/models/IDevice'

const useDeviceId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IDevice>({
        id: 0,
        idpiso: 0,
        idtipodispositivo: 0,
        codigo: '',
        nombre: '',
        estado: 0,
        descripcion: '',
        version_app: '',
        ip: '',
        macwifi: '',
        ip_arduino: '',
        mac: '',
        codigo_permanente: '',
        bateria: 0,
    })

    const [limpiezaUsers, setLimpiezaUsers] = useState<Array<{ key: string, name: string }>>([])
    const [pisos, setPisos] = useState<Array<{ key: string, name: string }>>([])

    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const [listTypeDevices, setListTypeDevices] = useState<Array<{ key: string, name: string, label: string }>>([])
    const [flagTypeDevices, setFlagTypeDevices] = useState<number | null>(-1)
    const [dataTypeDeviceSel, setDataTypeDeviceSel] = useState<{ id: number, code: string }>({ id: 0, code: '' })

    const handleChange = (e: any) => {
        let _val = e.target.value
        let _name = e.target.name as string


        setDataDB({
            ...dataDB,
            [e.target.name]: _val
        })
    }

    const handleSave = async () => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]
        //alert('ddddddd')
        //return

        const result = await (id ?
            FetchApiServiceInstance.update(`/api/atic/devices/crud/${id}`, { ...dataDB, idpiso: (dataDB.idpiso?.toString() == '-2') ? undefined : dataDB.idpiso, type: dataTypeDeviceSel.code, idtipodispositivo: dataTypeDeviceSel.id }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if (status !== 200) {
                    let _d = data as { error: string, data: Array<{ type: string, code: string, field: string, msg: string, label?: string }> }
                    if (_d.data.length !== 0) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        // let _result = (el.code === '23505' && el.field === 'id_dispositivo_ref' && el.type ==='SQL') ? `Código duplicado` : (el.label||'')
                        // return _result
                        return `${el.label || ''}: ${el.msg}`
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) :
            FetchApiServiceInstance.create('/api/atic/devices/crud', { ...dataDB, idpiso: (dataDB.idpiso?.toString() == '-2') ? undefined : dataDB.idpiso, type: dataTypeDeviceSel.code, idtipodispositivo: dataTypeDeviceSel.id }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if (status !== 200) {
                    let _d = data as { error: string, data: Array<{ type: string, code: string, field: string, msg: string, label?: string }> }
                    if (_d.data.length !== 0) {
                        setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                            return `${el.label || ''}: ${el.msg}`
                        })))
                    } else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))

                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )

        // Si no hay error, redirecciona [SOL TMP]
        if (result) {
            router.push('/atic/devices/')
        }
    }

    useEffect(() => {
        let _data = listTypeDevices[flagTypeDevices === null ? -1 : flagTypeDevices] || { key: '0', name: '', label: '' }
        setDataTypeDeviceSel({ id: parseInt(_data.key), code: _data.name })
    }, [flagTypeDevices])

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/atic/devices/crud/${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status

        }).then(data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if (statusDataId === 200 && data) {
                let _data = data as IDevice

                // actualizar el tipo de dato seleccionado
                setDataTypeDeviceSel({ id: _data.idtipodispositivo, code: _data.type || '' })
                let typeExtras = {}
                if (_data.idtipodispositivo == 1) {
                    typeExtras = {
                        ...typeExtras,
                        mac: _data?.info_extra[0].mac || '',
                        codigo_permanente: _data?.info_extra[0].codigo_permanente || '',
                        bateria: _data?.info_extra[0].bateria || 0
                    }

                }
                if (_data.idtipodispositivo == 2) {
                    typeExtras = {
                        ...typeExtras,
                        ip_arduino: _data?.info_extra[0].ip_arduino || ''
                    }
                }
                if (_data.idtipodispositivo == 3) {
                    let _
                    typeExtras = {
                        ...typeExtras,
                        version_app: _data?.info_extra[0].version_app || '',
                        ip: _data?.info_extra[0].ip || '',
                        macwifi: _data?.info_extra[0].macwifi || ''
                    }
                }


                setDataDB({
                    ..._data,
                    id: _data.id || 0,
                    idpiso: _data.idpiso || 0,
                    idtipodispositivo: _data.idtipodispositivo || 0,
                    codigo: _data.codigo || '',
                    nombre: _data.nombre || '',
                    estado: _data.estado || 0,
                    descripcion: _data.descripcion || '',
                    ...typeExtras
                })


            }
        }).catch(err => { }).finally(() => { })

        // GET información de personal de limpieza
        // let statusHttpUS = 200
        // FetchApiServiceInstance.getAllData(`/api/atic/devices/ulimpieza`, (err) => {
        //     const { status } = err.response!
        //     statusHttpUS = status
        // }).then( data => {
        //     if ( statusHttpUS === 200 && data ) {
        //         let _data = (data as Array<any>)
        //         setLimpiezaUsers(_data.map(el => ({key: `${el.id}`, name: el.nombre_completo})))
        //     } else {
        //         setLimpiezaUsers([])
        //     }
        // }).catch(err => {
        //     console.log('err: ', err)
        // }).finally(()=>{})

        // GET información Pisos
        let statusHttpP = 200
        FetchApiServiceInstance.getAllWithFilter('/api/share/data/dataselect/', { tipo: 'pisos' }, (err) => {
            const { status } = err.response!
            statusHttpP = status
        }).then(data => {
            if (statusHttpP === 200 && data) {
                let _data = data as Array<{ key: string, name: string }>
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => { })

        // GET información types devices
        let statusHttpTD = 200
        FetchApiServiceInstance.getAllWithFilter('/api/share/data/dataselect/', { tipo: 'typedevices' }, (err) => {
            const { status } = err.response!
            statusHttpTD = status
        }).then(data => {
            if (statusHttpTD === 200 && data) {
                let _data = data as Array<{ key: string, name: string }>
                // console.log('tipo dispositivos', _data)
                setListTypeDevices(_data.filter(el => el.name !== 'router').map(el => ({ ...el, label: UtilCustomInstance.getLabelTypeDevice(el.name) })))
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => { })
    }, [id])

    const handleDelete = async () => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return

        const result = await (id ?
            FetchApiServiceInstance.delete(`/api/atic/devices/crud/${id}`, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if (status === 409) {
                    let _d = data as { error: string, data: Array<{ type: string, code: string, field: string, msg: string }> }
                    if (_d.data.length !== 0) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
            : null
        )
        // Si no hay error, redirecciona [SOL TMP]
        if (result) {
            router.push('/atic/devices/')
        }
    }

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/atic/devices/', router),
        handleDelete,
        errorValidate,
        msgError,
        limpiezaUsers,
        pisos,
        listTypeDevices,
        flagTypeDevices,
        setFlagTypeDevices,
        dataTypeDeviceSel
    }
}

export default useDeviceId;