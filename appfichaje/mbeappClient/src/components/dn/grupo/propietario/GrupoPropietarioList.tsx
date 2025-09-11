import React from 'react'
import { IGrupoPropietario } from '@/client/models/IGrupoPropietario'
import GrupoPropietarioItem from './GrupoPropietarioItem'

const GrupoPropietarioList = ({ items }: { items: Array<IGrupoPropietario> }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <GrupoPropietarioItem key={'item-gp' + index} item={item} />
                })
            }
        </div>
    )
}

export default GrupoPropietarioList