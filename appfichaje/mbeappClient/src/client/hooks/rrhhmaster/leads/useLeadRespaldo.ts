import { DN_GET_TYPE_RESPONSABLE_PATH, DN_LEAD_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LeadServiceInstance from '@/client/services/LeadService';
import { ILead } from '@/client/models/ILead';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import FilterInstance from '@/client/helpers/Filter';

type filterLead = { ns_start: string, ns_end: string, idresponsable: number, tipo_lead: string, estatus: number, telefono: string }

const useLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterLead>({
                                ns_start:UtilCustomInstance.getDateCurrent().fecha, 
                                ns_end:UtilCustomInstance.getDateCurrent().fecha, 
                                idresponsable: 0, 
                                tipo_lead: 'Propietario', 
                                estatus: 1,
                                telefono: ''} as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])

    const headerTable = [
        // { key:'lead_id', label: 'Lead ID' },
        { key:'tipo_lead', label: 'Tipo Lead' },
        { key:'personahtml', label: 'Persona' },
        { key:'telefonos_str', label: 'Teléfonos' },
        // { key:'timestamp', label: 'F. Ult cambio' },
        { key:'last_step', label: 'Last Step' },
        { key:'next_step', label: 'Next Step' },
        // { key:'nro_llamadas', label: 'Nro Calls' },
        { key:'responsable', label: 'Perfil' },
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
        FilterInstance.setLead(filterFields)
    }

    useEffect(() => {
        if (flagFilter === 0) {
            setTimeout(() => setLoading(false), 500)
            return
        }
        setLoading(true)
        let statusHttpUS = 200
        let dataFilter = {  ns_start: filterFields.ns_start, 
                            ns_end: filterFields.ns_end,
                            idresponsable: filterFields.idresponsable,
                            tipo_lead: filterFields.tipo_lead,
                            estatus: filterFields.estatus,
                            telefono: filterFields.telefono.trim()
                        }
        LeadServiceInstance.getAllWithFilter(`${DN_LEAD_PATH}`, dataFilter, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _dList = [  ...data.map(d => (
                    { ...d,
                        personahtml: true,
                        actions: [
                            { key: 'edit', label: 'Editar', link: `/dnmaster/settings/leads/${d.id}` },
                        ]
                    }
                ))    
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
        // Get List: Responsables
        let statusHttpResponsable = 200
        ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpResponsable = status
        }).then( data => {
            statusHttpResponsable === 200 && data && setListResponsable( data.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
        setFilterFields(FilterInstance.getLead() as filterLead)
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
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

export default useLead;