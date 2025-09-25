import React from 'react'
import { useRouter } from 'next/router'
import { BsPencilFill } from 'react-icons/bs'
import useVacacionesItem from '@/client/hooks/rrhhmaster/vacaciones/useVacacionesItems'
import { IVacaciones } from '@/client/models/IVacaciones'

const VacacionesItem = ({ item, pathEdit, index }: { item: IVacaciones, pathEdit: string, index: number }) => {
  const router = useRouter()

  const {
    itemContent,
    goEditData,
  } = useVacacionesItem(item, pathEdit)

  return (
    <div className="w-full h-auto">
      <div 
        style={{ 
          backgroundColor: index % 2 === 0 ? 'rgba(0, 83, 96, 0.15)' : 'white',
          color: itemContent.estado === 0 ? 'red' : '#005360'
        }}
        className={`data-table-row-nopointer grid grid-cols-10 p-2`}>
        <div className='col-span-2 truncate'>{itemContent.nombre_completo}</div>
        <div className='col-span-1 truncate'>{itemContent.fecha_inicio}</div>
        <div className='col-span-1 truncate'>{itemContent.fecha_final}</div>
        <div className='col-span-1 truncate'>{itemContent.estado_solicitud}</div>
        <div className='col-span-4 truncate'>{itemContent.tipo_ausencia_permiso}</div>
        <div className='flex justify-end'>
          <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
            <BsPencilFill title='Editar' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VacacionesItem
