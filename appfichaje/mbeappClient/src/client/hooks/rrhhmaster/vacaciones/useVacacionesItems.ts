import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { user } from '@/client/types/globalTypes'
import { ALERT_MSG_CONFIR_RESET_PASSWORD } from '@/client/helpers/constants'
import { IVacaciones } from '@/client/models/IVacaciones'

const useVacacionesItem = (  item: IVacaciones, pathEdit: string ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IVacaciones>(item)

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
        eventMap,
        
    }
}

export default useVacacionesItem;