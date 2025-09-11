import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { STATES, ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import useUserId from '@/client/hooks/rrhhmaster/users/useUserId'

const UserById = () => {
    const { dataDB,
        handleChange,
        handleSave,
        handleCancel,
        errorValidate,
        msgError,
        roles } = useUserId()

    //Verificacion por ID pendiente
    //Editar y eliminar

    const drawListOnSelect = (lData: Array<{ key: string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-full h-full grid items-center justify-items-center">
                <div className="w-[45rem] h-full rounded-3xl bg-[#0077bdaf] py-10 px-10 space-y-5">
                    {errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer> : <></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Username <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <input type="text" onChange={handleChange} name='username' value={dataDB.username} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombre <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <input type="text" onChange={handleChange} name='nombre' value={dataDB.nombre} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Apellido <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <input type="text" onChange={handleChange} name='apellido' value={dataDB.apellido} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Email <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <input type="text" onChange={handleChange} name='email' value={dataDB.email} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Estado <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <select value={dataDB.estado} onChange={handleChange} name='estado' className="rounded-r-full p-4 col-span-6">
                                {useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), [])}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Rol <span style={{ color: 'red', fontSize: 'bold' }}>*</span></label>
                            <select value={dataDB.idrol || 'NA'} onChange={handleChange} name='idrol' className="rounded-r-full p-4 col-span-6">
                                {useMemo(() => drawListOnSelect(roles, 'rl', 'Seleccionar rol'), [roles])}
                            </select>
                        </div>
                    </div>

                    <ButtonContainer>
                        <button onClick ={handleSave} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Guardar</button>
                        <button onClick={handleCancel} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Cancelar</button>
                    </ButtonContainer>
                </div>
                <br />
            </div>
        </Layout>
    )
}

export default UserById