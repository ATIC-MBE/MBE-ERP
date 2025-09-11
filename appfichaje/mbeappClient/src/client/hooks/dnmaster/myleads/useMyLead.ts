import { DN_GET_TYPE_RESPONSABLE_PATH, DN_MY_LEADS_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LeadServiceInstance from '@/client/services/LeadService';
import { ILead } from '@/client/models/ILead';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import FilterInstance from '@/client/helpers/Filter';

type filterLead = { ns_start: string, 
                    ns_end: string, 
                    idresponsable: number, 
                    tipo_lead: string, 
                    telefono: string, 
                    persona: string,
                    search_all: string }

const useMyLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterLead>({
                            ns_start:UtilCustomInstance.actionAddAndDismissDays('', 30).fecha, 
                            ns_end:UtilCustomInstance.actionAddAndDismissDays('', 0).fecha, 
                            tipo_lead: '',
                            telefono: '',
                            persona: '',
                            search_all: ''} as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    // const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])
    // const [listTypeLead, setListTypeLead] = useState<Array<{ key:string, name: string }>>([])

    const goEditData = (id: number) => {
        router.push(`/dnmaster/myleads/${id}`)
    }

    const headerTable = [
        // { key:'lead_id', label: 'Lead ID' },
        // { key:'tipo_lead', label: 'Tipo Lead' },
        { key:'personahtml', label: 'Persona' },
        // { key:'timestamp', label: 'F. Ult cambio' },
        { key:'telefonos_str', label: 'Teléfonos' },
        { key:'next_step', label: 'Next Step' },
        { key:'last_step', label: 'Last Step' },
        // { key:'nro_llamadas', label: 'Nro Calls' },
        // { key:'responsable', label: 'Responsable' },
        // { key:'actions', label: 'Acciones' }
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
            telefono: filterFields.telefono.trim(),
            persona: filterFields.persona.trim(),
            search_all: filterFields.search_all.trim()
        }

        if (flagFilter === 0) {
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
                        // lestado: (d.estado === 1 ? 'Alta':(d.estado === 0 ? 'Baja':'Eliminado')),
                        personahtml: true,
                        actions: [
                            { key: 'edit', label: 'Procesar', link: `/dnmaster/myleads/${d.id}` },
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
            let _lResponsableFilter = (data && data.filter(el => el.idusuario_resp == idUserLogin )) || []
            
            const _dataF = FilterInstance.getMyLead() as filterLead
            FilterInstance.setMyLead({ ..._dataF })

            // console.log(_lResponsableFilter)

            if ( _lTipoLeadFilter.length === 0  ) FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), tipo_lead: 'Na' })
            else if ( _lTipoLeadFilter.length !== 0 && (_dataF.tipo_lead === '' || _dataF.tipo_lead === 'Na' || _dataF.tipo_lead !== _lTipoLeadFilter[0].key)  ) FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), tipo_lead: _lTipoLeadFilter[0].key })
            
            if ( _lResponsableFilter.length === 0 ) FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), idresponsable: 0 })
            else if ( _lResponsableFilter.length !== 0 && ( _dataF.idresponsable === 0 || _dataF.idresponsable !== _lResponsableFilter[0].id ) ) FilterInstance.setMyLead({ ...FilterInstance.getMyLead(), idresponsable: _lResponsableFilter[0].id })

            setFilterFields(FilterInstance.getMyLead() as filterLead)
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [])

    return {
        listData,
        headerTable,
        loading,
        filterFields,
        handleChange,
        handleSearch,
        goEditData
    }
}

export default useMyLead;