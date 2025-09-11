
import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { COUNTRIES, CITIES, STATES, ALERT_DANGER, STATES_BOOLEAN } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import usePisoId from '@/client/hooks/da/pisos/usePisoId'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillEnvironment, AiFillSave, AiOutlineComment } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import { BsDoorClosed, BsFillHouseFill } from 'react-icons/bs'
import SemaforoIcon from '@/components/Iconos/SemaforoIcon'
import { BiAccessibility, BiBarcode, BiBath, BiBed, BiBorderInner, BiBuilding, BiGlobe, BiMale, BiMapAlt, BiMapPin } from 'react-icons/bi'
import PropietarioIcon from '@/components/Iconos/PropietarioIcon'
import ElevadorIcon from '@/components/Iconos/ElevadorIcon'
import CalefaccionIcon from '@/components/Iconos/CalefaccionIcon'
import AireAconIcon from '@/components/Iconos/AireAconIcon'
import AreaMMIcon from '@/components/Iconos/AreaMMIcon'
import SofaCamaIcon from '@/components/Iconos/SofaCamaIcon'
import { FaTrashAlt } from 'react-icons/fa'
import { BsCardText, BsFillDoorClosedFill, BsPencilFill, BsPencilSquare } from 'react-icons/bs'

const ApartmentsById = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            handleDelete,
            errorValidate, 
            msgError,
            propietarios } = usePisoId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    const MenuDA = ()=>{

    }

    return (
        <Layout>
            <div className="w-auto min-h-[31rem] grid grid-flow-col">
                <div className="w-[80rem] w-min-[80rem] min-h-[30rem] pl-[2rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        { errorValidate ?
                            <AlertContainer typeAlert={ALERT_DANGER}>
                                <div dangerouslySetInnerHTML={{ __html: msgError }} />
                            </AlertContainer>:<></>
                        }
                        <input type="hidden" name='id' value={dataDB.id?.toString()} />
                        
                        <div className="min-h-[25rem] grid grid-cols-1n space-x-5">
                            <div className="h-full grid space-y-2">
                                <div className=" w-full flex text-sm">
                                    <button type='submit' id='infoPiso' onClick={()=>{alert('Info Piso')}} className='px-3 py-2 h-auto w-[10rem] bg-[#0077bd] text-white rounded-full'>INFO</button>
                                    <button type='submit' id='mantePiso' onClick={()=>{alert('Mantenimiento')}} className='px-3 py-2 h-auto w-[10rem] bg-[#0077bd] text-white rounded-full ml-4'>MANTENIMIENTO</button>
                                </div>
                                <div className=" min-h-[25rem] bg-[#5da7d5c0] rounded-2xl p-2 space-y-3">                                   
                                    <div>
                                        <fieldset className="grid border border-solid border-gray-300 p-4 space-y-3 mb-4 rounded-lg">
                                            <legend className='text-lg text-[#0077bd] font-bold'>Información del piso</legend>
                                            <div className='grid grid-cols-3 space-x-3'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiBarcode title='Código' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Código' type="text" onChange={handleChange} name='id_dispositivo_ref' value={dataDB.id_dispositivo_ref} className="rounded-r-full p-2 w-[95%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BsFillHouseFill title='Nombre del piso' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Nombre del piso' type="text" onChange={handleChange} name='etiqueta' value={dataDB.etiqueta} className="rounded-r-full p-2 w-[85%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <SemaforoIcon title="Estado" color={'white'} className='w-[1rem] h-[1rem]' /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <select value={dataDB.estado} onChange={handleChange} name='estado' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                        { useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), []) }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-3 space-x-3'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiGlobe title='Pais' color='white' size={'1rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <select value={dataDB.pais} onChange={handleChange} name='pais' className="rounded-r-full p-1 w-[95%] col-span-6">
                                                        { useMemo(() => drawListOnSelect(COUNTRIES, 'co', 'Seleccionar país'), []) }
                                                    </select>
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiMapPin title='Ciudad' color='white' size={'1rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <select value={dataDB.ciudad} onChange={handleChange} name='ciudad' className="rounded-r-full p-1 w-[85%] col-span-6">
                                                        { useMemo(() => drawListOnSelect(CITIES, 'ci', 'Seleccionar ciudad'), []) }
                                                    </select>
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                        <span><b className='py-3'>C.P.</b></span> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Código postal' type="text" onChange={handleChange} name='codigo_postal' value={dataDB.codigo_postal} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-3 space-x-3'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiMapAlt title='Dirección' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Calle / Avenida' type="text" onChange={handleChange} name='direccion' value={dataDB.direccion} className="rounded-r-full p-2 w-[95%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiBuilding title='Nro edificio' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Nro edificio' type="text" onChange={handleChange} name='nro_edificio' value={dataDB.nro_edificio} className="rounded-r-full p-2 w-[85%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BsDoorClosed title='Nro piso' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                        </span>
                                                    </label>
                                                    <input placeholder='Nro piso' type="text" onChange={handleChange} name='nro_piso' value={dataDB.nro_piso} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                </div>
                                            </div>

                                            <div className='grid grid-flow-col grid-cols-3 space-x-3'>
                                                <div className=" w-full col-span-2 flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <BiBorderInner title='Zona' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Zonas' type="text" onChange={handleChange} name='if_zonas' value={dataDB.if_zonas} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                        <PropietarioIcon title="Propietario" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                    </label>
                                                    <select value={dataDB.idpropietario?.toString() || 0} onChange={handleChange} name='idpropietario' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                        { useMemo(() => drawListOnSelect(propietarios, 'ppt', 'Seleccionar propietario'), [propietarios]) }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='grid grid-flow-col grid-cols-3 space-x-3'>
                                                <div className=" w-full col-span-2 flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <AiFillEnvironment title='Ubicación mapa' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Ubicación mapa' type="text" onChange={handleChange} name='ubicacion_mapa' value={dataDB.ubicacion_mapa} className="rounded-r-full p-2 w-[100%] col-span-6" />
                                                </div>                                       
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                                            <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Características</legend>
                                            <div className='grid grid-flow-col grid-cols-5 space-x-0'>
                                                <div className="w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                                        <BiMale title='Capacidad máxima' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Nro Ocupación' type="number" onChange={handleChange} name='cp_ocupacion_maxima' value={dataDB.cp_ocupacion_maxima !== undefined ? dataDB.cp_ocupacion_maxima : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <BsDoorClosed title="Nro Habitaciones" color={'white'} size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Nro habitaciones' type="number" onChange={handleChange} name='ds_nro_dormitorios' value={dataDB.ds_nro_dormitorios !== undefined ? dataDB.ds_nro_dormitorios : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <BiBed title="Nro Camas" color={'white'} size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Nro camas' type="number" onChange={handleChange} name='ds_nro_camas' value={dataDB.ds_nro_camas !== undefined ? dataDB.ds_nro_camas : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <BiBath title="Nro Baños" color={'white'} size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Nro baños' type="number" onChange={handleChange} name='bs_nro_banios' value={dataDB.bs_nro_banios !== undefined ? dataDB.bs_nro_banios : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <SofaCamaIcon title="Nro sofacama" color={'white'} className='w-[1.6rem] h-[1.6rem]' />
                                                    </label>
                                                    <input placeholder='Nro sofacama' type="number" onChange={handleChange} name='ds_nro_sofacama' value={dataDB.ds_nro_sofacama !== undefined ? dataDB.ds_nro_sofacama : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                            </div>
                                            <div className='grid grid-flow-col grid-cols-5 space-x-0'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <AreaMMIcon title="Área m2" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                    </label>
                                                    <input placeholder='Área m2' type="number" onChange={handleChange} name='cp_m2' value={dataDB.cp_m2 !== undefined ? dataDB.cp_m2 : ''} className="rounded-r-full p-2 w-[75%]" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <ElevadorIcon title="Elevador" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                    </label>
                                                    <select value={dataDB.cp_ascensor !== undefined ? (dataDB.cp_ascensor?'true':'false'):'-2'} onChange={handleChange} name='cp_ascensor' className="rounded-r-full p-1 w-[75%]">
                                                        { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ascensor', 'Elevador?'), []) }
                                                    </select>
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <CalefaccionIcon title="Calefacción" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                    </label>
                                                    <select value={dataDB.ca_calefaccion !== undefined ? (dataDB.ca_calefaccion?'true':'false'):'-2'} onChange={handleChange} name='ca_calefaccion' className="rounded-r-full p-1 w-[75%]">
                                                        { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-calefaccion', 'Calefacción?'), []) }
                                                    </select>
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <AireAconIcon title="Aire acondicionado" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                                    </label>
                                                    <select value={dataDB.ca_aire_acondicionado !== undefined ? (dataDB.ca_aire_acondicionado?'true':'false'):'-2'} onChange={handleChange} name='ca_aire_acondicionado' className="rounded-r-full p-1 w-[75%]">
                                                        { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-aireacondicionado', 'Aire acondicionado?'), []) }
                                                    </select>
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                                        <BiAccessibility title="Accesibilidad" color={'white'} size={'1.2rem'} />
                                                    </label>
                                                    <select value={dataDB.ca_discapacidad !== undefined ? (dataDB.ca_discapacidad?'true':'false'):'-2'} onChange={handleChange} name='ca_discapacidad' className="rounded-r-full p-1 w-[75%]">
                                                        { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-discapacidad', 'Accesibilidad?'), []) }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-2 space-x-3'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <AiOutlineComment title='Observaciones camas' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Observaciones de camas' type="text" onChange={handleChange} name='ds_descripcion_camas' value={dataDB.ds_descripcion_camas} className="rounded-r-full p-2 w-[95%] col-span-6" />
                                                </div>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <AiOutlineComment title='Observaciones baños' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Observaciones de baños' type="text" onChange={handleChange} name='bs_descripcion_banios' value={dataDB.bs_descripcion_banios} className="rounded-r-full p-2 w-[90%] col-span-6" />
                                                </div>
                                                
                                            </div>            
                                            <div className='grid grid-cols-2 space-x-3'>
                                                <div className=" w-full flex text-sm">
                                                    <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <AiOutlineComment title='Observaciones sofacama' size={'1.2rem'} />
                                                    </label>
                                                    <input placeholder='Observaciones de sofacama' type="text" onChange={handleChange} name='ds_descripcion_sofacama' value={dataDB.ds_descripcion_sofacama} className="rounded-r-full p-2 w-[95%] col-span-6" />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div>
                                        <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                                            <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Plano del Apartamento</legend> 
                                            <div className="flex items-center justify-center w-full">    
                                                <div className='w-full flex text-sm'>
                                                    <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                        <span className='display-icon-error'>
                                                            <BiGlobe title='Url Imagen' size={'1.5rem'} />
                                                        </span>
                                                    </label>
                                                    <input placeholder='Url de la imágen' type="url" onChange={handleChange} name='plano' defaultValue={dataDB.plano} className="rounded-r-full p-2 w-[90%] border" />
                                                    
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div>
                                        <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Comentarios Adicionales</legend>
                                            <div className="w-full flex text-sm">
                                                <label className='px-3 py-4 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <span className='display-icon-error'>
                                                        <AiOutlineComment title='Observaciones adicionales' size={'1.5rem'} />
                                                    </span>
                                                </label>
                                                <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.observaciones} onChange={handleChange} className="rounded-r-full p-3 w-[95%] outline-blue-800 " name="observaciones"></textarea>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ButtonContainerVertical>
                    <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                    <FloatButton title='Eliminar' handler={handleDelete} Icon={FaTrashAlt} />
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
                {/* </div> */}
            </div>
        </Layout>
    )
}

export default ApartmentsById