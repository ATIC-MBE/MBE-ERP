import { ALERT_MSG_CONFIR_DELETE_DATA, DN_APARTMENT_PATH } from '@/client/helpers/constants';
import PisoServiceInstance from '@/client/services/PisoService';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import UserService from '@/client/services/UserService';
import { user } from '@/client/types/globalTypes';

const useUser = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<user>>([])
    const [loading, setLoading] = useState(true)

    const headerTable = [
        { key:'ref_lead', label: 'Ref. Lead' },
        { key:'username', label: 'Usuario' },
        { key:'fullname', label: 'Nombre completo' },
        { key:'email', label: 'Email' },
        { key:'lestado', label: 'Estado' },
        { key:'roles_str', label: 'Rol' },
        { key:'actions', label: 'Acciones' }
    ]
    
    const handleDelete = async (id: number) => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return

        let result = await PisoServiceInstance.delete(DN_APARTMENT_PATH, BigInt(id), (err) => {
            // Se ejecuta para status diferente de 200
            const { status, data } = err.response!
            // Errores de validación del servidor [API]
            if ( status === 404 || status === 403  ) {
                console.log('Error, el registro no esta disponible!!')
            }
        })
        
        // // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            console.log(`delete user [dn] ${new Date().toDateString()}`)
            // router.reload()
        }
    }

    useEffect(() => {
        let statusHttpUS = 200
        new UserService().getAll('/api/dn/users', (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _dList = [  ...data.map(d => ( { ...d, 
                        lestado: (d.estado === 1 ? 'Alta':(d.estado === 0 ? 'Baja':'Eliminado')),
                        fullname: `${d.nombre} ${d.apellido}`,
                        roles_str: `${d.nombrerol}` ,
                        actions: [
                            { key: 'edit', label: 'Editar', link: `/dnmaster/users/${d.id}` },
                            { key: 'delete', label: 'Eliminar', link: '/dnmaster/users', btnAction: () => handleDelete(d.id || 0)}
                        ] 
                    } ))    
                ]
                setListData(_dList)
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 500);
        })
    }, [])

    return {
        listData,
        headerTable,
        loading
    }
}

export default useUser;