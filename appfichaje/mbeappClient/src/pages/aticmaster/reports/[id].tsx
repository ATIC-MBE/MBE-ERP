import { Layout } from '@/components/Layout'
import React from 'react'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import useReportDeviceId from '@/client/hooks/atic/reportdevice/useReportDeviceId'
import ReportDetailsDeviceItem from '@/components/atic/reportdevicesstate/ReportDetailsDeviceItem'

const PerfilId = () => {
    const _pathGoToBack = '/atic/reports'

    const {  
            handleCancel,
            lstDetailsReport,
            idReport
    } = useReportDeviceId(_pathGoToBack)

    return (
        <Layout>
            <div className="w-auto min-h-[10rem] grid grid-flow-col">
                <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        
                        <div>
                            <div className={`w-full h-auto table-header`}>
                                <div className="grid grid-cols-12 p-2 pl-2 text-bold text-white bg-[#0077BD]">
                                    <div className="grid col-span-2"><span className='grid ml-1'>Piso</span></div>
                                    <div className="grid col-span-2"><span className='grid'>Móvil</span></div>
                                    <div className="grid col-span-2"><span className='grid'>Manija</span></div>
                                    <div className="grid col-span-2"><span className='grid'>Luces</span></div>
                                    <div className="grid col-span-2"><span className='grid'>Telefonillo</span></div>
                                    <div className="grid col-span-2"><span className='grid'>Cámara</span></div>
                                </div>
                            </div>

                            <div className="bg-white table-content">
                                {
                                    lstDetailsReport.map( (el, index) => (<ReportDetailsDeviceItem key={index} item={el} idReport={parseInt(idReport.toString())} />) )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <ButtonContainerVertical>
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
            </div>
        </Layout>
    )
}

export default PerfilId