import { useState } from 'react';

type TooltipPropsType = { 
    valDefaultTooltipElement: JSX.Element,
    flagTooltip: boolean,
    updateFlagTooltip: () => void,
    children: string | JSX.Element | JSX.Element[],
    idTT: string,
    idTooltipSelected: string,
}

const Tooltip = ({ idTT, idTooltipSelected, children, valDefaultTooltipElement,  flagTooltip, updateFlagTooltip }: TooltipPropsType) => {
    const handleClick = async (e: any) => {
        updateFlagTooltip()
        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    const handleStopPropagation = (e: any) => {
        e.stopPropagation() // Evita la propagación de los eventos [No se ejecutan los eventos en cadena]
    }

    return (
        <div id={`${idTT}-tooltip`} onClick={handleStopPropagation} className={`relative inline-block`}>
            {
                (flagTooltip && idTooltipSelected === idTT) ? <div className="content-tooltip absolute border border-[#212529] bg-[#e8edef] p-4 shadow-md flex rounded-lg z-10">{ children }</div>:''
            }
            <button onClick={handleClick} className="">
                { valDefaultTooltipElement }
            </button>
        </div>
    );
};

export default Tooltip;
