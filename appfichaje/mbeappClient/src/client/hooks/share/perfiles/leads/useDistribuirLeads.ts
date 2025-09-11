import { ALERT_MSG_MOVER_LEADS, DN_GET_TYPE_INTERESA_PATH, DN_GET_TYPE_RESPONSABLE_PATH, DN_MOVER_LEADS_PATH, DN_NRO_LEAD_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import InteresaLeadServiceInstance from '@/client/services/InteresaLeadService';
import DataServiceInstance from '@/client/services/DataService';
import { IData } from '@/client/models/IData'
import { handleCancel } from '@/client/helpers/Util'

type filterLead = { 
                    ns_start: string, 
                    ns_end: string, 
                    idresponsable_source: number,
                    idresponsable_target: number, 
                    tipo_lead: string, 
                    total_leads: number,
                    nro_datos_mover: number,
                    idtipointeres: number,
                    tipo: string
                 }

const useDistribuirLeads = (pathGoToBack: string) => {
    const router = useRouter()

    // const [listData, setListData] = useState<Array<ILead>>([])
    const [searching, setSearching] = useState(false)

    const [filterFields, setFilterFields] = useState<filterLead>({
                                            ns_start: UtilCustomInstance.getDateCurrent().fecha, 
                                            ns_end: UtilCustomInstance.getDateCurrent().fecha, 
                                            idresponsable_source: 0, 
                                            idresponsable_target: 0, 
                                            idtipointeres: 0, 
                                            tipo_lead: '', 
                                            total_leads: 0, 
                                            nro_datos_mover: 0, 
                                            tipo: 'leads'
                                        } as filterLead)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])
    const [listResponsableTarget, setListResponsableTarget] = useState<Array<{ key:string, name: string }>>([])
    const [listInteresa, setListInteresa] = useState<Array<{ key:string, name: string }>>([])

    const handleChange = (e: any) => {
        setFilterFields({
            ...filterFields,
            [e.target.name]: e.target.value
        })

        // Solo para tipo_lead
        if (e.target.name === 'tipo_lead') changeResponsable(e.target.value as string)
    }

    const changeResponsable = (value: string) => {
        if (!value || value === '' || value === '-2') {
            setListResponsable([])
            return
        }
        
        // Solicita los responsables y filtra
        let statusHttpResponsable = 200
        ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpResponsable = status
        }).then( dataR => {
            statusHttpResponsable === 200 && dataR && setListResponsable( dataR.filter(el => ['Todos', value].includes(el.tipo_lead)).map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }

    const handleSearch = () => {
        setSearching(true)
        setFilterFields(dataCurrent => ({...dataCurrent, total_leads: 0}))

        let statusHttpUS = 200
        let dataDB: IData = { total_data: 0 }
        DataServiceInstance.getTotalData(`${DN_NRO_LEAD_PATH}`, filterFields, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                dataDB = data
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            setTimeout(() => {
                setListResponsableTarget( [ ...listResponsable.filter(el => el.key !== filterFields.idresponsable_source.toString()) ] )
                setFilterFields(dataCurrent => ({...dataCurrent, total_leads: dataDB.total_data}))
                setSearching(false)
                if (dataDB.total_data === 0 ) alert ('No hay registros que mover!!')
            }, 1000);
        })
    }

    const handleMoveLeads = () => {
        if (!confirm(`${ALERT_MSG_MOVER_LEADS}`)) return
        if ( !(filterFields.nro_datos_mover > 0 && filterFields.nro_datos_mover <= filterFields.total_leads) ) {
            alert(`El nro de datos a mover debe ser mayor a 0 y menor o igual a ${filterFields.total_leads}`)
            return
        }

        if ( listResponsableTarget.findIndex(el => el.key === filterFields.idresponsable_target.toString()) === -1 ) {
            alert(`Seleccionar un responsable target`)
            return
        }

        let statusHttpUS = 200
        let dataDB: IData = { total_data: 0 }
        DataServiceInstance.moverLeads(`${DN_MOVER_LEADS_PATH}`, filterFields, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                dataDB = data
                alert(`Los leads han sido movidos exitosamente!!`)
            } else alert(`Error, intentelo más tarde!!`)
        }).catch(err => {
            console.log('err: ', err)
            alert(`Error, intentelo más tarde!!`)
        }).finally(()=>{
            setTimeout(() => {
                setFilterFields(dataCurrent => ({   
                    ns_start: UtilCustomInstance.getDateCurrent().fecha, 
                    ns_end: UtilCustomInstance.getDateCurrent().fecha, 
                    idresponsable_source: 0, 
                    idresponsable_target: 0, 
                    idtipointeres: 0, 
                    tipo_lead: '', 
                    total_leads: 0, 
                    nro_datos_mover: 0, 
                    tipo: 'leads'})
                )
                setListResponsable([])
            }, 0);
        })
    }

    const handleClear = () => {
        setFilterFields(dataCurrent => ({   
            ns_start: UtilCustomInstance.getDateCurrent().fecha, 
            ns_end: UtilCustomInstance.getDateCurrent().fecha, 
            idresponsable_source: 0, 
            idresponsable_target: 0, 
            idtipointeres: 0, 
            tipo_lead: '', 
            total_leads: 0, 
            nro_datos_mover: 0, 
            tipo: 'leads'})
        )
        setListResponsable([])
    }

    return {
        searching,
        filterFields,
        listResponsable,
        listResponsableTarget,
        listInteresa,
        handleChange,
        handleSearch,
        handleMoveLeads,
        handleClear,
        handleCancel: () => handleCancel(`${pathGoToBack}`, router),
    }
}

export default useDistribuirLeads;