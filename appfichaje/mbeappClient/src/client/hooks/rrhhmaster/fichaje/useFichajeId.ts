import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_CONFIR_DELETE_DATA } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { IFichaje } from '@/client/models/IFichaje'

const useFichajeId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IFichaje>({
        id: 0,
        fecha: '',
        full_name:'',
        h_entrada: '',
        h_salida: '',
        idusuario: 0
    })
    
    const [limpiezaUsers, setLimpiezaUsers] = useState<Array<{ key:string, name: string }>>([])


    const [fichajeUsers, setFichajeUser] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        let _val = e.target.value
        let _name = e.target.name as string

        // Ejecutar operación de calculo siempre y cuando cumpla las validaciones
        if ( ['fecha','h_entrada','h_salida'].includes(e.target.name as string) ) {
            let _fechaValueCurrent = _name === 'fecha' ? _val: dataDB.fecha
            let _hEntradaValueCurrent = _name === 'h_entrada' ? _val: dataDB.h_entrada
            let _hSalidaValueCurrent = _name === 'h_salida' ? _val: dataDB.h_salida

            if ( _fechaValueCurrent && _hEntradaValueCurrent && _hSalidaValueCurrent ) {
                const {h, m} = UtilCustomInstance.getHoursMinDiff(`${_fechaValueCurrent} ${_hEntradaValueCurrent}:00`,`${_fechaValueCurrent} ${_hSalidaValueCurrent}:00`)
                setDataDB({
                    ...dataDB,
                    //t_total_horas: `${h}h ${m}min`,
                    [e.target.name]: _val,
                })
            } else {
                setDataDB({
                    ...dataDB,
                    //t_total_horas: `0h 0min`,
                    [e.target.name]: _val,
                })
            }
            return
        }

        setDataDB({
            ...dataDB,
            [e.target.name]: _val
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        console.log(dataDB)
        const result = await ( id ?
            FetchApiServiceInstance.update(`/api/rrhh/fichajeoficina/${id!}`, { ...dataDB, entrada: `${dataDB.fecha} ${dataDB.entrada || '--:--'}:00`, salida: (dataDB.salida!=='')?`${dataDB.fecha} ${dataDB.salida}:00`:'' }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        // let _result = (el.code === '23505' && el.field === 'id_dispositivo_ref' && el.type ==='SQL') ? `Código duplicado` : (el.label||'')
                        // return _result
                        return `${el.label || ''}: ${el.msg}`
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            }) :
            FetchApiServiceInstance.create('/api/rrhh/fichajeoficina/', { ...dataDB, entrada: `${dataDB.fecha} ${dataDB.entrada || '--:--'}:00`, salida: (dataDB.salida!=='')?`${dataDB.fecha} ${dataDB.salida}:00`:'' }, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label?: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => {
                        // let _result = (el.code === '23505' && el.field === 'id_dispositivo_ref' && el.type ==='SQL') ? `Código duplicado` : (el.label||'')
                        // return _result
                        return `${el.label || ''}: ${el.msg}`
                    })))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )

        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/rrhhmaster/fichaje/')
        }
    }

    useEffect(() => {
        let statusDataId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/rrhh/fichajeoficina/${id}`, (err) => {
            const { status } = err.response!
            statusDataId = status
        }).then( data => {
            
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            if ( statusDataId === 200 && data ) {
                let _data = data as IFichaje
                const {h, m} = UtilCustomInstance.getHoursMinDiff(`${_data.fecha} ${_data.h_entrada}:00`,`${_data.fecha} ${_data.h_salida}:00`)
                setDataDB( {    ..._data,
                    fecha: _data.fecha || '',
                    entrada: _data.h_entrada || '',
                    salida: _data.h_salida || '',
                    idusuario: _data.idusuario || 0,
                    observacion: _data.observacion ||'',
                    h_entrada: _data.h_entrada || '',
                    h_salida: _data.h_salida || ''
                })
            }
        }).catch(err => {}).finally(()=>{})

        // GET información personal ofi
        let statusHttpP = 200
        FetchApiServiceInstance.getAllWithFilter('/api/share/data/dataselect/', { tipo: 'personal_oficina' }, (err) => {
            const { status } = err.response!
            statusHttpP = status
        }).then( data => {
            if ( statusHttpP === 200 && data ) {
                let _data = data as Array<{ key:string, name: string }>
                setFichajeUser( _data )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    const handleDelete = async () => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return

        const result = await ( id ?
            FetchApiServiceInstance.delete(`/api/rrhh/fichajeoficina/${id}`, (err) => {
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
            router.push('/rrhhmaster/fichaje/')
        }
    }

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/rrhhmaster/fichaje/', router),
        handleDelete,
        errorValidate,
        msgError,
        limpiezaUsers,
        fichajeUsers
    }
}

export default useFichajeId;