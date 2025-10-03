import { MSG_TABLE_EMPTY, MSG_TABLE_LOADING } from "@/client/helpers/constants"
// import { IInfoPisoComercial } from "@/client/models/IInfoPisoComercial"
import { BiMapPin } from "react-icons/bi"
import { BsFillHouseDoorFill, BsFillHouseFill } from "react-icons/bs"


const PisoComercialContainer = ({ data, title = 'Información general' }: { data: any, title?: string }) => {
    return (
        <div className="min-h-[20rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-4">
            <h1 className='text-lg text-primary font-bold'>{title}</h1>

            <div className='grid'>
                <div className=" w-full flex text-sm">
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#005360] text-white rounded-l-full col-span-2'>
                        <span className='display-icon-error'>
                            <BsFillHouseFill title='Nombre del piso' size={'1.2rem'} />
                        </span>
                    </label>
                    <input disabled type="text" name='a_etiqueta' value={data.a_etiqueta} className="rounded-r-full p-2 w-[100%] col-span-6" />
                </div>
            </div>
            <div className='grid'>
                <div className=" w-full flex text-sm">
                    {/* <label className='p-2 h-min w-[14rem] bg-[#005360] text-white rounded-l-full col-span-0'>Localidad</label> */}
                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#005360] text-red rounded-l-full col-span-2'>
                        <span className='display-icon-error'>
                            <BiMapPin title='Dirección' color='white' size={'1rem'} />
                        </span>
                    </label>
                    <input disabled type="text" name='a_localidad' value={`${data.a_localidad}, ${data.a_codigo_postal}, ${data.a_full_direccion}`} className="rounded-r-full p-2 w-[100%] col-span-6" />
                </div>
            </div>
            {/* <div className='grid'>
                <div className=" w-full flex text-sm">
                    <label className='p-2 h-min w-[14rem] bg-[#005360] text-white rounded-l-full col-span-0'>Código postal</label>
                    <input disabled type="text" name='a_codigo_postal' value={data.a_codigo_postal} className="rounded-r-full p-2 w-[100%] col-span-6" />
                </div>
            </div>
            <div className='grid'>
                <div className=" w-full flex text-sm">
                    <label className='p-2 h-min w-[14rem] bg-[#005360] text-white rounded-l-full col-span-0'>Dirección</label>
                    <input disabled type="text" name='a_full_direccion' value={data.a_full_direccion} className="rounded-r-full p-2 w-[100%] col-span-6" />
                </div>
            </div> */}
        </div>
    )
}
export default PisoComercialContainer