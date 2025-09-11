import React from 'react'
import { useRouter } from 'next/router'
import { BsFillShieldLockFill, BsLockFill, BsPencilFill } from 'react-icons/bs'
import useUserItem from '@/client/hooks/share/users/useUserItem'
import { user } from '@/client/types/globalTypes'
import Link from 'next/link'
import { TbLockSquare } from 'react-icons/tb'
import useEsquemaItem from '@/client/hooks/rrhhmaster/esquema/useEsquemaItems'

const UserItem = ({ item, pathEdit } : 
                            {
                                item: user,
                                pathEdit: string
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            handleResetPassword
        } = useEsquemaItem(item, pathEdit)

    return (
        <div className={`w-full h-auto`}>
            <div
                className={`data-table-row-nopointer grid grid-cols-8 p-1 pl-2 ${itemContent.estado === 0 ? 'text-[red]':'text-[#0077BD]'}`}>
            
                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.fullname} 
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.jornada}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.horario} 
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        &nbsp;{itemContent.total?.hours? itemContent.total?.hours : '0'}:{itemContent.total?.minutes ? itemContent.total?.minutes : "00"} 
                    </span>
                </div>

                <div className='flex justify-end'>
                    {
                        (itemContent.id)?<div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>:''
                    }
                    
                   
                </div>
            </div>
        </div>
    )
}

export default UserItem