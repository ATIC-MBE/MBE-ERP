import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { STATES, ALERT_DANGER, USER_DEPARMENT } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillSave, AiOutlineBars, AiOutlineCalendar, AiOutlineComment, AiOutlineContacts, AiOutlineFileText, AiOutlineLock, AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { MdCancel, MdEmail } from 'react-icons/md'
import SemaforoIcon from '@/components/Iconos/SemaforoIcon'
import { BsCalendar2Date } from "react-icons/bs";
import { BsCalendar2Month } from "react-icons/bs";
import { BsCalendar2Minus } from "react-icons/bs";
import useUserIdd from '@/client/hooks/share/users/useUserIdtest'



const UserById = () => {
    const _pathGoToBack = '/rrhhmaster/users'
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel, 
            errorValidate, 
            msgError,
            roles } = useUserIdd(_pathGoToBack)

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-auto min-h-[10rem] grid grid-flow-col">
                <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem] ">
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
                                <div className=" min-h-[16rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-3">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Usuario</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineContacts title='Nombre completo' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Nombre completo' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='nombre_completo' 
                                                        value={dataDB.nombre_completo} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>

                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineUser title='Usuario' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Usuario' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='username' 
                                                        value={dataDB.username} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>

                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <MdEmail title="Correo personal" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Correo personal' 
                                                        type="email" 
                                                        onChange={handleChange}
                                                        name='email' 
                                                        //value={dataDB.email} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                   
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineMail title='Correo MCH' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Correo MCH' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='mail_mch' 
                                                        value={dataDB.email} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>

                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
                                
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineBars title="Roles" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.idrol?.toString() || 0} onChange={handleChange} name='idrol' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(roles, 'roles', 'Seleccionar rol'), [roles]) }
                                            </select>
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineLock title='Contraseña' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Contraseña' 
                                                    disabled
                                                        type="password" 
                                                        name='password'
                                                        value={`*************`} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>

    
                                        
                                    </div>
                                    
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineCalendar title='Fecha de inicio' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha de inicio'
                                                    disabled 
                                                        type="date" 
                                                        onChange={handleChange}
                                                        name='fecha_inicio' 
                                                        value={dataDB.fecha_inicio} 
                                                        className=" px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white col-span-2'>
                                                <span className='display-icon-error'>
                                                    <span>a</span>
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha final' 
                                                        type="date" 
                                                        onChange={handleChange}
                                                        name='fecha_fin' 
                                                        value={dataDB.fecha_fin} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                        <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto w-[3rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsCalendar2Date title="Departamento" color={'white'} size={'1.2rem'} /> <span style={{color: 'white'}}></span><span></span>
                                                </span>
                                            </label>
                                            <span className=" px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6 bg-white">{dataDB.dias}</span>
                                            <label className='px-3 py-2 h-auto w-[3rem] bg-[#0077bd] text-red col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsCalendar2Month title="Departamento" color={'white'} size={'1.2rem'} /> <span style={{color: 'white'}}></span><span></span>
                                                </span>
                                            </label>
                                            <span className=" px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6 bg-white">{dataDB.meses}</span>
                                            <label className='px-3 py-2 h-auto w-[3rem] bg-[#0077bd] text-red col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsCalendar2Minus title="Departamento" color={'white'} size={'1.2rem'} /> <span style={{color: 'white'}}></span><span></span>
                                                </span>
                                            </label>
                                            <span className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6 bg-white">{dataDB.years}</span>
                                        </div>
                                        
                                     
                                        
                                    </div>
                                    
                             
                                    
                                    <div className='grid grid-cols-2 space-x-3'>
                                    <div className=" w-full flex text-sm ">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <span>SS</span> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Alta Seguridad Social' 
                                                    disabled
                                                        type="date" 
                                                        onChange={handleChange}
                                                        name='alta_ss' 
                                                        value={dataDB.alta_ss} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>

                                    <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <SemaforoIcon title="Estado" color={'white'} className='w-[0.9rem] h-[0.9rem]' /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.estado?.toString() || ''} onChange={handleChange} name='estado' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(STATES, 'sp', 'Seleccionar estado'), []) }
                                            </select>
                                        </div>

                                        
                        
                                    </div>
                                    
                      

                                   
                                    
                                 
                                    <div className='grid grid-cols-1 space-x-3'>
                                        
                                   
                                        <div className='grid grid-cols-1 space-x-3'>
                                        <div className="w-full flex text-sm">
                                            <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineComment title='Observaciones' size={'1.5rem'} />
                                                </span>
                                            </label>
                                            <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.detalles} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="observacion"></textarea>
                                        </div>
                                    </div>
                                     
                                        
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    
                </div>
                     
                </div>
                <ButtonContainerVertical>
                    <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
                {/* </div> */}
            </div>
        </Layout>
    )
}

export default UserById