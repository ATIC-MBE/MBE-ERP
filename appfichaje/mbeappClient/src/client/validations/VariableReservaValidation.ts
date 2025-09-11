import { IVariablesReserva } from "../models/IVariablesReserva"

class VariableReservaValidation {
    constructor() {}

    validateSave(data: IVariablesReserva): { error: boolean, data: Array<{field: string, label: string, msg: string}> } {
        let error: Array<{field: string, label: string, msg: string}> = []
        if ( !data.aplica || data.aplica.toString() === '' || data.aplica.toString() === '-2' ) 
            error.push({field: 'vr_variablereserva.aplica', label: 'Aplica', msg: 'Campo incorrecto!!'})

        if ( error.filter(el => el.field === 'vr_variablereserva.aplica').length === 0 ) {
            if ( data.aplica.toString() === 'Despues' && (!data.fecha_inicio_vigencia || data.fecha_inicio_vigencia.toString() === '') )
                error.push({field: 'vr_variablereserva.fecha_inicio_vigencia', label: 'Fecha inicio vigencia', msg: 'Campo incorrecto!!'})
        }

        // vr_variablereserva.precio_base
        if ( data.precio_base === undefined || data.precio_base.toString() === '' || parseFloat(data.precio_base.toString()) < 0.00 )
            error.push({field: 'vr_variablereserva.precio_base', label: 'Precio base', msg: 'Campo incorrecto!!'})

        if (    data.porcentaje_descuento === undefined || 
                data.porcentaje_descuento.toString() === '' || 
                (parseFloat(data.porcentaje_descuento.toString()) < 0.00 || parseFloat(data.porcentaje_descuento.toString()) > 100.00) )
            error.push({field: 'vr_variablereserva.porcentaje_descuento', label: 'Porcentaje descuento', msg: 'Campo incorrecto!!'})
        
        if ( data.precio_alquiler === undefined || data.precio_alquiler.toString() === '' || parseFloat(data.precio_alquiler.toString()) <= 0.00 )
            error.push({field: 'vr_variablereserva.precio_alquiler', label: 'Precio alquiler', msg: 'Campo incorrecto!!'})

        if ( data.precio_muebles === undefined || data.precio_muebles.toString() === '' || parseFloat(data.precio_muebles.toString()) <= 0.00 )
            error.push({field: 'vr_variablereserva.precio_muebles', label: 'Precio muebles', msg: 'Campo incorrecto!!'})

        if ( !data.idtipoestancia || data.idtipoestancia.toString() === '' || data.idtipoestancia.toString() === '-2' ) 
            error.push({field: 'vr_variablereserva.idtipoestancia', label: 'Estancia', msg: 'Campo incorrecto!!'})

        if ( error.filter(el => el.field === 'vr_variablereserva.idtipoestancia').length === 0 ) {
            if ( !data.duracion_estancia || data.duracion_estancia.toString() === '' || parseInt(data.duracion_estancia.toString()) <= 0 )
                error.push({field: 'vr_variablereserva.duracion_estancia', label: 'Duración', msg: 'Campo incorrecto!!'})
        }

        if ( data.edad_min === undefined || data.edad_min.toString() === '' || parseInt(data.edad_min.toString()) <= 0 )
            error.push({field: 'vr_variablereserva.edad_min', label: 'Edad [Valor mínimo]', msg: 'Campo incorrecto!!'})

        if ( data.edad_max === undefined || data.edad_max.toString() === '' || parseInt(data.edad_max.toString()) <= 0 )
            error.push({field: 'vr_variablereserva.edad_max', label: 'Edad [Valor máximo]', msg: 'Campo incorrecto!!'})

        if ( error.filter(el => el.field.includes('vr_variablereserva.edad_min') || el.field.includes('vr_variablereserva.edad_max')).length === 0 ) {
            if (    parseInt(data.edad_max!.toString()) < parseInt(data.edad_min!.toString())  ) {
                error.push({field: 'vr_variablereserva.edad_min', label: 'Edad [Valor mínimo]', msg: 'Campo incorrecto!!'})
                error.push({field: 'vr_variablereserva.edad_max', label: 'Edad [Valor máximo]', msg: 'Campo incorrecto!!'})
            }
        }

        if ( data.mascota === undefined )
            error.push({field: 'vr_variablereserva.mascota', label: 'Mascota', msg: 'Campo incorrecto!!'})
        
        return { error: error.length > 0, data: error }
    }
}

const VariableReservaValidationInstance = new VariableReservaValidation()
Object.freeze(VariableReservaValidationInstance)

export default VariableReservaValidationInstance