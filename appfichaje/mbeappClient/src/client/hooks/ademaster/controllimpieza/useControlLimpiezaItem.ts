import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza';

const useControlLimpiezaItem = (  item: IControlHorarioLimpieza ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IControlHorarioLimpieza>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/ade/controllimpieza/${id}`)
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

export default useControlLimpiezaItem;