import React, { useState, Dispatch } from 'react'

type EnumButtonType = { value: string, id: number, selected:Nulleable<number>, setSelected: Dispatch<React.SetStateAction<Nulleable<number>>>, isSelected: boolean, max: number, txtSize?: string }
const EnumButton = ({ value, id, selected, setSelected, isSelected, max, txtSize = 'text-lg' }: EnumButtonType) => (
    <button onClick={() => !(selected==id)?setSelected(id):setSelected(null)} className={`p-2 w-auto font-bold1 ${txtSize} ` + (isSelected ? 'bg-[#0077bd] ' : 'bg-white text-blue-800 ') + (id == 0 ? ' rounded-l-xl ' : id == max ? ' rounded-r-xl ' : '')}>{value}</button>
)

type Nulleable<T> = T|null

type EnumButtonsType = { values: Array<string>, selected:Nulleable<number> , setSelected: Dispatch<React.SetStateAction<Nulleable<number>>>, txtSize?: string }
const EnumButtons = ({ values, selected, setSelected, txtSize = 'text-lg'}: EnumButtonsType) => {

    return (
        <div className="w-auto flex justify-left divide-x-2 rounded-l-xl rounded-r-xl border border-blue text-white">
            {
                values.map((value, i) => <div key={'EnumButton'+value+i} className="w-auto"><EnumButton txtSize={txtSize} value={value} id={i} selected={selected} setSelected={setSelected} isSelected={selected == i} max={values.length - 1} /></div>)
            }
        </div>
    )
}

export default EnumButtons