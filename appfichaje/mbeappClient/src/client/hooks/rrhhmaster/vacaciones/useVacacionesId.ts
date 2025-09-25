import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE , ALERT_MSG_CONFIR_DELETE_DATA} from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { UserSignup, rolenum, user } from '@/client/types/globalTypes';
import UserService from '@/client/services/UserService';
import RoleServiceInstance from '@/client/services/RoleService';
import { format } from 'path';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import ValidationsInstance from '@/client/helpers/Validations';
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IVacaciones } from '@/client/models/IVacaciones';

const useVacacionesIdd = (pathGoToBack: string) => {

    const router = useRouter()

    let dateIniF: string
    let dateEndF: string
    let fecha1: string
    let fecha2: string

    let hoy = Date.now()
    let fechaHoy = hoy.toString

    let diasG: string
    let mesesG: string
    let years: string
    
    let id = BigInt((router.query.id as string) || 0)

    const [dataDB, setDataDB] = useState<IVacaciones>({
        nombre_completo : '',
        fecha_inicio : '',
        fecha_final : '',
        descripcion : '',
        fecha_creacion : '',
        estado_solicitud : 0,
        tipo_ausencia_permiso : '',
        idsolicitud: 0 // <-- Agrega esta línea
    })

    const [roles, setRoles] = useState<Array<{ key:string, name: string }>>([])
    
    const [errorValidate, setErrorValidate] = useState<boolean>(false)

    const [msgError, setMsgError] = useState<string>(MSG_ERROR_SAVE)

    // Var for Model
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }    

    const handleChange = (e: any) => {

        let totalMilisegundos = 0
        let horas = 0
        let dias = 0
        let meses = 0
        let años = 0

        setDataDB({           
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    const dataUpload = (e:any) =>{
        setDataDB({
            ...dataDB,
            [e.target.name]: e.target.value
        })
    }

    // El input type=date ya entrega yyyy-mm-dd, así que solo devolvemos el valor
    const formatDateToBackend = (dateStr: string) => {
        return dateStr || '';
    };

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        // Formatear fechas antes de enviar
        const dataToSend = {
            ...dataDB,
            fecha_inicio: formatDateToBackend(dataDB.fecha_inicio),
            fecha_final: formatDateToBackend(dataDB.fecha_final),
        };
        // Log para ver el objeto que se envía al backend
        console.log('handleSave dataToSend:', dataToSend);
        
        const result = await ( id ?  FetchApiServiceInstance.update(`/api/rrhh/vacaciones/${id}`, dataToSend as IVacaciones, (err) => {
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
            FetchApiServiceInstance.create('/api/rrhh/vacaciones', dataToSend as IVacaciones, (err) => {
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
            // alert(`${ALERT_MSG_SAVE_DATA}`)
            router.push(`${pathGoToBack}`)
        }
    }

    useEffect(() => {
        let statusHttpSById = 200
        id && FetchApiServiceInstance.getSingleData(`/api/rrhh/vacaciones/${id}`, (err) => {
            const { status } = err.response!
            statusHttpSById = status
        }).then( data => {
            if ( statusHttpSById === 200 && data ) {
                let _data = data as IVacaciones
                setDataDB(_data)
                console.log(_data)
            }
        }).catch(err => {
            console.log('err: ', err)
        }).finally(()=>{})

        RoleServiceInstance.getAll().then( data => {
            data && setRoles( data.filter(el => (el.id.toString() !== 'propietario' && el.id.toString() !== 'colaborador')).map(el => ({ key: el.id.toString(), name: `${el.nombre}`})) )
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
        roles,
        isModalOpen,
        toggleModal,
    }
}

export default useVacacionesIdd;