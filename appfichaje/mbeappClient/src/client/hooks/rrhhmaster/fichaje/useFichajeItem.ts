import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza';
import { IFichaje } from '@/client/models/IFichaje';

const useFichajeItem = (  item: IFichaje ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IFichaje>(item)
    let puntualidadUser = ''
    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item]) 

    const goEditData = (id: number) => {
        router.push(`/rrhhmaster/fichaje/${id}`)
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

export default useFichajeItem;