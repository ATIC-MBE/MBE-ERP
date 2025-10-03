import { MenuLeftType } from "@/client/types/globalTypes"
import { PropBox } from "./Layout"
import { useContext, useState } from "react"
import UserContext from "@/client/context/UserContext"
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { BsLightbulbOff, BsLightbulbFill, BsLightbulb } from 'react-icons/bs'

const OfficeContainer = () => {
    const router = useRouter()
    const { changeCurrentRol, setUserData } = useContext(UserContext)

    const lightIcons = [
        BsLightbulb,
        BsLightbulbFill
    ]

    const [lightState, setLightState] = useState(0)

    return (
        <div className="w-full h-[60vh] grid items-center justify-items-center">
            <div className="lg:w-[40rem] w-[90vw] h-[30rem] bg-[#ffffff4b] rounded-3xl shadow-2xl grid grid-rows-6">
                <div className=" row-span-5 grid items-center justify-items-center">
                    <div className=" flex flex-col items-center space-y-5">
                        <h1 className="text-lg text-primary font-bold">Bienvenido a MBE</h1>
                        <div onClick={() => setLightState(lightState == 0 ? 1 : 0)} className="">
                            {
                                lightIcons[lightState]({ size: 125, className: 'text-white' })
                            }
                            <h1 className="text-center mt-2 font-bold">[{lightState ? 'Encendido' : 'Apagado'}] </h1>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full h-full space-x-4">
                    <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/'>Abrir Portal</Link>
                    <Link className="p-2 h-min rounded-xl bg-[#0077bd] text-white" href='/'>Abrir Puerta</Link>
                </div>
            </div>
        </div>
    )
}

export default OfficeContainer