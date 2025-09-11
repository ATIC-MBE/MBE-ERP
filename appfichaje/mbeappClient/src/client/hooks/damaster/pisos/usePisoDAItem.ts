import { RMG_INFOCOMERCIAL_PATH, SHARE_PLATAFORMA_PATH } from '@/client/helpers/constants';
import { IPiso } from '@/client/models/IPiso';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IInfoPisoComercial } from '@/client/models/IInfoPisoComercial';
import { IVariablesReserva } from '@/client/models/IVariablesReserva';

const usePisoDAItem = (  item: IPiso, 
                                setStatusTooltip: (value: boolean | ((prevVar: boolean) => boolean)) => void, 
                                setIdTooltipSelected: (value: string | ((prevVar: string) => string)) => void) => {
    const router = useRouter()
    const [ itemContent, setItemContent ] = useState<IPiso>(item)

    /**
     * Acualiza la información de las tarjetas, cuando se filtran
     */
    useEffect(() => {
        setItemContent( { ...item } )
    }, [item])

    // return (error.data?.length === 0) ? this.dataAcces.insert(data) : new Promise<IErrorResponse>((resolve, reject) => { resolve(error) })
    const fetchService = async ( dataFetch: any ): Promise<number> => {
        let statusHttps = 200
        await (
            itemContent.id ? 
            FetchApiServiceInstance.update(`/api/rmg/infocomercial`, { ...dataFetch }, (err) => {
                const { status, data } = err.response!
                statusHttps = status
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    // let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label: string}> }
                    // if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => `${el.label} -> ${el.msg}`)))
                    // else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    // setErrorValidate((previousValue) => !previousValue)
                    // scroll.scrollToTop()
                }
            })
            :
            FetchApiServiceInstance.create(`/api/rmg/infocomercial`, { ...dataFetch }, (err) => {
                const { status, data } = err.response!
                statusHttps = status
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    // let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label: string}> }
                    // if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => `${el.label} -> ${el.msg}`)))
                    // else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    // setErrorValidate((previousValue) => !previousValue)
                    // scroll.scrollToTop()
                }
            }).then(data => {
                const _data: IInfoPisoComercial = data as IInfoPisoComercial
                // Actualizamos id de la info-comercial
                // Pendiente actualización adicional de los campos de las tarjetas
                setItemContent(current => {
                    current.id = _data.id
                    return { ...current }
                })
            })
        )

        return new Promise<number>((resolve, reject) => { resolve(statusHttps) })
    }

    /**
     * Guarda solo las plataformas
     * @param id 
     */
    const saveLinkPlataforma = async (id: number, e: any) => {
        // let _plataformaSelIndex = itemContent.plataformas.findIndex(el => el.id === id)
        // let _dataPlataformaSelected = itemContent.plataformas[_plataformaSelIndex]
        // _dataPlataformaSelected.link = _dataPlataformaSelected.link_tooltip || ''

        // let statusHttps = await fetchService({ ...itemContent, plataformas: [_dataPlataformaSelected], type_saved: 'plataforma' })

        // if ( statusHttps === 200 ) {
        //     setStatusTooltip( current => !current )
        //     setItemContent(current => {
        //         current.plataformas[_plataformaSelIndex] = { ..._dataPlataformaSelected }
        //         return { ...current }
        //     })
        // }

        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    /**
     * Guarda el estado general
     */
    const saveEstadoGeneral = async (e: any) => {
        let statusHttps = await fetchService({ ...itemContent, plataformas: [], type_saved: 'info-comercial-estado_general' })
        
        if ( statusHttps === 200 ) {
            setStatusTooltip( current => !current )
            setItemContent(current => {
                let _lblStatus = current.estado_general === 1 ? 'Activo' : ( current.estado_general === 2 ? 'Stop Sell': '---' )
                return { ...current, lestado: _lblStatus }
            })
        }
        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    /**
     * Obtiene el lbl de estado de la reserva, para indiciar si el valor del precio de aquiler favorece a
     * la empresa, se lo compara con el precio limite propuesto por el propietario
     * @param current 
     * @returns 
     */
    const getEstadoAlquiler = (current: IInfoPisoComercial): string => {
        let [ _palquiler, _pmuebles, _plimite ] = 
                                                [   (current.precio_alquiler_tooltip || 0.0)*1.0, 
                                                    (current.precio_muebles_tooltip || 0.0)*1.0,
                                                    (current.precio_limite_tooltip || 0.0)*1.0
                                                ]
        let _totalMCH = ( _palquiler + _pmuebles ) * 0.85
        return ( _totalMCH === _plimite ) ? 'NA' : ( ( _totalMCH < _plimite ) ? 'NO' : 'SI' )
    }

    /**
     * Guarda el precio alquiler
     */
    const savePrecioAlquiler = async (e: any) => {
        // let statusHttps = await fetchService({ ...itemContent, plataformas: [], variablesreserva: itemContent.variablesreserva, type_saved: 'info-comercial-precio-alquiler' })
        
        // if ( statusHttps === 200 ) {
        //     setStatusTooltip( current => !current )
        //     setItemContent(current => {
        //         return  {   ...current,
        //             estado_alquiler_rentable: getEstadoAlquiler(current),
        //             total_tootip: (current.precio_alquiler_tooltip || 0.0)*1.0 + (current.precio_muebles_tooltip || 0.0)*1.0,
        //             vr_variablereserva: {   ...current.vr_variablereserva, 
        //                                     precio_alquiler: current.variablesreserva.at(0)?.precio_alquiler || 0.00
        //                                 } as IVariablesReserva
        //         }
        //     })
        // }

        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    /**
     * Guarda el precio del mueble
     */
    const savePrecioMueble = async (e: any) => {
        // let statusHttps = await fetchService({ ...itemContent, plataformas: [], variablesreserva: itemContent.variablesreserva, type_saved: 'info-comercial-precio-mueble' })
        
        // if ( statusHttps === 200 ) {
        //     setStatusTooltip( current => !current )
        //     setItemContent(current => {
        //         return  {   ...current,
        //             estado_alquiler_rentable: getEstadoAlquiler(current),
        //             total_tootip: (current.precio_alquiler_tooltip || 0.00)*1.0 + (current.precio_muebles_tooltip || 0.00)*1.0,
        //             vr_variablereserva: {   ...current.vr_variablereserva,
        //                                     precio_muebles: current.variablesreserva.at(0)?.precio_muebles || 0.00
        //                                 } as IVariablesReserva
        //         }
        //     })
        // }

        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    /**
     * Guarda el precio limite
     */
    const savePrecioLimite = async (e: any) => {
        // let statusHttps = await fetchService({ ...itemContent, plataformas: [], variablesreserva: itemContent.variablesreserva, type_saved: 'info-comercial-precio-limite' })
        
        // if ( statusHttps === 200 ) {
        //     setStatusTooltip( current => !current )
        //     setItemContent(current => {
        //         return  {   ...current,
        //             estado_alquiler_rentable: getEstadoAlquiler(current),
        //             vr_variablereserva: {   ...current.vr_variablereserva,
        //                                     precio_limite: current.variablesreserva.at(0)?.precio_limite || 0.00
        //                                 } as IVariablesReserva
        //         }
        //     })
        // }

        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    const closeTooltip = (e: any) => {
        setStatusTooltip( current => !current )
        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    } 

    /**
     * Evento al abrir el tooltip, iniciamos valores correspondientes
     * @param idTootip 
     */
    const changeStatusTootip = (idTootip: string) => {
        setStatusTooltip( current => !current )
        setIdTooltipSelected(idTootip)

        // Captura al elemento por ID
        let _elementHtml: HTMLDivElement | null = document.querySelector(`#${idTootip}-tooltip`)
        // let _elementHtml: HTMLHeadingElement | null = document.querySelector(`#${idTootip}`)
        
        let _elementHtmlChildren: HTMLDivElement | null = null
        // let _elementHtmlChildren: HTMLDivElement | null = _elementHtml ? _elementHtml.querySelector('.content-tooltip') : null
        // console.log('tmp: ', _elementHtmlChildren)
        if ( _elementHtml ) {}

        _elementHtml && console.log(_elementHtml)
        _elementHtmlChildren && console.log(_elementHtmlChildren)

        _elementHtml && console.log('x -> ', _elementHtml.offsetLeft)
        _elementHtml && console.log('y -> ', _elementHtml.offsetTop)
        // _elementHtml && console.log('parent -> ', _elementHtml.offsetParent.)
        // _elementHtml && (_elementHtml.offsetParent)
        // if (_elementHtml) {
        //     _elementHtml.style.position = 'relative'
        //     _elementHtml.style.marginLeft = '-100px'
        // }

        // // Formato IDTOOLTIP [Plataforma]: ${position}-ptf-${item.idpiso}-${el.id} -> Última position es id plataforma
        // const _lIdTooltip = idTootip.split('-')
        // const _isNumber = /^\d{1,}$/.test( _lIdTooltip[_lIdTooltip.length - 1] )
        // let _plataformaSelIndex = item.plataformas.findIndex(el => el.id.toString() === _lIdTooltip[_lIdTooltip.length - 1])

        // // Actualizamos datos actuales [plataforma-link, precio_alquiler, precio_muebles, precio_limite], en caso de que no se haya presionado guardar
        // setItemContent(current => {
        //     if ( _isNumber && _plataformaSelIndex !== -1 ) current.plataformas[_plataformaSelIndex] = { ...current.plataformas[_plataformaSelIndex], link_tooltip: current.plataformas[_plataformaSelIndex].link }
            
        //     return  {   ...current,
        //         precio_alquiler_tooltip: current.vr_variablereserva?.precio_alquiler || 0.00,
        //         precio_muebles_tooltip: current.vr_variablereserva?.precio_muebles || 0.00,
        //         precio_limite_tooltip: current.vr_variablereserva?.precio_limite || 0.00
        //     }
        // })
    }

    const handleChangePlataforma = (e: any, idPlataforma: number) => {
        // let _plataformaSelIndex = item.plataformas.findIndex(el => el.id === idPlataforma)
        // _plataformaSelIndex !== -1 && setItemContent(current => {
        //     current.plataformas[_plataformaSelIndex] = { ...current.plataformas[_plataformaSelIndex], link_tooltip: e.target.value }
        //     return { ...current }
        // })
    }

    const handleChange = (e: any) => {
        if ( e.target.name === 'estado_general' ) {
            setItemContent(current => {
                return { ...current, [e.target.name]: parseInt(e.target.value as string) }
            })
        } else if (e.target.name === 'precio_alquiler') {
            // setItemContent(current => {
            //     return  {   ...current,
            //                 precio_alquiler_tooltip: e.target.value,
            //                 variablesreserva: [
            //                         { ...current.vr_variablereserva, [e.target.name]: parseFloat(e.target.value as string) } as IVariablesReserva
            //                 ]
            //             }
            // })
        } else if (e.target.name === 'precio_muebles') {
            // setItemContent(current => {
            //     return  {   ...current,
            //                 precio_muebles_tooltip: e.target.value,
            //                 variablesreserva: [
            //                         { ...current.vr_variablereserva, [e.target.name]: parseFloat(e.target.value as string) } as IVariablesReserva
            //                 ]
            //             }
            // })
        } else if (e.target.name === 'precio_limite') {
            // setItemContent(current => {
            //     return  {   ...current,
            //                 precio_limite_tooltip: e.target.value,
            //                 variablesreserva: [
            //                         { ...current.vr_variablereserva, [e.target.name]: parseFloat(e.target.value as string) } as IVariablesReserva
            //                 ]
            //             }
            // })
        } else {
            setItemContent(current => {
                return {    ...current, 
                            [e.target.name]: e.target.value 
                        }
            })
        }   
    }

    const goEditData = (id: number) => {
        router.push(`/da/apartments/${id}`)
    }

    const eventStop = (e: any) => {
        e.stopPropagation();
    }

    return {
        itemContent,
        saveLinkPlataforma,
        handleChangePlataforma,
        changeStatusTootip,
        closeTooltip,
        handleChange,
        saveEstadoGeneral,
        savePrecioAlquiler,
        savePrecioMueble,
        savePrecioLimite,
        goEditData,
        eventStop
    }
}

export default usePisoDAItem;