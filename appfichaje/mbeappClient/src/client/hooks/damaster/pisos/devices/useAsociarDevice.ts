import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_CONFIR_DELETE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { IDevice } from '@/client/models/IDevice'
import { AsociarDevicesToPisoType } from '@/client/types/globalTypes'

const useAsociarDevice = (dataDB: AsociarDevicesToPisoType, setDataDB: any) => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [lstDispositivos, setLstDispositivos] = useState<Array<IDevice>>([])
    const [loadingLstDevices, setLoadingLstDevices] = useState<boolean|undefined>(undefined)
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const [listTypeDevices, setListTypeDevices] = useState<Array<{ key:string, name: string, label: string }>>([])
    const [flagTypeDevices, setFlagTypeDevices] = useState<number|null>(-1)
    const [dataTypeDeviceSel, setDataTypeDeviceSel] = useState<{id: number, code: string}>({ id: 0, code:''})

    const [deviceSelForm, setDeviceSelForm] = useState<string>('-2')

    const handleChangeDevice = (e: any) => {
        setDeviceSelForm(e.target.value)
    }

    const addDeviceToList = (device: IDevice) => {
        !(dataDB.dispositivos.find(el => el.id === device.id)) && dataDB.dispositivos.push({
            id: device.id, 
            codigo: device.codigo, 
            nombre: device.nombre, 
            type: dataTypeDeviceSel.code,
            estado: 1,
            action: 'add'
        })
        setDataDB( { ...dataDB } )
        setFlagTypeDevices(-1)
        setDeviceSelForm('-2')
    }

    const handleAddDevice = () => {
        const _deviceSel = lstDispositivos.find(el => el.id.toString() === deviceSelForm)
        _deviceSel && addDeviceToList(_deviceSel)
    }

    const handleChangeStateDevice = (idDevice: number) => {
        const _deviceDelete = dataDB.dispositivos.find(el => el.id === idDevice)
        const _deviceDeleteIndex = dataDB.dispositivos.findIndex(el => el.id === idDevice)
        if( _deviceDelete ) {
            dataDB.dispositivos.splice(_deviceDeleteIndex, 1, {..._deviceDelete, action: _deviceDelete.action === 'add'?'delete':'add'});
        }
        setDataDB( { ...dataDB } )
    }

    useEffect(() => {
        let _data = listTypeDevices[ flagTypeDevices === null ? -1 : flagTypeDevices ] || { key: '0', name:'', label:''}
        setDataTypeDeviceSel({id: parseInt(_data.key), code: _data.name})

        if( parseInt(_data.key) !== 0 ) {
            setLoadingLstDevices(true)
            let statusHttpUS = 200
            FetchApiServiceInstance.getAllWithFilter(`/api/da/dispositivos/disponibles`, { code : _data.name },(err) => {
                const { status } = err.response!
                statusHttpUS = status
            }).then( data => {
                if ( statusHttpUS === 200 && data ) setLstDispositivos( (data as Array<IDevice>) )
                else setLstDispositivos([])
            }).catch(err => {
                console.log('err: ', err)
            }).finally(()=>{
                setTimeout(() => {setLoadingLstDevices(false)}, 100)
            })
        } else setLstDispositivos([])
    }, [flagTypeDevices])

    useEffect(() => {
        // GET información types devices
        let statusHttpTD = 200
        FetchApiServiceInstance.getAllWithFilter('/api/share/data/dataselect/', { tipo: 'typedevices' }, (err) => {
            const { status } = err.response!
            statusHttpTD = status
        }).then( data => {
            if ( statusHttpTD === 200 && data ) {
                let _data = data as Array<{ key:string, name: string }>
                setListTypeDevices( _data.filter(el => el.name !== 'router').map(el => ({...el, label: UtilCustomInstance.getLabelTypeDevice(el.name)})) )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        handleChangeDevice,
        errorValidate,
        msgError,
        listTypeDevices,
        flagTypeDevices,
        setFlagTypeDevices,
        lstDispositivos,
        deviceSelForm,
        loadingLstDevices,
        handleAddDevice,
        handleChangeStateDevice
    }
}

export default useAsociarDevice;