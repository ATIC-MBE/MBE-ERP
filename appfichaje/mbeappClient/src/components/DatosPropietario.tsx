import React from 'react'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

const DataInput = ({ name, placeholder, type }: { name?: string, placeholder?: string, type?: React.HTMLInputTypeAttribute }) => (
    <div className=" w-full flex text-xs">
        <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{placeholder ? placeholder : 'Empty'} </label>
        <input type={type ? type : "text"} name={name} className="rounded-r-full p-2 w-[100%] outline-blue-800" />
    </div>
)

const DataListInput = ({ name, placeholder, type }: { name?: string, placeholder?: string, type?: React.HTMLInputTypeAttribute }) => (
    <div className=" w-full grid grid-cols-8 text-xs">
        <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{placeholder ? placeholder : 'Empty'} </label>
        <div className="w-[100%] flex">
            <input type={type ? type : "text"} name={name} className="p-2 w-max  outline-blue-800" />
            <div className="bg-white col-span-2 rounded-r-full flex items-center justify-end px-2 w-[5rem]">
                <AiOutlinePlus className='text-[#0077bd] cursor-pointer' size={'1.5rem'} />
            </div>
        </div>

    </div>
)

const DataListContainer = ({ value }: { value: string }) => (
    <div className=" w-[90%] flex text-xs">
        <label className='p-2 h-min min-w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{'Empty'} </label>
        <div className="rounded-r-full p-2 px-3 w-[100%] h-[100%] bg-white flex justify-between">
            <p>{value}</p> <div className="h-full flex items-center"><AiOutlineMinus className='text-[#0077bd] cursor-pointer' size={'1rem'} /></div> 
        </div>
    </div>
)


const DatosPropietario = () => {
    return (
        <div className="w-full min-h-[45rem] px-[6rem] ">
            <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                <div className="min-h-[40rem] grid grid-cols-2 space-x-5">
                    <div className="h-full grid space-y-5">
                        <div className=" min-h-[23rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                            <h1 className='text-lg text-[#0077bd] font-bold'>Datos Personales</h1>
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataInput name='name' placeholder='Nombre' />
                                <DataInput />
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataInput />
                                <DataInput />
                            </div>
                            <DataInput />
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataListInput />
                                <DataListInput />
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className="space-y-2">
                                    <DataListContainer value='a' />
                                    <DataListContainer value='a' />
                                </div>
                                <div className="space-y-2">
                                    <DataListContainer value='a' />
                                </div>
                                
                            </div>
                            
                        </div>
                        <div className=" row-span-4 bg-[#5da7d5c0] p-5 rounded-2xl space-y-2 h-[15rem]">
                            <h1 className='text-lg text-[#0077bd] font-bold'>Datos Propiedad</h1>
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataInput />
                                <DataInput />
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataInput />
                                <DataInput />
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <DataInput />
                                <DataInput />
                            </div>
                            <DataInput />
                        </div>
                    </div>
                    <div className="bg-[#ffffff5f] rounded-2xl p-5 space-y-2 h-full">
                        <h1 className='text-lg text-[#0077bd] font-bold'>Datos Leads</h1>
                        <div className='grid grid-cols-2 space-x-2'>
                            <DataInput />
                            <DataInput />
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <DataInput />
                            <DataInput />
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <DataInput />
                            <DataInput />
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <DataInput />
                            <DataInput />
                        </div>
                        <DataInput />
                        <div className="w-full h-[2rem] bg-[#0077bd] text-white px-3 rounded-full text-sm grid items-center">Historial</div>
                        <div className="w-full max-h-[20rem] p-3 overflow-y-scroll space-y-3">
                            {
                                [0, 0, 0, 0, 0, 0, 0].map((item, index) => (
                                    <div key={"Comment" + index} className="bg-white w-full h-auto p-3 rounded-lg">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                        <div className="text-sm w-full text-blue-800 font-semibold text-right"> 
                                            John Doe <span className=' font-extrabold'>1 Ene 1970</span> 
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DatosPropietario