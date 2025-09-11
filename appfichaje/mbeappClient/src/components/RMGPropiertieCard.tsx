import React from 'react'
import Tooltip from './TooltipOLD'
import { RMGPropiertieCardType } from '@/client/types/globalTypes'
import { TbBrandAirbnb, TbBrandBooking } from 'react-icons/tb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MdHomeFilled } from 'react-icons/md'

const RMGPropiertieCard = ({ piso, estado, alquiler, muebles, total, limite }: RMGPropiertieCardType) => {

    const router = useRouter()

    return (
        <div className=' w-full lg:h-[7rem] md:h-[7rem] h-auto rounded-2xl bg-[#ffffffc8] grid items-center p-5'>
            <div className=" grid lg:grid-flow-col md:grid-flow-col lg:grid-cols-none md:grid-cols-none  grid-cols-3 lg:space-x-5 md:space-x-5 space-x-0">
                <div className="text-lg">
                    <h1 className='font-bold text-blue-700 text-xl'>Piso</h1>
                    <Tooltip defaultValue={piso} btnContent={<h2>{piso}</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Estado</h1>
                    <Tooltip defaultValue={estado} btnContent={<h2>{estado}</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Alquiler</h1>
                    <Tooltip defaultValue={alquiler.toString()} btnContent={<h2>{alquiler}EUR</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Muebles</h1>
                    <Tooltip defaultValue={muebles.toString()} btnContent={<h2>{muebles}EUR</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Total</h1>
                    <Tooltip defaultValue={total.toString()} btnContent={<h2>{total}EUR</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Limite</h1>
                    <Tooltip defaultValue={limite.toString()} btnContent={<h2>{limite}EUR</h2>} />
                </div>
                <div className="text-xl">
                    <h1 className='font-bold text-blue-700 text-xl'>Plataformas</h1>
                    <div className="flex items-end space-x-5 text-gray-50">
                        <Tooltip btnContent={<div onClick={ ()=>{router.push('https://booking.com/')} } className='rounded-full bg-blue-800 p-1'><TbBrandBooking/></div>} />
                        <Tooltip btnContent={<div onClick={ ()=>{router.push('https://airbnb.com/')} } className='rounded-full bg-red-600 p-1'><TbBrandAirbnb/></div>} />
                        <Tooltip btnContent={<div onClick={ ()=>{router.push('https://booking.com/')} } className='rounded-full bg-blue-600 p-1'><MdHomeFilled/></div>} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RMGPropiertieCard