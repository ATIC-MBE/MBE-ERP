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
        const AUSENCIAS = [
            '', // para indexar desde 1
            'Enfermedad común',
            'Renovar el DNI, pasaporte o visado',
            'Enfermedad laboral',
            'Citas médicas',
            'Cuidado de menores',
            'Vacaciones',
            'Días de asuntos propios',
            'Hospitalización o intervención quirúrgica de familiar',
            'Permisos formación',
            'Permiso por nacimiento de hijo',
            'Permiso por lactancia',
            'Permiso por fuerza mayor',
            'Permiso matrimonio o pareja de hecho',
            'Permiso por fallecimiento familiar',
            'Permiso por exámenes',
            'Permiso por traslado del domicilio habitual',
            'Permiso para el cumplimiento de un deber público y personal',
            'Permiso acompañamiento medico familiar'
        ];
    const router = useRouter()
    const { id } = router.query

    const [dataDB, setDataDB] = useState<IVacaciones>({
        nombre_completo: '',
        fecha_inicio: '',
        fecha_final: '',
        descripcion: '',
        fecha_creacion: '',
        estado_solicitud: 0,
        tipo_ausencia_permiso: '',
        idsolicitud: 0 // Asegúrate de incluir este campo si es requerido por IVacaciones
    });

    const [errorValidate, setErrorValidate] = useState(false)
    const [msgError, setMsgError] = useState('')
    const [roles, setRoles] = useState<Array<{ key: string, name: string }>>([]);

    useEffect(() => {
        // Si hay un id en la URL, es una edición
        if (id) {
            // Carga los datos actuales de la solicitud
            FetchApiServiceInstance.getSingleData(`/api/share/vacaciones/${id}`)
                .then(data => {
                    if (data) {
                        setDataDB({
                            ...data,
                            tipo_ausencia_permiso: AUSENCIAS[data.idsolicitud] ?? '',
                        });
                    }
                })
                .catch(err => {
                    const { status } = err.response!;
                    // Si no se encuentra el recurso, redirige
                    if (status === 404) router.push('/404');
                });
        }
    }, [id]);




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

    const handleChange = (e: any) => {
        if (e.target.name === 'idsolicitud') {
            const id = parseInt(e.target.value, 10);
            setDataDB({
                ...dataDB,
                idsolicitud: id,
                tipo_ausencia_permiso: AUSENCIAS[id]
            });
        } else {
            setDataDB({
                ...dataDB,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleDelete = () => {
        router.push(pathGoToBack)
    }
    return {
        dataDB,
        errorValidate,
        msgError,
        handleChange,
        handleSave,
        dataUpload,
        handleCancel: () => router.push(pathGoToBack),
        handleDelete,
        roles
    }
}

export default useVacacionesIddShare;