import React from 'react'
import PerfilItem from './PerfilItem'
import { IResponsableLead } from '@/client/models/IResponsableLead'

const PerfilList = ({ items, pathEdit }: { items: Array<IResponsableLead>, pathEdit: string }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <PerfilItem key={'item-l' + index} item={item} pathEdit={pathEdit} />
                })
            }
        </div>
    )
}

export default PerfilList