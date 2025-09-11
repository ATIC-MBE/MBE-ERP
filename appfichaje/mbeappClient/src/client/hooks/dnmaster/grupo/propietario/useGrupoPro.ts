import { ALERT_MSG_CONFIR_DELETE_DATA, DN_APARTMENT_PATH } from '@/client/helpers/constants';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { user } from '@/client/types/globalTypes';
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import FilterInstance from '@/client/helpers/Filter';
import { IGrupoPropietario} from '@/client/models/IGrupoPropietario';
type filterPropietario = { 
    search_all: string
}

// Modificar para propietarios
const useGrupoPro = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IGrupoPropietario>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterPropietario>({
        search_all:''} as filterPropietario)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const headerTable = [
        { key:'nombre', label: 'Nombre' },
        { key:'whatsapp', label: 'Whatsapp' },
        { key:'next_step', label: 'Next step' },
        { key:'nro_llamadas', label: 'Nro Llamadas' }
    ]

    const goEditData = (id: number) => {
        router.push(`/dnmaster/grupo/${id}/propietarios/suceso`)
    }

    const handleChange = (e: any) => {
        setFilterFields({
            ...filterFields,
            [e.target.name]: e.target.value
        })
    }

    const handleSearch = () => {
        setLoading(true)
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        // Agrega tus propios campos para los filtros
        FilterInstance.setPropietario(filterFields)
    }

    useEffect(() => {
        if (flagFilter === 0) {
            setTimeout(() => setLoading(false), 500)
            return
        }
        setLoading(true)
        let statusHttpUS = 200
        let dataFilter = {  search_all: filterFields.search_all.trim() }
        // let statusHttpUS = 200
        FetchApiServiceInstance.getAllWithFilter('/api/dn/grupo/propietarios', { ...dataFilter }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<IGrupoPropietario>)
                setListData([ ..._data ])
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
        setFilterFields(FilterInstance.getPropietario() as filterPropietario)
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
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

export default useGrupoPro;