import { ALERT_MSG_CONFIR_DELETE_DATA, DN_APARTMENT_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import PisoServiceInstance from '@/client/services/PisoService';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useApartment = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IPiso>>([])
    const [loading, setLoading] = useState(true)

    const headerTable = [
                            { key:'ref_lead', label: 'Ref. Lead' },
                            { key:'etiqueta', label: 'Piso' },
                            { key:'lugar', label: 'Lugar' },
                            { key:'codigo_postal', label: 'C.P.' },
                            { key:'direccion_full', label: 'Dirección' },
                            { key:'lestado', label: 'Estado' },
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
            router.reload()
        }
    }

    useEffect(() => {
        PisoServiceInstance.getAll().then( data => {
            if ( data ) {
                let _dList = [  ...data.map(d => ( { ...d, 
                                                    lestado: (d.estado === 1 ? 'Alta':'Baja'),
                                                    lugar: `${d.pais}, ${d.ciudad}`,
                                                    direccion_full: `${d.direccion}, Nro ${d.nro_edificio}, ${d.nro_piso}`,
                                                    actions: [
                                                        { key: 'edit', label: 'Editar', link: `/dn/apartments/${d.id}`},
                                                        // { key: 'delete', label: 'Eliminar', link: '/dn/apartments', btnAction: () => handleDelete(d.id || 0)}
                                                    ] 
                                                    } ))
                            ]
                setListData(_dList)
            }
        }).catch(err => {}).finally(()=>{
            setTimeout(() => setLoading(false), 500);
        })
    }, [])

    return {
        listData,
        headerTable,
        loading
    }
}

export default useApartment;