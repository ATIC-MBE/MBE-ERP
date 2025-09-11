import ValidationsInstance from "../helpers/Validations"
import { ILead } from "../models/ILead"
import { ISucesosDnUser } from "../modelsextra/ISucesosDnUser"

class SucesoValidation {
    constructor() {}

    validateSave(data: ISucesosDnUser): { error: boolean, data: Array<{field: string, label: string, msg: string}> } {
        let error: Array<{field: string, label: string, msg: string}> = []
        if ( !data.nombres_suceso || ValidationsInstance.isEmpty(data.nombres_suceso.trim()) ) 
            error.push({field: 'nombres_suceso', label: 'Nombres', msg: 'Campo incorrecto!!'})
        
        if ( !data.telefono_suceso || !ValidationsInstance.checkTelefono(data.telefono_suceso.trim()) )
            error.push({field: 'telefono_suceso', label: 'Teléfono', msg: 'Campo incorrecto!!'})

        // if ( data.correo_suceso && !ValidationsInstance.isEmpty(data.correo_suceso.trim()) ) {
        //     if ( !ValidationsInstance.checkEmail(data.correo_suceso.trim()) )
        //         error.push({field: 'correo_suceso', label: 'Correo', msg: 'Campo incorrecto!!'})
        // }

        if ( !data.correo_suceso || !ValidationsInstance.checkEmail(data.correo_suceso.trim()) )
            error.push({field: 'correo_suceso', label: 'Correo', msg: 'Campo incorrecto!!'})

        if ( !data.descripcion || ValidationsInstance.isEmpty(data.descripcion.trim()) )
            error.push({field: 'descripcion', label: 'Comentario', msg: 'Ingresar comentario!!'})
        
        return { error: error.length > 0, data: error }
    }

    validateContratar(data: ISucesosDnUser) : {error: boolean, data: Array<{field: string, label: string, msg: string}>} {
        let error: Array<{field: string, label: string, msg: string}> = []
        return { error: error.length > 0, data: error }
    }
}

const SucesoValidationInstance = new SucesoValidation()
Object.freeze(SucesoValidationInstance)

export default SucesoValidationInstance