import React, { useMemo, useState } from 'react'
import SpinnerCustom from '../../../SpinnerCustom'
import { BsCalendar3 } from 'react-icons/bs'
import Link from 'next/link'
//import useControlLimpieza from '@/client/hooks/ade/controllimpieza/useControlLimpieza'
import ReactPaginate from 'react-paginate'
import GrupoPrescriptorList from './GrupoPrescriptorList'
import useGrupoPrescriptor from '@/client/hooks/dn/grupo/prescriptor/useGrupoPrescriptor'
// import Pagination from "";

const GrupoPrescriptorContainer = () => {
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
        } = useGrupoPrescriptor()

    return (
        <div className="w-[80rem] h-auto grid1 grid-flow-row1">

            <div className="w-[80rem] h-auto bg-[#badaed] border border-blue rounded-t-3xl grid table-filter">
                <div className="w-full pt-4 pl-2 pr-1 flex">
                    <div className="w-full flex">
                        <h1 className="w-full text-bold text-blue" style={{fontSize:'22px'}}>{ `Prescriptores` }</h1>
                    </div>
                    {/* <div className="w-min flex justify-end">
                        <Link className="ml-0 px-2 py-1 h-min text-[1rem] rounded-xl bg-[#0077bd] border border-blue text-white" href='/ade/controllimpieza/new'>Nuevo</Link>
                    </div> */}
                </div>

                <div className="flex justify-end w-full h-[5rem] p-1">    
                    <div className="flex items-center justify-end h-full">
                        <input  placeholder='Buscar...' 
                                className='rounded-full text-sm text-black border border1-[#212529] px-2 py-1 w-[15rem] h-[2.2rem]' 
                                type="text"
                                name='search_all' 
                                value={filterFields.search_all} 
                                onChange={changeSearch} 
                                onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleActionSearch} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-1 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                    </div>
                </div>
            </div>

            <div>
                <div className={`w-full h-auto table-header`}>
                    <div className="grid grid-cols-7 p-2 pl-2 text-bold text-white bg-[#0077BD]">
                        <div className="grid col-span-2"><span className='grid'>Grupo</span></div>
                        <div className="grid"><span className='grid'>Whatsapp</span></div>
                        {/* <div className=""><span className='flex'>Whatsapp</span></div> */}
                        <div className=""><span className='grid'>Next step</span></div>
                        <div className=""><span className='grid justify-end'># Visitas</span></div>
                        <div className=""><span className='grid justify-end'># Reservas</span></div>
                        <div className=""><span className='grid justify-end'># Propietarios</span></div>
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
                                            <GrupoPrescriptorList items={listData} />
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

export default GrupoPrescriptorContainer