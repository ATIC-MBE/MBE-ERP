import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IResponsableLead } from '@/client/models/IResponsableLead'
import { IKeys } from '@/client/models/IKeys'

const useKeysAticItem = (item: IKeys) => {
    const router = useRouter()
    const [itemContent, setItemContent] = useState<IKeys>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent({ ...item })
    }, [item])

    const goEditData = (id: number) => {
        router.push(`/atic/keys/${id}`)
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

export default useKeysAticItem;