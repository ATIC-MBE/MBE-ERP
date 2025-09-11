import { DN_GET_TYPE_RESPONSABLE_PATH, DN_MY_LEADS_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LeadServiceInstance from '@/client/services/LeadService';
import { ILead } from '@/client/models/ILead';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import FilterInstance from '@/client/helpers/Filter';

type filterLead = { ns_start: string, ns_end: string, idresponsable: number, tipo_lead: string, telefono: string }

const useMyLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterLead>({
                            ns_start:UtilCustomInstance.getDateCurrent().fecha, 
                            ns_end:UtilCustomInstance.getDateCurrent().fecha, 
                            tipo_lead: '',
                            telefono: ''} as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])
    const [listTypeLead, setListTypeLead] = useState<Array<{ key:string, name: string }>>([])

    const headerTable = [
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
        let statusHttpUS = 200
        let dataFilter = {  
            ns_start: filterFields.ns_start, 
            ns_end: filterFields.ns_end,
            idresponsable: filterFields.idresponsable,
            tipo_lead: filterFields.tipo_lead,
            telefono: filterFields.telefono.trim()
        }

        if (filterFields.tipo_lead === '') {
            setTimeout(() => setLoading(false), 500)
            return
        }
        setLoading(true)

        LeadServiceInstance.getAllWithFilter(`${DN_MY_LEADS_PATH}`, dataFilter, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _dList = [  ...data.map(d => ( { ...d,
                        personahtml: true,
                        actions: [
                            { key: 'edit', label: 'Procesar', link: `/rrhhmaster/myleads/${d.id}` },
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
        // Get List: Responsables
        let statusHttpResponsable = 200
        ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpResponsable = status
        }).then( data => {
            let idUserLogin = parseInt( localStorage.getItem('idlogin') || '0') || 0
            let _lTipoLeadFilter = (data && data.filter(el => el.idusuario_resp == idUserLogin ).map(el => ({ key: el.tipo_lead, name: `${el.tipo_lead}`})).sort((a, b) => a.key.localeCompare(b.key))) || []
            statusHttpResponsable === 200 && data && setListResponsable( data.filter(el => ('Todos' === el.tipo_lead && 'LIBRE' === el.codigo) || el.idusuario_resp == idUserLogin ).map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            statusHttpResponsable === 200 && data && setListTypeLead( data.filter(el => el.idusuario_resp == idUserLogin ).map(el => ({ key: el.tipo_lead, name: `${el.tipo_lead}`})).sort((a, b) => a.key.localeCompare(b.key)) )
            if (_lTipoLeadFilter.length !== 0 ) {
                const _dataF = FilterInstance.getMyLead() as filterLead
                const _na = (_dataF.tipo_lead === '') ? 
                            FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), tipo_lead: _lTipoLeadFilter[0].key })
                            :
                            FilterInstance.setMyLead({...FilterInstance.getMyLead()})
                setFilterFields(FilterInstance.getMyLead() as filterLead)
                setFlagFilter((flagFilter) => { return flagFilter + 1 })
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [])

    return {
        listData,
        headerTable,
        loading,
        filterFields,
        listResponsable,
        listTypeLead,
        handleChange,
        handleSearch
    }
}

export default useMyLead;