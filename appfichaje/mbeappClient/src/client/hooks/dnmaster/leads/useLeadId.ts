import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE, ALERT_MSG_SAVE_DATA, DN_GET_TYPE_AVANCE_PATH, DN_GET_TYPE_INTERESA_PATH, DN_GET_TYPE_OCUPACION_PATH, DN_GET_TYPE_RESPONSABLE_PATH, DN_LEAD_PATH, DN_GET_TYPE_CATEGORIA_PATH, ALERT_MSG_CONTRATAR_DELETE_DATA, ALERT_MSG_CONFIR_DELETE_DATA, DN_MY_LEADS_PATH } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { ILead } from '@/client/models/ILead'
import AvanceLeadServiceInstance from '@/client/services/AvanceLeadService'
import InteresaLeadServiceInstance from '@/client/services/InteresaLeadService'
import OcupacionLeadServiceInstance from '@/client/services/OcupacionLeadService'
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService'
import LeadServiceInstance from '@/client/services/LeadService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import MyLeadValidationInstance from '@/client/validations/MyLeadValidation'
import CategoriaLeadServiceInstance from '@/client/services/CategoriaLeadService';
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor';
import { IGrupoPropietario } from '@/client/models/IGrupoPropietario';
import { parse } from 'path';

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

const useLeadId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)
    let refTelefono = useRef<HTMLInputElement>(null)
    let refCorreo = useRef<HTMLInputElement>(null)


    const [dataDB, setDataDB] = useState<ILead>({
        id: 0,
        nro_llamadas: 0,
        lead_id: '',
        timestamp: '',
        next_step: UtilCustomInstance.getDateNextStep('').fecha,
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
        nombre_completo: '',
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

        tipo_lead: '',
        idcategoria: 0,
        empresa: ''
    })

    const [listAvance, setListAvance] = useState<Array<{ key:string, name: string }>>([])
    const [listInteresa, setListInteresa] = useState<Array<{ key:string, name: string }>>([])
    const [listOcupacion, setListOcupacion] = useState<Array<{ key:string, name: string }>>([])
    const [listResponsable, setListResponsable] = useState<Array<{ key:string, name: string }>>([])
    const [listCategoria, setListCategoria] = useState<Array<{ key:string, name: string }>>([])
    const [listGrupo, setListGrupo] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    //State controlar el tipo del suceso
    const dataTypeGrupo = ['Nuevo'] // Importante orden: 0 -> Nuevo, 1 -> Existente, -1|null -> no seleccionado
    const [flagGrupo, setFlagGrupo] = useState<number|null>(-1)

    //State controlar interesa
    // listInteresa // info desde db, ordenada ['Poco', 'Medio', 'Mucho'] :: Importante orden [0, 1, 2]
    const [flagInteresa, setFlagInteresa] = useState<number|null>(-1)

    //State controlar ocupacion
    // listOcupacion // info desde db, ordenada ['Poco', 'Medio', 'Mucho'] :: Importante orden [0, 1, 2]
    const [flagOcupacion, setFlagOcupacion] = useState<number|null>(-1)

    //State controlar avance
    // listOcupacion // info desde db, ordenada ['Poco', 'Medio', 'Mucho'] :: Importante orden [0, 1, 2]
    const [flagAvance, setFlagAvance] = useState<number|null>(-1)

    const [ newGrupo, setNewGrupo ] = useState(false)

    // Var for Model
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const fnHidenModal = () => {
        toggleModal()
        setFlagGrupo(-1)
        setNewGrupo(false)
        setDataDB({
            ...dataDB,
            grupo: { id: 0, nombre: '' }
        })
    }

    const generateCodeGroup = (): string => {
        let _code = ''
        if ( dataDB.tipo_lead === 'Colaborador' ) 
            _code = `ColAg#${(dataDB.telefono || '').substring(dataDB.telefono!.length - 5).padStart(5, 'X')}`
        else if ( dataDB.tipo_lead === 'Propietario' )
            _code = `MyCityHome.es/${((dataDB.nombre_completo || '').trim().split(' ')[0])||'XXXXX'}#${(dataDB.telefono || '').substring(dataDB.telefono!.length - 5).padStart(5, 'X')}` 
        return _code
    }

    /**
     * Verifica el formato del grupo
     * @returns 
     */
    const validateCodeGroup = (): boolean => {
        // return  dataDB.grupo !== undefined && 
        //         dataDB.grupo?.nombre !== '' && 
        //         (/^[A-Za-z0-9]+[#][0-9]{5}$/.test(dataDB.grupo?.nombre || '') ||
        //         /^[A-Za-z.0-9]+[/][A-Za-z0-9]+[#][0-9]{5}$/.test(dataDB.grupo?.nombre || '')
        //         )

        return  dataDB.grupo !== undefined && 
                dataDB.grupo?.nombre !== ''
    }

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
        // Solo para tipo_lead
        if (e.target.name === 'tipo_lead') changeResponsable(e.target.value as string)
    }

    const handleNewGrupo = (e: any) => {
        setDataDB({
            ...dataDB,
            [ e.target.name ]: { id: 0, nombre: e.target.value }
        })
    }

    const handleChangeGrupo = (id: number) => {
        setNewGrupo( (current) => (current) ? !current : current )
        const _grupoSelected = listGrupo.find(el => el.key === id.toString())
        _grupoSelected && setDataDB({...dataDB, grupo: {id, nombre: _grupoSelected.name}})
    }

    const handleActionGrupo = (eTxt = 'new') => {
        setDataDB({
            ...dataDB,
            grupo: { id: 0, nombre: eTxt === 'new' ? generateCodeGroup() : '' }
        })
        setNewGrupo((current) => !current)
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

        setDataDB(data => ({ ...data, idcategoria: 0}))
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

    const getIndexTipoLead = (data: ILead): { idInteresa: number, idOcupacion: number, idAvance: number} => {
        // ['Poco', 'Medio', 'Mucho'] :: Importante orden [0, 1, 2]
        let idInteresa = 0
        switch(data.name_tinteresa?.toLowerCase().trim() || '') {
            case 'poco':
                idInteresa = 0
                break
            case 'NA':
                idInteresa = 1
                break
            case 'medio':
                idInteresa = 2
                break
            case 'mucho':
                idInteresa = 3
                break
            default:
                idInteresa = -1
        }

        // ['Libre', 'A punto', 'Ocupado'] :: Importante orden [0, 1, 2]
        let idOcupacion = 0
        switch(data.name_tocupacion?.toLowerCase().trim() || '') {
            case 'libre':
                idOcupacion = 0
                break
            case 'a punto':
                idOcupacion = 1
                break
            case 'ocupado':
                idOcupacion = 2
                break
            default:
                idOcupacion = -1
        }

        // ['Call', 'WPP', 'Meet', 'Sign', 'KOFF'] :: Importante orden [0, 1, 2, 3, 4]
        let idAvance = 0
        switch(data.name_tavance?.toLowerCase().trim() || '') {
            case 'call':
                idAvance = 0
                break
            case 'wpp':
                idAvance = 1
                break
            case 'meet':
                idAvance = 2
                break
            case 'sign':
                idAvance = 3
                break
            case 'koff':
                idAvance = 4
                break
            default:
                idAvance = -1
        }

        return { idInteresa, idOcupacion, idAvance}
    }

    const setTiposLeadCustom = () => {
        // ['Poco', 'Medio', 'Mucho'] :: Importante orden [0, 1, 2]
        let _dataInteresaSelected: { index: number, name: string } = {} as { index: number, name: string }
        if ( flagInteresa === 0 ) _dataInteresaSelected = {index: 0, name: 'Poco'}
        else if ( flagInteresa === 1 ) _dataInteresaSelected = {index: 1, name: 'NA'}
        else if ( flagInteresa === 2 ) _dataInteresaSelected = {index: 2, name: 'Medio'}
        else if ( flagInteresa === 3 ) _dataInteresaSelected = {index: 3, name: 'Mucho'}

        let _li = listInteresa.filter(el => el.name.toLowerCase().trim() === _dataInteresaSelected.name?.toLowerCase().trim())[0]
        dataDB.idtipointeresa = (_li && parseInt(_li.key)) || undefined

        // ['Libre', 'A punto', 'Ocupado'] :: Importante orden [0, 1, 2]
        let _dataOcupacionSelected: { index: number, name: string } = {} as { index: number, name: string }
        if ( flagOcupacion === 0 ) _dataOcupacionSelected = {index: 0, name: 'Libre'}
        else if ( flagOcupacion === 1 ) _dataOcupacionSelected = {index: 1, name: 'A punto'}
        else if ( flagOcupacion === 2 ) _dataOcupacionSelected = {index: 2, name: 'Ocupado'}
        let _lo = listOcupacion.filter(el => el.name.toLowerCase().trim() === _dataOcupacionSelected.name?.toLowerCase().trim())[0]
        dataDB.idtipoocupacion = (_lo && parseInt(_lo.key)) || undefined

        // ['Call', 'WPP', 'Meet', 'Sign', 'KOFF'] :: Importante orden [0, 1, 2, 3, 4]
        let _dataAvanceSelected: { index: number, name: string } = {} as { index: number, name: string }
        if ( flagAvance === 0 ) _dataAvanceSelected = {index: 0, name: 'Call'}
        else if ( flagAvance === 1 ) _dataAvanceSelected = {index: 1, name: 'WPP'}
        else if ( flagAvance === 2 ) _dataAvanceSelected = {index: 2, name: 'Meet'}
        else if ( flagAvance === 3 ) _dataAvanceSelected = {index: 3, name: 'Sign'}
        else if ( flagAvance === 4 ) _dataAvanceSelected = {index: 4, name: 'KOFF'}
        let _la = listAvance.filter(el => el.name.toLowerCase().trim() === _dataAvanceSelected.name?.toLowerCase().trim())[0]
        dataDB.idtipoavance = (_la && parseInt(_la.key)) || undefined
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        setTiposLeadCustom()

        // Redirecciona si es Avance Sign
        if ( flagAvance === 3 ) {
            handleContratarModal()
            return
        }


        // Validacion previa para el formulario [PENDIENTE]
        let {error, data} = MyLeadValidationInstance.validateSave(dataDB)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            return
        }

        // Guardar telefono
        let dataSend = { ...dataDB }
        // dataSend.telefonos = dataDB.telefonos.map(el=>el)
        // dataSend.correos = dataDB.correos.map(el=>el)
        dataSend.telefonos = []
        dataSend.correos = []
        if (    dataSend.telefono && 
                dataSend.telefono.toString() !== '' &&  
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono))
            ) {
                dataSend.telefonos = [{ id: 0, numero: dataSend.telefono}]
                // dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo))
            ) {
                dataSend.correos = [{ id: 0, correo: dataSend.correo}]
                // dataSend.correos.push( { id: 0, correo: dataSend.correo} )
        }

        const result = await ( id ?
            LeadServiceInstance.update(DN_MY_LEADS_PATH, {...dataSend, tipo_accion: 'Procesar'}, (err) => {
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
            :
            LeadServiceInstance.create(DN_LEAD_PATH, {...dataSend, tipo_accion: 'Nuevo'}, (err) => {
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            // alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/dnmaster/settings/leads')
        }
    }

    /**
     * Carga los grupos, en base al tipo de lead seleccionado [PRESCRIPTOR, PROPIETARIO]
     */
    const handleContratarModal = async () => {
        // Get List: Grupos
        const _urlSearchGroup = dataDB.tipo_lead === 'Colaborador' ? '/api/dn/grupo/prescriptores' 
                                                                    : 
                                                                    ( (dataDB.tipo_lead === 'Propietario') ? '/api/dn/grupo/propietarios' : '/api/na' )  
        let statusHttpGrupo = 200
        FetchApiServiceInstance.getAllData(`${_urlSearchGroup}`, (err) => {
            const { status } = err.response!
            statusHttpGrupo = status
        }).then( data => {
            let _data = data as Array<IGrupoPrescriptor | IGrupoPropietario>
            statusHttpGrupo === 200 && data && setListGrupo( _data.map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
            statusHttpGrupo !== 200 && setListGrupo([])
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
            toggleModal()
        })
    }

    const handleContratar = async () => {
        setErrorValidate(() => false)
        setTiposLeadCustom()
        
        // Guardar telefono
        let dataSend = { ...dataDB }
        // dataSend.telefonos = dataDB.telefonos.map(el=>el)
        // dataSend.correos = dataDB.correos.map(el=>el)
        dataSend.telefonos = []
        dataSend.correos = []
        // dataSend.telefonos.findIndex(el => el.numero.trim() === dataSend.telefono) === -1
        if (    dataSend.telefono && 
                dataSend.telefono.toString() !== '' &&  
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono))
            ) {
                dataSend.telefonos = [{ id: 0, numero: dataSend.telefono}]
                // dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo))
            ) {
                dataSend.correos = [{ id: 0, correo: dataSend.correo}]
                // dataSend.correos.push( { id: 0, correo: dataSend.correo} )
        }

        // Validacion previa para el formulario
        let {error, data} = MyLeadValidationInstance.validateContratar(dataSend)
        if ( error ) {
            setErrorValidate((previousValue) => !previousValue)
            setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
            scroll.scrollToTop()
            toggleModal()
            setNewGrupo(false)
            setDataDB({
                ...dataDB,
                grupo: { id: 0, nombre: '' }
            })
            return
        }

        const result = await ( id ?
            LeadServiceInstance.update(DN_MY_LEADS_PATH, {...dataSend, tipo_accion: 'Procesar-Contratar'}, (err) => {
                // Se ejecuta para status diferente de 200
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    console.log(_d)
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
            :
            LeadServiceInstance.create(DN_LEAD_PATH, {...dataSend, tipo_accion: 'Procesar-Contratar'}, (err) => {
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => el.field)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                }
            })
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/dnmaster/settings/leads')
        }
    }

    const handleDelete = async () => {
        if (!confirm(`${ALERT_MSG_CONFIR_DELETE_DATA}`)) return
        setErrorValidate(() => false)
        setTiposLeadCustom()

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
                (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(dataSend.telefono))
            ) {
                dataSend.telefonos = [{ id: 0, numero: dataSend.telefono}]
            // dataSend.telefonos.push( { id: 0, numero: dataSend.telefono} )
        }

        // Guarda correo [No agregado]
        if (    dataSend.correo && 
                dataSend.correo.toString() !== '' &&  
                (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataSend.correo))
            ) {
                dataSend.correos = [{ id: 0, correo: dataSend.correo}]
            // dataSend.correos.push( { id: 0, correo: dataSend.correo} )
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
            // alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push('/dnmaster/settings/leads')
        }
    }

    useEffect(() => {
        // Get data by ID
        let statusHttpLeadId = 200
        id && LeadServiceInstance.getById(`${DN_LEAD_PATH}`, id, (err) => {
            const { status } = err.response!
            statusHttpLeadId = status
        }).then( data => {
            // Preprocesar data y cambiar de null a vacío, para evitar warnings React
            // statusHttpLeadId === 200 && data && setDataDB({...data})
            if( statusHttpLeadId === 200 && data ) {
                let { idInteresa: _idInteresa, idOcupacion: _idOcupacion, idAvance: _idAvance } = getIndexTipoLead(data)
                // console.log('data: ', _idInteresa, _idOcupacion, _idAvance)
                setFlagInteresa(_idInteresa)
                setFlagOcupacion(_idOcupacion)
                setFlagAvance(_idAvance)
                setDataDB({
                    id: data.id || 0,
                    nro_llamadas: (data.nro_llamadas) ? parseInt(data.nro_llamadas.toString()):0,
                    lead_id: data.lead_id || '',
                    timestamp: data.timestamp || '',
                    next_step: UtilCustomInstance.getDateNextStep(data.next_step || '').fecha || '',
                    last_step: data.last_step ||'',
                    fecha_creacion: data.fecha_creacion || '',
                    fecha_ult_cambio: data.fecha_ult_cambio || '',
                    idusuario_creacion: data.idusuario_creacion || 0,
                    idusuario_ult_cambio: data.idusuario_ult_cambio || 0,
                    idtipoavance: _idAvance || 0,
                    idresponsable: data.idresponsable || 0,
                    idtipoocupacion: _idOcupacion || 0,
                    idtipointeresa: _idInteresa || 0,
                    comentario: '',
                    historico: data.historico || [],

                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    nombre_completo: data.nombre_completo || '',
                    grupo_wpp: data.grupo_wpp || '',
                    referencia: data.referencia || '',
                    estatus: data.estatus || 0,
                    // telefono: '',
                    telefono: data.telefonos.map(el => el.numero).join(', '),
                    // telefono: data.telefonos.length != 0 ? data.telefonos[0].numero: ',',
                    telefonos: data.telefonos || [],
                    // correo: '',
                    correo: data.correos.map(el => el.correo).join(', '),
                    // correo: data.correos.length != 0 ? data.correos[0].correo: '',
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

        // Get List: Responsables
        if(id != BigInt(0)) {
            let statusHttpResponsable = 200
            ResponsableLeadServiceInstance.getAll(`${DN_GET_TYPE_RESPONSABLE_PATH}`, (err) => {
                const { status } = err.response!
                statusHttpResponsable = status
            }).then( data => {
                statusHttpResponsable === 200 && data && setListResponsable( data.map(el => ({ key: el.id.toString(), name: `${el.codigo} -> ${el.responsable}`})) )
            }).catch(err => {
                console.log('err: ', err)
            }).finally(()=>{})
        }

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
        handleCancel: () => handleCancel('/dnmaster/settings/leads', router),
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
        listCategoria,
        isModalOpen,
        toggleModal,
        setFlagGrupo,
        flagGrupo,
        dataTypeGrupo,
        generateCodeGroup,
        listGrupo,
        fnHidenModal,
        handleChangeGrupo,
        newGrupo,
        setNewGrupo,
        handleActionGrupo,
        handleNewGrupo,
        handleContratarModal,
        validateCodeGroup,
        flagInteresa,
        setFlagInteresa,
        flagOcupacion,
        setFlagOcupacion,
        flagAvance,
        setFlagAvance
    }
}

export default useLeadId;