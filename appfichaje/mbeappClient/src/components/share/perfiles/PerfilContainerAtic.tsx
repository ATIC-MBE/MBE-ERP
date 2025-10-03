import React from 'react'
import SpinnerCustom from '../../SpinnerCustom'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import PerfilList from './PerfilList'
import usePerfilDN from '@/client/hooks/share/perfiles/usePerfilDN'

interface Props {
  pathAdd: string
  pathEdit: string
  typeTotalData: string
  pathGetData: string
  pathMoverLead: string
}

const PerfilContainerAtic = ({
  pathAdd,
  pathEdit,
  typeTotalData,
  pathGetData,
  pathMoverLead,
}: Props) => {
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
    handleActionSearch,
  } = usePerfilDN(typeTotalData, pathGetData)

  return (
    <div className="w-full max-w-[80rem] mx-auto p-4 grid gap-4">

      {/* Header + Filtros */}
      <div className="w-full bg-[#badaed] border border-blue rounded-t-3xl p-4 grid gap-4">
        
        {/* Título y botones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Perfiles DN</h1>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <Link
              href={pathMoverLead}
              className="px-4 py-2 rounded-xl bg-[#0077bd] border border-blue text-white text-base"
            >
              Distribuir leads
            </Link>
            <Link
              href={pathAdd}
              className="px-4 py-2 rounded-xl bg-[#0077bd] border border-blue text-white text-base"
            >
              Nuevo
            </Link>
          </div>
        </div>

        {/* Input de búsqueda */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-2 w-full max-w-md">
            <input
              placeholder="Buscar..."
              className="rounded-full text-sm text-black border border-[#0077bd] px-4 py-2 flex-grow"
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

        {/* Cabecera de tabla */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-2 text-white bg-[#0077BD] rounded-t-xl font-semibold text-sm text-center">
          <div className="text-left pl-4">Código</div>
          <div className="md:col-span-3">Responsable</div>
          <div># Leads</div>
          <div className="hidden md:block">{/* Acciones */}</div>
        </div>
      </div>

      {/* Lista o estado de carga */}
      <div>
        {loading ? (
          <div className="text-blue text-center py-4 flex justify-center">
            <SpinnerCustom />
          </div>
        ) : listData.length === 0 ? (
          <div className="text-black text-center py-4 font-bold">
            No hay registros <span>&#128549; &#128549;</span>!!
          </div>
        ) : (
          <PerfilList items={listData} pathEdit={pathEdit} />
        )}
      </div>

      {/* Paginación */}
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
          pageRangeDisplayed={8}
          previousClassName="item previous"
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
}

export default PerfilContainerAtic
