import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { COUNTRIES, CITIES, STATES, ALERT_DANGER, STATES_BOOLEAN } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import usePisoId from '@/client/hooks/da/pisos/usePisoId'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillEnvironment, AiFillSave, AiOutlineBarcode, AiOutlineComment } from 'react-icons/ai'
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
import { BiBuildingHouse, BiCoffee, BiCar, BiTv, BiShow, BiChalkboard, BiMoveVertical, BiWifi } from "react-icons/bi";
import { FaTrashAlt, FaKey, FaFire, FaSwimmingPool, FaTools, FaHandsWash } from 'react-icons/fa'
import { TbListNumbers} from "react-icons/tb";
import { CgGym } from "react-icons/cg";
import { RiVipFill, RiLandscapeFill } from "react-icons/ri";
import { MdLocalBar, MdBalcony, MdOutlineYard, MdSpa, MdArchitecture } from "react-icons/md";
import { GiKitchenScale, GiFrenchFries, GiCookingGlove, GiCookingPot, GiChimney, GiComputerFan, GiWashingMachine, GiRingingAlarm, GiGardeningShears, GiHeatHaze, GiKidSlide, GiBarbecue } from "react-icons/gi";
import { BsCardText, BsFillDoorClosedFill, BsPencilFill, BsPencilSquare, BsFillSafeFill } from 'react-icons/bs'

