import React, { useMemo, useState } from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import { BsCalendar3 } from 'react-icons/bs'
import useVacaciones from '@/client/hooks/rrhhmaster/vacaciones/useVacaciones'
import VacacionesItemShare from './VacacionesItemShare'
import VacacionesListShare from './VacacionesListShare'
import useVacacionesShare from '@/client/hooks/share/vacaciones/useVacacionesShare'

const VacacionesContainerShare = (
  { pathAdd, pathEdit, typeTotalData, pathGetData }:
    {
      pathAdd: string,
      pathEdit: string,
      typeTotalData: string,
      pathGetData: string
    }) => {

  const {
    pageCurrent,
    listData,
    filterFields,
    loading,
    changeSearch,
    handleKeyDown,
    total,
    limit,
    flagFilter,
    handlerOnPage,
    handleActionSearch
  } = useVacacionesShare(typeTotalData, pathGetData)

  return (
    <div className="w-full max-w-[80rem] mx-auto px-2">
  <div className="w-full h-auto bg-primary/10 border border-secondary rounded-t-3xl grid table-filter">
        <div className="w-full pt-4 pl-2 pr-1 flex">
          <div className="w-full flex">
            <h1 className="w-full text-bold text-primary" style={{ fontSize: '22px' }}>{`Solicitudes`}</h1>
          </div>
          <div className="w-min flex justify-end">
            <Link className="ml-0 px-2 py-1 h-min text-[1rem] rounded-xl bg-primary/80 border border-secondary text-white hover:bg-secondary hover:text-primary" href={`${pathAdd}`}>Nuevo</Link>
          </div>
        </div>

        <div className="flex justify-end w-full h-[5rem] p-1">
          <div className="flex justify-end w-full h-[5rem] p-1">
            <div className="flex w-auto items-center justify-center h-full text-sm mr-3">
              {/* Filtros deshabilitados */}
            </div>
            <div className="flex items-center justify-end h-full">
              {/* Buscador deshabilitado */}
            </div>
          </div>
        </div>

        <div className={`w-full h-auto table-header`}>
          <div className="grid grid-cols-8 p-2 pl-2 text-bold text-white bg-primary/90">
            <div className="grid col-span-2"><span className='grid'>Nombre</span></div>
            <div className="grid col-span-2"><span className='grid'>Fecha Inico</span></div>
            <div className="grid col-span-2"><span className='grid'>Fecha Fin</span></div>
            <div className="grid col-span-2"><span className='grid'>Estado</span></div>
            <div className=""><span className='grid'></span></div>
          </div>
        </div>
      </div>

      <div>
        {
          loading ?
            <div className='text-primary text-center flex justify-center pt-1 pb-1'><SpinnerCustom /></div>
            :
            (
              listData.length === 0 ?
                <div className='table-empty text-black text-center flex justify-center pt-2 pb-2'>
                  <b>No hay registros <span>&#128549; &#128549;</span>!!</b>
                </div>
                :
                <>
                  <VacacionesListShare items={listData} pathEdit={pathEdit} />
                </>
            )
        }
      </div>
    </div>
  )
}

export default VacacionesContainerShare
