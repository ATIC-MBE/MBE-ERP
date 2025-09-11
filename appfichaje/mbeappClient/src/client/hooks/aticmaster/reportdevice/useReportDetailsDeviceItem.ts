import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { ReportDetailsDeviceType, ReportDetailsType } from '@/client/types/globalTypes'

type ReportDetailsSave = {
    idReport: number, 
    idDetailsReport: number, 
    idPiso: number, 
    idDevice: number, 
    state: string
}

const useReportDetailsDeviceItem = (  item: ReportDetailsType, idReport: number ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<ReportDetailsType>(item)

    // Tipos de dispositivos
    const [ itemMovil, setItemMovil] = useState<ReportDetailsDeviceType | undefined>()
    const [ itemLock, setItemLock] = useState<ReportDetailsDeviceType | undefined>()
    const [ itemTTLock, setItemTTLock] = useState<ReportDetailsDeviceType | undefined>()
    const [ itemSonoff, setItemSonoff] = useState<ReportDetailsDeviceType | undefined>()
    const [ itemTelefonillo, setItemTelefonillo] = useState<ReportDetailsDeviceType | undefined>()
    const [ itemCamara, setItemCamara] = useState<ReportDetailsDeviceType | undefined>()

    /**
     * Pre
     * @param dataFetch 
     * @returns 
     */
    const fetchService = async ( dataFetch: ReportDetailsSave ): Promise<number> => {
        let statusHttps = 200

        let dataSend = {
            state : dataFetch.state,
            id_piso : dataFetch.idPiso,
            id_device : dataFetch.idDevice
        }

        await (
            idReport && FetchApiServiceInstance.update(`/api/atic/devices/report/${dataFetch.idReport}/details/${dataFetch.idDetailsReport}`, dataSend, (err) => {
                const { status, data } = err.response!
                statusHttps = status
                // Errores de validación del servidor [API]
                if ( status === 409 ) {}
            })
        )
        return new Promise<number>((resolve, reject) => { resolve(statusHttps) })
    }

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
        
        // Pendientes para pisos con el mismo dispositivo
        // Actualizamos los dispositivos
        setItemMovil(item.dispositivos.find(el => el.type === 'movil'))
        setItemLock(item.dispositivos.find(el => el.type === 'lock'))
        setItemTTLock(item.dispositivos.find(el => el.type === 'ttlock'))
        setItemSonoff(item.dispositivos.find(el => el.type === 'sonoff'))
        setItemTelefonillo(item.dispositivos.find(el => el.type === 'telefonillo'))
        setItemCamara(item.dispositivos.find(el => el.type === 'camara'))

    }, [item]) 

    /**
     * Todos los dispositivos excepto LOCK
     * @param e 
     */
    const handlerSaveByState = async (e: any) => {
        let [id, idDetailsReport, idPiso, idDevice, state] = [idReport, 0, itemContent.id, 0, e.target.value as string]

        if ( (e.target.name as string).includes('movil') ) {
            setItemMovil( (current) => {
                return current ? { ...current, state: e.target.value } : undefined
            } )
            idDetailsReport = itemMovil?.iddetallereporte || 0
            idDevice = itemMovil?.id || 0
        } else if ( (e.target.name as string).includes('sonoff') ) {
            setItemSonoff( (current) => {
                return current ? { ...current, state: e.target.value } : undefined
            } )
            idDetailsReport = itemSonoff?.iddetallereporte || 0
            idDevice = itemSonoff?.id || 0
        } else if ( (e.target.name as string).includes('telefonillo') ) {
            setItemTelefonillo( (current) => {
                return current ? { ...current, state: e.target.value } : undefined
            } )
            idDetailsReport = itemTelefonillo?.iddetallereporte || 0
            idDevice = itemTelefonillo?.id || 0
        } else if ( (e.target.name as string).includes('camara') ) {
            setItemCamara( (current) => {
                return current ? { ...current, state: e.target.value } : undefined
            } )
            idDetailsReport = itemCamara?.iddetallereporte || 0
            idDevice = itemCamara?.id || 0
        }

        let statusHttps = await fetchService({  idReport: id, 
                                                idDetailsReport: idDetailsReport, 
                                                idPiso: idPiso, 
                                                idDevice: idDevice, 
                                                state: state
                                            })
        
        if ( statusHttps === 200 ) {
            console.log('Ok se guardo exitosamente!!')
        }
    }

    const handlerSaveByStateLock = async (e: any) => {
        setItemLock( (current) => {
            return current ? { ...current, state: e.target.value } : undefined
        } )

    }

    const saveStateLockKeyDown = async (e: any) => {
        if (e.key === 'Enter') {
            let [id, idDetailsReport, idPiso, idDevice, state] = [idReport, itemLock?.iddetallereporte || 0, itemContent.id, itemLock?.id || 0, e.target.value as string]

            let statusHttps = await fetchService({  idReport: id, 
                                                idDetailsReport: idDetailsReport, 
                                                idPiso: idPiso, 
                                                idDevice: idDevice, 
                                                state: state
                                            })
        
            if ( statusHttps === 200 ) {
                console.log('Ok se guardo exitosamente!!')
            }
        }
        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    return {
        itemContent,
        itemMovil,
        itemLock,
        itemTTLock,
        itemSonoff,
        itemTelefonillo,
        itemCamara,
        handlerSaveByState,
        handlerSaveByStateLock,
        saveStateLockKeyDown
    }
}

export default useReportDetailsDeviceItem;