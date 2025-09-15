import React, { useEffect, useState } from 'react'
import { IVacaciones } from '@/client/models/IVacaciones'
import VacacionesItem from './vacacionesItem'

const VacacionesList = ({ items, pathEdit }: { items: Array<IVacaciones>, pathEdit: string }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    // return <vacacionesItem key={'item-l' + index} item={item} pathEdit={pathEdit} />
                    return <VacacionesItem key={'item-l' + index} item={item} pathEdit={pathEdit} index={index} />

                })
            }
        </div>
    )
}

export default VacacionesList