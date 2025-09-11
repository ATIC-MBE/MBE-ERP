import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, DN_APARTMENT_PATH, SHARE_GET_PROPIETARIOS_PATH, DA_APARTMENT_PATH, ALERT_MSG_CONFIR_DELETE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { IDevice } from '@/client/models/IDevice'

const useDeviceForm = (dataIn: IDevice) => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IDevice>(dataIn)

    const [limpiezaUsers, setLimpiezaUsers] = useState<Array<{ key: string, name: string }>>([])
    const [pisos, setPisos] = useState<Array<{ key: string, name: string }>>([])

    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const [listTypeDevices, setListTypeDevices] = useState<Array<{ key: string, name: string, label: string }>>([])
    const [flagTypeDevices, setFlagTypeDevices] = useState<number | null>(-1)
    const [dataTypeDeviceSel, setDataTypeDeviceSel] = useState<{ id: number, code: string }>({ id: 0, code: '' })



    useEffect(() => {
        let _data = listTypeDevices[flagTypeDevices === null ? -1 : flagTypeDevices] || { key: '0', name: '', label: '' }
        setDataTypeDeviceSel({ id: parseInt(_data.key), code: _data.name })
    }, [flagTypeDevices])

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/ade/controlhorario/${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then(data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            // console.log("Estos son los datos " , data)
            if (statusDataId === 200 && data) {
                let _data = data as IDevice

                setDataDB({
                    ..._data,
                    id: _data.id || 0,
                    idpiso: _data.idpiso || 0,
                    idtipodispositivo: _data.idtipodispositivo || 0,
                    codigo: _data.codigo || '',
                    nombre: _data.nombre || '',
                    estado: _data.estado || 0,
                    version_app: _data.version_app || '',
                    ip: _data.ip || '',
                    macwifi: _data.macwifi || '',
                    ip_arduino: _data.ip_arduino || '',
                    mac: _data.mac || '',
                    codigo_permanente: _data.codigo_permanente || '',
                    bateria: _data.bateria || 0,
                })
            }
        }).catch(err => { }).finally(() => { })

        // GET información de personal de limpieza
        let statusHttpUS = 200
        FetchApiServiceInstance.getAllData(`/api/share/users/ulimpieza`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then(data => {
            if (statusHttpUS === 200 && data) {
                let _data = (data as Array<any>)
                setLimpiezaUsers(_data.map(el => ({ key: `${el.id}`, name: el.nombre_completo })))
            } else {
                setLimpiezaUsers([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => { })

        // GET información Pisos
        let statusHttpP = 200
        FetchApiServiceInstance.getAllWithFilter('/api/share/data/dataselect/', { tipo: 'pisos' }, (err) => {
            const { status } = err.response!
            statusHttpP = status
        }).then(data => {
            if (statusHttpP === 200 && data) {
                let _data = data as Array<{ key: string, name: string }>
                setPisos(_data)
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
                setListTypeDevices(_data.filter(el => el.name !== 'router').map(el => ({ ...el, label: UtilCustomInstance.getLabelTypeDevice(el.name) })))
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => { })
    }, [id])

    return {
        dataDB,
        errorValidate,
        msgError,
        pisos,
        listTypeDevices,
        flagTypeDevices,
        setFlagTypeDevices,
        dataTypeDeviceSel
    }
}

export default useDeviceForm;