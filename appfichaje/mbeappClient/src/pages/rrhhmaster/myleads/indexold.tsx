import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master, menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
// import useMyLead from "@/client/hooks/dnmaster/myleads/useMyLead"
import OptionsOnSelect from "@/components/OptionsOnSelect"
import TableContainerML from "@/components/TableContainerML"
import useMyLead from "@/client/hooks/rrhhmaster/myleads/useMyLead"

const MyLead = () => {

    const _itemSelected = 'rrhh_master_myleads'
    const { listData, 
            headerTable, 
            loading, 
            filterFields, 
            handleChange, 
            handleSearch,
            goEditData } = useMyLead()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string, addSelecionar?: boolean) => {
        addSelecionar = addSelecionar != undefined ? addSelecionar : true
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} addSelecionar={addSelecionar} />
    }

    const drawActions = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return (<></>)
    }

    const drawfilters = () => {
        return (
            <>
                <div className='grid space-x-2 justify-end'>
                    <form onSubmit={handleSearch} className="w-[100%] flex justify-end overflow-hidden">
                        <div className="w-[100%] grid grid-cols-2 text-xs px-5 justify-end">
                            <div className="w-[90%] flex text-xs ml-0">
                                <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Buscar</label>
                                <input placeholder="Persona | Teléfono" className="h-min rounded-r-full p-2 w-[20rem] outline-blue-800" onChange={handleChange} value={filterFields.search_all} type="text" name='search_all' />
                            </div>
                            <div className="w-[100%] flex text-xs mr-0">
                                <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                                <input className="h-min p-2 w-[8rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                                <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>to</label>
                                <input className="h-min rounded-r-full p-2 w-[8rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                                <button onClick={handleSearch} className='ml-4 bg-[#0077bd] h-min text-white p-2 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                            </div>
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
                        {/* <TableContainer nro_cols={7} drawactions={drawActions} drawfilters={drawfilters} title="Mis Leads"  header={headerTable} data={listData} loading={loading} /> */}
                        <TableContainerML actionOnRow={goEditData} nro_cols={7} drawactions={drawActions} drawfilters={drawfilters} title="Mis Leads"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default MyLead