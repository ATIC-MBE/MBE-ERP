import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillSave, AiOutlineComment, AiOutlineFieldTime, AiOutlineUser } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import { BsCalendar3, BsFillHouseFill } from 'react-icons/bs'
import { BiTimer } from 'react-icons/bi'
import useControlLimpiezaId from '@/client/hooks/ademaster/controllimpieza/useControlLimpiezaId'
import { FaTrashAlt } from 'react-icons/fa'

const ControlLimpiezaId = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            handleDelete,
            errorValidate, 
            msgError,
            limpiezaUsers,
            pisos } = useControlLimpiezaId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-auto min-h-[10rem] grid grid-flow-col">
                <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        { errorValidate ?
                            <AlertContainer typeAlert={ALERT_DANGER}>
                                <div dangerouslySetInnerHTML={{ __html: msgError }} />
                            </AlertContainer>:<></>
                        }
                        <input type="hidden" name='id' value={dataDB.id?.toString()} />

                        <div className="min-h-[10rem] grid grid-cols-1n space-x-5">
                            <div className="h-full grid space-y-2">
                                <div className=" min-h-[18rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-3">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Control de limpieza</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsFillHouseFill title='Piso' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.idpiso?.toString() || 0} onChange={handleChange} name='idpiso' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(pisos, 'sp', 'Seleccionar piso'), [pisos]) }
                                            </select>
                                        </div>
                                        
                                        
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineUser title="Personal limpieza" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.idusuario?.toString() || 0} onChange={handleChange} name='idusuario' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(limpiezaUsers, 'sl', 'Seleccionar personal limpieza'), [limpiezaUsers]) }
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-3 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsCalendar3 title='Fecha' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha' 
                                                        type="date" 
                                                        onChange={handleChange}
                                                        name='fecha' 
                                                        value={dataDB.fecha} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineFieldTime title='Horario' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  className="h-min p-2 w-[8.5rem] outline-blue-800" 
                                                onChange={handleChange} 
                                                value={dataDB.h_entrada}
                                                type="time" 
                                                name='h_entrada' />
                                            <label className='p-2 h-min w-[2rem] bg-[#0077bd] text-white col-span-2'>a</label>
                                            <input  className="h-min rounded-r-full p-2 w-[8.5rem] outline-blue-800" 
                                                    onChange={handleChange}
                                                    value={dataDB.h_salida} 
                                                    type="time" 
                                                    name='h_salida' />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BiTimer title='Total' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='0h 0min'
                                                    disabled 
                                                    type="text" 
                                                    name='t_total_horas' 
                                                    value={dataDB.t_total_horas} 
                                                    className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 space-x-3'>
                                        <div className="w-full flex text-sm">
                                            <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineComment title='Observaciones' size={'1.5rem'} />
                                                </span>
                                            </label>
                                            <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.observacion} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="observacion"></textarea>
                                        </div>
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

export default ControlLimpiezaId