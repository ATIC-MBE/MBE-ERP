import { DN_RESPONSABLES_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IResponsableLead } from '@/client/models/IResponsableLead';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';

const useResponsableLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IResponsableLead>>([])
    const [loading, setLoading] = useState(true)

    const headerTable = [
        { key:'tipo_lead', label: 'Aplica a' },
        { key:'codigo', label: 'Código' },
        { key:'responsable', label: 'Responsable' },
        { key:'nro_leads', label: 'Nro Leads' },
        { key:'lestado', label: 'Estado' },
        { key:'observacion', label: 'Observación' },
        { key:'actions', label: 'Acciones' }
    ]
    
    // const handleDelete = async (id: number) => {
    //     if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return

    //     let result = await PisoServiceInstance.delete(DN_APARTMENT_PATH, BigInt(id), (err) => {
    //         // Se ejecuta para status diferente de 200
    //         const { status, data } = err.response!
    //         // Errores de validación del servidor [API]
    //         if ( status === 404 || status === 403  ) {
    //             console.log('Error, el registro no esta disponible!!')
    //         }
    //     })
        
    //     // // Si no hay error, redirecciona [SOL TMP]
    //     if ( result ) {
    //         console.log(`delete user [dn] ${new Date().toDateString()}`)
    //         // router.reload()
    //     }
    // }

    useEffect(() => {
        let statusHttpUS = 200
        ResponsableLeadServiceInstance.getAll(`${DN_RESPONSABLES_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _dList = [  ...data.map(d => ( { ...d, 
                        lestado: (d.estado === 1 ? 'Alta':(d.estado === 0 ? 'Baja':'Eliminado')),
                        actions: [
                            { key: 'edit', label: 'Editar', link: `/dnmaster/settings/responsables/${d.id}` },
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

export default useResponsableLead;