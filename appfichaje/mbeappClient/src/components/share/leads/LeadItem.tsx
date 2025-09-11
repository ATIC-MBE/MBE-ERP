import React from 'react'
import { useRouter } from 'next/router'
// import useControlLimpiezaItem from '@/client/hooks/ade/controllimpieza/useControlLimpiezaItem'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { BsFillEmojiAngryFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill, BsPencilFill } from 'react-icons/bs'
import { ILead } from '@/client/models/ILead'
import useLeadItem from '@/client/hooks/share/leads/useLeadItem'
import AgenteIcon from '@/components/Iconos/AgenteIcon'
import PropietarioIcon from '@/components/Iconos/PropietarioIcon'

const LeadItem = ({ item, pathEdit } : 
                            {
                                item: ILead,
                                pathEdit: string
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            eventMap
        } = useLeadItem(item, pathEdit)

    const getValueHoras = (dateStart: string, dateEnd: string): string => {
        if (dateStart.trim() === '' || dateEnd.trim() === '') return '0h 0min'
        let {h, m} = UtilCustomInstance.getHoursMinDiff(`${dateStart}:00`, `${dateEnd}:00`)
        return `${h}h ${m}min`
    }

    return (
        <div className={`w-full h-auto`}>
            {/* <div className="grid pl-2 pr-2"> #0077BD 0077bd #d2ebf9*/}
            {/* <div className={`grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}> */}
            <div
                onClick={() => goEditData(itemContent.id as number)}
                className={`data-table-row grid grid-cols-6 p-1 pl-2 ${itemContent.lbl_orden === 'orden_2'?'txt-orange-f3bb6d':'text-[#0077BD]'}`}>
                <div className='grid col-span-2'>
                    <span className='flex'>
                        {
                            ( itemContent.tipo_lead as string || '' ).trim().toLowerCase() === 'colaborador' ||
                            ( itemContent.tipo_lead as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                            <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.2rem] h-[1.2rem]' />
                            : 
                            <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                        }
                        {
                            itemContent.name_tinteresa === 'Mucho' ?
                                <BsFillEmojiSmileFill className="text-green-600" style={{display: 'inline'}} size={'1.1rem'}/>
                            :
                                (itemContent.name_tinteresa === 'Medio' ?
                                    <BsFillEmojiNeutralFill className="text-yellow-600" style={{display: 'inline'}} size={'1.1rem'}/>
                                    :
                                    (itemContent.name_tinteresa === 'Poco' ?
                                    <BsFillEmojiAngryFill className="text-red-600" style={{display: 'inline'}} size={'1.1rem'} />
                                    :
                                    '')
                                )
                        }
                        &nbsp;{itemContent.persona}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.telefonos_str}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.next_step}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.last_step}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.responsable}
                    </span>
                </div>

                {/* <div>
                    <span className='flex grid justify-end'>
                        {
                            // getValueHoras(itemContent.entrada || '', itemContent.salida || '')
                        }
                        ff
                    </span>
                </div>

                <div>
                    <div className='grid justify-end pr-3 card-action'>
                        <BsPencilFill onClick={() => goEditData(itemContent.id!)} className='mt-1' title='Editar' />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default LeadItem