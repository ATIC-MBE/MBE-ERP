import React from 'react'

const NumberButtonsInput = () => {
    return (
        <div className="h-[4rem] w-[8rem] grid grid-flow-col p-0 text-2xl">
            <input className='noArrows h-[4rem] w-[4rem] rounded-l-xl p-2 text-center' type="number" />
            <div className="w-[4rem] h-[4rem] grid grid-rows-2 bg-blue-800 divide-y-2 text-white rounded-r-xl">
                <button>+</button>
                <button>-</button>
            </div>
        </div>
    )
}

export default NumberButtonsInput