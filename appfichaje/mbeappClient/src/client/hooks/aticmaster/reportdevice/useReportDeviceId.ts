import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { handleCancel } from '@/client/helpers/Util'
import { ReportDetailsType, user } from '@/client/types/globalTypes'
import FetchApiServiceInstance from '@/client/services/FetchApiService'

const useReportDeviceId = (pathGoToBack: string) => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [lstDetailsReport, setLstDetailsReport] = useState<Array<ReportDetailsType>>([])

    useEffect(() => {
        // Edit
        // declare the async data fetching function
        const fetchData = async () => {
            if ( id ) {
                const _listStateMovil = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'movil'})) || []
                const _listStateLock = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'lock'})) || []
                const _listStateTTLock = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'ttlock'})) || []
                const _listStateSonoff = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'sonoff'})) || []
                const _listStateTelefonillo = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'telefonillo'})) || []
                const _listStateCamara = (await FetchApiServiceInstance.getAllWithFilter(`/api/atic/devices/report/${id}/apartments`, {typecode: 'camara'})) || []

                let _dataResult = [
                    {
                        dim: _listStateMovil.length, listData: _listStateMovil
                    },
                    {
                        dim: _listStateLock.length, listData: _listStateLock
                    },
                    {
                        dim: _listStateTTLock.length, listData: _listStateTTLock
                    },
                    {
                        dim: _listStateSonoff.length, listData: _listStateSonoff
                    },
                    {
                        dim: _listStateTelefonillo.length, listData: _listStateTelefonillo
                    },
                    {
                        dim: _listStateCamara.length, listData: _listStateCamara
                    }
                ]
                _dataResult.sort((a, b) => a.dim > b.dim ? 1 : -1)

                const _listMaster = (_dataResult[0].listData as Array<ReportDetailsType>)
                let _listResult: Array<ReportDetailsType> = []
                
                // Creamos el listado de pisos con todos los dispositivos
                _listMaster.forEach(el => {
                    let _devicesFinal = []
                    let _deviceMovil = (_listStateMovil as Array<ReportDetailsType>).find(dev => dev.id === el.id)
                    let _deviceLock = (_listStateLock as Array<ReportDetailsType>).find(dev => dev.id === el.id)
                    let _deviceTTLock = (_listStateTTLock as Array<ReportDetailsType>).find(dev => dev.id === el.id)
                    let _deviceSonoff = (_listStateSonoff as Array<ReportDetailsType>).find(dev => dev.id === el.id)
                    let _deviceTelefonillo = (_listStateTelefonillo as Array<ReportDetailsType>).find(dev => dev.id === el.id)
                    let _deviceCamara = (_listStateCamara as Array<ReportDetailsType>).find(dev => dev.id === el.id)

                    _devicesFinal.push( _deviceMovil!.dispositivos[0] )
                    _devicesFinal.push( _deviceLock!.dispositivos[0] )
                    _devicesFinal.push( _deviceSonoff!.dispositivos[0] )
                    _devicesFinal.push( _deviceTelefonillo!.dispositivos[0] )
                    _devicesFinal.push( _deviceCamara!.dispositivos[0] )

                    _listResult.push({ ...el,  dispositivos: _devicesFinal.filter(el => el !== undefined)})
                })
                setLstDetailsReport(_listResult)
            }
        }

        // call the function
        fetchData().catch(console.error)

    }, [id])

    return {
        handleCancel: () => handleCancel(`${pathGoToBack}`, router),
        lstDetailsReport,
        idReport: id
    }
}

export default useReportDeviceId;