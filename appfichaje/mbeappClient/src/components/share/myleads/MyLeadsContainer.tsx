import React, { useMemo, useState } from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import { BsCalendar3 } from 'react-icons/bs'
import ReactPaginate from 'react-paginate'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import MyLeadsList from './MyLeadsList'
import useMyLead from '@/client/hooks/share/myleads/useMyLead'

const MyLeadsContainer = ({ pathEdit }: {pathEdit: string}) => {
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
            listResponsable,
            handlerOnPage,
            handleActionSearch 
    } = useMyLead()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <div className="w-[80rem] h-auto grid1 grid-flow-row1">
            <div className="w-[80rem] h-auto bg-[#badaed] border border-blue rounded-t-3xl grid table-filter">
                <div className="w-full pt-4 pl-2 pr-1 flex">
                    <div className="w-full flex">
                        <h1 className='text-lg text-primary font-bold'>{ `Mis Leads` }</h1>
                    </div>
                </div>

                <div className="flex justify-end w-full h-[5rem] p-1">
                    <div className="flex w-auto items-center justify-center h-full text-sm mr-3">                        
                        <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                            <BsCalendar3 title='Next step inicio' color='white' size={'1.2rem'} />
                        </label>
                        <input title='Next step inicio'  className="h-min p-2 w-[8.5rem] outline-blue-800" 
                                onChange={changeSearch} 
                                onKeyDown={handleKeyDown}
                                value={filterFields.ns_start} 
                                type="date" name='ns_start' />
                        <label title='Next step fin' className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>a</label>
                        <input  className="h-min rounded-r-full p-2 w-[8.5rem] outline-blue-800"
                                title='Next step fin' 
                                onChange={changeSearch}
                                onKeyDown={handleKeyDown} 
                                value={filterFields.ns_end} 
                                type="date" 
                                name='ns_end' />
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
                        <button onClick={handleActionSearch} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-1 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                    </div>
                </div>

                <div className={`w-full h-auto table-header`}>
                    <div className="grid grid-cols-5 p-2 pl-2 text-bold text-white bg-[#0077BD]">
                        <div className="grid col-span-2"><span className=''>Persona</span></div>
                        <div className=""><span className='grid'>Teléfonos</span></div>
                        <div className=""><span className='grid'>Next Step</span></div>
                        <div className=""><span className='grid'>Last Step</span></div>
                    </div>
                </div>
            </div>

            <div>
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
                                            <MyLeadsList items={listData} pathEdit={pathEdit} /> 
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
                        pageRangeDisplayed={8}
                        previousClassName={"item previous"}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default MyLeadsContainer