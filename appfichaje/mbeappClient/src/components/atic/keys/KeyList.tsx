import React, { useEffect, useState } from 'react'
import KeyItem from '../keys/KeyItem'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import { IKeys } from '@/client/models/IKeys'

const KeyList = ({ items }: { items: Array<IKeys> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <KeyItem key={'item-cl' + index} item={item}   />
                })
            }
        </div>
    )
}

export default KeyList