const ApartmentsById = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            errorValidate, 
            msgError,
            propietarios } = usePisoId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <>
        <Layout>
        { errorValidate ?
            <AlertContainer typeAlert={ALERT_DANGER}>
                <div dangerouslySetInnerHTML={{ __html: msgError }} />
            </AlertContainer>:<></>
        }
        <input type="hidden" name='id' value={dataDB.id?.toString()} />
        <div className="w-auto min-h-[31rem] grid grid-cols-1 md:grid-flow-col gap-4 px-3">
            <div className="min-h-[25rem] bg-[#5da7d5c0] rounded-2xl p-2 sm:p-4 space-y-3">

                {/* Campo para información básica y esencial del piso*/ }                                   
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-2 sm:p-4 space-y-3 mb-4 rounded-lg">
                        <legend className='text-lg text-[#0077bd] font-bold'>Información del piso</legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <span className='display-icon-error'>
                                        <BiBarcode title='Código' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                    </span>
                                </label>
                                <input placeholder='Código' type="text" onChange={handleChange} name='id_dispositivo_ref' value={dataDB.id_dispositivo_ref} className="rounded-r-full p-2 w-[85%] col-span-6" />
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
                                <select value={dataDB.estado} onChange={handleChange} name='estado' className="rounded-r-full p-1 w-[85%] col-span-5">
                                    { useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), []) }
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <span className='display-icon-error'>
                                        <BiGlobe title='Pais' color='white' size={'1rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                    </span>
                                </label>
                                <select value={dataDB.pais} onChange={handleChange} name='pais' className="rounded-r-full p-1 w-[85%] col-span-6">
                                    { useMemo(() => drawListOnSelect(COUNTRIES, 'co', 'Seleccionar país'), []) }
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
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
                                <input placeholder='Código postal' type="text" onChange={handleChange} name='codigo_postal' value={dataDB.codigo_postal} className="rounded-r-full p-2 w-[85%] col-span-6" />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <span className='display-icon-error'>
                                        <BiMapAlt title='Dirección' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                    </span>
                                </label>
                                <input placeholder='Calle / Avenida' type="text" onChange={handleChange} name='direccion' value={dataDB.direccion} className="rounded-r-full p-2 w-[85%] col-span-6" />
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
                                <input placeholder='Nro piso' type="text" onChange={handleChange} name='nro_piso' value={dataDB.nro_piso} className="rounded-r-full p-2 w-[85%] col-span-6" />
                            </div>
                        </div>

                        <div className='grid grid-flow-col grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full col-span-1 flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <BiBorderInner title='Zona' size={'1.2rem'} />
                                </label>
                                <input placeholder='Zonas' type="text" onChange={handleChange} name='if_zonas' value={dataDB.if_zonas} className="rounded-r-full p-2 w-[100%] col-span-6" />
                            </div>
                            {/* <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                    <PropietarioIcon title="Propietario" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.idpropietario?.toString() || 0} onChange={handleChange} name='idpropietario' className="rounded-r-full p-1 w-[85%] col-span-6">
                                    { useMemo(() => drawListOnSelect(propietarios, 'ppt', 'Seleccionar propietario'), [propietarios]) }
                                </select>
                            </div> */}
                        </div>

                        <div className='flex flex-col space-y-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                    <AiFillEnvironment title='Ubicación mapa' size={'1.2rem'} />
                                </label>
                                <input placeholder='Ubicación mapa' type="text" onChange={handleChange} name='ubicacion_mapa' value={dataDB.ubicacion_mapa} className="rounded-r-full p-2 flex-1" />
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                    <BiShow title='Vistas' size={'1.2rem'} />
                                </label>
                                <select onChange={handleChange} name='if_vista' value={dataDB.if_vista} className="rounded-r-full p-1 flex-1">
                                    <option value='na'>Tipo Vista?</option>
                                    <option value='interior'>Interior</option>
                                    <option value='exterior'>Exterior</option>
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                    <BiBuildingHouse title='Clase' size={'1.2rem'} />
                                </label>
                                <select onChange={handleChange} name='if_clase' value={dataDB.if_clase} className="rounded-r-full p-1 flex-1">
                                    <option value='na'>Clase Piso?</option>
                                    <option value='apartamento'>Apartamento</option>
                                    <option value='estudio'>Estudio</option>
                                    <option value='casa'>Casa</option>
                                    <option value='finca'>Finca</option>
                                    <option value='aparthotel'>Aparthotel</option>
                                    <option value='habitaciones'>Por Habitaciones</option>
                                </select>
                            </div>                                       
                        </div>
                    </fieldset>
                </div>

                {/* 1.2 Caracteristicas Principales del piso */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                    <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Características Principales</legend>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className="w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                    <BiMale title='Capacidad máxima' size={'1.2rem'} />
                                </label>
                                <input placeholder='Ocupación Maxima' type="number" onChange={handleChange} name='cp_ocupacion_maxima' value={dataDB.cp_ocupacion_maxima !== undefined ? dataDB.cp_ocupacion_maxima : ''} className="rounded-r-full p-2 w-[75%]" />
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
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
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
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <AreaMMIcon title="Área m2" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <input placeholder='Área m2' type="number" onChange={handleChange} name='cp_m2' value={dataDB.cp_m2 !== undefined ? dataDB.cp_m2 : ''} className="rounded-r-full p-2 w-[75%]" />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full  flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <ElevadorIcon title="Elevador" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.cp_ascensor !== undefined ? (dataDB.cp_ascensor?'true':'false'):'-2'} onChange={handleChange} name='cp_ascensor' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-cp_ascensor', 'Elevador?'), []) }
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <CalefaccionIcon title="Calefacción" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_calefaccion !== undefined ? (dataDB.ca_calefaccion?'true':'false'):'-2'} onChange={handleChange} name='ca_calefaccion' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_calefaccion', 'Calefacción?'), []) }
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <AireAconIcon title="Aire acondicionado" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_aire_acondicionado !== undefined ? (dataDB.ca_aire_acondicionado?'true':'false'):'-2'} onChange={handleChange} name='ca_aire_acondicionado' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_aireacondicionado', 'Aire acondicionado?'), []) }
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <AiOutlineComment title='Observaciones camas' size={'1.2rem'} />
                                </label>
                                <input placeholder='Observaciones de camas' type="text" onChange={handleChange} name='ds_descripcion_camas' value={dataDB.ds_descripcion_camas} className="rounded-r-full p-2 w-[88%] col-span-6" />
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <AiOutlineComment title='Observaciones baños' size={'1.2rem'} />
                                </label>
                                <input placeholder='Observaciones de baños' type="text" onChange={handleChange} name='bs_descripcion_banios' value={dataDB.bs_descripcion_banios} className="rounded-r-full p-2 w-[88%] col-span-6" />
                            </div>  
                        </div> 
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <AiOutlineComment title='Observaciones sofacama' size={'1.2rem'} />
                                </label>
                                <input placeholder='Observaciones de sofacama' type="text" onChange={handleChange} name='ds_descripcion_sofacama' value={dataDB.ds_descripcion_sofacama} className="rounded-r-full p-2 w-[88%] col-span-6" />
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <AiOutlineComment title='Tipo Piso' size={'1.2rem'} />
                                </label>
                                <input type='text' placeholder='Tipo de Piso / Inmueble' name='if_tipo' onChange={handleChange} value={dataDB.if_tipo} className="rounded-r-full p-1 w-[88%]" />
                                
                            </div>
                        </div>
                        {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <AiOutlineComment title='zonas' size={'1.2rem'} />
                                </label>
                                <input placeholder='Zonas' type="text" onChange={handleChange} name='if_zonas' value={dataDB.if_zonas} className="rounded-r-full p-2 w-[88%] col-span-6" />
                            </div>                         
                        </div>      */}
                    </fieldset>
                </div>

                {/* 1.2.1 Caracteristicas Cocina */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Cocina</legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <GiCookingGlove title='Clase Cocina' size={'1.2rem'} />
                                </label>
                                <select name='co_clase_cocina' onChange={handleChange} value={dataDB.co_clase_cocina} className="rounded-r-full p-1 w-[75%]">
                                    <option value='na'>Clase Cocina?</option>
                                    <option value='americana'>Americana</option>
                                    <option value='independiente'>Independiente</option>
                                    <option value='abierta'>Abierta</option>
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <GiCookingPot title='Tipo Cocina' size={'1.2rem'} />
                                </label>
                                <select name='co_tipo_cocina' onChange={handleChange} value={dataDB.co_tipo_cocina} className="rounded-r-full p-1 w-[75%]">
                                    <option value='na'>Tipo Cocina?</option>
                                    <option value='inudccion'>Inducción</option>
                                    <option value='vitroceramica'>Vitroceramica</option>
                                    <option value='abierta'>Mixta</option>
                                    <option value='gas'>Gas</option>
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <BiCoffee title='Tipo Cafetera' size={'1.2rem'} />
                                </label>
                                <select name='co_tipo_cafetera' onChange={handleChange} value={dataDB.co_tipo_cafetera} className="rounded-r-full p-1 w-[75%]">
                                    <option value='na'>Tipo Cafetera?</option>
                                    <option value='capsulas'>Capsulas</option>
                                    <option value='italiana'>Italiana</option>
                                    <option value='francesa'>Francesa</option>
                                </select>
                            </div>    
                        </div>
                    </fieldset>
                </div>

                {/* 1.2.2 Accesorios del Hogar */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Accesorios del Hogar</legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <RiVipFill title="Entrada Independiente" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ah_entrada_independiente !== undefined ? (dataDB.ah_entrada_independiente?'true':'false'):'-2'} onChange={handleChange} name='ah_entrada_independiente' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ah_entrada_independiente', 'Entrada Independiente?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <GiChimney title="Chimenea" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ah_chimenea !== undefined ? (dataDB.ah_chimenea?'true':'false'):'-2'} onChange={handleChange} name='ah_chimenea' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ah_chimenea', 'Tiene Chimenea?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <BsFillSafeFill title="Caja Fuerte" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ah_caja_fuerte !== undefined ? (dataDB.ah_caja_fuerte?'true':'false'):'-2'} onChange={handleChange} name='ah_caja_fuerte' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ah_caja_fuerte', 'Tiene Caja Fuerte?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <MdLocalBar title="Minibar" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ah_minibar !== undefined ? (dataDB.ah_minibar?'true':'false'):'-2'} onChange={handleChange} name='ah_minibar' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ah_minibar', 'Tiene Minibar?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <GiComputerFan title="Ventilador Techo" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ah_ventilador_techo !== undefined ? (dataDB.ah_ventilador_techo?'true':'false'):'-2'} onChange={handleChange} name='ah_ventilador_techo' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ah_ventilador_techo', 'Ventilador Techo?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* 1.3 Caractertisticas Adicionales del piso */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Caracteristicas Adicionales del Piso</legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <BiCar  title="Parking" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_aparcamiento_instalaciones !== undefined ? (dataDB.ca_aparcamiento_instalaciones?'true':'false'):'-2'} onChange={handleChange} name='ca_aparcamiento_instalaciones' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_aparcamiento_instalaciones', 'Tiene Parking?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <BiCar title="Plazas Parking" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <input placeholder='Nro de Plazas' type="number" onChange={handleChange} name='ca_nro_plazas' value={dataDB.ca_nro_plazas !== undefined ? dataDB.ca_nro_plazas : ''} className="rounded-r-full p-2 w-[75%]" />
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <GiRingingAlarm title="Alarma" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_alarma !== undefined ? (dataDB.ca_alarma?'true':'false'):'-2'} onChange={handleChange} name='ca_alarma' className="rounded-r-full p-1 w-[75%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_alarma', 'Tiene Alarma?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <FaFire title="Alarma Incendios" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_alarma_incendios !== undefined ? (dataDB.ca_alarma_incendios?'true':'false'):'-2'} onChange={handleChange} name='ca_alarma_incendios' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_alarma_incendios', 'Alarma Incendios?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <CalefaccionIcon title="Ubicación Calefacción" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select name='ca_ubicacion_calefaccion' value={dataDB.ca_ubicacion_calefaccion} onChange={handleChange} className="rounded-r-full p-1 w-[85%]">
                                    <option value='na'>Calefacción?</option>
                                    <option value='individual'>Individual</option>
                                    <option value='central'>Central</option>
                                </select>
                            </div> 
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <GiHeatHaze title='Tipo Calefacción' size={'1.2rem'} />
                                </label>
                                <select name='ca_tipo_calefaccion' value={dataDB.ca_tipo_calefaccion} onChange={handleChange} className="rounded-r-full p-1 w-[85%]">
                                    <option value='na'>Tipo Calefacción?</option>
                                    <option value='gas'>Gas</option>
                                    <option value='electrica'>Eléctrica</option>
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <MdBalcony title="Balcón" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_balcon !== undefined ? (dataDB.ca_balcon?'true':'false'):'-2'} onChange={handleChange} name='ca_balcon' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_balcon', 'Tiene Balcón?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <RiLandscapeFill title="Terraza" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_terraza !== undefined ? (dataDB.ca_terraza?'true':'false'):'-2'} onChange={handleChange} name='ca_terraza' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_terraza', 'Tiene Terraza?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <MdOutlineYard title="Patio Interior" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_patio_interior !== undefined ? (dataDB.ca_patio_interior?'true':'false'):'-2'} onChange={handleChange} name='ca_patio_interior' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_patio_interior', 'Patio Interior?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <GiGardeningShears title="Jardines" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.ca_jardin !== undefined ? (dataDB.ca_jardin?'true':'false'):'-2'} onChange={handleChange} name='ca_jardin' className="rounded-r-full p-1 w-[85%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-ca_jardin', 'Tiene Jardin?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <FaSwimmingPool title='Piscina' size={'1.2rem'} />
                                </label>
                                <select name='ca_piscina' value={dataDB.ca_piscina} onChange={handleChange} className="rounded-r-full p-1 w-[85%]">
                                    <option value='na'>Tiene Piscina?</option>
                                    <option value='no'>No</option>
                                    <option value='privada'>Si, privada</option>
                                    <option value='comunitaria'>Si, comunitaria</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* Caracteristicas de la Urbanización o Edificio */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                    <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Características de la Urbanización o Edificio</legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <GiKidSlide title="Zona Infantil" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.cu_zona_infantil !== undefined ? (dataDB.cu_zona_infantil?'true':'false'):'-2'} onChange={handleChange} name='cu_zona_infantil' className="rounded-r-full p-1 w-[80%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-cu_zona_infantil', 'Zona Infantil?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <MdSpa title="Spa" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.cu_spa !== undefined ? (dataDB.cu_spa?'true':'false'):'-2'} onChange={handleChange} name='cu_spa' className="rounded-r-full p-1 w-[80%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-cu_spa', 'Tiene Spa?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                            <div className=" w-full flex text-sm">
                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full'>
                                    <CgGym title="Gimnasio" color={'white'} className='w-[1.2rem] h-[1.2rem]' />
                                </label>
                                <select value={dataDB.cu_gimnasio !== undefined ? (dataDB.cu_gimnasio?'true':'false'):'-2'} onChange={handleChange} name='cu_gimnasio' className="rounded-r-full p-1 w-[80%]">
                                    { useMemo(() => drawListOnSelect(STATES_BOOLEAN, 's-cu_gimnasio', 'Tiene Gimnasio?'), []) }{/*Revisar funcionamiento*/} 
                                </select>
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* Campo para la url del plano del piso, unico campo para indicar el enlace*/}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Plano del Apartamento</legend> 
                        <div className="flex items-center justify-center w-full">    
                            <div className='w-full flex text-sm'>
                                <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <span className='display-icon-error'>
                                        <MdArchitecture title='Plano del Piso' size={'1.5rem'} />
                                    </span>
                                </label>
                                <input placeholder='Url de la imágen' type="url" onChange={handleChange} name='plano' defaultValue={dataDB.plano} className="rounded-r-full p-2 w-[94%] border" />
                                
                            </div>
                        </div>
                    </fieldset>
                </div>
                
                {/* Campo para la url de Mantenimiento */}
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                        <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Acceso a Mantenimiento</legend> 
                        <div className="flex items-center justify-center w-full">    
                            <div className='w-full flex text-sm'>
                                <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                    <span className='display-icon-error'>
                                        <FaTools title='Mantenimiento' size={'1.5rem'} />
                                    </span>
                                </label>
                                <input placeholder='Url sección de mantenimiento' type="url" onChange={handleChange} name='link_source_mantenimiento' defaultValue={dataDB.link_source_mantenimiento} className="rounded-r-full p-2 w-[94%] border" />
                                
                            </div>
                        </div>
                    </fieldset>
                </div>
                { /* Campo para los comentarios adicionales del piso */ }
                <div>
                    <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4 rounded-lg">
                    <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Comentarios Adicionales</legend>
                        <div className="w-full flex text-sm">
                            <label className='px-3 py-4 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                    <AiOutlineComment title='Observaciones adicionales' size={'1.5rem'} />
                                </span>
                            </label>
                            <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.observaciones} onChange={handleChange} className="rounded-r-full p-3 w-[94%] outline-blue-800 " name="observaciones"></textarea>
                        </div>
                    </fieldset>
                </div>
            </div>
            <ButtonContainerVertical>
                <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                {/* <FloatButton title='Eliminar' handler={handleDelete} Icon={FaTrashAlt} /> */}
                <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
            </ButtonContainerVertical>
        </div>
    </Layout>
    </>
    )
}

export default ApartmentsById