import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import useMyLead from "@/client/hooks/dn/myleads/useMyLead"
import OptionsOnSelect from "@/components/OptionsOnSelect"

const MyLead = () => {

    const _itemSelected = 'dn_myleads'
    const { listData, headerTable, loading, filterFields, listResponsable, listTypeLead, handleChange, handleSearch } = useMyLead()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string, addSelecionar?: boolean) => {
        addSelecionar = addSelecionar != undefined ? addSelecionar : true
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} addSelecionar={addSelecionar} />
    }

    const drawActions = () => {
        return (<></>)
    }

    const drawfilters = () => {
        return (
            <>
                <div className='w-full grid grid-cols-1 space-x-2 justify-end'>
                    {/* <div className="w-[100%] flex text-xs px-5 justify-end">
                        <div className="w-[15rem] flex text-xs">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Tipo lead</label>
                            <select className="h-min rounded-r-full p-2 w-[50%] col-span-5" value={filterFields.tipo_lead} onChange={handleChange} name='tipo_lead'>
                                    { drawListOnSelect(listTypeLead, 'tl', 'Seleccionar', listTypeLead.length > 1? true: false) }
                            </select>
                        </div>
                        <div className="w-[17rem] flex text-xs mr-0">
                            <label className='p-2 h-min w-[5.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Responsable</label>
                            <select className="h-min rounded-r-full py-2 w-[50%] col-span-2" value={filterFields.idresponsable} onChange={handleChange} name='idresponsable'>
                                { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar') }
                            </select>
                        </div>
                        <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                        <input className="h-min p-2 w-[8rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                        <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>to</label>
                        <input className="h-min rounded-r-full p-2 w-[8rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                        <button onClick={handleSearch} className='ml-4 bg-[#0077bd] h-min text-white p-2 text-[1rem] border border-blue rounded-xl' type='button'>Buscar</button>
                    </div> */}
                    <div className="w-[100%] flex text-xs px-5 justify-end">
                        <div className="w-[36%] flex text-xs mr-0">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-1'>Teléfono</label>
                            <input placeholder="Ingresar teléfono" className="h-min rounded-r-full p-2 w-[7rem] outline-blue-800" onChange={handleChange} value={filterFields.telefono} type="text" name='telefono' />
                        </div>
                        <div className="w-[20rem] flex text-xs">
                            <label className='p-2 h-min w-[4.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Tipo lead</label>
                            <select className="h-min rounded-r-full p-2 w-[50%] col-span-5" value={filterFields.tipo_lead} onChange={handleChange} name='tipo_lead'>
                                    { drawListOnSelect(listTypeLead, 'tl', 'Seleccionar', listTypeLead.length > 1? true: false) }
                            </select>
                        </div>
                        <div className="w-[30rem] flex text-xs mr-0">
                            <label className='p-2 h-min w-[5.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Responsable</label>
                            <select className="h-min rounded-r-full py-2 w-[50%] col-span-2" value={filterFields.idresponsable} onChange={handleChange} name='idresponsable'>
                                { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar') }
                            </select>
                        </div>
                        <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                        <input className="h-min p-2 w-[10rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                        <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>to</label>
                        <input className="h-min rounded-r-full p-2 w-[10rem] outline-blue-800" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                        <button onClick={handleSearch} className='ml-4 bg-[#0077bd] h-min text-white p-2 text-[1rem] border border-blue rounded-xl' type='button'>Buscar</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} drawfilters={drawfilters} title="Mis Leads"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default MyLead