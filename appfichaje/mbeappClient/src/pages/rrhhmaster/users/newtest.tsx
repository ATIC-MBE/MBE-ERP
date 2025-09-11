import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { STATES, ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
//import useUserId from '@/client/hooks/share/users/useUserId'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { AiFillSave, AiOutlineBars, AiOutlineContacts, AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { MdCancel, MdEmail } from 'react-icons/md'
import SemaforoIcon from '@/components/Iconos/SemaforoIcon'
import useUserId from '@/client/hooks/share/users/useUserId'

const UserNew = () => {
    const _pathGoToBack = '/rrhhmaster/users'
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel, 
            errorValidate, 
            msgError,
            roles } = useUserId(_pathGoToBack)

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
                                <div className=" min-h-[16rem] bg-[#5da7d5c0] rounded-2xl p-6 space-y-3">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Usuario</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineContacts title='Nombres completos' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Nombres completos' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='nombre_completo' 
                                                        value={dataDB.nombre_completo} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <MdEmail title="Correo electrónico" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Correo electrónico' 
                                                        type="email" 
                                                        onChange={handleChange}
                                                        name='email' 
                                                        value={dataDB.email} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
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
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineLock title='Contraseña' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Contraseña' 
                                                        type="password" 
                                                        onChange={handleChange}
                                                        name='password' 
                                                        value={dataDB.password} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
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

export default UserNew