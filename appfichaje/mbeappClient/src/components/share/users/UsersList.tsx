import React, { useEffect, useState } from 'react'
import UserItem from './UserItem'
import { user } from '@/client/types/globalTypes'

const UsersList = ({ items, pathEdit, isUnsubscribeMode = false }: { items: Array<user>, pathEdit: string, isUnsubscribeMode?: boolean }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <UserItem key={'item-l' + index} item={item} pathEdit={pathEdit} index={index} isUnsubscribeMode={isUnsubscribeMode} />
                })
            }
        </div>
    )
}

export default UsersList