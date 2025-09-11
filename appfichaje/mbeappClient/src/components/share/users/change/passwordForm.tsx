import React from 'react'
import { ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import { AiFillEye, AiFillEyeInvisible, AiFillSave } from 'react-icons/ai'
import usePassword from '@/client/hooks/share/users/usePassword'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { MdCancel } from 'react-icons/md'
import PasswordIcon from '@/components/Iconos/PasswordIcon'


const PasswordForm = ({ pathToBack, id }: { pathToBack: string, id: number }) => {
    const {
        dataDB,
        userDB,
        flagPassword,
        errorValidate,
        msgError,
        handleChange,
        handleSave,
        handleCancel,
        handlerFlagPassword
    } = usePassword(pathToBack, id)

    return (
        <div className="w-auto min-h-[10rem] grid grid-flow-col">
            <div className="w-[80rem] w-min-[80rem] min-h-[10rem] pl-[6rem]">
                <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                    { errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer>:<></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />
                    <div className="min-h-[15rem] grid grid-cols-2m space-x-5">
                        <div className="h-full grid space-y-5">
                            <div className=" min-h-[14rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                                <h1 className='text-lg text-[#0077bd] font-bold'>Cambiar contraseña</h1>
                                <div className='grid grid-cols-1 space-x-2'>
                                    <div className=" w-full flex text-lg">{userDB.nombre_completo}</div>
                                </div>
                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-ms">
                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                            <PasswordIcon title="Contraseña actual" color={'white'} className='w-[1.3rem] h-[1.2rem]' />
                                        </label>
                                        <input type={`${flagPassword.flagPasswordCurrent?'text':'password'}`} placeholder='Contraseña actual' className="rounded-r-full1 p-2 w-[80%] outline-blue-800" onChange={handleChange} value={dataDB.password_current} name='password_current' />
                                        <label onClick={ () => handlerFlagPassword('flagPasswordCurrent') } className={`px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-r-full col-span-2`}>
                                            {
                                                (!flagPassword.flagPasswordCurrent) ? 
                                                    <AiFillEyeInvisible title={`Mostrar contraseña`} size={'1.3rem'} /> 
                                                    :
                                                    <AiFillEye title={`Ocultar contraseña`} size={'1.3rem'} />
                                            }
                                        </label>
                                    </div>
                                    <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                            <PasswordIcon title="Contraseña nueva" color={'white'} className='w-[1.3rem] h-[1.2rem]' />
                                        </label>
                                        <input type={`${flagPassword.flagPasswordNew?'text':'password'}`} placeholder='Contraseña nueva' className="rounded-r-full1 p-2 w-[80%] outline-blue-800" onChange={handleChange} value={dataDB.password_new} name='password_new' />
                                        <label onClick={ () => handlerFlagPassword('flagPasswordNew') } className={`px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-r-full col-span-2`}>
                                            {
                                                (!flagPassword.flagPasswordNew) ? 
                                                    <AiFillEyeInvisible title={`Mostrar contraseña`} size={'1.3rem'} /> 
                                                    :
                                                    <AiFillEye title={`Ocultar contraseña`} size={'1.3rem'} />
                                            }
                                        </label>
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
        </div>
    )
}

export default PasswordForm