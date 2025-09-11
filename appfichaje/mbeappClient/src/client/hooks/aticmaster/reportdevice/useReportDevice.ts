import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import FilterInstance from '@/client/helpers/Filter'
import { IData } from '@/client/models/IData'
import { IDeviceReport } from '@/client/models/IDeviceReport'
import axios, { AxiosError } from 'axios';

type filterSearchAll = {
    search_all: string,
    limit: number,
    offset: number
}

const limit = 50

const useReportDevice = () => {
    const router = useRouter()

    const [listData, setListData] = useState<Array<IDeviceReport>>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)
    const [pageCurrent, setPageCurrent] = useState<number>(0)

    const [loadingScreen, setLoadingScreen] = useState<boolean|undefined>(undefined)

    const [filterFields, setFilterFields] = useState<filterSearchAll>({
        search_all: '',
        limit: limit,
        offset: 0
        } as filterSearchAll)
    const [flagFilter, setFlagFilter] = useState<number>(0)

    const [statData, setStatData] = useState<any>(null); // Estado para guardar la respuesta de estadísticas

    const handlerOnPage = (e: any) => {
        setPageCurrent(e.selected)
        setFilterFields( (current) => ({...current, offset: (e.selected * limit) % total}) )
        setFlagFilter( (flagFilter) => { return flagFilter + 1 } )
        setLoading(true)
    }

    /**
     * Metodo crea un nuevo reporte
     */
    

    const handlerReportNew = async () => {
        setLoadingScreen(true);
        let statusHttpUS = 409; // Inicia como 409 para entrar en el bucle
        const maxAttempts = 1000; // Número máximo de intentos
        let attempt = 0;

        while (statusHttpUS === 409 && attempt < maxAttempts) {
        try {
            attempt++;
            const response = await FetchApiServiceInstance.create(`/api/atic/devices/report/`, {});

            if (response) {
                statusHttpUS = 200; // Cambia el estado si la solicitud fue exitosa
                setFlagFilter((flagFilter) => flagFilter + 1); // Ejecuta acción en éxito
                break; // Si la solicitud es exitosa, salimos del bucle
            }

        } catch (err: unknown) {
            // Verificamos si el error es un error de Axios
            if (axios.isAxiosError(err) && err.response) {
                const { status } = err.response; // Accedemos de forma segura a status
                if (status === 409) {
                    console.log(`Attempt ${attempt}: Conflict detected. Retrying...`);
                    statusHttpUS = 409; // Mantén el 409 para seguir reintento
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 1 segundo antes de reintentar
                } else {
                    console.error('Other error occurred:', err);
                    break; // Rompe el bucle si no es 409
                }
            } else {
                // Si el error no es un error de Axios, lo manejamos aquí
                console.error('Unknown error:', err);
                break;
            }
        } finally {
            if (statusHttpUS !== 409 || attempt === maxAttempts) {
                setLoadingScreen(false); // Desactiva la pantalla de carga cuando se sale del bucle
            }
        }
    }

    if (attempt === maxAttempts && statusHttpUS === 409) {
        console.error("Max attempts reached. Request failed with status 409.");
    }
};


    /**
     * Metodo crea estadisticas del día
     */
    const handlerReportLeadNew = async () => {
        setLoadingScreen(true); // Activa la pantalla de carga
        let statusHttpUS = 200; // Estado inicial
        try {
            const response = await FetchApiServiceInstance.create(`/api/dn/estadisticas/estadistica/`, {}); // Llama al endpoint
            if (response) {
                setStatData(response); // Guarda la respuesta en el estado
                console.log('Estadísticas recibidas:', response); // Depuración: muestra la respuesta en consola
                setFlagFilter((flagFilter) => flagFilter + 1); // Actualiza el flag para recargar datos
            }
        } catch (err) {
            console.error('Error al obtener estadísticas:', err); // Manejo de errores
        } finally {
            setLoadingScreen(false); // Desactiva la pantalla de carga
        }
    }

    useEffect(() => {
        if (flagFilter === 0) return
        
        let statusHttpUS = 200
        let dataFilter = {
            search_all: filterFields.search_all.trim(),
            tipo: 'all_device_report'
        }

        let _total = 0
        FetchApiServiceInstance.getSingleDataWithFilter(`/api/share/data/totaldata/`, { ...dataFilter }, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = data as IData
                setTotal(_data.total_data)
                _total = _data.total_data
                if (_total === 0) return

                let _dataFilter = {
                    search_all: filterFields.search_all.trim(),
                    limit: filterFields.limit,
                    offset: filterFields.offset
                }
                
                // Consultar datos por paginación []
                // /api/atic/p/reportdevices
                FetchApiServiceInstance.getAllWithFilter(`/api/atic/p/reportdevices/`, { ..._dataFilter }, (err) => {
                    const { status } = err.response!
                    statusHttpUS = status
                }).then( data => {
                    if ( statusHttpUS === 200 && data ) {
                        let _data = (data as Array<IDeviceReport>)
                        setListData([ ..._data ])
                    }
                }).catch(err => {
                    console.log('err: ', err)
                }).finally(()=>{
                    setLoading(false)
                })
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            if ( _total === 0 ) {
                setLoading(false)
                setListData([])
            }
        })
    }, [flagFilter])

    const changeSearch = (e: any) => {
        let _value = e.target.value
        
        setFilterFields({
            ...filterFields,
            [e.target.name]: _value
        })
    }

    /**
     * Captura evento de enter de los inputs
     * @param e 
     */
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setFlagFilter((flagFilter) => { return flagFilter + 1 })
            setFilterFields((current) => ({...current, offset: 0}))
            setPageCurrent(0)
            FilterInstance.setControlLimpieza(filterFields)
            setLoading(true)
        }
    }

    const handleActionSearch = () => {
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
        setFilterFields((current) => ({...current, offset: 0}))
        setPageCurrent(0)
        FilterInstance.setControlLimpieza(filterFields)
        setLoading(true)
    }

    useEffect(() => {
        setFilterFields((current) => ({...current, ...FilterInstance.getControlLimpieza()}))
        setFlagFilter((flagFilter) => { return flagFilter + 1 })
    }, [])

    /**
     * Capturar la position del mouse para reubicar 
     */
    useEffect(() => {
        const handleMouseMove = (event:any) => {
        //   console.log(`x: ${event.clientX}, y: ${event.clientY}`)
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
        pageCurrent,
        listData,
        loading,
        filterFields,
        total,
        limit,
        flagFilter,
        loadingScreen,
        statData, // Incluye el estado de estadísticas
        changeSearch,
        handleKeyDown,
        handlerOnPage,
        handleActionSearch,
        handlerReportNew,
        handlerReportLeadNew
    }
}

export default useReportDevice
