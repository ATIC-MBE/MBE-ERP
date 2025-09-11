import React, { useEffect, useState } from 'react'
import UserItem from './userItem'
import { user } from '@/client/types/globalTypes'

const UsersList = ({ items, pathEdit }: { items: Array<user>, pathEdit: string }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <UserItem key={'item-l' + index} item={item} pathEdit={pathEdit} />
                })
            }
        </div>
    )
}

export default UsersList