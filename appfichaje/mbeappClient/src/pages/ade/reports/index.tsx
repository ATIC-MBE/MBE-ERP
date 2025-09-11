import { menu_ade } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React from 'react'
import dynamic from "next/dynamic"
import useControlLimpiezaReport from '@/client/hooks/reports/ade/useControlLimpiezaReport'
import { BsCalendar3 } from 'react-icons/bs'
import SpinnerCustom from '@/components/SpinnerCustom'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { BiUser } from 'react-icons/bi'

const GeneratePDF = dynamic(()=>import("@/components/pdf/reportes/ade/controllimpieza/MarcacionReport"),{ssr:false})
const ReportByUserPDF = dynamic(()=>import("@/components/pdf/reportes/ade/controllimpieza/MarcacionByUserReport"),{ssr:false});

const AdeReports = () => {

    const _itemSelected = 'ade_reports'
    const { filterFields,
            loading,
            listData,
            flagFilter, 
            changeSearch, 
            handleKeyDownMarcacion,
            handleActionSearch,
            listDataUser,
            listDataDetails,
            loadingDetails,
            flagFilterDetails,
            changeSearchReportII,
            handleKeyDownMarcacionReportII,
            handleActionSearchReportII } = useControlLimpiezaReport()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (

        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_ade} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="w-full h-auto grid items-center">
                        <div className="lg:w-[80rem] w-[90vw] h-[32rem] bg-[#ffffff4b] rounded-3xl shadow-2xl grid grid-rows-6">
                            <div className=" row-span-3 grid items-center justify-items-center">
                                <div className=" flex flex-col items-center space-y-5 mt-20">
                                    <div className='flex flex-col items-center space-y-8'>
                                        <h1 className="text-lg color-black"><b>Reporte de marcación de limpieza [ General ]</b></h1>
                                        <div className="flex space-x-8 w-full h-auto">
                                            <div className="flex w-auto items-center justify-center h-full text-sm">                        
                                                <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <BsCalendar3 title='Fecha inicio' color='white' size={'1.2rem'} />
                                                </label>
                                                <input  placeholder='Fecha inicio' 
                                                        type="date" 
                                                        onChange={changeSearch}
                                                        onKeyDown={handleKeyDownMarcacion} 
                                                        name='m_start' 
                                                        value={filterFields.m_start} 
                                                        className="rounded-r-full px-1 h-[2.2rem] w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                            </div>
                                            <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                                                <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <BsCalendar3 title='Fecha fin' color='white' size={'1.2rem'} />
                                                </label>
                                                <input  placeholder='Fecha fin' 
                                                        type="date" 
                                                        onChange={changeSearch}
                                                        onKeyDown={handleKeyDownMarcacion} 
                                                        name='m_end' 
                                                        value={filterFields.m_end} 
                                                        className="rounded-r-full px-1 h-[2.2rem] w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                            </div>
                                            <div className="flex w-auto items-center justify-end1 h-full text-sm">
                                                <button onClick={handleActionSearch} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-2 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                                            </div>
                                        </div>

                                        
                                        {
                                            loading ? 
                                                <div className='text-blue text-center flex justify-center'><SpinnerCustom /></div> 
                                                :
                                                ( 
                                                    listData.length === 0 ? 
                                                        <div className='text-black text-center flex justify-center'><b>{flagFilter===0?'':<>Sin registros <span>&#128549; &#128549;</span>!!</>}</b></div>
                                                        : 
                                                        <div className='text-blue text-center flex justify-center'>
                                                            <GeneratePDF lData={listData} 
                                                                        dateStart={filterFields.m_start} 
                                                                        dateEnd={filterFields.m_end} />
                                                        </div>
                                                )
                                        }

                                    </div>
                                </div>

                                <hr className='flex flex-col w-[75%] border-[] border-[#0077bd] mt-5 mb-5' />
                                
                                <div className=" flex flex-col items-center space-y-5 mt-5">
                                    <div className='flex flex-col items-center space-y-8'>
                                        <h1 className="text-lg color-black"><b>Reporte de marcación de limpieza [ Persona ]</b></h1>
                                        <div className="flex space-x-8 w-full h-auto">
                                            <div className="flex w-auto items-center justify-center h-full text-sm">
                                                <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <BiUser title='Fecha inicio' color='white' size={'1.2rem'} />
                                                </label>
                                                <select className="h-min rounded-r-full p-2 w-[100%] col-span-6" value={filterFields.m_user_2} onChange={changeSearchReportII} name='m_user_2'>
                                                    { drawListOnSelect(listDataUser, 'lresp', 'Seleccionar personal') }
                                                </select>
                                            </div>
                                            <div className="flex w-auto items-center justify-center h-full text-sm">                        
                                                <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <BsCalendar3 title='Fecha inicio' color='white' size={'1.2rem'} />
                                                </label>
                                                <input  placeholder='Fecha inicio' 
                                                        type="date" 
                                                        onChange={changeSearchReportII}
                                                        onKeyDown={handleKeyDownMarcacionReportII}
                                                        name='m_start_2' 
                                                        value={filterFields.m_start_2} 
                                                        className="rounded-r-full px-1 h-[2.2rem] w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                            </div>
                                            <div className="flex w-auto items-center justify-end1 h-full text-sm">                        
                                                <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <BsCalendar3 title='Fecha fin' color='white' size={'1.2rem'} />
                                                </label>
                                                <input  placeholder='Fecha fin' 
                                                        type="date" 
                                                        onChange={changeSearchReportII}
                                                        onKeyDown={handleKeyDownMarcacionReportII} 
                                                        name='m_end_2' 
                                                        value={filterFields.m_end_2} 
                                                        className="rounded-r-full px-1 h-[2.2rem] w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                            </div>
                                            <div className="flex w-auto items-center justify-end1 h-full text-sm">
                                                <button onClick={handleActionSearchReportII} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-2 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                                            </div>
                                        </div>

                                        
                                        {
                                            loadingDetails ? 
                                                <div className='text-blue text-center flex justify-center'><SpinnerCustom /></div> 
                                                :
                                                ( 
                                                    listDataDetails.length === 0 ? 
                                                        <div className='text-black text-center flex justify-center'><b>{flagFilterDetails===0?'':<>Sin registros <span>&#128549; &#128549;</span>!!</>}</b></div>
                                                        : 
                                                        <div className='text-blue text-center flex justify-center'>
                                                            <ReportByUserPDF lData={listDataDetails}
                                                                        dateStart={filterFields.m_start_2}
                                                                        dateEnd={filterFields.m_end_2}
                                                                        persona={listDataUser.find(el => `${el.key}` === `${filterFields.m_user_2}`)?listDataUser.find(el => `${el.key}` === `${filterFields.m_user_2}`).name:'Desconocido'}
                                                                         />
                                                        </div>
                                                )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default AdeReports