import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, ESTADO_LLAVE, TIPO_LLAVE, TIPO_PISO, TYPE_LEAD_RESPONSABLE } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiFillSave, AiOutlineComment, AiOutlineBars, AiOutlineBarcode, AiFillHome, AiFillIdcard, AiOutlineQrcode, AiOutlineIdcard, AiOutlineCheck, AiFillCalendar, AiFillFileImage } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { BsPersonBadge, BsPersonCheck } from 'react-icons/bs'
import usePerfilDNId from '@/client/hooks/share/perfiles/usePerfilDNId'
import useKeysAticId from '@/client/hooks/atic/keys/useKeysAticId'
import { FaTrashAlt } from 'react-icons/fa'

const KeysId = () => {
    const _pathGoToBack = '/atic/keys'
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            handleDelete,
            errorValidate, 
            msgError,
            } = useKeysAticId(_pathGoToBack)

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
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Llave</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiFillHome title="name" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.ubicacion} onChange={handleChange} name='ubicacion' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(TIPO_PISO, 't_leads', 'Ubicación'), []) }
                                            </select>
                                        </div>

                                        <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineQrcode title='ID' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Id QR' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='idqr' 
                                                        value={dataDB.idqr} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiFillIdcard title="Codigo llave" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.tipo_tarjeta} onChange={handleChange} name='tipo_tarjeta' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(TIPO_LLAVE, 't_leads', 'Tipo Tarjeta'), []) }
                                            </select>
                                        </div>

                                        <div className=" w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineCheck title="Estado Llave" color={'white'} size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.estado} onChange={handleChange} name='estado' className="rounded-r-full p-1 w-[100%] col-span-6">
                                                { useMemo(() => drawListOnSelect(ESTADO_LLAVE, 't_leads', 'Estado Tarjeta'), []) }
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineQrcode title='QR' color='white' size={'1.2rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='URL QR' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='qr' 
                                                        value={dataDB.qr} 
                                                        className="rounded-r-full px-1  w-[100%] border border-l-0 border-[#0077bd] col-span-6" />
                                        </div>

                                        <div className=" w-full flex text-sm">
                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-red rounded-l-full col-span-2'>
                                                <span className='display-icon-error'>
                                                    <AiFillFileImage title='QR img' color='white' size={'1.2rem'} />
                                                </span>
                                            </label>
                                            <input  placeholder='URL Imagen QR' 
                                                        type="text" 
                                                        onChange={handleChange}
                                                        name='imagenqr' 
                                                        value={dataDB.imagenqr} 
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
                                            <textarea placeholder='Observaciones' value={dataDB.observacion} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="observacion"></textarea>
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

export default KeysId