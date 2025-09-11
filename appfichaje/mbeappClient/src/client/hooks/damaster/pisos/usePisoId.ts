import { IPiso } from '@/client/models/IPiso'
import PisoServiceInstance from '@/client/services/PisoService'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, DN_APARTMENT_PATH, SHARE_GET_PROPIETARIOS_PATH, DA_APARTMENT_PATH, ALERT_MSG_CONFIR_DELETE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { user } from '@/client/types/globalTypes'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import ValidationsInstance from '@/client/helpers/Validations'

// Constants
const dataControl = {
    pais: { label: 'Pais', required: true, isError: false, msgDefault: 'Campo requerido' },
    ciudad: { label: 'Ciudad', required: true, isError: false },
    codigo_postal: { label: 'Código Postal', required: true, isError: false },
    direccion: { label: 'Dirección', required: true, isError: false },
    nro_edificio: { label: 'Nro Edificio', required: true, isError: false },
    nro_piso: { label: 'Nro Piso', required: false, isError: false },
    id_dispositivo_ref: { label: 'Código', required: true, isError: false }
}

const usePisoId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)
    const [dataDB, setDataDB] = useState<IPiso>({
        id: 0,
        pais: '',
        ciudad: '',
        codigo_postal: '',
        direccion: '',
        nro_edificio: '',
        nro_piso: '',
        id_dispositivo_ref: '',
        ubicacion_mapa: '',
        observaciones: '',
        estado: 1,
        etiqueta: '',
        idpropietario: 0,
        propietarios: [],
        cp_ocupacion_maxima: undefined,
        cp_m2: undefined,
        ca_aire_acondicionado: undefined,
        ca_calefaccion: undefined,
        cp_ascensor: undefined,
        ca_discapacidad: undefined,
        ds_nro_dormitorios: undefined,
        ds_nro_camas: undefined,
        bs_nro_banios: undefined,
        bs_nro_aseos: undefined,
        ds_nro_sofacama: undefined,
        ds_descripcion_camas: '',
        bs_descripcion_banios: '',
        ds_descripcion_sofacama: '',
        if_clase: '',
        if_vista: '',
        plano:'',
        if_zonas: '',
        if_tipo:'',
        co_clase_cocina:'',
        co_tipo_cocina:'',
        co_tipo_cafetera:'',
        ah_tipo_tv:'',
        ah_tipo_internet:'',
        ca_ubicacion_calefaccion:'',
        ca_tipo_calefaccion:'',
    })

    const [propietarios, setPropietarios] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    //Aqui todos los select que sean booleanos
    const handleChange = (e: any) => {
        let _val = e.target.value
        //alert(`${e.target.name} -> ${_val}`)
        if ( ['cp_ascensor','ca_calefaccion','ca_aire_acondicionado','ca_discapacidad'
            ,'cp_cerradura_puertas','co_freidora','co_horno','ah_entrada_independiente'
            ,'ah_chimenea','ah_caja_fuerte','ah_minibar','ah_ventilador_techo'
            ,'ca_aparcamiento_instalaciones','ca_alarma','ca_alarma_incendios','ca_balcon'
            ,'ca_terraza','ca_jardin','ca_patio_interior','cu_zona_bbq','cu_zona_infantil'
            ,'cu_spa','cu_gimnasio' ].includes(e.target.name as string) ) {
            _val = ( e.target.value === '-2' ) ? undefined : ( e.target.value === 'true' ? true : false )
        }
        // setDataDB({     
        //     ...dataDB,
        //     [e.target.name]: _val
        // })

        setDataDB((current) => {
            let _data = {...current, [e.target.name]: _val}
            return { ..._data }
        })
    }

    const handleSave = async() => {
        
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]
        //if(!ValidationsInstance.checkUrl(dataDB.plano || '')){alert('error')}
        // console.log(dataDB.idpropietario, (dataDB.idpropietario == -2))
        let _propietariosL = (dataDB.idpropietario && dataDB.idpropietario != -2) ? [{ id: parseInt(dataDB.idpropietario.toString()) || 0 }]:[]
        // console.log(_propietariosL)
        const result = await ( id ?
            FetchApiServiceInstance.update(`${DA_APARTMENT_PATH}${id!}`, {...dataDB, propietarios: _propietariosL}, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        let _result = (el.code === '23505' && el.field === 'id_dispositivo_ref' && el.type ==='SQL') ? `Código duplicado` : (el.label||'')
                        return _result
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    console.log(_d)
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) :
            FetchApiServiceInstance.create(DA_APARTMENT_PATH, dataDB, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        let _result = (el.code === '23505' && el.field === 'id_dispositivo_ref' && el.type ==='SQL') ? `Código duplicado` : (el.label||'')
                        return _result
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )

        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/da/apartments/')
        }
    }

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`${DA_APARTMENT_PATH}${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( statusDataId === 200 && data ) {
                let _data = data as IPiso
                setDataDB( {    ..._data, 
                    idpropietario: ( (_data.propietarios && _data.propietarios.length !== 0)?_data.propietarios[0].id:0 ), 
                    ubicacion_mapa: _data.ubicacion_mapa || '',
                    observaciones: _data.observaciones || '',
                    cp_ocupacion_maxima: _data.cp_ocupacion_maxima !== undefined ?  _data.cp_ocupacion_maxima : undefined,
                    cp_m2: _data.cp_m2 !== undefined ?  _data.cp_m2 : undefined,
                    ca_aire_acondicionado: _data.ca_aire_acondicionado !== undefined ?  _data.ca_aire_acondicionado : undefined,
                    ca_calefaccion: _data.ca_calefaccion !== undefined ?  _data.ca_calefaccion : undefined,
                    cp_ascensor: _data.cp_ascensor !== undefined ?  _data.cp_ascensor : undefined,
                    ca_discapacidad: _data.ca_discapacidad !== undefined ?  _data.ca_discapacidad : undefined,
                    ds_nro_dormitorios: _data.ds_nro_dormitorios !== undefined ?  _data.ds_nro_dormitorios : undefined,
                    ds_nro_camas: _data.ds_nro_camas !== undefined ?  _data.ds_nro_camas : undefined,
                    bs_nro_banios: _data.bs_nro_banios !== undefined ?  _data.bs_nro_banios : undefined,
                    ds_nro_sofacama: _data.ds_nro_sofacama !== undefined ?  _data.ds_nro_sofacama : undefined,
                    ds_descripcion_camas: _data.ds_descripcion_camas || '',
                    bs_descripcion_banios: _data.bs_descripcion_banios || '',
                    ds_descripcion_sofacama: _data.ds_descripcion_sofacama || '',
                    if_zonas: _data.if_zonas || '',
                    if_clase: _data.if_clase || '',
                    if_vista: _data.if_vista || '',
                    if_tipo: _data.if_tipo || '',
                    cp_estancia_total: _data.cp_estancia_total !== undefined ? _data.cp_estancia_total : undefined,
                    cp_cerradura_puertas: _data.cp_cerradura_puertas !== undefined ? _data.cp_cerradura_puertas : undefined,
                    cp_nro_plantas: _data.cp_nro_plantas !== undefined ? _data.cp_nro_plantas : undefined,
                    co_clase_cocina: _data.co_clase_cocina || '',
                    co_tipo_cocina: _data.co_tipo_cocina || '',
                    co_tipo_cafetera: _data.co_tipo_cafetera || '',
                    co_freidora: _data.co_freidora !== undefined ? _data.co_freidora : undefined,
                    co_horno: _data.co_horno !== undefined ? _data.co_horno : undefined,
                    ah_entrada_independiente: _data.ah_entrada_independiente !== undefined ? _data.ah_entrada_independiente : undefined,
                    ah_chimenea: _data.ah_chimenea !== undefined ? _data.ah_chimenea : undefined,
                    ah_lavadora: _data.ah_lavadora || '',
                    ah_caja_fuerte: _data.ah_caja_fuerte !== undefined ? _data.ah_caja_fuerte : undefined,
                    ah_minibar: _data.ah_minibar !== undefined ? _data.ah_minibar : undefined,
                    ah_tipo_tv: _data.ah_tipo_tv || '',
                    ah_tipo_internet: _data.ah_tipo_internet || '',
                    ah_ventilador_techo: _data.ah_ventilador_techo !== undefined ? _data.ah_ventilador_techo : undefined,
                    ca_aparcamiento_instalaciones: _data.ca_aparcamiento_instalaciones !== undefined ? _data.ca_aparcamiento_instalaciones : undefined,
                    ca_nro_plazas: _data.ca_nro_plazas !== undefined ? _data.ca_nro_plazas : undefined,
                    ca_ubicacion_calefaccion: _data.ca_ubicacion_calefaccion || '',
                    ca_tipo_calefaccion: _data.ca_tipo_calefaccion || '',
                    ca_alarma: _data.ca_alarma !== undefined ? _data.ca_alarma : undefined,
                    ca_alarma_incendios: _data.ca_alarma_incendios !== undefined ? _data.ca_alarma_incendios : undefined,
                    ca_balcon: _data.ca_balcon !== undefined ? _data.ca_balcon : undefined,
                    ca_terraza: _data.ca_terraza !== undefined ? _data.ca_terraza : undefined,
                    ca_jardin: _data.ca_jardin !== undefined ? _data.ca_jardin : undefined,
                    ca_piscina: _data.ca_piscina || '',
                    ca_patio_interior: _data.ca_patio_interior !== undefined ? _data.ca_patio_interior : undefined,
                    cu_zona_bbq: _data.cu_zona_bbq !== undefined ? _data.cu_zona_bbq : undefined,
                    cu_zona_infantil: _data.cu_zona_infantil !== undefined ? _data.cu_zona_infantil : undefined,
                    cu_spa: _data.cu_spa !== undefined ? _data.cu_spa : undefined,
                    cu_gimnasio: _data.cu_gimnasio !== undefined ? _data.cu_gimnasio : undefined,
                    plano: _data.plano || '',
                    bs_nro_aseos: _data.bs_nro_aseos !== undefined ? _data.bs_nro_aseos : undefined,
                    link_source_mantenimiento: _data.link_source_mantenimiento || '',
                })
            }
        }).catch(err => {}).finally(()=>{})
        
        let statusHttpUS = 200
        FetchApiServiceInstance.getAllWithFilter(SHARE_GET_PROPIETARIOS_PATH, {}, (err) => {
            const { status } = err.response!
            statusHttpUS = status
        }).then( data => {
            if ( statusHttpUS === 200 && data ) {
                let _data = data as Array<user>
                setPropietarios( _data.map(el => ({ key: el.id.toString(), name: `${el.nombre} ${el.apellido}`})) )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    const handleDelete = async () => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return

        const result = await ( id ?
            FetchApiServiceInstance.delete(`${DA_APARTMENT_PATH}${id}`, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
            : null
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/da/apartments/')
        }
    }

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/da/apartments/', router),
        handleDelete,
        errorValidate,
        msgError,
        dataControl,
        propietarios
    }
}

export default usePisoId;