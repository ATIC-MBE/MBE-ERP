import React, { useEffect, useState } from 'react'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import GrupoPrescriptorItem from './GrupoPrescriptorItem'
import { IGrupoPrescriptor } from '@/client/models/IGrupoPrescriptor'

const GrupoPrescriptorList = ({ items }: { items: Array<IGrupoPrescriptor> }) => {
    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    // return <ControlLimpiezaItem key={'item-cl' + index} item={item} />
                    return <GrupoPrescriptorItem key={'item-gp' + index} item={item} />
                })
            }
        </div>
    )
}

export default GrupoPrescriptorList