import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ILead } from '@/client/models/ILead'

const useMyLeadItem = (  item: ILead, pathEdit: string ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<ILead>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`${pathEdit}/${id}`)
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

export default useMyLeadItem;