import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { STATES, TIPO_LEADS, menu_dn_master, menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import OptionsOnSelect from "@/components/OptionsOnSelect"
// import useLead from "@/client/hooks/dnmaster/leads/useLead"
import TableContainerL from "@/components/TableContainerL"
import useLead from "@/client/hooks/rrhhmaster/leads/useLead"

const Lead = () => {

    const _itemSelected = 'rrhh_master_leads'
    const { listData, 
            headerTable, 
            loading, 
            filterFields, 
            listResponsable, 
            handleChange, 
            handleSearch, 
            goEditData } = useLead()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    const drawActions = () => {
        return (
            <>
                <Link className="p-1 ml-2 px-2 h-min text-[1rem] rounded-xl bg-[#0077bd] border border-blue text-white" href='/rrhhmaster/leads/new'>Nuevo</Link>
            </>
        )
    }

    const drawfilters = () => {
        return (
            <>
                <div className='grid space-x-2 justify-end'>
                    <form onSubmit={handleSearch} className="w-[100%] flex justify-end overflow-hidden">
                        <div className="w-[45%] flex text-xs ml-10 mr-4">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Buscar</label>
                            <input placeholder="Persona | Teléfono" className="h-min rounded-r-full p-2 w-[15rem] outline-blue-800" onChange={handleChange} value={filterFields.search_all} type="text" name='search_all' />
                        </div>
                        <div className="w-[35%] flex text-xs mr-1">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Tipo lead</label>
                            <select className="h-min rounded-r-full p-2 w-[55%] col-span-6" value={filterFields.tipo_lead} onChange={handleChange} name='tipo_lead'>
                                    { drawListOnSelect(TIPO_LEADS, 'tl', 'Seleccionar') }
                            </select>
                        </div>
                        <div className="w-[35%] flex text-xs mr-0">
                            <label className='p-2 h-min w-[4rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Perfil</label>
                            <select className="h-min rounded-r-full p-2 w-[60%] col-span-6" value={filterFields.idresponsable} onChange={handleChange} name='idresponsable'>
                                { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar') }
                            </select>
                        </div>
                        <div className="w-[33%] flex text-xs mr-0">
                            <label className='p-2 h-min w-[10rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                            <input className="h-min p-2 w-[14rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                            <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>to</label>
                            <input className="h-min rounded-r-full p-2 w-[14rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                            <button onClick={handleSearch} className='ml-2 bg-[#0077bd] h-min text-white p-2 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                        </div>
                    </form>
                </div>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainerL actionOnRow={goEditData} nro_cols={7} drawactions={drawActions} drawfilters={drawfilters} title="All Leads"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Lead