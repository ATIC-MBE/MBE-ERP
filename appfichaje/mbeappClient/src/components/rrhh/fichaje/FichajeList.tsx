import React, { useEffect, useState } from 'react'
//import ControlLimpiezaItem from './ControlLimpiezaItem'
import { IControlHorarioLimpieza } from '@/client/models/IControlHorarioLimpieza'
import FichajeItem from './FichajeItem'
import { IFichaje } from '@/client/models/IFichaje'
import ControlLimpiezaItem from '@/components/ade/controllimpieza/ControlLimpiezaItem'

const FichajeList = ({ items }: { items: Array<IFichaje> }) => {
    // const [ statusTooltip, setStatusTooltip ] = useState<boolean>(false)
    // const [ idTooltipSelected, setIdTooltipSelected ] = useState<string>('')

    return (
        <div className="bg-white table-content">
            { 
                items.map((item, index) => {
                    return <FichajeItem key={'item-cl' + index} item={item} index={index} />
                })
            }
        </div>
    )
}

export default FichajeList