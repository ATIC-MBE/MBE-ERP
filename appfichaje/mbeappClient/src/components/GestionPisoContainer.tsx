import Link from 'next/link'
import React from 'react'
import { BsLightbulbOff, BsLightbulbFill, BsLightbulb } from 'react-icons/bs'

const GestionPisoContainer = () => {
    return (
        <div className="w-full h-[75vh] grid items-center justify-items-center px-[5rem]">
            <div className="w-full h-full grid grid-cols-3 space-x-5">
                <div className="bg-neutral/30 rounded-3xl shadow-2xl p-5 space-y-9">
                    <h1 className="text-center text-2xl font-bold text-primary"> Control del piso</h1>
                    <div className="w-full text-white grid justify-items-center p-5">
                        <BsLightbulbFill size={80} />
                        <span className='text-lg font-bold text-blue'>[Encendido]</span>
                    </div>
                    <div className="space-x-4 flex justify-center">
                        <Link className="p-2 h-min rounded-xl bg-primary hover:bg-secondary text-white hover:text-primary " href='/'>Abrir portal</Link>
                        <Link className="p-2 h-min rounded-xl bg-primary text-white" href='/'>Abrir puerta</Link>
                    </div>
                </div>
                <div className="bg-neutral/30 rounded-3xl shadow-2xl p-5 space-y-3 text-black ">
                    <h1 className="text-center text-2xl font-bold text-blue"> Gestion codigos</h1>

                    <div className="w-full grid justify-items-center ">
                        <span className='text-lg font-bold text-blue'>Tipo de codigo *</span>
                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5">

                            <select className="rounded-full h-[3rem] col-span-8 text-center" defaultValue={'test'}>
                                <option> test</option>
                            </select>

                        </div>
                    </div>

                    <div className="w-full grid justify-items-center ">

                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5 px-10">
                            <label className='pt-2 text-center h-[3rem] bg-[#0077bd] text-white rounded-l-full col-span-4'>Codigo * </label>
                            <input type="number" className="rounded-r-full h-[3rem] col-span-4 p-2" placeholder='' />

                        </div>

                    </div>

                    <div className="w-full  grid justify-items-center ">

                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5 px-10">
                            <label className='pt-2 text-center h-[3rem] bg-[#0077bd] text-white rounded-l-full col-span-4'>Vigencia dias * </label>
                            <input type="number" className="rounded-r-full h-[3rem] col-span-4 p-2" placeholder='' />

                        </div>

                    </div>
                    <div className="grid w-full justify-items-center mt-5">
                        <Link className="p-2 h-min rounded-xl bg-[#0077bd] text-white" href='/'>Crear codigo</Link>
                    </div>


                </div>

                <div className="bg-neutral/30 rounded-3xl shadow-2xl p-5 space-y-3 ">
                    <h1 className="text-center text-2xl font-bold text-blue"> Gestion llaves</h1>

                    <div className="w-full grid justify-items-center ">
                        <span className='text-lg font-bold text-blue'>Operacion *</span>
                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5">

                            <select className="rounded-full h-[3rem] col-span-8 text-center" defaultValue={'test'}>
                                <option> test</option>
                            </select>

                        </div>

                    </div>

                    <div className="w-full grid justify-items-center ">

                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5 px-10">
                            <label className='pt-2 text-center h-[3rem] bg-[#0077bd] text-white rounded-l-full col-span-4'>ID tarjeta * M- </label>
                            <input type="number" className="rounded-r-full h-[3rem] col-span-4 p-2" placeholder='' />

                        </div>

                    </div>

                    <div className="w-full grid justify-items-center ">
                        <span className='text-lg font-bold text-blue'>Tipo *</span>
                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5">

                            <select className="rounded-full h-[3rem] col-span-8 text-center" defaultValue={'test'}>
                                <option> test</option>
                            </select>

                        </div>

                    </div>

                    <div className="w-full grid justify-items-center ">
                        <span className='text-lg font-bold text-blue'>Ubicacion *</span>
                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5">

                            <select className="rounded-full h-[3rem] col-span-8 text-center" defaultValue={'test'}>
                                <option> test</option>
                            </select>

                        </div>

                    </div>

                    <div className="w-full  grid justify-items-center ">

                        <div className=" w-full h-[3rem] grid grid-cols-8 text-lg mt-5 px-10">
                            <label className='pt-2 text-center h-[3rem] bg-[#0077bd] text-white rounded-l-full col-span-4'>Codigo QR * </label>
                            <input type="number" className="rounded-r-full h-[3rem] col-span-4 p-2" placeholder='' />

                        </div>

                    </div>
                    <div className="grid w-full justify-items-center mt-5">
                        <Link className="p-2 h-min rounded-xl bg-[#0077bd] text-white" href='/'>Procesar tarjeta</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GestionPisoContainer