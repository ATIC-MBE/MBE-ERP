import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IDevice } from '@/client/models/IDevice'

const useDeviceItem = (  item: IDevice ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IDevice>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/atic/devices/${id}`)
    }

    const eventMap = (e: any) => {
        e.stopPropagation();
    }

    return {
        itemContent,
        goEditData,
        eventMap
    }
}

export default useDeviceItem;