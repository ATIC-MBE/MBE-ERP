import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IGrupoPropietario } from '@/client/models/IGrupoPropietario';

const useGrupoPropietarioItem = (  item: IGrupoPropietario ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IGrupoPropietario>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/dnmaster/grupo/${id}/propietarios/suceso`)
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

export default useGrupoPropietarioItem;