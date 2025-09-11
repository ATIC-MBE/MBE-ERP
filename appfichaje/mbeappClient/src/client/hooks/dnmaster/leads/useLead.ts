import { DN_GET_TYPE_RESPONSABLE_PATH, DN_LEAD_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LeadServiceInstance from '@/client/services/LeadService';
import { ILead } from '@/client/models/ILead';
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import FilterInstance from '@/client/helpers/Filter';

type filterLead = { ns_start: string, 
                    ns_end: string, 
                    idresponsable: number, 
                    tipo_lead: string, 
                    estatus: number, 
                    telefono: string,
                    persona: string,
                    search_all: string }

const useLead = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<ILead>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterLead>({
                                ns_start:UtilCustomInstance.actionAddAndDismissDays('', -30).fecha, 
                                ns_end:UtilCustomInstance.actionAddAndDismissDays('', 0).fecha, 
                                idresponsable: 0, 
                                tipo_lead: '', 
                                estatus: 1,
                                telefono: '',
                                persona: '',
                                search_all: ''} as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])

    const goEditData = (id: number) => {
        router.push(`/dnmaster/settings/leads/${id}`)
    }

    const headerTable = [
        // { key:'lead_id', label: 'Lead ID' },
        // { key:'tipo_lead', label: 'Tipo Lead' },
        { key:'personahtml', label: 'Persona' },
        { key:'telefonos_str', label: 'Teléfonos' },
        // { key:'timestamp', label: 'F. Ult cambio' },
        { key:'next_step', label: 'Next Step' },
        { key:'last_step', label: 'Last Step' },
        // { key:'nro_llamadas', label: 'Nro Calls' },
        { key:'responsable', label: 'Perfil' },
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
                            telefono: filterFields.telefono.trim(),
                            persona: filterFields.persona.trim(),
                            search_all: filterFields.search_all.trim()
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
            let idUserLogin = parseInt( localStorage.getItem('idlogin') || '0') || 0
            let _lTipoLeadFilter = (data && data.filter(el => el.idusuario_resp == idUserLogin ).map(el => ({ key: el.tipo_lead, name: `${el.tipo_lead}`})).sort((a, b) => a.key.localeCompare(b.key))) || []
            let _lResponsableFilter = (data && data.filter(_el => _el.tipo_lead.includes(_lTipoLeadFilter.map(el => el.key).join('|').trim() || '$_$') ) ) || []

            // if ( _lTipoLeadFilter.length !== 0 && _lTipoLeadFilter[0] && _lTipoLeadFilter[0].key === 'Todos' ) _lResponsableFilter = data || []

            // console.log(_lResponsableFilter)

            const _dataF = FilterInstance.getLead() as filterLead
            FilterInstance.setLead({ ..._dataF })

            // if ( _lTipoLeadFilter.length === 0  ) FilterInstance.setLead({ ...FilterInstance.getLead(), tipo_lead: 'Na' })
            // else if ( _lTipoLeadFilter.length !== 0 && (_dataF.tipo_lead === '' || _dataF.tipo_lead === 'Na' || _dataF.tipo_lead !== _lTipoLeadFilter[0].key)  ) FilterInstance.setLead({ ...FilterInstance.getLead(), tipo_lead: _lTipoLeadFilter[0].key })

            if ( _lResponsableFilter.length === 0  ) FilterInstance.setLead({ ...FilterInstance.getLead(), idresponsable: 0 })

            statusHttpResponsable === 200 && 
            data && 
            _lTipoLeadFilter.length !== 0 &&
            // setListResponsable( data.filter(_el => _el.codigo === 'LIBRE' || _el.tipo_lead.includes(_lTipoLeadFilter.map(el => el.key).join('|').trim() || '$_$') ).map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            
            // (
            //     (_lTipoLeadFilter.length !== 0 && _lTipoLeadFilter[0] && _lTipoLeadFilter[0].key === 'Todos') ?
            //     setListResponsable( data.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            //     :
            //     setListResponsable( data.filter(_el => _el.tipo_lead === 'Todos' || _el.tipo_lead.includes(_lTipoLeadFilter.map(el => el.key).join('|').trim() || '$_$') ).map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            // )
            setListResponsable( data.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )

            setFilterFields(FilterInstance.getLead() as filterLead)
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
        listResponsable,
        handleChange,
        handleSearch,
        goEditData
    }
}

export default useLead;