import React from 'react'
import { useRouter } from 'next/router'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import UtilCustomInstance from '@/client/helpers/UtilCustom'
import { BsPencilFill } from 'react-icons/bs'
import useGrupoPrescriptorItem from '@/client/hooks/dn/grupo/prescriptor/useGrupoPrescriptorItem'
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor'
import Link from 'next/link'
import { AiOutlineWhatsApp } from 'react-icons/ai'

const GrupoPrescriptorItem = ({ item } : 
                            {
                                item: IGrupoPrescriptor
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            eventMap
        } = useGrupoPrescriptorItem(item)

    const eventWhatsaap = (e: any) => {
        e.stopPropagation();
    }


    return (
        <div className={`w-full h-auto`}>
            <div onClick={() => goEditData(itemContent.id as number)} 
                className={`data-table-row grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}>
                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.nombre}
                    </span>
                </div>

                <div className=''>
                    <span className='flex'>
                        {/^https:\/\/chat.whatsapp.com\/.*$/.test(itemContent.whatsapp || '') ? 
                                                                            <Link href={`${itemContent.whatsapp}`} target='_blank' onClick={eventWhatsaap} className='px-3m py-3m h-auto w-auto contents text-[#00a884]'>
                                                                                <AiOutlineWhatsApp title='Whatsapp' size={'1.5rem'} />
                                                                            </Link>
                                                                        :
                                                                            <span className='px-3m py-3m h-auto w-auto contents text-[#a8a8a8]'>
                                                                                <AiOutlineWhatsApp title='Whatsapp' size={'1.5rem'} />
                                                                            </span>
                        }
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {itemContent.next_step}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.nro_visitas}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end'>
                        {itemContent.nro_reservas}
                    </span>
                </div>

                <div>
                    <span className='grid justify-end mr-2'>
                        {itemContent.valor_propietario}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default GrupoPrescriptorItem