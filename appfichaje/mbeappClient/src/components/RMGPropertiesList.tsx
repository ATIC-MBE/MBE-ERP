import React, { useState } from 'react'
import RMGPropiertieCard from './RMGPropiertieCard'
import { RMGPropiertieCardType } from '@/client/types/globalTypes'

const RMGPropertiesList = ({ PisosList }: { PisosList: Array<RMGPropiertieCardType> }) => {

    const [ filterName, setFilterName ] = useState<string>('')

    const pisoFilter:any = ({piso}:any)=>(piso.toLowerCase().startsWith(filterName.toLowerCase()))

    return (
        <div className="w-[80rem] h-auto grid grid-flow-row">
            <div className="w-full h-[6rem] rounded-t-2xl border-2 border-blue-700 bg-[#badaed] grid grid-flow-col p-5">
                <div className="flex items-center justify-end h-full">
                    <span className='font-bold mr-3'>Buscar:</span><input className='rounded-lg' type="text" value={filterName} onChange={(e)=>{setFilterName(e.target.value)}} />
                </div>

            </div>
            <div className="max-h-[30rem] overflow-y-scroll grid grid-flow-row space-y-1">
                {PisosList.filter(pisoFilter).map((item, i) => (
                    <RMGPropiertieCard key={'RMGProps-'+i} {...item} />
                ))}
            </div>
        </div>
    )
}

export default RMGPropertiesList