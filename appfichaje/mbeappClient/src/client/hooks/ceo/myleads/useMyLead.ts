import { DN_GET_TYPE_RESPONSABLE_PATH, DN_MY_LEADS_PATH } from '@/client/helpers/constants';
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LeadServiceInstance from '@/client/services/LeadService';
import { ILead } from '@/client/models/ILead';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import UserContext from '@/client/context/UserContext';
import { IResponsableLead } from '@/client/models/IResponsableLead';
import FilterInstance from '@/client/helpers/Filter';

type filterLead = { ns_start: string, ns_end: string, idresponsable: number, tipo_lead: string, telefono: string }

const useMyLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(false)

    const { userData } = useContext(UserContext)

    const [filterFields, setFilterFields] = useState<filterLead>({
                                            ns_start:UtilCustomInstance.getDateCurrent().fecha, 
                                            ns_end:UtilCustomInstance.getDateCurrent().fecha,
                                            idresponsable: 0, 
                                            tipo_lead: 'Propietario',
                                            telefono: ''} as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])

    const headerTable = [
        // { key:'id', label: 'ID' },
        // { key:'lead_id', label: 'Lead ID' },
        { key:'tipo_lead', label: 'Tipo Lead' },
        { key:'personahtml', label: 'Persona' },
        // { key:'timestamp', label: 'F. Ult cambio' },
        { key:'telefonos_str', label: 'Teléfonos' },
        { key:'last_step', label: 'Last Step' },
        { key:'next_step', label: 'Next Step' },
        // { key:'nro_llamadas', label: 'Nro Calls' },
        { key:'responsable', label: 'Responsable' },
        { key:'actions', label: 'Acciones' }
    ]

    const handleChange = (e: any) => {
        setFilterFields({
            ...filterFields,
            [e.target.name]: e.target.value
        })
    }

    const handleSearch = () => {
        setLoading(true)
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        FilterInstance.setMyLead(filterFields)
    }

    useEffect(() => {
        if (filterFields.idresponsable === 0) {
            setTimeout(() => setLoading(false), 500)
            return
        }
        setLoading(true)
        
        let statusHttpUS = 200
        let dataFilter = {  
            ns_start: filterFields.ns_start, 
            ns_end: filterFields.ns_end,
            idresponsable: filterFields.idresponsable,
            tipo_lead: filterFields.tipo_lead,
            telefono: filterFields.telefono.trim()
        }

        LeadServiceInstance.getAllWithFilter(`${DN_MY_LEADS_PATH}`, dataFilter, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _dList = [  ...data.map(d => ( { ...d, 
                        // lestado: (d.estado === 1 ? 'Alta':(d.estado === 0 ? 'Baja':'Eliminado')),
                        personahtml: true,
                        actions: [
                            { key: 'edit', label: 'Procesar', link: `/ceo/myleads/${d.id}` },
                        ]
                    } ))    
                ]
                setListData(_dList)
            } else {
                setListData([])
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => setLoading(false), 500);
        })
    }, [flagFilter])

    useEffect(() => {
        const idUserLogin = userData().id
        let _lResonsables: Array<IResponsableLead> = []

        // Get List: Responsables
        let statusHttpResponsable = 200
        ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpResponsable = status
        }).then( data => {
            if (statusHttpResponsable === 200 && data) {
                _lResonsables = data.filter(el => ('Todos' === el.tipo_lead && 'LIBRE' === el.codigo) || el.idusuario_resp == idUserLogin )
                setListResponsable( _lResonsables.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            if ( _lResonsables.length !== 0  ) {
                let _index = _lResonsables.findIndex(el => el.idusuario_resp == idUserLogin)
                // setFilterFields(data => ({...data, idresponsable: _lResonsables[_index].id || 0 }))
                const _dataF = FilterInstance.getMyLead() as filterLead
                const _na = (_dataF.idresponsable === 0) ? 
                            FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), idresponsable: _lResonsables[_index].id || 0 })
                            :
                            FilterInstance.setMyLead({...FilterInstance.getMyLead()})
                setFilterFields(FilterInstance.getMyLead() as filterLead)

                setFlagFilter(data => data + 1)
            }
        })
    }, [])

    return {
        listData,
        headerTable,
        loading,
        filterFields,
        listResponsable,
        handleChange,
        handleSearch
    }
}

export default useMyLead;