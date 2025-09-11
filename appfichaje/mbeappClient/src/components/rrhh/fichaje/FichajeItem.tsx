import React from 'react'
import { useRouter } from 'next/router'
import { BsPencilFill } from 'react-icons/bs'
import { IFichaje } from '@/client/models/IFichaje'
import useFichajeItem from '@/client/hooks/rrhhmaster/fichaje/useFichajeItem'

import { FaSadTear, FaSmile } from 'react-icons/fa'

const FichajeItem = ({ item } : 
                            {
                                item: IFichaje
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData
        } = useFichajeItem(item)

    // const getValueHoras = (dateStart: string, dateEnd: string): string => {
    //     if (dateStart.trim() === '' || dateEnd.trim() === '') return '0h 0min'
    //     let {h, m} = UtilCustomInstance.getHoursMinDiff(`${dateStart}:00`, `${dateEnd}:00`)
    //     return `${h}h ${m}min`
    // }


    // Carita feliz si entrada <= 09:05, triste si después
    const getFaceIcon = (entrada?: string) => {
        if (!entrada) return null;
        // Formato esperado: '08:59' o '09:05'
        const [h, m] = entrada.split(":").map(Number);
        if (h < 9 || (h === 9 && m <= 5)) {
            return <FaSmile color="green" title="Puntual" style={{marginRight:4}} />;
        } else {
            return <FaSadTear color="red" title="Tarde" style={{marginRight:4}} />;
        }
    };

    return (
        <div className={`w-full h-auto`}>
            <div className={`data-table-row-nopointer grid grid-cols-7 p-1 pl-2`}>
                {/* Departamento en mayúsculas */}
                <div>
                    <span className='flex'>
                        {(itemContent.idrol || '').toUpperCase()}
                    </span>
                </div>
                {/* Persona con carita */}
                <div className="grid col-span-2">
                    <span className='flex items-center'>
                        {getFaceIcon(itemContent.h_entrada)}{itemContent.full_name}
                    </span>
                </div>
                {/* Fecha */}
                <div>
                    <span className='flex'>
                        {itemContent.fecha_str}
                    </span>
                </div>
                {/* Entrada */}
                <div>
                    <span className='flex'>
                        {itemContent.h_entrada}
                    </span>
                </div>
                {/* Salida, rojo si vacío */}
                <div>
                    <span className={`flex${!itemContent.h_salida ? ' text-red-600 font-bold' : ''}`}>
                        {itemContent.h_salida || '—'}
                    </span>
                </div>
                {/* Editar */}
                <div className='grid justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-end rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FichajeItem