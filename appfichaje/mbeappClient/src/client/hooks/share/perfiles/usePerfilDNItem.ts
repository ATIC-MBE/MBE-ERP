import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IResponsableLead } from '@/client/models/IResponsableLead'

const usePerfilDNItem = (  item: IResponsableLead, pathEdit: string ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IResponsableLead>(item)

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

export default usePerfilDNItem;