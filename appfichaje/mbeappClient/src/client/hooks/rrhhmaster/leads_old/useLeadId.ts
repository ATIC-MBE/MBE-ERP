import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_SAVE, DN_GET_TYPE_AVANCE_PATH, DN_GET_TYPE_INTERESA_PATH, DN_GET_TYPE_OCUPACION_PATH, DN_GET_TYPE_RESPONSABLE_PATH, DN_LEAD_PATH, DN_GET_TYPE_CATEGORIA_PATH } from '@/client/helpers/constants'
import { handleCancel } from '@/client/helpers/Util'
import { ILead } from '@/client/models/ILead'
import AvanceLeadServiceInstance from '@/client/services/AvanceLeadService'
import InteresaLeadServiceInstance from '@/client/services/InteresaLeadService'
import OcupacionLeadServiceInstance from '@/client/services/OcupacionLeadService'
import ResponsableLeadServiceInstance from '@/client/services/ResponsableLeadService'
import LeadServiceInstance from '@/client/services/LeadService'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import CategoriaLeadServiceInstance from '@/client/services/CategoriaLeadService';

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

    const handleChange = (e: any) => {}

    const changeResponsable = (value: string) => {}

    const handleAddTelefono = () => {}

    const handleDeleteTelefono = (valueRow: string) => {}

    const handleAddCorreo = () => {}

    const handleDeleteCorreo = (valueRow: string) => {}

    const handleSave = async() => {}

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
        handleCancel: () => handleCancel('/rrhhmaster/leads', router),
        handleAddTelefono,
        handleDeleteTelefono,
        handleAddCorreo,
        handleDeleteCorreo,
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

export default useLeadId;