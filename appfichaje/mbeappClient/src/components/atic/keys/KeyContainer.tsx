import React from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import Link from 'next/link'
import useKeysAtic from '@/client/hooks/atic/keys/useKeysAtic'
import KeyList from './KeyList'
import ReactPaginate from 'react-paginate'

const KeyContainer = () => {
  const {
    pageCurrent,
    listData,
    filterFields,
    loading,
    changeSearch,
    handleKeyDown,
    total,
    limit,
    handlerOnPage,
    handleActionSearch
  } = useKeysAtic()

  return (
    <div className="w-full max-w-[80rem] mx-auto p-4 grid gap-4">

      <div className="w-full bg-[#badaed] border border-blue rounded-t-3xl grid gap-4 p-4">

        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-primary mb-2 md:mb-0">LLaves</h1>
          <Link 
            href="/atic/keys/new" 
            className="px-4 py-2 rounded-xl bg-[#0077bd] border border-blue text-white text-base"
          >
            Nuevo
          </Link>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center space-x-2 w-full max-w-md">
            <input
              placeholder="Buscar..."
              className="rounded-full text-sm text-black border border-[#212529] px-4 py-2 flex-grow"
              type="text"
              name="search_all"
              value={filterFields.search_all}
              onChange={changeSearch}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleActionSearch}
              className="bg-[#0077bd] text-white px-4 py-2 rounded-xl border border-blue text-base"
              type="submit"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full h-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 p-2 text-white bg-[#0077BD] rounded-t-xl font-semibold text-center">
            <div className="col-span-1 text-left pl-4">LLave</div>
            <div className="col-span-1">Tipo de LLave</div>
            <div className="col-span-1">Pisos</div>
            <div className="col-span-1">nr_Locks</div>
            <div className="hidden md:block">{/* Espacio para posibles botones u opciones */}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-blue text-center py-4 flex justify-center">
            <SpinnerCustom />
          </div>
        ) : listData.length === 0 ? (
          <div className="table-empty text-black text-center py-4 font-bold">
            No hay registros <span>&#128549; &#128549;</span>!!
          </div>
        ) : (
          <KeyList items={listData} />
        )}

        <div className="w-full grid rounded-b-2xl bg-[#f7f7f7] p-4 items-center">
          <ReactPaginate
            forcePage={pageCurrent}
            activeClassName="item active"
            breakClassName="item break-me"
            breakLabel="..."
            containerClassName="pagination flex justify-center space-x-2"
            disabledClassName="disabled-page"
            marginPagesDisplayed={2}
            nextClassName="item next"
            nextLabel=">"
            onPageChange={handlerOnPage}
            pageCount={Math.ceil(total / limit)}
            pageClassName="item pagination-page"
            pageRangeDisplayed={limit}
            previousClassName="item previous"
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  )
}

export default KeyContainer
