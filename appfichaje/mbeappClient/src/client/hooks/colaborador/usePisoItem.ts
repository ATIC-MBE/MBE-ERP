import { RMG_INFOCOMERCIAL_PATH, SHARE_PLATAFORMA_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const usePisoItem = (  item: IPiso) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IPiso>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item])

    const eventMap = (e: any) => {
        e.stopPropagation();
    }

    return {
        itemContent,
        eventMap
    }
}

export default usePisoItem;