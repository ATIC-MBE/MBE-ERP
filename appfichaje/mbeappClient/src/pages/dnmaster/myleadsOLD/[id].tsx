import { Layout } from '@/components/Layout'
import { ALERT_DANGER, CITIES, STATES, TIPO_LEADS } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiOutlinePlus, AiFillSave, AiOutlineClose, AiOutlineWhatsApp, AiOutlineMail, AiOutlineComment } from 'react-icons/ai'
import { FaHandshake, FaTrashAlt } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import Modal from '@/components/Modal'
import FloatButton from '@/components/FloatButton'
import { BsFillHouseFill, BsFillPersonCheckFill, BsFillPersonFill, BsFillTelephoneFill, BsLink, BsListCheck } from 'react-icons/bs'
import EnumButtons from '@/components/EnumButtons'
import useMyLeadId from '@/client/hooks/dnmaster/myleads/useMyLeadId'
import React, { useMemo, useState } from 'react';

const LeadId = () => {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { dataDB,
        handleChange,
        handleSave,
        handleCancel,
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
        msgError,
        isModalOpen,
        listGrupo,
        fnHidenModal,
        handleChangeGrupo,
        handleActionGrupo,
        newGrupo,
        handleNewGrupo,
        handleContratarModal,
        validateCodeGroup,
        flagInteresa,
        setFlagInteresa,
        flagOcupacion,
        setFlagOcupacion,
        flagAvance,
        setFlagAvance } = useMyLeadId()

    const drawListOnSelect = (lData: Array<{ key: string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

     
 //Manda el numero de telefono y el nombre guardado por ek botón y lo envía a Make para guardar el contacto en google Contacts
 const sendPhoneNumberToMake = async (firstName: string, phoneNumber: string) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
        let response;

        if (dataDB.tipo_lead == 'Colaborador') {
             //Manda el núm y el nombre a make y guarda contacto en google Contact dn3@micityhome.es
            response = await fetch('https://hook.eu2.make.com/7h0s5b96t2tf7894yab4hlw3uuyhi3x8', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Cambiar a los nombres correctos segun campos de MÓODULO MAKE
                body: JSON.stringify({ nombre_completo: firstName, telefono: phoneNumber }), 
            });
        } else if (dataDB.tipo_lead == 'Propietario') {
            //Manda el núm y el nombre a make y guarda contacto en google Contact dn2@micityhome.es
            response = await fetch('https://hook.eu2.make.com/pfllqshorkx3iu14ouxnrdafsxjnh6b2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Cambiar a los nombres correctos segun campos de MÓODULO MAKE
                body: JSON.stringify({ nombre_completo: firstName, telefono: phoneNumber }), 
            });
        } else {
            setErrorMessage('Tipo de lead no soportado');
            return;
        }

        if (response.ok) {
            setSuccessMessage('Número de teléfono y nombre enviados con éxito');
        } else {
            setErrorMessage('Falló el envío del número de teléfono y nombre');
        }
    } catch (error: any) {
        setErrorMessage('Error al enviar el número de teléfono y nombre: ' + error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <Layout>
            <div className="w-auto h-full grid grid-flow-col">
                <div className="w-full min-h-[45rem] px-[6rem] ">
                    <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                        {errorValidate ?
                            <AlertContainer typeAlert={ALERT_DANGER}>
                                <div dangerouslySetInnerHTML={{ __html: msgError }} />
                            </AlertContainer> : <></>
                        }
                        <input type="hidden" name='id' value={dataDB.id?.toString()} />
                        <div className="min-h-[35rem] grid grid-cols-2 space-x-5">
                            <div className="h-full grid space-y-5">
                                <div className=" min-h-[18rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Datos Personales</h1>

                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Tipo lead</label>
                                        <select value={dataDB.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-2 w-[100%] col-span-6">
                                            {useMemo(() => drawListOnSelect(TIPO_LEADS, 'tl', 'Seleccionar tipo lead'), [])}
                                        </select>
                                    </div>

                                    {/* <div className='grid grid-cols-2 space-x-2'>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombre</label>
                                    <input value={dataDB.nombre} onChange={handleChange} type="text" name='nombre' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                                <div className=" w-full flex text-xs">
                                    <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Apellido</label>
                                    <input value={dataDB.apellido} onChange={handleChange} type="text" name='apellido' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div> */}

                                    <div className='grid space-x-2'>
                                        <div className=" w-full flex text-xs">
                                            {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombres</label> */}
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsFillPersonFill title='Nombres persona' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Nombres completos' value={dataDB.nombre_completo} onChange={handleChange} type="text" name='nombre_completo' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 space-x-2'>
                                        <div className=" w-full flex text-xs">
                                            {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>G. WPP</label> */}
                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <AiOutlineWhatsApp title='Grupo whatsapp' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Grupo whatsaap' value={dataDB.grupo_wpp} onChange={handleChange} type="text" name='grupo_wpp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                        </div>
                                        <div className=" w-full flex text-xs">
                                            {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Referencia</label> */}
                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsLink title='Link referencia' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Link referencia' value={dataDB.referencia} onChange={handleChange} type="text" name='referencia' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                        </div>
                                    </div>

                                    {/* <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Estado</label>
                                <select value={dataDB.estatus} onChange={handleChange} name='estatus' className="rounded-r-full p-2 w-[100%] col-span-6">
                                    { useMemo(() => drawListOnSelect(STATES, 'st', 'Seleccionar estado'), []) }
                                </select>
                            </div> */}

                                    {dataDB.tipo_lead === 'Colaborador' ?
                                        <div className='grid grid-cols-2 space-x-2'>
                                            <div className=" w-full flex text-xs">
                                                {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Empresa</label> */}
                                                <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <BsFillHouseFill title='Empresa' size={'1.2rem'} />
                                                </label>
                                                <input placeholder='Nombre empresa' value={dataDB.empresa} onChange={handleChange} type="text" name='empresa' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                            </div>
                                            <div className=" w-full flex text-xs">
                                                {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Categoria</label> */}
                                                <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <BsListCheck title='Categoría' size={'1.2rem'} />
                                                </label>
                                                <select value={dataDB.idcategoria} onChange={handleChange} name='idcategoria' className="rounded-r-full p-2 w-[100%] col-span-6">
                                                    {drawListOnSelect(listCategoria, 'cat', 'Seleccionar Categoria')}
                                                </select>
                                            </div>
                                        </div>
                                        : ''}

                                    <div className='grid grid-cols-2 space-x-2'>
                                        <div className="w-full flex text-xs">
                                            {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Teléfono</label> */}
                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsFillTelephoneFill title='Teléfono' size={'1rem'} />
                                            </label>
                                            <input placeholder='Número de teléfono' ref={refTelefono} value={dataDB.telefono} onChange={handleChange} type='text' name='telefono' className="p-2 w-[100%] rounded-r-full outline-blue-800" />
                                        </div>
                                        <div className="w-full flex text-xs">
                                            {/* <label className='p-2 h-min w-[5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Correo</label> */}
                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <AiOutlineMail title='Correo' size={'1.2rem'} />
                                            </label>
                                            <input placeholder='Correo electrónico' ref={refCorreo} value={dataDB.correo} onChange={handleChange} type='text' name='correo' className="p-2 w-[100%] rounded-r-full outline-blue-800" />
                                        </div>
                                    </div>

                                    {/* guarda el núm de telefono y el nombre de los campos  */}
                                    <button
                                    onClick={() => {
                                        // verifica si los campos están vacíos
                                        if (dataDB.nombre_completo && dataDB.telefono && dataDB.tipo_lead) {
                                            // Valida nombre_completo es un string
                                            if (typeof dataDB.nombre_completo === 'string' && dataDB.nombre_completo.trim() !== '') {
                                                // Valida el núm (hasta 15 digitos,permitiendo prefijos opcionales)
                                                const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{1,15}$/; // Permite prefijos opcionales y un número de hasta 15 dígitos
                                                if (phoneRegex.test(dataDB.telefono)) {
                                                    // llama siguiendo el orden, primero el nombre, luego el telefono
                                                    sendPhoneNumberToMake(dataDB.nombre_completo, dataDB.telefono);
                                                } else {
                                                    setErrorMessage('El número de teléfono no es válido. Debe tener hasta 15 dígitos y puede incluir un prefijo.');
                                                }
                                            } else {
                                                setErrorMessage('El nombre completo debe ser un string no vacío.');
                                            }
                                        } else {
                                            setErrorMessage('El número de teléfono y el nombre completo no pueden estar vacíos');
                                        }
                                    }} className='ml-2 bg-[#0077bd] h-min text-white px-2 py-1 text-[1rem] border border-blue rounded-xl'>
                                        Guardar contacto
                                    </button>

                                    {loading && <p>Guardando...</p>} {/* Mensaje de carga */}

                                    {successMessage && <p className="text-green-600">{successMessage}</p>} {/* Mensaje de éxito */}
                                    {errorMessage && <p className="text-red-600">{errorMessage}</p>} {/* Mensaje de error */}

                                    {/* <div className='grid grid-cols-2 space-x-2'>
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
                                
                            </div> */}
                                </div>
                                {   dataDB.tipo_lead === 'Propietario' && false ?
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
                                                {drawListOnSelect(CITIES, 'loc', 'Seleccionar localidad')}
                                            </select>
                                        </div>
                                    </div>
                                    : ''}

                                <div className="bg-[#5da7d5c0] rounded-2xl p-5 space-y-2 h-full">
                                    <h1 className='text-lg text-[#0077bd] font-bold'>Datos Leads</h1>
                                    <div className='grid grid-cols-1 space-x-2'>
                                        <div className=" w-full flex text-xs">
                                            <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>F. ult. cambio</label>
                                            <input disabled value={dataDB.timestamp} onChange={handleChange} type="text" name='timestamp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 space-x-2'>
                                        <div className=" w-full flex text-xs">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                <BsFillPersonCheckFill title='Perfil responsable' size={'1.2rem'} />
                                            </label>
                                            <select value={dataDB.idresponsable} onChange={handleChange} name='idresponsable' className="rounded-r-full p-2 w-[100%] col-span-6">
                                                { drawListOnSelect(listResponsable, 'lresp', 'Seleccionar Perfil Responsable') }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-min grid space-x-2">
                                        <div className="flex text-sm">
                                            <EnumButtons txtSize='sm' values={[...listInteresa.map(el => el.name)]} selected={flagInteresa} setSelected={setFlagInteresa} />
                                        </div>
                                    </div>

                                    { dataDB.tipo_lead === 'Propietario' ? 
                                        <div className="grid space-x-2">
                                            <div className="w-auto flex text-sm">
                                                <EnumButtons txtSize='sm' values={[...listOcupacion.map(el => el.name)]} selected={flagOcupacion} setSelected={setFlagOcupacion} />
                                            </div>
                                        </div> 
                                        : ''
                                    }

                                    <div className="w-min grid space-x-2">
                                        <div className="flex text-sm">
                                            <EnumButtons txtSize='sm' values={[...listAvance.map(el => el.name)]} selected={flagAvance} setSelected={setFlagAvance} />
                                        </div>
                                    </div>
                                    {
                                        flagAvance === 3 ?
                                            <div className=" w-full flex text-sm">
                                                <label className='px-1 py-1 h-auto w-full col-span-2 text-sm'>
                                                    <b className='txt-red-c62608'>Importante:</b> { flagAvance === 3 ? `Se procederá a contratar al ${dataDB.tipo_lead === 'Propietario'?'"Propietario"':(dataDB.tipo_lead === 'Colaborador'?'"Prescriptor"':'"XXX"')}`: '"XXX"' }
                                                </label>
                                            </div> : ''
                                    }
                                </div>
                            </div>


                            <div className="bg-[#ffffff5f] rounded-2xl p-5 space-y-2 h-full">
                                <h1 className='text-lg text-[#0077bd] font-bold'>Historial</h1>
                                {/* <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>F. ult. cambio</label>
                                        <input readOnly value={dataDB.timestamp} onChange={handleChange} type="text" name='timestamp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                </div> */}
                                <div className='grid grid-cols-2 space-x-2'>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Last step <span style={{ color: 'red' }} className='field-required'>*</span></label>
                                        <input readOnly value={dataDB.last_step} onChange={handleChange} type="date" name='last_step' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                    <div className=" w-full flex text-xs">
                                        <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step <span style={{ color: 'red' }} className='field-required'>*</span></label>
                                        <input value={dataDB.next_step} onChange={handleChange} type="date" name='next_step' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                    </div>
                                </div>

                                <div className="w-full flex text-sm">
                                    {/* <label className='p-5 h-min w-[8.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Comentario <span style={{ color: 'red' }} className='field-required'>*</span></label> */}
                                    <label className='px-3 py-2 h-auto w-[3rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                        <span className='display-icon-error'>
                                            <AiOutlineComment title='Comentario' size={'1.5rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                        </span>
                                    </label>
                                    <textarea placeholder='Ingresar comentarios' defaultValue={dataDB.comentario} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="comentario"></textarea>
                                </div>
                                {/* Solo para edición*/}
                                {/* <div className="w-full h-[2rem] bg-[#0077bd] text-white px-3 rounded-full text-sm grid items-center">Historial</div> */}
                                <hr />
                                <div className="w-full max-h-[20rem] p-3 overflow-y-scroll space-y-3">
                                    {
                                        dataDB.historico.length === 0 ? '' : (
                                            dataDB.historico.map((el, index) => (
                                                <div key={`hst-${index}`} className="bg-white w-full h-auto p-3 rounded-lg">
                                                    {`${el.comentario}`}
                                                    <div className="text-xs w-full text-blue-800 font-semibold text-right">
                                                        {`${el.responsable}, `} <span className=''>{`${el.fecha_creacion_short}`}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <br />

                    </div>
                </div>
                <ButtonContainerVertical>
                    <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                    <FloatButton title='Contratar' handler={handleContratarModal} Icon={FaHandshake} />
                    <FloatButton title='Eliminar' handler={handleDelete} Icon={FaTrashAlt} />
                    <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
                </ButtonContainerVertical>
            </div>
            <Modal title={`Contratar ${dataDB.tipo_lead==='Propietario'?'Propietario':'Prescriptor'}`} isOpen={isModalOpen} >
            <>
            <div className='w-[30rem] bg-[#badaed54] p-4 rounded-2xl'>
                <div className="w-full grid max-h-[15rem] overflow-y-scroll">
                    {
                        listGrupo.map((el, index) => 
                            <div key={`grp-${index}`} className="w-full flex text-sm">
                                <div onClick={() => handleChangeGrupo(parseInt(el.key))} className="flex items-center mr-4 py-[0.4rem] cursor-pointer">
                                    <input checked={dataDB.grupo?.id.toString() === el.key} onChange={(e) => {}} type="radio" value={`${el.key}`} name="grupo" className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-2 text-sm font-medium text-gray-900 text-bold1 dark:text-gray-300 cursor-pointer">{ el.name }</label>
                                </div>
                            </div>
                        )
                    }
                </div>
                <hr className='mt-3 mb-3 border-1 border-[#c7d2e7]' />
                <div className="w-full h-full grid">
                    <div className="w-full flex text-sm">
                        <div className="w-full flex items-center mr-4 py-[0.4rem]">
                            {
                                newGrupo ? 
                                <>
                                    <div className='w-full space-x-2'>
                                        <div className="w-[100%] flex text-black text-xs">
                                            <input placeholder='Nombre grupo' value={dataDB.grupo?.nombre} onChange={handleNewGrupo} type='text' name='grupo' className="p-2 w-[70%] rounded-l-full outline-blue-800" />
                                            <div onClick={() => handleActionGrupo('delete')} className="bg-blue col-span-2 rounded-r-full flex items-center justify-end px-2 w-[2rem]">
                                                <AiOutlineClose className='text-white cursor-pointer' size={'1rem'} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className='cursor-pointer flex' onClick={() => handleActionGrupo('new')}>
                                    <button title={'Nuevo'} className='bg-[#0077bd] text-white p-[0.3rem] text-lg border border-blue rounded-full' type='button'>
                                        <AiOutlinePlus size={'1.2rem'} />
                                    </button>
                                    <span className='ml-2 text-sm self-center'>Nuevo grupo</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='btnContent w-full flex justify-end sticky'>
                {
                    ( validateCodeGroup() ) ?
                    <button onClick={handleContratar} className='w-[5rem] p-2 hover:text-white text-blue-700 border border-[#0077bd] rounded-full hover:bg-[#0077bd]' type='button'>Listo</button>
                    :
                    ''
                }
                <button onClick={fnHidenModal} className='py-2 px-2 hover:text-white text-orange-600 border border-[#ed7233] rounded-full hover:bg-[#ed7233]' type='button'>Cancelar</button>
            </div>
            </>

        </Modal>
        </Layout>
    )
}

export default LeadId