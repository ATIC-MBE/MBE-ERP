import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE } from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { user } from '@/client/types/globalTypes';
import { IResponsableLead } from '@/client/models/IResponsableLead';
import FetchApiServiceInstance from '@/client/services/FetchApiService';


const usePerfilDNId = (pathGoToBack: string) => {
    const router = useRouter()

    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IResponsableLead>({
        id: 0,
        codigo: '',
        nombre: '',
        observacion: '',
        estado: 1,
        idusuario_resp: 0,
        tipo_lead: ''
    })

    const [usuarios, setUsuarios] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)
    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    // Var for Model
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }    

    const handleChange = (e: any) => {
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        const result = await ( id ? FetchApiServiceInstance.update(`/api/dn/leads/responsables/${id}`, dataDB, (err) => {
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
            FetchApiServiceInstance.create('/api/dn/leads/responsables', dataDB, (err) => {
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
        )

        // // Si no hay error, redirecciona [SOL TMP]
        if ( result ) {
            router.push(`${pathGoToBack}`)
        }
    }

    useEffect(() => {
        let statusHttpSById = 200
        // Edit
        id && FetchApiServiceInstance.getSingleData(`/api/dn/leads/responsables/${id}`, (err) => {
            const { status } = err.response!
            statusHttpSById = status
        }).then( data => {
            if ( statusHttpSById === 200 && data ) {
                let _data = data as IResponsableLead
                setDataDB( _data )
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{
        })

        // Se cargaran todos los usuarios responsables
        let statusHttpUS = 200
        FetchApiServiceInstance.getAllData(`/api/dn/users/responsables/`, (err) => {    
            const { status } = err.response!
            statusHttpUS = status
        }).then( ldata => {
            let _data = ldata as Array<user>
            let _d = _data ? _data.map(el => ({ key: el.id.toString(), name: `${el.nombre_completo}`})) : []
            statusHttpUS === 200 && setUsuarios( _d )
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})
    }, [id])

    return {
        dataDB,
        handleChange,
        handleSave,
        handleCancel: () => handleCancel(`${pathGoToBack}`, router),
        errorValidate,
        msgError,
        isModalOpen,
        usuarios,
        toggleModal
    }
}

export default usePerfilDNId;