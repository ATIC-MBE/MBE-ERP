import { animateScroll as scroll} from 'react-scroll'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_SAVE_DATA, DN_GET_TYPE_AVANCE_PATH, DN_GET_TYPE_INTERESA_PATH, DN_GET_TYPE_OCUPACION_PATH, DN_GET_TYPE_RESPONSABLE_PATH, DN_LEAD_PATH, DN_MY_LEADS_PATH, ALERT_MSG_CONTRATAR_DELETE_DATA, ALERT_MSG_CONFIR_DELETE_DATA, DN_GET_TYPE_CATEGORIA_PATH } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { ILead } from '@/client/models/ILead'
import AvanceLeadServiceInstance from '@/client/services/AvanceLeadService'
import InteresaLeadServiceInstance from '@/client/services/InteresaLeadService'
import OcupacionLeadServiceInstance from '@/client/services/OcupacionLeadService'
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService'
import LeadServiceInstance from '@/client/services/LeadService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import MyLeadValidationInstance from '@/client/validations/MyLeadValidation'
import CategoriaLeadServiceInstance from '@/client/services/CategoriaLeadService'

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

const useMyLeadId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)
    let refTelefono = useRef<HTMLInputElement>(null)
    let refCorreo = useRef<HTMLInputElement>(null)


    const [dataDB, setDataDB] = useState<ILead>({
        id: 0,
        nro_llamadas: 0,
        lead_id: '',
        timestamp: '',
        next_step: '',
        last_step: UtilCustomInstance.getDateCurrent().fecha,
        fecha_creacion: '',
        fecha_ult_cambio: '',
        idusuario_creacion: 0,
        idusuario_ult_cambio: 0,
        idtipoavance: 0,
        idresponsable: 0,
        idtipoocupacion: 0,
        idtipointeresa: 0,
        comentario: '',
        historico: [],

        nombre: '',
        apellido: '',
        grupo_wpp: '',
        referencia: '',
        estatus: 1,
        telefono: '',
        telefonos: [],
        correo: '',
        correos: [],

        precio: '',
        m2: '',
        direccion: '',
        nro_edificio: '',
        nro_piso: '',
        codigo_postal: '',
        localidad: '',

        tipo_accion: 'Procesar',

        tipo_lead: '',
        idcategoria: 0,
        empresa: ''
    })

    const [listAvance, setListAvance] = useState<Array<{ key:string, name: string }>>([])
    const [listInteresa, setListInteresa] = useState<Array<{ key:string, name: string }>>([])
    const [listOcupacion, setListOcupacion] = useState<Array<{ key:string, name: string }>>([])
    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])
    const [listCategoria, setListCategoria] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const handleChange = (e: any) => {
        // console.log('ddd')
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    const handleAddTelefono = () => {
        const valueTelefono = (refTelefono.current) ? refTelefono.current.value.trim() : ''
        if ( !(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(valueTelefono)) ) return
        setDataDB((dCurrent) => {
            let _existTelefono = dCurrent.telefonos.findIndex(el => el.numero.trim() === valueTelefono)
            if ( _existTelefono === -1 ) dCurrent.telefonos.push( { id: 0, numero: valueTelefono} )
            return { ...dCurrent, telefono: '' }
        })
    }

    const handleDeleteTelefono = (valueRow: string) => {
        setDataDB((dCurrent) => {
            return { ...dCurrent, telefonos: dCurrent.telefonos.filter(el => el.numero !== valueRow.trim())}
        })
    }

    const handleAddCorreo = () => {
        const valueField = (refCorreo.current) ? refCorreo.current.value.trim() : ''
        if ( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valueField)) ) return
        setDataDB((dCurrent) => {
            let _existCorreo = dCurrent.correos.findIndex(el => el.correo.trim() === valueField)
            if ( _existCorreo === -1 ) dCurrent.correos.push( { id: 0, correo: valueField} )
            return { ...dCurrent, correo: '' }
        })
    }

    const handleDeleteCorreo = (valueRow: string) => {
        setDataDB((dCurrent) => {
            return { ...dCurrent, correos: dCurrent.correos.filter(el => el.correo !== valueRow.trim())}
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        
        // Validacion previa para el formulario
        let {error, data} = MyLeadValidationInstance.validateSave(dataDB)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        // Guardar telefono [No agregado]
        let dataSend = { ...dataDB }
        dataSend.telefonos = dataDB.telefonos.map(el=>el)
        dataSend.correos = dataDB.correos.map(el=>el)
        if (    dataSend.telefono && 
                dataSend.telefono.toString() !== '' &&  
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono)) &&
                dataSend.telefonos.findIndex(el => el.numero.trim() === dataSend.telefono) === -1
            ) {
            dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo [No agregado]
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo)) &&
                dataSend.correos.findIndex(el => el.correo.trim() === dataSend.correo) === -1
            ) {
            dataSend.correos.push( { id: 0, correo: dataSend.correo} )
        }

        const result = await ( id ?
            LeadServiceInstance.update(DN_MY_LEADS_PATH, dataSend, (err) => {
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
            :null
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/ceo/myleads')
        }
    }

    const handleContratar = async () => {
        if (!confirm(`${ALERT_MSG_CONTRATAR_DELETE_DATA}`)) return
        setErrorValidate(() => false)

        // Guardar telefono [No agregado]
        let dataSend = { ...dataDB }
        dataSend.telefonos = dataDB.telefonos.map(el=>el)
        dataSend.correos = dataDB.correos.map(el=>el)
        if (    dataSend.telefono && 
                dataSend.telefono.toString() !== '' &&  
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono)) &&
                dataSend.telefonos.findIndex(el => el.numero.trim() === dataSend.telefono) === -1
            ) {
            dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo [No agregado]
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo)) &&
                dataSend.correos.findIndex(el => el.correo.trim() === dataSend.correo) === -1
            ) {
            dataSend.correos.push( { id: 0, correo: dataSend.correo} )
        }

        // Validacion previa para el formulario
        let {error, data} = MyLeadValidationInstance.validateContratar(dataSend)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        const result = await ( id ?
            LeadServiceInstance.update(DN_MY_LEADS_PATH, {...dataSend, tipo_accion: 'Procesar-Contratar'}, (err) => {
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
            :null
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/ceo/myleads')
        }
    }

    const handleDelete = async () => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return
        setErrorValidate(() => false)

        // Validacion previa para el formulario
        let {error, data} = MyLeadValidationInstance.validateSave(dataDB)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        // Guardar telefono [No agregado]
        let dataSend = { ...dataDB }
        dataSend.telefonos = dataDB.telefonos.map(el=>el)
        dataSend.correos = dataDB.correos.map(el=>el)
        if (    dataSend.telefono && 
                dataSend.telefono.toString() !== '' &&  
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono)) &&
                dataSend.telefonos.findIndex(el => el.numero.trim() === dataSend.telefono) === -1
            ) {
            dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo [No agregado]
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo)) &&
                dataSend.correos.findIndex(el => el.correo.trim() === dataSend.correo) === -1
            ) {
            dataSend.correos.push( { id: 0, correo: dataSend.correo} )
        }

        const result = await ( id ?
            LeadServiceInstance.update(DN_MY_LEADS_PATH, {...dataSend, tipo_accion: 'Procesar-Eliminar'}, (err) => {
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
            :null
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/ceo/myleads')
        }
    }

    useEffect(() => {
        // Get data by ID
        let statusHttpLeadId = 200
        id && LeadServiceInstance.getById(`${DN_MY_LEADS_PATH}`, id, (err) => {
            const { status } = err.response!
            statusHttpLeadId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            // statusHttpLeadId === 200 && data && setDataDB({...data})
            if( statusHttpLeadId === 200 && data ) {
                setDataDB({
                    id: data.id || 0,
                    nro_llamadas: (data.nro_llamadas) ? parseInt(data.nro_llamadas.toString()):0,
                    lead_id: data.lead_id || '',
                    timestamp: data.timestamp || '',
                    next_step: data.next_step || '',
                    last_step: data.last_step ||'',
                    fecha_creacion: data.fecha_creacion || '',
                    fecha_ult_cambio: data.fecha_ult_cambio || '',
                    idusuario_creacion: data.idusuario_creacion || 0,
                    idusuario_ult_cambio: data.idusuario_ult_cambio || 0,
                    idtipoavance: data.idtipoavance || 0,
                    idresponsable: data.idresponsable || 0,
                    idtipoocupacion: data.idtipoocupacion || 0,
                    idtipointeresa: data.idtipointeresa || 0,
                    comentario: '',
                    historico: data.historico || [],

                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    grupo_wpp: data.grupo_wpp || '',
                    referencia: data.referencia || '',
                    estatus: data.estatus || 0,
                    telefono: '',
                    telefonos: data.telefonos || [],
                    correo: '',
                    correos: data.correos || [],

                    precio: (data.precio) ? parseFloat(data.precio).toFixed(2) : '',
                    m2: (data.m2) ? parseFloat(data.m2).toFixed(2) : '',
                    direccion: data.direccion || '',
                    nro_edificio: data.nro_edificio || '',
                    nro_piso: data.nro_piso || '',
                    codigo_postal: data.codigo_postal || '',
                    localidad: data.localidad || '',

                    tipo_lead: data.tipo_lead || '',
                    idcategoria: data.idcategoria || 0,
                    empresa: data.empresa || '',
                })

                // Filtra los responsables en base al tipo de lead: Propietario | Colaborador
                let statusHttpResponsable = 200
                ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
                    const { status } = err.response!
                    statusHttpResponsable = status
                }).then( dataR => {
                    statusHttpResponsable === 200 && dataR && setListResponsable( dataR.filter(el => ['Todos', data.tipo_lead].includes(el.tipo_lead)).map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
                }).catch(err => {
                    console.log('err: ', err)
                }).finally(()=>{})
            }
        }).catch(err => {}).finally(()=>{})
        
        // Get List: Avance
        let statusHttpAvance = 200
        AvanceLeadServiceInstance.getAll(`${DN_GET_TYPE_AVANCE_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpAvance = status
        }).then( data => {
            statusHttpAvance === 200 && data && setListAvance( data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})

        // Get List: Interesa
        let statusHttpInteresa = 200
        InteresaLeadServiceInstance.getAll(`${DN_GET_TYPE_INTERESA_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpInteresa = status
        }).then( data => {
            statusHttpInteresa === 200 && data && setListInteresa( data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})

        // Get List: Ocupacion
        let statusHttpOcupacion = 200
        OcupacionLeadServiceInstance.getAll(`${DN_GET_TYPE_OCUPACION_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpOcupacion = status
        }).then( data => {
            statusHttpOcupacion === 200 && data && setListOcupacion( data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})

        // Get List: Categoria
        let statusHttpCategoria = 200
        CategoriaLeadServiceInstance.getAll(`${DN_GET_TYPE_CATEGORIA_PATH}`, (err) => {
            const { status } = err.response!
            statusHttpCategoria = status
        }).then( data => {
            statusHttpCategoria === 200 && data && setListCategoria( data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/ceo/myleads', router),
        handleAddTelefono,
        handleDeleteTelefono,
        handleAddCorreo,
        handleDeleteCorreo,
        handleContratar,
        handleDelete,
        refTelefono,
        refCorreo,
        errorValidate,
        msgError,
        dataControl,
        listAvance,
        listInteresa,
        listOcupacion,
        listResponsable,
        listCategoria
    }
}

export default useMyLeadId;