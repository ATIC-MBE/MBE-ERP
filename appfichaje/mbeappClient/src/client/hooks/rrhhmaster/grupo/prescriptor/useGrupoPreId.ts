import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DN_GET_TYPE_CATEGORIA_PATH, MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor';
import { ISucesoPrescriptor } from '@/client/models/ISucesoPrescriptor';
import CategoriaLeadServiceInstance from '@/client/services/CategoriaLeadService';

const useGrupoPreId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [listCategoria, setListCategoria] = useState<Array<{ key:string, name: string }>>([])

    // Var for Model
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Data init del grupo
    const [dataDB, setDataDB] = useState<IGrupoPrescriptor>({
        id: 0,
        nombre: '',
        whatsapp: '',
        nro_visitas: 0,
        nro_reservas: 0,
        flag_vr: 'N',
        valor: 0.0,
        valor_propietario: 0,
        prescriptores: [],
        comentario_suceso: '',
        prescriptores_to_lead: [],
        total_visitas: 0,
        total_reservas: 0,
        total_valor_propietario: 0,
        next_step: '',
    })

    //State controlar el tipo del suceso
    const dataTypeSucess = ['Visita', 'Reserva', 'Propietario'] // Importante orden: 0 -> Visita, 1 -> Reserva, -1|null -> no seleccionado
    const [flagVR, setFlagVR] = useState<number|null>(-1)

    // const prescriptorToLead = useState<Array<number>>([])

    const [listSucesos, setListSucesos] = useState<Array<ISucesoPrescriptor>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    /**
     * Add o Remove prescriptor a mover a Leads
     * @param id 
     */
    const fnSelectPrescriptor = (id: number) => {
        let _lDataPre = [ ...dataDB.prescriptores ]
        let _dataPreIndex = _lDataPre.findIndex(el => el.id === id)
        // let _currentIsSelected = _lDataPre[_dataPreIndex].isSelected
        _lDataPre[_dataPreIndex] = { ..._lDataPre[_dataPreIndex], isSelected: !_lDataPre[_dataPreIndex].isSelected }
        let _prescriptoresToLead = _lDataPre.filter(el => el.isSelected === true).map(el => el.id)

        setDataDB( { ...dataDB, prescriptores: _lDataPre, prescriptores_to_lead: _prescriptoresToLead } )
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    // Update información de los prescriptores
    const handleChangePrescriptor = (e: any, id: number) => {
        let _lDataPre = [ ...dataDB.prescriptores ]
        let _dataPreIndex = _lDataPre.findIndex(el => el.id === id)
        _lDataPre[_dataPreIndex] = { ..._lDataPre[_dataPreIndex], [e.target.name]: e.target.value }

        setDataDB( { ...dataDB, prescriptores: _lDataPre } )
    }

    const handleOperation = (value: number) => {
        if ( flagVR !== 0 && flagVR !== 1 ) return
        else if ( flagVR === 0 ) setDataDB((current) => ({ ...current, nro_visitas: ((current.nro_visitas + value) <= 0) ? 0 : current.nro_visitas + value }))
        else if ( flagVR === 1 ) setDataDB((current) => ({...current, nro_reservas: ((current.nro_reservas + value) <= 0) ? 0 : current.nro_reservas + value}))
    }

    const handleSave = async() => {
        setErrorValidate(() => false)

        if ( flagVR === 0 ) dataDB.flag_vr = 'V'
        else if ( flagVR === 1 ) dataDB.flag_vr = 'R'
        else if ( flagVR === 2 ) dataDB.flag_vr = 'P' // Propietario
        else dataDB.flag_vr = 'N'

        // let {error, data} = SucesoValidationInstance.validateSave(dataDB)
        // if ( error ) {
        //     setErrorValidate((previousValue) => !previousValue)
        //     setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
        //     scroll.scrollToTop()
        //     return
        // }

        const result = await (
            FetchApiServiceInstance.update(`/api/dn/grupo/${id}/prescriptores`, dataDB, (err) => {
                const { status, data } = err.response!
                // Errores de validación del servidor [API]
                if ( status === 409 ) {
                    let _d = data as { error: string, data: Array<{type: string, code: string, field: string, msg: string, label: string}> }
                    if ( _d.data.length !== 0 ) setMsgError(detailsListAlert(MSG_ERROR_FIELD, _d.data.map(el => `${el.label} -> ${el.msg}`)))
                    else setMsgError(detailsNormalAlert(MSG_ERROR_SAVE))
                    setErrorValidate((previousValue) => !previousValue)
                    scroll.scrollToTop()
                }
            })
        )
        // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push('/rrhhmaster/grupo/prescriptores')
        }
    }

    const handleGoBackLead = async () => {
        // alert('Regresar to Lead')
        toggleModal() // No usar popup para regresar leads
    }

    useEffect(() => {
        // Get data by ID
        let statusHttpLeadId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/dn/grupo/${id}/prescriptores`, (err) => {
            const { status } = err.response!
            statusHttpLeadId = status
        }).then( data => {
            if( statusHttpLeadId === 200 && data ) {
                let _data = (data as IGrupoPrescriptor)
                // console.log(_data)
                setDataDB({
                    id: 0,
                    nombre: _data.nombre || '',
                    whatsapp: _data.whatsapp || '',
                    nro_visitas: 0,
                    nro_reservas: 0,
                    valor_propietario: 0,
                    flag_vr: 'N',
                    valor: 0.0,
                    prescriptores: _data.prescriptores || [],
                    comentario_suceso: _data.comentario_suceso || '',
                    prescriptores_to_lead: [],
                    total_visitas: _data.nro_visitas || 0,
                    total_reservas: _data.nro_reservas || 0,
                    total_valor_propietario: _data.valor_propietario || 0,
                    next_step: _data.next_step || ''
                })

                // Get List: Sucesos
                let statusHttpSucesos = 200
                id && FetchApiServiceInstance.getAllData(`/api/dn/sucess/grupo/${id}/prescriptores`, (err) => {
                    const { status } = err.response!
                    statusHttpSucesos = status
                }).then( data => {
                    statusHttpSucesos === 200 && data && setListSucesos( data as Array<ISucesoPrescriptor> )
                }).catch(err => {
                    console.log('err: ', err)
                }).finally(()=>{})
            }
        }).catch(err => {}).finally(()=>{})

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
        flagVR,
        dataTypeSucess,
        setFlagVR,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/rrhhmaster/grupo/prescriptores', router),
        handleGoBackLead,
        errorValidate,
        msgError,
        listSucesos,
        handleChangePrescriptor,
        handleOperation,
        isModalOpen,
        toggleModal,
        fnSelectPrescriptor,
        listCategoria
    }
}

export default useGrupoPreId;