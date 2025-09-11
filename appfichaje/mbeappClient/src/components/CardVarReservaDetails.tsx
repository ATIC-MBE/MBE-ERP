import { IVariablesReserva } from '@/client/models/IVariablesReserva'
import { AiFillCloseCircle } from 'react-icons/ai'

const CardVarReservaDetails = ( { data, index }: { data: IVariablesReserva, index: number } ) => {
    return (
    <div className="bg-neutral/80 w-[90%] rounded-2xl p-5 space-y-2 h-full">
            <div className='flex'>
                <h1 className='text-lg text-primary font-bold w-[95%]'>Configuración #{index+1}</h1>
                <div onClick={() => data.delete()} className="flex items-end w-[1.5rem]">
                    <AiFillCloseCircle className='text-primary cursor-pointer' size={'2rem'} />
                </div>
            </div>
            <div className='flex'>
                <label className='text-bold'>Aplica:</label>
                <span className='px-2'>{ data.aplica == 'Ahora' ? 'Ahora' : (data.aplica == 'Despues') ? 'Despues' : 'Na' }</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Estado:</label>
                <span className={`px-2 text-bold ${data.estado == 2?'txt-green':'txt-red'}`}>{ data.estado == 2 ? 'Activo' : (data.estado == 7) ? 'Pendiente' : 'Na' }</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Fecha inicio vigencia:</label>
                <span className='px-2'>{data.fecha_inicio_vigencia}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Precio base:</label>
                <span className='px-2'>€ {data.precio_base}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Descuento:</label>
                <span className='px-2'>{data.porcentaje_descuento} %</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Precio alquiler:</label>
                <span className='px-2'>€ {data.precio_alquiler}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Precio muebles:</label>
                <span className='px-2'>€ {data.precio_muebles}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Total:</label>
                <span className='px-2'>€ {data.total}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Estancia:</label>
                <span className='px-2'>{data.n_estancia}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Duración:</label>
                <span className='px-2'>{data.duracion_estancia}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Edad:</label>
                <span className='px-2'>Entre {data.edad_min} y {data.edad_max} años</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Mascota:</label>
                <span className='px-2'>{data.mascota?'Si':'No'}</span>
            </div>
            <div className='flex'>
                <label className='text-bold'>Comentario:</label>
                <span className='px-2'>{data.observacion}</span>
            </div>
        </div>
    )
}

export default CardVarReservaDetails