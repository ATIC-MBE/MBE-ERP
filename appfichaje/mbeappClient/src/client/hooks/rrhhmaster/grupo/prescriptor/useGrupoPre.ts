import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import FilterInstance from '@/client/helpers/Filter';
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor';

type filterPrescriptor = {
    search_all: string 
}

const useGrupoPre = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IGrupoPrescriptor>>([])
    const [loading, setLoading] = useState(true)

    const [filterFields, setFilterFields] = useState<filterPrescriptor>({
        search_all: ''} as filterPrescriptor)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const headerTable = [
        { key:'nombre', label: 'Grupo' },
        { key:'whatsapp', label: 'Whatsapp' },
        { key:'next_step', label: 'Next step' },
        { key:'nro_visitas', label: '# Visitas' },
        { key:'nro_reservas', label: '# Reservas' },
        { key:'valor_propietario', label: 'Propietarios' }
    ]

    const goEditData = (id: number) => {
        router.push(`/rrhhmaster/grupo/${id}/prescriptores/suceso`)
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
        FilterInstance.setPrescriptor(filterFields)
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
        FetchApiServiceInstance.getAllWithFilter('/api/dn/grupo/prescriptores', { ...dataFilter }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = (data as Array<IGrupoPrescriptor>)
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
        setFilterFields(FilterInstance.getPrescriptor() as filterPrescriptor)
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

export default useGrupoPre;