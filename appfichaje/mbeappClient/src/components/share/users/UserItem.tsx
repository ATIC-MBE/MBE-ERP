import React from 'react'
import { useRouter } from 'next/router'
import { BsFillShieldLockFill, BsLockFill, BsPencilFill } from 'react-icons/bs'
import useUserItem from '@/client/hooks/share/users/useUserItem'
import { user } from '@/client/types/globalTypes'
import Link from 'next/link'
import { TbLockSquare } from 'react-icons/tb'

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
        } = useUserItem(item, pathEdit)

    return (
        <div className={`w-full h-auto`}>
            <div
                className={`data-table-row-nopointer grid grid-cols-8 p-1 pl-2 ${itemContent.estado === 0 ? 'text-[red]':'text-[#0077BD]'}`}>
                <div>
                    <span className='flex'>
                        &nbsp;{itemContent.username} 
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.nombre_completo}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.email}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.nombrerol_str}
                    </span>
                </div>

                <div className='flex justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                    <div onClick={() => handleResetPassword(itemContent.id || 0)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsLockFill className='mt-1' title='Reset Contraseña' />
                    </div>
                    <div>
                        <Link className="icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action" href={`/superadmin/users/${itemContent.id}/changepassword`}>
                            <BsFillShieldLockFill className='mt-1' size={'1.1rem'} title='Cambiar Contraseña' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserItem