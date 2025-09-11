import React from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import useControlLimpiezaItem from '@/client/hooks/ade/controllimpieza/useControlLimpiezaItem'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { BsPencilFill } from 'react-icons/bs'
import { IKeys } from '@/client/models/IKeys'
import useKeysAtic from '@/client/hooks/atic/keys/useKeysAtic'
import useKeysAticItem from '@/client/hooks/atic/keys/useKeysAticItem'

const KeyItem = ({ item }:
    {
        item: IKeys
    }) => {

    const router = useRouter()

    const {
        itemContent,
        goEditData,

    } = useKeysAticItem(item)

    const getColorRow = (estado: number, etiqueta: string ,estado_piso:number): string => {
        if (etiqueta.toLocaleLowerCase() === 'libre') return 'text-[green] text-bold'
        // else if (estado === 0 || estado === -1) return 'text-[red] text-bold'
        return 'text-[#0077BD]'
    }

    const getBackgroudRow = (estado: number): string => {
        if (estado === 0) return 'bg-[#fde3b2]'
        else if (estado === -1) return 'bg-[#fbd0d0]'
        return ''
    }

    return (
        <div className={`w-full h-auto`}>
            <div
                className={`data-table-row-nopointer ${getBackgroudRow(itemContent.estado == undefined ? -2 : itemContent.estado)} grid grid-cols-5 p-1 pl-2 text-[#0077BD]`}>

                <div>
                    <span className='flex'>
                        {itemContent.idqr}
                    </span>
                </div>

                <div>
                    <span className='flex justify-center'>
                        {itemContent.tipo_tarjeta}
                    </span>
                </div>


                <div className='flex justify-center'>
                    <span className={`flex ${getColorRow(itemContent.estado || -2, itemContent.pisos_str || '', itemContent.estado_piso === undefined ? -2 : itemContent.estado_piso)}`}    >
                        {itemContent.pisos_str}
                    </span>
                </div>

                <div className='flex justify-center'>
                    <span>
                        {itemContent.nro_locks}
                    </span>
                </div>
                
                <div className='flex justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KeyItem