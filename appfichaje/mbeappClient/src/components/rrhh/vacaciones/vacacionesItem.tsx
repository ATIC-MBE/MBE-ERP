import React from 'react'
import { useRouter } from 'next/router'
import { BsPencilFill } from 'react-icons/bs'
import useVacacionesItem from '@/client/hooks/rrhhmaster/vacaciones/useVacacionesItems'
import { IVacaciones } from '@/client/models/IVacaciones'

const VacacionesItem = ({ item, pathEdit }: { item: IVacaciones, pathEdit: string }) => {
  const router = useRouter()

  const {
    itemContent,
    goEditData,
  } = useVacacionesItem(item, pathEdit)

  return (
    <div className="w-full h-auto">
      <div className={`data-table-row-nopointer grid grid-cols-9 p-2 gap-2 ${itemContent.estado === 0 ? 'text-[red]' : 'text-[#0077BD]'}`}>
        <div className='col-span-2 truncate'>{itemContent.nombre_completo}</div>
        <div className='col-span-2 truncate'>{itemContent.fecha_inicio}</div>
        <div className='col-span-2 truncate'>{itemContent.fecha_final}</div>
        <div className='col-span-2 truncate'>{itemContent.estado_solicitud}</div>
        <div className='flex justify-end'>
          <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
            <BsPencilFill className='mt-1' title='Editar' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VacacionesItem
