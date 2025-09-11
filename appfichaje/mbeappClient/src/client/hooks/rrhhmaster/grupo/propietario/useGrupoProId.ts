import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IGrupoPropietario } from '@/client/models/IGrupoPropietario';
import { ISucesoPropietario } from '@/client/models/ISucesoPropietario';

const useGrupoProId = () => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    // Data init del grupo
    const [dataDB, setDataDB] = useState<IGrupoPropietario>({
        id: 0,
        nombre: '',
        whatsapp: '',
        nro_llamadas: 0,
        propietarios: [],
        comentario_suceso: '',
        propietarios_to_lead: [],
        next_step: ''
    })

    const [listSucesos, setListSucesos] = useState<Array<ISucesoPropietario>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    const fnSelectPropietario = (id: number) => {
        let _lDataPre = [ ...dataDB.propietarios ]
        let _dataPreIndex = _lDataPre.findIndex(el => el.id === id)
        // let _currentIsSelected = _lDataPre[_dataPreIndex].isSelected
        _lDataPre[_dataPreIndex] = { ..._lDataPre[_dataPreIndex], isSelected: !_lDataPre[_dataPreIndex].isSelected }
        let _prescriptoresToLead = _lDataPre.filter(el => el.isSelected === true).map(el => el.id)
        console.log(_prescriptoresToLead)

        setDataDB( { ...dataDB, propietarios: _lDataPre, propietarios_to_lead: _prescriptoresToLead } )
    }

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    // Update información de los propietarios
    const handleChangePropietario = (e: any, id: number) => {
        let _lDataPro = [ ...dataDB.propietarios ]
        let _dataProIndex = _lDataPro.findIndex(el => el.id === id)
        _lDataPro[_dataProIndex] = { ..._lDataPro[_dataProIndex], [e.target.name]: e.target.value }

        setDataDB( { ...dataDB, propietarios: _lDataPro } )
    }

    const handleOperation = async() => {
        setErrorValidate(() => false)
    }

    const handleSave = async() => {
        setErrorValidate(() => false)

        // let {error, data} = SucesoValidationInstance.validateSave(dataDB)
        // if ( error ) {
        //     setErrorValidate((previousValue) => !previousValue)
        //     setMsgError(detailsListAlert(MSG_ERROR_FIELD, data.map(el => el.label)))
        //     scroll.scrollToTop()
        //     return
        // }

        const result = await (
            FetchApiServiceInstance.update(`/api/dn/grupo/${id}/propietarios`, dataDB, (err) => {
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
            router.push('/rrhhmaster/grupo/propietarios')
        }
    }

    const handleGoBackLead = async () => {}

    useEffect(() => {
        // Get data by ID
        let statusHttpLeadId = 200
        id && FetchApiServiceInstance.getSingleData(`/api/dn/grupo/${id}/propietarios`, (err) => {
            const { status } = err.response!
            statusHttpLeadId = status
        }).then( data => {
            if( statusHttpLeadId === 200 && data ) {
                let _data = (data as IGrupoPropietario)
                console.log(_data)
                setDataDB({
                    id: 0,
                    nombre: _data.nombre || '',
                    whatsapp: _data.whatsapp || '',
                    nro_llamadas: _data.nro_llamadas || 0,
                    propietarios: _data.propietarios || [],
                    comentario_suceso: _data.comentario_suceso || '',
                    propietarios_to_lead: [],
                    next_step: _data.next_step || ''
                })

                // Get List: Sucesos
                let statusHttpSucesos = 200
                id && FetchApiServiceInstance.getAllData(`/api/dn/sucess/grupo/${id}/propietarios`, (err) => {
                    const { status } = err.response!
                    statusHttpSucesos = status
                }).then( data => {
                    statusHttpSucesos === 200 && data && setListSucesos( data as Array<ISucesoPropietario> )
                }).catch(err => {
                    console.log('err: ', err)
                }).finally(()=>{})
            }
        }).catch(err => {}).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel('/rrhhmaster/grupo/propietarios', router),
        handleGoBackLead,
        errorValidate,
        msgError,
        listSucesos,
        handleChangePropietario,
        handleOperation,
        fnSelectPropietario
    }
}

export default useGrupoProId;