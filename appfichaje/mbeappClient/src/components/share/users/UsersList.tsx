import React, { useEffect, useState } from 'react'
import UserItem from './UserItem'
import { user } from '@/client/types/globalTypes'

interface UsersListProps {
    items: Array<user>;
    pathEdit: string;
    isUnsubscribeMode?: boolean;
    onUserUpdate?: () => void;
}

const UsersList = ({ items, pathEdit, isUnsubscribeMode = false, onUserUpdate }: UsersListProps) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => (
                    <UserItem
                        key={'item-l' + index}
                        item={item}
                        pathEdit={pathEdit}
                        index={index}
                        isUnsubscribeMode={isUnsubscribeMode}
                        onUserUpdate={onUserUpdate}
                    />
                ))
            }
        </div>
    )
}

export default UsersList