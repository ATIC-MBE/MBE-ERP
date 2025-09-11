import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React, { useMemo } from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { TIPO_LEADS, menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import OptionsOnSelect from "@/components/OptionsOnSelect"
import useMoverLead from "@/client/hooks/dnmaster/moverleads/useMoverLead"
import ButtonContainer from "@/components/ButtonContainer"
// import useLead from "@/client/hooks/dnmaster/leads/useLead"

const MoverLead = () => {

    const _itemSelected = 'dn_master_moverleads'
    const { searching, filterFields, listResponsable, listResponsableTarget, listInteresa, handleChange, handleSearch, handleMoveLeads, handleClear } = useMoverLead()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="w-full min-h-[40rem] px-[6rem] ">
                        <div className="w-[45rem] h-full rounded-3xl bg-[#0077bdaf] py-10 px-10 space-y-5">
                            {/* <h1>Mover Leads</h1> */}
                            {/* <div className=" w-full grid grid-cols-8 text-lg">
                                <label className='p-2 h-min w-[20rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Tipo Interes</label>
                                <select disabled = { filterFields.total_leads !== 0 } value={filterFields.idtipointeres} onChange={handleChange} name='idtipointeres' className="rounded-r-full p-2 w-[100%] col-span-5">
                                    { drawListOnSelect(listInteresa, 'lint', 'Seleccionar Interesa') }
                                </select>
                            </div> */}

                            <div className=" w-full grid grid-cols-8 text-lg">
                                <label className='p-2 h-min w-[20rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Tipo lead <span style={{color: 'red'}} className='field-required'>*</span></label>
                                <select disabled = { filterFields.total_leads !== 0 } value={filterFields.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-2 w-[100%] col-span-5">
                                    { useMemo(() => drawListOnSelect(TIPO_LEADS, 'tl', 'Seleccionar tipo lead'), []) }
                                </select>
                            </div>

                            <div className="w-full grid grid-cols-8 text-lg">
                                <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Perfil origen <span style={{color: 'red'}} className='field-required'>*</span></label>
                                <select disabled = { filterFields.total_leads !== 0 } value={filterFields.idresponsable_source} onChange={handleChange} name='idresponsable_source' className="rounded-r-full p-2 w-[100%] col-span-5">
                                    { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar Responsable source') }
                                </select>
                            </div>

                            <div className="w-full grid grid-cols-10 text-lg">
                                <label className='p-2 h-min1 w-[12rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                                <input readOnly = { filterFields.total_leads !== 0 } className="h-min p-2 w-[12rem] outline-blue-800 col-span-3" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                                <label className='p-2 h-min1 w-[4rem] bg-[#0077bd] text-white text-center col-span-1'>to</label>
                                <input readOnly = { filterFields.total_leads !== 0 } className="h-min rounded-r-full p-2 w-[14rem] outline-blue-800 col-span-3" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                            </div>

                            <div className="w-full grid grid-cols-8 text-lg">
                                    <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Total Leads filtrados</label>
                                    <input readOnly value={filterFields.total_leads} onChange={handleChange} type="number" name='total_leads' className="rounded-r-full p-2 w-[100%] col-span-5 outline-blue-800" />
                            </div>

                            { filterFields.total_leads === 0 ? 
                                <ButtonContainer>
                                    <button disabled={searching} onClick={handleSearch} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>{searching?'Buscando...':'Buscar'}</button>
                                </ButtonContainer>:''
                            }
                            { filterFields.total_leads !== 0 ? 
                            <>
                                <div className="w-full grid grid-cols-8 text-lg">
                                    <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Nro Lead a mover <span style={{color: 'red'}} className='field-required'>*</span></label>
                                    <input value={filterFields.nro_datos_mover} onChange={handleChange} type="number" name='nro_datos_mover' className="rounded-r-full p-2 w-[100%] col-span-5 outline-blue-800" />
                                </div>

                                <div className="w-full grid grid-cols-8 text-lg">
                                    <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>Perfil destino <span style={{color: 'red'}} className='field-required'>*</span></label>
                                    <select value={filterFields.idresponsable_target} onChange={handleChange} name='idresponsable_target' className="rounded-r-full p-2 w-[100%] col-span-5">
                                        { drawListOnSelect(listResponsableTarget, 'lrespt', 'Seleccionar Responsable target') }
                                    </select>
                                </div>
                                <ButtonContainer>
                                    <button onClick={handleMoveLeads} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Mover leads</button>
                                    <button onClick={handleClear} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Limpiar</button>
                                </ButtonContainer>
                            </>
                            : '' }
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default MoverLead