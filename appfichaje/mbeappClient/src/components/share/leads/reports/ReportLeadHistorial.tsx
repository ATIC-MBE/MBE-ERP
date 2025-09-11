import useReportLeadHistorial from "@/client/hooks/share/leads/report/useReportLeadHistorial"
import SpinnerCustom from "@/components/SpinnerCustom"
import { BsCalendar3 } from "react-icons/bs"

const ReportLeadHistorial = () => {
    const {
        listData,
        loading,
        nroPrescriptor,
        nroPropietario,

        filterFields,

        changeSearch,
        handleKeyDownMarcacion,
        handleActionSearch
    } = useReportLeadHistorial()

    return (
        <div>
            <div className="flex space-x-8 w-full h-auto items-center justify-center">
                <div className="flex w-auto items-center justify-center h-full text-sm mr-3">                        
                    <label className='px-3 py-2 h-[2.2rem] w-[2.5rem] bg-[#0077bd] border border-[#0077bd] text-red rounded-l-full col-span-2'>
                        <BsCalendar3 title='Next step inicio' color='white' size={'1.2rem'} />
                    </label>
                    <input title='Next step inicio'  className="h-min p-2 w-[8.5rem] outline-blue-800" 
                            onChange={changeSearch} 
                            onKeyDown={handleKeyDownMarcacion}
                            value={filterFields.m_start} 
                            type="date" name='m_start' />
                    <label title='Next step fin' className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>a</label>
                    <input  className="h-min rounded-r-full p-2 w-[8.5rem] outline-blue-800"
                            title='Next step fin' 
                            onChange={changeSearch}
                            onKeyDown={handleKeyDownMarcacion} 
                            value={filterFields.m_end} 
                            type="date" 
                            name='m_end' />
                </div>

                <div className="flex w-auto items-center justify-end1 h-full text-sm">
                    <button onClick={handleActionSearch} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-2 text-[1rem] border border-blue rounded-xl' type='submit'>Buscar</button>
                </div>
            </div>

            <br />

            {
                loading ? 
                    <div className='text-blue text-center flex justify-center pt-1 pb-1'><SpinnerCustom /></div> 
                :
                    ( 
                        listData.length === 0 ? 
                            <div className="ml-5">Sin registros!! <span style={{fontSize: '26px'}}>&#128549; &#128549;</span></div>
                            : 
                            <div className="grid space-y-4 text-xx col">
                                <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
                                    <legend className="flexxx ml-1 mr-1 text-black font-bold text-ms">Llamadas&nbsp;&nbsp;<span className="text-lg text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">{listData.filter(el=>el.tipo.toLocaleLowerCase()==='calls_users').reduce(((a,b)=> a + b.estadistica),0)}</span></legend>
                                    {
                                        listData.filter(el=>el.tipo.toLocaleLowerCase()==='calls_users').map((el, index) => {
                                                return <div className="pl-5" key={`users-${index}`}><span className="text-bold">{el.usr_responsable}:</span>&nbsp;&nbsp;<span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">{el.estadistica || 0}</span></div>
                                        }) 
                                    }         
                                </fieldset>
                                
                                <div><span className="text-bold">Prescriptores [Contratados]:</span>&nbsp;&nbsp;<span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">{nroPrescriptor?.estadistica || 0}</span></div>
                                <div><span className="text-bold">Propietarios [Contratados]:</span>&nbsp;&nbsp;<span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">{nroPropietario?.estadistica || 0}</span></div>
                            </div>
                            
                    )
            }
        </div>
    )
}

export default ReportLeadHistorial