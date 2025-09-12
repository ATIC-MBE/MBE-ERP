import React, { useMemo, useState } from 'react'
import { BsCalendar3 } from 'react-icons/bs'
import Link from 'next/link'
import useControlLimpieza from '@/client/hooks/ade/controllimpieza/useControlLimpieza'
import ReactPaginate from 'react-paginate'
import FichajeList from './FichajeList'
import SpinnerCustom from '../../SpinnerCustom'
import useFichaje from '@/client/hooks/rrhhmaster/fichaje/useFichaje'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
//import ControlLimpiezaList from './ControlLimpiezaList'
// import Pagination from "";

const FichajeContainer = () => {
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
        } = useFichaje()

    return (
        <div className="w-[80rem] h-auto grid1 grid-flow-row1">

            <div className="w-[80rem] h-auto bg-[#005360]/10 border border-[#005360] rounded-t-3xl grid table-filter">
                <div className="w-full pt-4 pl-2 pr-1 flex">
                    <div className="w-full flex">
                        <h1 className="w-full text-bold text-blue" style={{fontSize:'22px'}}>{ `Fichaje Oficina` }</h1>
                    </div>
                    <div className="w-min flex justify-end">
                        <Link className="ml-0 px-2 py-1 h-min text-[1rem] rounded-xl bg-[#005360] border border-[#005360] text-white" href='/rrhhmaster/fichaje/new'>Nuevo</Link>
                    </div>
                </div>

                <div className="flex justify-end w-full h-[5rem] p-1">    
                    <div className="flex w-auto items-center justify-center h-full text-sm mr-3">                        
                        <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#005360] border border-[#005360] text-red rounded-l-full col-span-2'>
                            <BsCalendar3 title='Fecha inicio' color='white' size={'1.2rem'} />
                        </label>
                        <input  className="h-min p-2 w-[8.5rem] outline-blue-800" 
                                onChange={changeSearch} 
                                onKeyDown={handleKeyDown}
                                value={filterFields.m_start} 
                                type="date" name='m_start' />
                        <label className='p-2 h-min w-[2rem] bg-[#005360] text-white col-span-2'>a</label>
                        <input  className="h-min rounded-r-full p-2 w-[8.5rem] outline-blue-800" 
                                onChange={changeSearch}
                                onKeyDown={handleKeyDown} 
                                value={filterFields.m_end} 
                                type="date" 
                                name='m_end' />
                    </div>

                    <div className="flex items-center justify-end h-full">
                        <input  placeholder='Buscar...' 
                                className='rounded-full text-sm text-black border border1-[#212529] px-2 py-1 w-[15rem] h-[2.2rem]' 
                                type="text"
                                name='search_all' 
                                value={filterFields.search_all} 
                                onChange={changeSearch} 
                                onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleActionSearch} className='ml-2 bg-[#005360] h-min text-white px-2 py-1 text-[1rem] border border-[#005360] rounded-xl' type='submit'>Buscar</button>
                    </div>
                </div>
            </div>

            <div>
                <div className={`w-full h-auto table-header`}>
                    <div className="grid grid-cols-7 p-2 pl-2 text-bold text-white bg-[#005360]">
                        <div className=""><span className='flex'>Departamento</span></div>
                        <div className="grid col-span-2"><span className=''>Persona</span></div>
                        <div className=""><span className='flex'>Fecha</span></div>
                        <div className=""><span className='flex'>Entrada</span></div>
                        <div className=""><span className='flex'>Salida</span></div>
                        <div className=""><span className='grid text-right'>&nbsp;</span></div>
                    </div>
                </div>
                {
                    loading ? 
                                <div className='text-blue text-center flex justify-center pt-1 pb-1'><SpinnerCustom /></div> 
                                :
                                ( 
                                    listData.length === 0 ? 
                                        <div className='table-empty text-black text-center flex justify-center pt-2 pb-2'>
                                            <b>No hay registros <span>&#128549; &#128549;</span>!!</b>
                                        </div>
                                        : 
                                        <>
                                            <FichajeList items={listData} /> 
                                        </>
                                        
                                )
                }
                <div className={`w-full grid rounded-b-2xl h-auto pagination-content items-center bg-[#f7f7f7]`}>
                        <ReactPaginate
                        forcePage={pageCurrent}
                        activeClassName={'item active '}
                        breakClassName={'item break-me '}
                        breakLabel={'...'}
                        containerClassName={'pagination'}
                        disabledClassName={'disabled-page'}
                        marginPagesDisplayed={2}
                        nextClassName={"item next "}
                        nextLabel=">"
                        onPageChange={ (e) => handlerOnPage(e) }
                        pageCount={ Math.ceil(total/limit)}
                        pageClassName={'item pagination-page '}
                        pageRangeDisplayed={limit}
                        previousClassName={"item previous"}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default FichajeContainer