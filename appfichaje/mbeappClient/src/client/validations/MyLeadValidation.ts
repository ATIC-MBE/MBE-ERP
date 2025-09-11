import ValidationsInstance from "../helpers/Validations"
import { ILead } from "../models/ILead"

class MyLeadValidation {
    constructor() {}

    validateSave(data: ILead): { error: boolean, data: Array<{field: string, label: string, msg: string}> } {
        let error: Array<{field: string, label: string, msg: string}> = []
        if ( !data.last_step || data.last_step.toString() === '' ) 
            error.push({field: 'last_step', label: 'Last step', msg: 'Campo incorrecto!!'})
        
        if ( !data.next_step || data.next_step.toString() === '' ) 
            error.push({field: 'next_step', label: 'Next step', msg: 'Campo incorrecto!!'})

        if ( !data.comentario || data.comentario.toString() === '' )
            error.push({field: 'comentario', label: 'Comentario', msg: 'Ingresar comentario!!'})

        // Validación en el caso que se ingrese texto [TELÉFONO]
        if ( data.telefono || data.telefono?.toString().trim() !== '' ) {
            if ( !ValidationsInstance.checkTelefono(data.telefono || '') )
                error.push({field: 'telefono', label: 'Teléfono', msg: 'Formato incorrecto!!'})
        }

        // Validación en el caso que se ingrese texto [CORREO]
        if ( data.correo || data.correo?.toString().trim() !== '' ) {
            if ( !ValidationsInstance.checkEmail(data.correo || '') )
                error.push({field: 'correo', label: 'Correo', msg: 'Formato incorrecto!!'})
        }

        
        return { error: error.length > 0, data: error }
    }

    validateContratar(data: ILead) : {error: boolean, data: Array<{field: string, label: string, msg: string}>} {
        let error: Array<{field: string, label: string, msg: string}> = []

        // if ( !data.nombre || data.nombre.toString() === '' ) 
        //     error.push({field: 'nombre', label: 'Nombre', msg: 'Campo incorrecto!!'})
        
        // if ( !data.apellido || data.apellido.toString() === '' ) 
        //     error.push({field: 'apellido', label: 'Apellido', msg: 'Campo incorrecto!!'})

        if ( !data.nombre_completo || data.nombre_completo.toString().trim() === '' ) 
            error.push({field: 'nombre_completo', label: 'Nombres', msg: 'Campo incorrecto!!'})

        if ( !data.telefonos || data.telefonos.length === 0 ) 
            error.push({field: 'telefonos', label: 'Teléfono', msg: 'Campo incorrecto!!'})
        else if ( !data.telefono || data.telefono?.toString().trim() === '' ||  !ValidationsInstance.checkTelefono(data.telefono || '') )
            error.push({field: 'telefono', label: 'Teléfono', msg: 'Ingresar teléfono!!'})

        if ( !data.correos || data.correos.length === 0 ) 
            error.push({field: 'correos', label: 'Correo', msg: 'Campo incorrecto!!'})
        else if ( !data.correo || data.correo?.toString().trim() === '' ||  !ValidationsInstance.checkEmail(data.correo || '') )
            error.push({field: 'correo', label: 'Correo', msg: 'Ingresar correo!!'})
            
        if ( data.tipo_lead === 'Propietario' ) {
            // if ( !data.precio || data.precio.toString() === '' ) 
            //     error.push({field: 'precio', label: 'Precio', msg: 'Campo incorrecto!!'})

            // if ( !data.m2 || data.m2.toString() === '' ) 
            //     error.push({field: 'm2', label: 'm2', msg: 'Campo incorrecto!!'})

            // if ( !data.direccion || data.direccion.toString() === '' ) 
            //     error.push({field: 'direccion', label: 'Dirección', msg: 'Campo incorrecto!!'})

            // if ( !data.nro_edificio || data.nro_edificio.toString() === '' ) 
            //     error.push({field: 'nro_edificio', label: 'Nro edificio', msg: 'Campo incorrecto!!'})

            // if ( !data.nro_piso || data.nro_piso.toString() === '' ) 
            //     error.push({field: 'nro_piso', label: 'Nro piso', msg: 'Campo incorrecto!!'})

            // if ( !data.codigo_postal || data.codigo_postal.toString() === '' ) 
            //     error.push({field: 'codigo_postal', label: 'Código postal', msg: 'Campo incorrecto!!'})

            // if ( !data.localidad || data.localidad.toString() === '' || data.localidad.toString() === '-2' ) 
            //     error.push({field: 'localidad', label: 'Localidad', msg: 'Campo incorrecto!!'})
        }

        if ( !data.last_step || data.last_step.toString() === '' ) 
            error.push({field: 'last_step', label: 'Last step', msg: 'Campo incorrecto!!'})
        
        if ( !data.next_step || data.next_step.toString() === '' ) 
            error.push({field: 'next_step', label: 'Next step', msg: 'Campo incorrecto!!'})

        if ( !data.comentario || data.comentario.toString() === '' )
            error.push({field: 'comentario', label: 'Comentario', msg: 'Ingresar comentario!!'})

        return { error: error.length > 0, data: error }
    }
}

const MyLeadValidationInstance = new MyLeadValidation()
Object.freeze(MyLeadValidationInstance)

export default MyLeadValidationInstance