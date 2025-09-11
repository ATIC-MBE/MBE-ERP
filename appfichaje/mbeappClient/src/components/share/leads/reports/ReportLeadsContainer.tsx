import React from 'react'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import EnumButtons from '@/components/EnumButtons'
import useReportLead from '@/client/hooks/share/leads/report/useReportLead'
import ReportLeadCurrent from './ReportLeadCurrent'
import ReportLeadHistorial from './ReportLeadHistorial'

const ReportLeadsContainer = () => {

    const {
        listType,
        flagType,
        setFlagType,
        dataTypeDeviceSel
    } = useReportLead()
    
    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <div className="w-auto min-h-[10rem] grid grid-flow-col">
            <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem]">
                <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                    <div className="min-h-[35rem] grid grid-cols-2m space-x-5">
                        <div className="h-full grid space-y-5">
                            <div className=" min-h-[14rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                                <h1 className='text-lg text-[#0077bd] font-bold'>Estadísticas Leads</h1>

                                <div className='grid space-x-2'>
                                    <div className="flex text-sm">
                                        <EnumButtons values={[...listType.map(el => el.lbl)]} selected={flagType} setSelected={setFlagType} txtSize='sm' />
                                    </div>
                                </div>

                                <div>
                                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
                                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Estadísticas</legend>
                                        {/* <div className='pb-0'>
                                        <h1>
                                            <span className='text-bold text-[#dc3545]'>Importante:</span> El historial esta disponible desde el 11/Dic/2023
                                        </h1>
                                        </div> */}
                                        {
                                            dataTypeDeviceSel.code === 'actual' ? <ReportLeadCurrent /> : ''
                                        }
                                        {
                                            dataTypeDeviceSel.code === 'historial' ? <ReportLeadHistorial /> : ''
                                        }
                                        {
                                            dataTypeDeviceSel.code === '' ? 'Sin estadisticas!!' : ''
                                        }
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportLeadsContainer