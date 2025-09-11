import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza';
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor';

const useGrupoPrescriptorItem = (  item: IGrupoPrescriptor ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IGrupoPrescriptor>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/dnmaster/grupo/${id}/prescriptores/suceso`)
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

export default useGrupoPrescriptorItem;