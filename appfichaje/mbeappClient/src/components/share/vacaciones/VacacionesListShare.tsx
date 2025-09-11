import React, { useEffect, useState } from 'react'
import { IVacaciones } from '@/client/models/IVacaciones'
import VacacionesItemShare from './VacacionesItemShare'

const VacacionesListShare = ({ items, pathEdit }: { items: Array<IVacaciones>, pathEdit: string }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <VacacionesItemShare key={'item-l' + index} item={item} pathEdit={pathEdit} />

                })
            }
        </div>
    )
}

export default VacacionesListShare