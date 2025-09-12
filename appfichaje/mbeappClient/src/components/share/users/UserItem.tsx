import React from 'react'
import { useRouter } from 'next/router'
import { BsFillShieldLockFill, BsLockFill, BsPencilFill } from 'react-icons/bs'
import useUserItem from '@/client/hooks/share/users/useUserItem'
import { user } from '@/client/types/globalTypes'
import Link from 'next/link'
import { TbLockSquare } from 'react-icons/tb'

const UserItem = ({ item, pathEdit, index } : 
                            {
                                item: user,
                                pathEdit: string,
                                index: number
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData,
            handleResetPassword
        } = useUserItem(item, pathEdit)

    // Alternar colores de fondo: custom turquesa (pares) y blanco (impares) - matching app theme
    const rowBgColor = index % 2 === 0 ? 'bg-[#005360]/15' : 'bg-white';
    
    return (
        <div className={`w-full h-auto`}>
            <div
                className={`data-table-row-nopointer grid grid-cols-8 p-1 pl-2 ${rowBgColor} ${itemContent.estado === 0 ? 'text-[red]':'text-[#005360]'}`}>
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
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action'>
                        <BsPencilFill title='Editar' />
                    </div>
                    <div onClick={() => handleResetPassword(itemContent.id || 0)} className='icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action'>
                        <BsLockFill title='Reset Contraseña' />
                    </div>
                    <div>
                        <Link className="icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action" href={`/superadmin/users/${itemContent.id}/changepassword`}>
                            <BsFillShieldLockFill  size={'1.1rem'} title='Cambiar Contraseña' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserItem