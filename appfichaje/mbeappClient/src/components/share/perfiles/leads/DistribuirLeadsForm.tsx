import { useMemo } from 'react'
import React from 'react'
import { TIPO_LEADS } from '@/client/helpers/constants'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import useMoverLead from '@/client/hooks/dnmaster/moverleads/useMoverLead'
import ButtonContainer from '@/components/ButtonContainer'
import useDistribuirLeads from '@/client/hooks/share/perfiles/leads/useDistribuirLeads'

const DistribuirLeadsForm = ({ pathToBack }: { pathToBack: string }) => {
    
    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    const { searching, 
            filterFields, 
            listResponsable, 
            listResponsableTarget, 
            listInteresa, 
            handleChange, 
            handleSearch, 
            handleMoveLeads, 
            handleClear } = useDistribuirLeads(pathToBack)

    return (
        <div className="w-auto min-h-[10rem] grid grid-flow-col">
            <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem]">
                <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                    <div className="min-h-[35rem] grid grid-cols-2m space-x-5">
                        <div className="h-full grid space-y-5">
                            <div className=" min-h-[14rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                                <h1 className='text-lg text-primary font-bold'>Distribuir Leads</h1>

                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto text-white w-[10rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                            Tipo lead <span style={{color: 'red'}} className='field-required'>*</span>
                                        </label>
                                        <select disabled = { filterFields.total_leads !== 0 } value={filterFields.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-1 w-[100%] col-span-6">
                                            { useMemo(() => drawListOnSelect(TIPO_LEADS, 'tl', 'Seleccionar tipo lead'), []) }
                                        </select>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-sm">
                                        <label className='p-2 h-min w-[10rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>
                                            Perfil origen <span style={{color: 'red'}} className='field-required'>*</span>
                                        </label>
                                        <select disabled = { filterFields.total_leads !== 0 } value={filterFields.idresponsable_source} onChange={handleChange} name='idresponsable_source' className="rounded-r-full p-1 w-[100%] col-span-6">
                                            { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar Responsable source') }
                                        </select>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-sm">
                                        <label className='p-2 h-min1 w-[9rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                                        <input readOnly = { filterFields.total_leads !== 0 } className="h-min p-2 w-[12rem] outline-blue-800 col-span-3" onChange={handleChange} value={filterFields.ns_start} type="date" name='ns_start' />
                                        <label className='p-2 h-min1 w-[4rem] bg-[#0077bd] text-white text-center col-span-1'>to</label>
                                        <input readOnly = { filterFields.total_leads !== 0 } className="h-min rounded-r-full p-2 w-[14rem] outline-blue-800 col-span-3" onChange={handleChange} value={filterFields.ns_end} type="date" name='ns_end' />
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-sm">
                                        <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>
                                            Total Leads filtrados
                                        </label>
                                        <input readOnly value={filterFields.total_leads} onChange={handleChange} type="number" name='total_leads' className="rounded-r-full p-2 w-[100%] col-span-5 outline-blue-800" />
                                    </div>
                                </div>

                                { filterFields.total_leads === 0 ? 
                                    <ButtonContainer>
                                        <button disabled={searching} onClick={handleSearch} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>{searching?'Buscando...':'Buscar'}</button>
                                    </ButtonContainer>:''
                                }
                                { filterFields.total_leads !== 0 ? 
                                <>
                                    <div className='grid grid-cols-2 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>
                                                Nro Lead a mover <span style={{color: 'red'}} className='field-required'>*</span>
                                            </label>
                                            <input value={filterFields.nro_datos_mover} onChange={handleChange} type="number" name='nro_datos_mover' className="rounded-r-full p-2 w-[100%] col-span-5 outline-blue-800" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-2'>
                                        <div className=" w-full flex text-sm">
                                            <label className='p-2 h-min w-[15rem] bg-[#0077bd] text-white rounded-l-full col-span-3'>
                                                Perfil destino <span style={{color: 'red'}} className='field-required'>*</span>
                                            </label>
                                            <select value={filterFields.idresponsable_target} onChange={handleChange} name='idresponsable_target' className="rounded-r-full p-2 w-[100%] col-span-5">
                                                { drawListOnSelect(listResponsableTarget, 'lrespt', 'Seleccionar Responsable target') }
                                            </select>
                                        </div>
                                    </div>

                                    <ButtonContainer>
                                        <button onClick={handleMoveLeads} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Mover leads</button>
                                        <button onClick={handleClear} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Limpiar</button>
                                    </ButtonContainer>
                                </>
                                : '' }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DistribuirLeadsForm