import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, TYPE_LEAD_RESPONSABLE } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiFillSave, AiOutlineComment, AiOutlineBars, AiOutlineBarcode } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { BsPersonBadge, BsPersonCheck } from 'react-icons/bs'
import usePerfilDNId from '@/client/hooks/share/perfiles/usePerfilDNId'

const PerfilNew = () => {
    const _pathGoToBack = '/dnmaster/perfiles'

    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel, 
            errorValidate, 
            msgError,
            isModalOpen,
            usuarios
             } = usePerfilDNId(_pathGoToBack)

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
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Perfil</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineBars title="Aplica a" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(TYPE_LEAD_RESPONSABLE, 't_leads', 'Aplica a?'), []) }
                                            </select>
                                        </div>

                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsPersonCheck title='Contraseña' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.idusuario_resp} onChange={handleChange} name='idusuario_resp' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(usuarios, 't_leads', 'Seleccionar responsable'), [usuarios]) }
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                                <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                    <span className='display-icon-error'>
                                                        <AiOutlineBarcode title="Código" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                    </span>
                                                </label>
                                                <input  placeholder='Código' 
                                                            type="text" 
                                                            onChange={handleChange}
                                                            name='codigo' 
                                                            value={dataDB.codigo} 
                                                            className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <BsPersonBadge title='Nombre perfil' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Nombre perfil' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='nombre' 
                                                        value={dataDB.nombre} 
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
                                            <textarea placeholder='Observaciones' defaultValue={dataDB.observacion} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="observacion"></textarea>
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
        </Layout>
    )
}

export default PerfilNew