import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IDeviceReport } from '@/client/models/IDeviceReport'
import FetchApiServiceInstance from '@/client/services/FetchApiService'

const useReportDeviceItem = (  item: IDeviceReport ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IDeviceReport>(item)
    const [ itemContentDetails, setItemContentDetails] = useState<any>()

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    // NO SIRVE
    const goEditData = (id: number) => {
        router.push(`/atic/reports/${id}`)
    }

    const eventMap = (e: any) => {
        e.stopPropagation();
    }

    const handlerReport = (id: number) => {
        let statusHttpUS = 200

        FetchApiServiceInstance.getAllData(`/api/reports/ratic/devicereport/${id}`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<any>)
                setItemContentDetails([ ..._data ])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            // setLoading(false)
        })
    }

    return {
        itemContent,
        goEditData,
        eventMap,
        handlerReport
    }
}

export default useReportDeviceItem;