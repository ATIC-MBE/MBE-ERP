import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import FilterInstance from '@/client/helpers/Filter';
import { IData } from '@/client/models/IData';

export type filterSearchAll = {
    ciudad: string;
    estado: string;
    search_all: string,
    ds_nro_dormitorios: number,
    cp_ocupacion_maxima: number,
    bs_nro_banios: number,
    total_start: number,
    total_end: number,
    limit: number,
    offset: number
}

const limit = 50

const usePiso = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IPiso>>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)
    const [pageCurrent, setPageCurrent] = useState<number>(0)

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
     // Añadir esta línea
        estado: '',
        search_all: '',
        ds_nro_dormitorios: -1,
        cp_ocupacion_maxima: -1,
        bs_nro_banios: -1,
        total_start: -1,
        total_end: -1,
        limit: 10,
        offset: 0
    } as filterSearchAll)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const handlerOnPage = (e: any) => {
        setPageCurrent(e.selected)
        setFilterFields((current) => ({ 
            ...current, 
            offset: (e.selected * limit) % total 
        }))
        setFlagFilter((flagFilter) => flagFilter + 1)
        setLoading(true)
    }

    useEffect(() => {
        if (flagFilter === 0) return

        let statusHttpUS = 200
        let dataFilter = {
            search_all: filterFields.search_all.trim(),
            ds_nro_dormitorios: filterFields.ds_nro_dormitorios,
            cp_ocupacion_maxima: filterFields.cp_ocupacion_maxima,
            bs_nro_banios: filterFields.bs_nro_banios,
            total_start: filterFields.total_start,
            total_end: filterFields.total_end,
            tipo: 'pisos_colaborador',
            ciudad: filterFields.ciudad?.trim() || ''   // <-- agregado ciudad
        }

        let _total = 0
        FetchApiServiceInstance.getSingleDataWithFilter('/api/share/data/totaldata/', { ...dataFilter }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then(data => {
            if (statusHttpUS === 200 && data) {
                let _data = data as IData
                setTotal(_data.total_data)
                _total = _data.total_data
                if (_total === 0) return

                let _dataFilter = {
                    search_all: filterFields.search_all.trim(),
                    ds_nro_dormitorios: filterFields.ds_nro_dormitorios,
                    cp_ocupacion_maxima: filterFields.cp_ocupacion_maxima,
                    bs_nro_banios: filterFields.bs_nro_banios,
                    total_start: filterFields.total_start,
                    total_end: filterFields.total_end,
                    limit: filterFields.limit,
                    offset: filterFields.offset,
                    ciudad: filterFields.ciudad?.trim() || ''
                }

                // Consultar datos por paginación - también corregir esta línea
                FetchApiServiceInstance.getAllWithFilter('/api/colaborador/p/apartments/', { ..._dataFilter }, (err) => {
                    const { status } = err.response!
                    statusHttpUS = status
                }).then(data => {
                    if (statusHttpUS === 200 && data) {
                        let _data = (data as Array<IPiso>)
                        setListData([..._data])
                    }
                }).catch(err => {
                    console.log('err: ', err)
                }).finally(() => {
                    setLoading(false)
                })
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(() => {
            if (_total === 0) {
                setLoading(false)
                setListData([])
            }
        })

    }, [flagFilter])

    const changeSearch = (e: any) => {
        let _value = e.target.value
        if (['total', 'bs_nro_banios', 'ds_nro_camas', 'ds_nro_dormitorios', 'cp_ocupacion_maxima', 'total_start', 'total_end'].includes(e.target.name as string)) {
            _value = parseInt(isNaN(e.target.value) ? '-1' : e.target.value) < 0 ? -1 : e.target.value
        }

        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setFlagFilter((flagFilter) => flagFilter + 1)
            setFilterFields((current) => ({ ...current, offset: 0 }))
            setPageCurrent(0)
            FilterInstance.setPisoColaborador(filterFields)
            setLoading(true)
        }
    }

    const handleActionSearch = () => {
        setFlagFilter((flagFilter) => flagFilter + 1)
        setFilterFields((current) => ({ ...current, offset: 0 }))
        setPageCurrent(0)
        FilterInstance.setPisoColaborador(filterFields)
        setLoading(true)
    }

    useEffect(() => {
        setFilterFields(FilterInstance.getPisoColaborador() as filterSearchAll)
        setFlagFilter((flagFilter) => flagFilter + 1)
    }, [])

    /**
     * Capturar la position del mouse para reubicar
     */
    useEffect(() => {
        const handleMouseMove = (event: any) => {
            console.log(`x: ${event.clientX}, y: ${event.clientY}`) // Añadir las comillas invertidas
        }

        // window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            )
        }
    }, [])

    return {
        listData,
        loading,
        filterFields,
        total,
        pageCurrent,
        limit,
        changeSearch,
        handleKeyDown,
        handlerOnPage,
        handleActionSearch
    }
}

export default usePiso;