import {
    ALERT_MSG_CONFIR_RESET_PASSWORD,
    ALERT_MSG_RESET_PASSWORD_OK,
    RRHH_USERS_PATH
} from '@/client/helpers/constants';
import PisoServiceInstance from '@/client/services/PisoService';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { user } from '@/client/types/globalTypes';
import UserService from '@/client/services/UserService';

const useUser = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<user>>([])
    const [loading, setLoading] = useState(true)

    const headerTable = [
        { key: 'username', label: 'Usuario' },
        { key: 'fullname', label: 'Nombre completo' },
        { key: 'email', label: 'Email' },
        { key: 'lestado', label: 'Estado' },
        { key: 'roles_str', label: 'Rol' },
        { key: 'actions', label: 'Acciones' }
    ]


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
            alert(`${ALERT_MSG_RESET_PASSWORD_OK}`)
            router.reload()
        }
    }

    useEffect(() => {
        let statusHttpUS = 200
        new UserService().getAll('/api/rrhh/users', (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then(data => {
            if (statusHttpUS === 200 && data) {
                let _dList = [...data.map(d => ({
                    ...d,
                    lestado: (d.estado === 1 ? 'Alta' : (d.estado === 0 ? 'Baja' : 'Eliminado')),
                    fullname: `${d.nombre} ${d.apellido}`,
                    roles_str: (d.roles.map(el => el.nombre).join(' | ')) || ' --- ',
                    actions: [
                        { key: 'edit', label: 'Editar', link: `/rrhh/users/${d.id}` },
                        { key: 'reset', label: 'Resetar contraseña', link: '/rrhh/users', btnAction: () => handleResetPassword(d.id || 0) }
                    ]
                }))
                ]
                setListData(_dList)
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => {
            setTimeout(() => setLoading(false), 1000);
        })
    }, [])

    return {
        listData,
        headerTable,
        loading
    }
}

export default useUser;