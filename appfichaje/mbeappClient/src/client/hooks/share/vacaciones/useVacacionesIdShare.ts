import { animateScroll as scroll} from 'react-scroll';
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MSG_ERROR_FIELD, MSG_ERROR_SAVE , ALERT_MSG_CONFIR_DELETE_DATA} from '@/client/helpers/constants'
import { detailsListAlert, detailsNormalAlert, handleCancel } from '@/client/helpers/Util'
import { UserSignup, rolenum, user } from '@/client/types/globalTypes';
import RoleServiceInstance from '@/client/services/RoleService';
import { format } from 'path';
import UtilCustomInstance from '@/client/helpers/UtilCustom';
import ValidationsInstance from '@/client/helpers/Validations';
import FetchApiServiceInstance from '@/client/services/FetchApiService';
import { IVacaciones } from '@/client/models/IVacaciones';

const useVacacionesIddShare = (pathGoToBack: string) => {

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
        estado : 1
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

        //Validamos (falta validar tipo fecha) y comprobamos que el data opuesto este añadido y procedemos a realizar el cálculo

        /*if(["fecha_inicio"].includes(e.target.name)){
           
            
            fecha1 = e.target.value

            setDataDB({

           
                ...dataDB,
                [e.target.name]: e.target.value
            })
            
            
        }
        if(["fecha_fin"].includes(e.target.name)&& fecha1.length > 0) {
            
            fecha2 = e.target.value

            
            
            setDataDB({

                ...dataDB,
                [e.target.name]: e.target.value

            })
            
        }*/

        // console.log("milisegundos: " + totalMilisegundos + " / horas: " + horas + " / dias: " + dias + " / meses: " + meses + " / años: " + anos )
        
        //dateCalculator(e)

        //console.log(fecha1,fecha2)
        
        // console.log(UtilCustomInstance.dateCalculator(fecha2,fecha1).dias)
        // console.log(UtilCustomInstance.dateCalculator(fecha2,fecha1).meses)
        // console.log(UtilCustomInstance.dateCalculator(fecha2,fecha1).anos)

        // if (["fecha_fin", "fecha_inicio"].includes(e.target.name as string)) {
        //     let _valueFechaInicio = ((e.target.name as string === "fecha_inicio")? e.target.value as string : dataDB.fecha_inicio?.toString()) || ''
        //     let _valueFechaFin = ((e.target.name as string === "fecha_fin")? e.target.value as string : dataDB.fecha_final?.toString()) || ''

        //     console.info('son fechas')
            
        //     if( ValidationsInstance.checkFormatDateSQL(_valueFechaInicio) && 
        //         ValidationsInstance.checkFormatDateSQL(_valueFechaFin) && (((Date.parse(_valueFechaFin as string))-(Date.parse(_valueFechaInicio as string)))/1000 >= 0 )){
        //             dataDB.dias = UtilCustomInstance.dateCalculator(_valueFechaInicio,_valueFechaFin).dias

        //     }else{

        //         dataDB.dias = '0'
           

        //     }

        // }else{
        //     console.error('ERROR NO FECHAS')
        // }

        setDataDB({           
            ...dataDB,
            [e.target.name]: e.target.value
        })
        

        //dataUpload(e)
    }

    const dataUpload = (e:any) =>{
        setDataDB({

            ...dataDB,
            [e.target.name]: e.target.value

        })
    }

    const handleSave = async() => {
        setErrorValidate(() => false)
        // Validacion previa para el formulario [PENDIENTE]

        // console.log(dataDB)
        // return
        
        const result = await ( id ?  FetchApiServiceInstance.update(`/api/share/vacaciones/${id}`, dataDB as IVacaciones, (err) => {
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
            FetchApiServiceInstance.create('/api/share/vacaciones', dataDB as IVacaciones, (err) => {
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
        id && FetchApiServiceInstance.getSingleData(`/api/share/vacaciones/${id}`, (err) => {
            const { status } = err.response!
            statusHttpSById = status
        }).then( data => {
            if ( statusHttpSById === 200 && data ) {
                let _data = data as IVacaciones
                setDataDB(_data)
                //Variables de prueba
                // let _fini = '2024-01-01'
                // let _fend = ''
                // let _fend2 = ''

                // if(_fend.length <= 0){
                //     _fend = UtilCustomInstance.getDateCurrent().fecha
                // }
                // else if(_fend.length != 0){
                //     _fend = _fend
                // }
                
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

export default useVacacionesIddShare;