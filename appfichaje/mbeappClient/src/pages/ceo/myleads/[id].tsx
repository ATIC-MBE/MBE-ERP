import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, CITIES, STATES, TIPO_LEADS } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import useMyLeadId from '@/client/hooks/ceo/myleads/useMyLeadId'

const MyLeadId = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            handleAddTelefono,
            handleDeleteTelefono,
            handleAddCorreo,
            handleDeleteCorreo,
            handleContratar,
            handleDelete,
            listAvance,
            refTelefono,
            refCorreo,
            listInteresa,
            listOcupacion,
            listResponsable, 
            listCategoria,
            errorValidate, 
            msgError } = useMyLeadId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
    <Layout>
        <div className="w-full min-h-[45rem] px-[6rem] ">
            <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                { errorValidate ?
                    <AlertContainer typeAlert={ALERT_DANGER}>
                        <div dangerouslySetInnerHTML={{ __html: msgError }} />
                    </AlertContainer>:<></>
                }
                <input type="hidden" name='id' value={dataDB.id?.toString()} />
                <div className="min-h-[38rem] grid grid-cols-2 space-x-5">
                    <div className="h-full grid space-y-5">
                        <div className=" min-h-[25rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                            <h1 className='text-lg text-[#0077bd] font-bold'>Datos Personales</h1>

                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Tipo lead</label>
                                <select disabled value={dataDB.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(TIPO_LEADS, 'tl', 'Seleccionar tipo lead'), []) }
                                </select>
                            </div>
                            
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombre</label>
                                    <input value={dataDB.nombre} onChange={handleChange} type="text" name='nombre' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Apellido</label>
                                    <input value={dataDB.apellido} onChange={handleChange} type="text" name='apellido' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>G. WPP</label>
                                    <input value={dataDB.grupo_wpp} onChange={handleChange} type="text" name='grupo_wpp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Referencia</label>
                                    <input value={dataDB.referencia} onChange={handleChange} type="text" name='referencia' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>

                            {/* <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Estado</label>
                                <select value={dataDB.estatus} onChange={handleChange} name='estatus' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), []) }
                                </select>
                            </div> */}

                            { dataDB.tipo_lead === 'Colaborador' ? 
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Empresa</label>
                                    <input value={dataDB.empresa} onChange={handleChange} type="text" name='empresa' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Categoria</label>
                                    {/* <input value={dataDB.referencia} onChange={handleChange} type="text" name='referencia' className="rounded-r-full p-2 w-[100%] outline-blue-800" /> */}
                                    <select value={dataDB.idcategoria} onChange={handleChange} name='idcategoria' className="rounded-r-full p-2 w-[100%] col-span-6">
                                        {/* { useMemo(() => drawListOnSelect(listCategoria, 'cat', 'Seleccionar Categoria'), [listCategoria]) } */}
                                        { drawListOnSelect(listCategoria, 'cat', 'Seleccionar Categoria') }
                                    </select>
                                </div>
                            </div>
                            : ''}

                            <div className='grid grid-cols-2 space-x-2'>
                                <div className="w-full grid grid-cols-8 text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Teléfono</label>
                                    <div className="w-[100%] flex">
                                        <input ref={refTelefono} value={dataDB.telefono} onChange={handleChange} type='text' name='telefono' className="p-2 w-max  outline-blue-800" />
                                        <div onClick={handleAddTelefono} className="bg-blue col-span-2 rounded-r-full flex items-center justify-end px-2 w-[5rem]">
                                            <AiOutlinePlus className='text-white cursor-pointer' size={'1.2rem'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full grid grid-cols-8 text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Correo</label>
                                    <div className="w-[100%] flex">
                                        <input ref={refCorreo} value={dataDB.correo} onChange={handleChange} type='text' name='correo' className="p-2 w-max  outline-blue-800" />
                                        <div onClick={handleAddCorreo} className="bg-blue col-span-2 rounded-r-full flex items-center justify-end px-2 w-[5rem]">
                                            <AiOutlinePlus className='text-white cursor-pointer' size={'1.2rem'} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 space-x-2'>
                                <div className="space-y-2">
                                {
                                    dataDB.telefonos.length === 0 ? '' : (
                                        dataDB.telefonos.map((el, index) => (
                                            <div className=" w-[90%] flex text-xs" key={`tlf-${index}`}>
                                                <label className='p-2 h-min min-w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{`Teléfono ${index+1}: `}</label>
                                                <div className="rounded-r-full p-2 px-3 w-[100%] h-[100%] bg-white flex justify-between">
                                                    <p>{el.numero}</p>
                                                    <div onClick={() => handleDeleteTelefono(el.numero)} className="h-full flex items-center">
                                                        <AiOutlineMinus className='text-[#0077bd] cursor-pointer' size={'1rem'} />
                                                    </div> 
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                </div>
                                <div className="space-y-2">
                                {
                                    dataDB.correos.length === 0 ? '' : (
                                        dataDB.correos.map((el, index) => (
                                            <div className=" w-[90%] flex text-xs" key={`cr-${index}`}>
                                                <label className='p-2 h-min min-w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{`Correo ${index+1}: `}</label>
                                                <div className="rounded-r-full p-2 px-3 w-[100%] h-[100%] bg-white flex justify-between">
                                                    <p>{el.correo}</p>
                                                    <div onClick={() => handleDeleteCorreo(el.correo)} className="h-full flex items-center">
                                                        <AiOutlineMinus className='text-[#0077bd] cursor-pointer' size={'1rem'} />
                                                    </div> 
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                                </div>
                                
                            </div>
                        </div>
                        {/* <div className=" row-span-4 bg-[#5da7d5c0] p-5 rounded-2xl space-y-2 h-[15rem]">
                            <h1 className='text-lg text-[#0077bd] font-bold'>Datos Propiedad</h1>
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Precio</label>
                                    <input value={dataDB.precio} onChange={handleChange} type="text" name='precio' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>m2</label>
                                    <input value={dataDB.m2} onChange={handleChange} type="text" name='m2' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Dirección</label>
                                    <input value={dataDB.direccion} onChange={handleChange} type="text" name='direccion' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro edificio</label>
                                    <input value={dataDB.nro_edificio} onChange={handleChange} type="text" name='nro_edificio' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro piso</label>
                                    <input value={dataDB.nro_piso} onChange={handleChange} type="text" name='nro_piso' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>C. Postal</label>
                                    <input value={dataDB.codigo_postal} onChange={handleChange} type="text" name='codigo_postal' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Localidad</label>
                                <select value={dataDB.localidad} onChange={handleChange} name='localidad' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(CITIES, 'loc', 'Seleccionar localidad'), []) }
                                </select>
                            </div>
                        </div> */}
                        { dataDB.tipo_lead === 'Propietario' ?
                            <div className=" row-span-4 bg-[#5da7d5c0] p-5 rounded-2xl space-y-2 h-[15rem]">
                                <h1 className='text-lg text-[#0077bd] font-bold'>Datos Propiedad</h1>
                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Precio</label>
                                        <input value={dataDB.precio} onChange={handleChange} type="text" name='precio' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>m2</label>
                                        <input value={dataDB.m2} onChange={handleChange} type="text" name='m2' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Dirección</label>
                                        <input value={dataDB.direccion} onChange={handleChange} type="text" name='direccion' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro edificio</label>
                                        <input value={dataDB.nro_edificio} onChange={handleChange} type="text" name='nro_edificio' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro piso</label>
                                        <input value={dataDB.nro_piso} onChange={handleChange} type="text" name='nro_piso' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[7rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>C. Postal</label>
                                        <input value={dataDB.codigo_postal} onChange={handleChange} type="text" name='codigo_postal' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Localidad</label>
                                    <select value={dataDB.localidad} onChange={handleChange} name='localidad' className="rounded-r-full p-2 w-[100%] col-span-6">
                                        {/* { useMemo(() => drawListOnSelect(CITIES, 'loc', 'Seleccionar localidad'), []) } */}
                                        { drawListOnSelect(CITIES, 'loc', 'Seleccionar localidad') }
                                    </select>
                                </div>
                            </div>
                        : '' }
                    </div>



                    <div className="bg-[#ffffff5f] rounded-2xl p-5 space-y-2 h-full">
                        <h1 className='text-lg text-[#0077bd] font-bold'>Datos Leads</h1>
                        <div className=" w-full flex text-xs">
                            <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Lead ID</label>
                            <input readOnly value={dataDB.lead_id} onChange={handleChange} type="text" name='lead_id' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nro llamadas</label>
                                <input readOnly value={dataDB.nro_llamadas} onChange={handleChange} type="number" name='nro_llamadas' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                            </div>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>F. ult. cambio</label>
                                <input readOnly value={dataDB.timestamp} onChange={handleChange} type="text" name='timestamp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Last step <span style={{color: 'red'}} className='field-required'>*</span></label>
                                <input readOnly value={dataDB.last_step} onChange={handleChange} type="date" name='last_step' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                            </div>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step <span style={{color: 'red'}} className='field-required'>*</span></label>
                                <input value={dataDB.next_step} onChange={handleChange} type="date" name='next_step' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Responsable</label>
                                <select value={dataDB.idresponsable} onChange={handleChange} name='idresponsable' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(listResponsable, 'lresp', 'Seleccionar Responsable'), [listResponsable]) }
                                </select>
                            </div>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Interesa</label>
                                <select value={dataDB.idtipointeresa} onChange={handleChange} name='idtipointeresa' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(listInteresa, 'lint', 'Seleccionar Interesa'), [listInteresa]) }
                                </select>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 space-x-2'>
                            {/* <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Ocupación</label>
                                <select value={dataDB.idtipoocupacion} onChange={handleChange} name='idtipoocupacion' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(listOcupacion, 'locu', 'Seleccionar Ocupación'), [listOcupacion]) }
                                </select>
                            </div> */}
                            { dataDB.tipo_lead === 'Propietario' ? 
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Ocupación</label>
                                <select value={dataDB.idtipoocupacion} onChange={handleChange} name='idtipoocupacion' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    {/* { useMemo(() => drawListOnSelect(listOcupacion, 'locu', 'Seleccionar Ocupación'), [listOcupacion, dataDB.tipo_lead]) } */}
                                    { drawListOnSelect(listOcupacion, 'locu', 'Seleccionar Ocupación') }
                                </select>
                            </div> 
                            : ''}
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Avance</label>
                                <select value={dataDB.idtipoavance} onChange={handleChange} name='idtipoavance' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(listAvance, 'lava', 'Seleccionar avance'), [listAvance]) }
                                </select>
                            </div>
                        </div>
                        
                        <div className="w-full flex text-xs">
                            <label className='p-5 h-min w-[8.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Comentario <span style={{color: 'red'}} className='field-required'>*</span></label>
                            <textarea defaultValue={dataDB.comentario} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="comentario"></textarea>
                        </div>
                        {/* Solo para edición*/}
                        <div className="w-full h-[2rem] bg-[#0077bd] text-white px-3 rounded-full text-sm grid items-center">Historial</div>
                        <div className="w-full max-h-[20rem] p-3 overflow-y-scroll space-y-3">
                            {
                                    dataDB.historico.length === 0 ? '' : (
                                        dataDB.historico.map((el, index) => (
                                            <div key={`hst-${index}`} className="bg-white w-full h-auto p-3 rounded-lg">
                                                {`${el.comentario}`}
                                                <div className="text-sm w-full text-blue-800 font-semibold text-right"> 
                                                    {`${el.responsable}, `} <span className=' font-extrabold'>{`${el.fecha_creacion}`}</span> 
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                        </div>
                    </div>
                </div>
                <br />
                <ButtonContainer>
                    <button onClick={handleSave} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Guardar</button>
                    <button onClick={handleContratar} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Contratar</button>
                    <button onClick={handleDelete} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Eliminar</button>
                    <button onClick={handleCancel} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Cancelar</button>
                </ButtonContainer>
            </div>
        </div>
    </Layout>
    )
}

export default MyLeadId