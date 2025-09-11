import { useRouter } from 'next/router'
import React from 'react'

const Unauthorized = () => {

    const router = useRouter()

    return (
        <div className='w-screen h-screen grid items-center justify-items-center'>
            <div className="w-[25rem] h-[18rem] border rounded-2xl p-5 pt-10 text-center grid grid-rows-2">
                <div className="">
                    <h1 className=' text-2xl font-bold'>No tienes acceso a este recurso</h1>
                    <p className=' text-gray-500 mt-5'>Probablemente tu usuario no este autorizado para este recurso o no has seleccionado el rol adecuado.</p>
                </div>
                <div className=" grid grid-cols-2 space-x-3 items-end">
                    <button onClick={()=>{router.push('/login')}} className='p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg'>Iniciar Sesion</button>
                    <button onClick={()=>{router.push('/profile/management/rolselector')}} className='p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg'>Seleccion de rol</button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized