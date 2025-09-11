import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { COUNTRIES, CITIES, STATES, ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import useApartmentId from '@/client/hooks/dnmaster/apartments/useApartmentId'

const ApartmentsById = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            errorValidate, 
            msgError,
            propietarios } = useApartmentId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-full h-full grid items-center justify-items-center">
                <div className="w-[45rem] h-full rounded-3xl bg-[#0077bdaf] py-10 px-10 space-y-5">
                    { errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer>:<></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Código <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='id_dispositivo_ref' value={dataDB.id_dispositivo_ref} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombre <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='etiqueta' value={dataDB.etiqueta} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>País <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <select value={dataDB.pais} onChange={handleChange} name='pais' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(COUNTRIES, 'co', 'Seleccionar país'), []) }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Ciudad <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <select value={dataDB.ciudad} onChange={handleChange} name='ciudad' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(CITIES, 'ci', 'Seleccionar ciudad'), []) }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Estado <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <select value={dataDB.estado} onChange={handleChange} name='estado' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), []) }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Código Postal <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='codigo_postal' value={dataDB.codigo_postal} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Dirección <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='direccion' value={dataDB.direccion} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro edificio <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='nro_edificio' value={dataDB.nro_edificio} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro piso <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='nro_piso' value={dataDB.nro_piso} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Propietario</label>
                            <select value={dataDB.idpropietario?.toString() || 0} onChange={handleChange} name='idpropietario' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(propietarios, 'ppt', 'Seleccionar propietario'), [propietarios]) }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Ubicación mapa</label>
                            <input type="text" onChange={handleChange} name='ubicacion_mapa' value={dataDB.ubicacion_mapa} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Observaciones</label>
                            <textarea defaultValue={dataDB.observaciones} onChange={handleChange} className="rounded-r-full p-4 col-span-6" name="observaciones"></textarea>
                        </div>
                    </div>

                    <ButtonContainer>
                        <button onClick={handleSave} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Guardar</button>
                        <button onClick={handleCancel} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Cancelar</button>
                    </ButtonContainer>
                </div>
                <br />
            </div>
        </Layout>
    )
}

export default ApartmentsById