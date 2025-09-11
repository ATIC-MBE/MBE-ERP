import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { user } from '@/client/types/globalTypes'
import { ALERT_MSG_CONFIR_RESET_PASSWORD } from '@/client/helpers/constants'
import UserService from '@/client/services/UserService'

const useUserItem = (  item: user, pathEdit: string ) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<user>(item)

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

    const handleResetPassword = async (id: number) => {
        if (!confirm(`${ALERT_MSG_CONFIR_RESET_PASSWORD}`)) return
        let result = await new UserService().resetPasswordUser(`/api/auth/users/${id}/password/reset`, (err) => {
            // Se ejecuta para status diferente de 200
            const { status, data } = err.response!
            // Errores de validación del servidor [API]
            if (status === 404 || status === 403) {
                console.log('Error, el registro no esta disponible!!')
            }
        })

        // // Si no hay error, reload [SOL TMP]
        if (result) {
            // alert(`${ALERT_MSG_RESET_PASSWORD_OK}`)
            router.reload()
        }
    }

    return {
        itemContent,
        goEditData,
        eventMap,
        handleResetPassword
    }
}

export default useUserItem;