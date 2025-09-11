import { Layout } from '@/components/Layout'
import React from 'react'
import { AiFillSave, AiOutlineCheck, AiOutlineClose, AiOutlineComment, AiOutlineEuro, AiOutlineMail, AiOutlineUndo, AiOutlineUser, AiOutlineWhatsApp } from 'react-icons/ai'
import { ALERT_DANGER } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import EnumButtons from '@/components/EnumButtons'
import { IconType } from 'react-icons'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import { MdCancel } from 'react-icons/md'
import Modal from '@/components/Modal'
import AgenteIcon from '@/components/Iconos/AgenteIcon'
import useGrupoPreId from '@/client/hooks/rrhhmaster/grupo/prescriptor/useGrupoPreId'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { BsFillHouseFill, BsListCheck } from 'react-icons/bs'

type floatButtonType = { handler: () => any, Icon: IconType, title?: string }

const FloatButton = ({ handler, Icon, title = 'Default' }: floatButtonType) => (
    <button title={title} onClick={handler} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'><Icon size={'2rem'} /></button>
)

const LeadId = () => {
    const { dataDB,
            flagVR,
            setFlagVR, 
            handleChange, 
            handleSave,
            handleCancel,
            handleChangePrescriptor,
            handleOperation,
            errorValidate, 
            msgError,
            listSucesos,
            isModalOpen,
            fnSelectPrescriptor,
            listCategoria,
            dataTypeSucess } = useGrupoPreId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
    <Layout>
        {/* <div className="w-full min-h-[38rem] px-[6rem] "> */}
        <div className="w-auto  min-h-[30rem] grid grid-flow-col">
        {/* <div className="h-100 overflow-hidden bg-image lg:p-5 md:p-5 p-1 pt-2 lg:flex md:flex grid justify-items-center"> */}
            <div className="w-full min-h-[20rem] px-[6rem] ">
            <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
                { errorValidate ?
                    <AlertContainer typeAlert={ALERT_DANGER}>
                        <div dangerouslySetInnerHTML={{ __html: msgError }} />
                    </AlertContainer>:<></>
                }
                <input type="hidden" name='id' value={dataDB.id?.toString()} />

                <div className="min-h-[25rem] grid grid-cols-2 space-x-5">
                    <div className="h-full grid space-y-2">
                        <div className=" min-h-[18rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                            <h1 className='text-lg text-[#0077bd] font-bold'>Información del Grupo</h1>

                            <div className='grid space-x-2'>
                                <div className=" w-full flex text-ms">
                                    <label className='p-2 h-min w-[6rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Grupo <span style={{color: 'red'}} className='field-required'>*</span></label>
                                    <input placeholder='Nombre grupo whatsapp' value={dataDB.nombre} onChange={handleChange} type="text" name='nombre' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>

                            <div className='grid space-x-2'>
                                <div className=" w-full flex text-ms">
                                    <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                        <AiOutlineWhatsApp title='Whatsapp' size={'1.2rem'} />
                                    </label>
                                    <input placeholder='Ingresar grupo whatsapp' value={dataDB.whatsapp} onChange={handleChange} type="text" name='whatsapp' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                </div>
                            </div>

                            <div className="w-min grid space-x-2">
                                <div className="flex text-xs">
                                    <EnumButtons values={dataTypeSucess} selected={flagVR} setSelected={setFlagVR} />
                                </div>
                            </div>

                            {
                                (flagVR === 0) ? // Visita
                                    <div className='grid space-x-2'>
                                        <div className="h-[4rem] w-[4rem] grid grid-flow-col p-0 text-sm">
                                            <label className='py-3 px-4 h-[2.7rem] w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{dataDB.total_visitas}</label>
                                            <input disabled value={dataDB.nro_visitas} name='nro_visitas' className='noArrows h-[2.7rem] w-[2.5rem] py-1 px-3 text-center' type="number" />
                                            <div className="w-[1.5rem] h-[2.7rem] grid grid-rows-2 bg-[#0077bd] divide-y-2 text-white rounded-r-xl">
                                                <button onClick={() => handleOperation(1)}>+</button>
                                                <button onClick={() => handleOperation(-1)}>-</button>
                                            </div>
                                        </div>
                                    </div>
                                : ''
                            }
                                    
                            {
                                (flagVR === 1) ? // Reserva
                                    <>
                                        <div className='grid grid-cols-4 space-x-2'>
                                            <div className="w-[7rem] flex text-sm">
                                                <label className='py-3 px-4 h-[2.7rem] w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>{dataDB.total_reservas}</label>
                                                <input disabled value={dataDB.nro_reservas} name='nro_reservas' className='noArrows h-[2.7rem] w-[2.5rem] p-2 text-center' type="number" />
                                                <div className="w-[1.5rem] h-[2.7rem] grid grid-rows-2 bg-[#0077bd] divide-y-2 text-white rounded-r-xl">
                                                    <button onClick={() => handleOperation(1)}>+</button>
                                                    <button onClick={() => handleOperation(-1)}>-</button>
                                                </div>
                                            </div>

                                            <div className=" w-full flex text-ms">
                                                <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <AiOutlineEuro title={'Valor reserva'} size={'1.2rem'} />
                                                </label>
                                                <input className="rounded-r-full p-2 w-[80%] outline-blue-800" placeholder='Valor' onChange={handleChange} value = { dataDB.valor === 0 ? '': dataDB.valor } type="number" name='valor' />
                                            </div>
                                        </div>
                                    </>
                                : ''
                            }

                            {
                                (flagVR === 2) ? // Propietario
                                    <>
                                        <div className='grid grid-cols-2 space-x-2'>
                                            <div className=" w-full flex text-ms">
                                                <label className='py-2 px-4 h-[2.7rem] w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>{dataDB.total_valor_propietario}</label>
                                                <input value={ dataDB.valor_propietario === 0 ? '': dataDB.valor_propietario } placeholder='Propietario' name='valor_propietario' onChange={handleChange} className='noArrows h-[2.7rem] w-[50%] py-1 px-2 rounded-r-full' type="number" />
                                            </div>
                                        </div>
                                    </>
                                : ''
                            }

                            <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3">
                                <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">Prescriptores</legend>
                                {
                                    dataDB.prescriptores.length === 0 ? 
                                        <div className='grid space-x-2'>
                                            <div className=" w-full flex text-ms">
                                                <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <AgenteIcon title="Prescriptor" color={'white'} className='w-[1.3rem] h-[1.3rem]' />
                                                </label>
                                                <input disabled value={'Sin prescriptores!!'} type="text" name='na' className="p-2 w-[100%] outline-blue-800 rounded-r-full text-bold" />
                                            </div>
                                        </div> 
                                        : 
                                        // (
                                        // dataDB.prescriptores.map((el, index) => (
                                        //     <div key={`hst-${index}`} className='grid space-x-2'>
                                        //         <div className=" w-full flex text-ms">
                                        //             <label className='px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                        //                 <AgenteIcon title="Prescriptor" color={'white'} className='w-[1.3rem] h-[1.3rem]' />
                                        //             </label>
                                        //             <input placeholder='Nombres' value={el.nombre_completo} onChange={(e) => handleChangePrescriptor(e, el.id)} type="text" name='nombre_completo' className="p-2 w-[70%] outline-blue-800" />
                                        //             <label className='p-2 w-[2rem] bg-white text-black col-span-2'><b>|</b></label>
                                        //             <input placeholder='Teléfono' className="rounded-r-full1 p-2 w-[14rem] outline-blue-800" onChange={(e) => handleChangePrescriptor(e, el.id)} value={el.telefono} type="text" name='telefono' />
                                        //             <label onClick={ () => fnSelectPrescriptor(el.id) } className={`px-2 py-3 h-auto w-[3rem] ${ (el.isSelected === undefined || el.isSelected === false)?'bg-[#0077bd]':'bg-red' } text-white rounded-r-full col-span-2`}>
                                        //                 {
                                        //                     (el.isSelected === undefined || el.isSelected === false) ? 
                                        //                         <AiOutlineCheck title={`Prescriptor #${index+1}`} size={'1.2rem'} /> 
                                        //                         :
                                        //                         <AiOutlineClose title={`Prescriptor #${index+1}`} size={'1.2rem'} />
                                        //                 }
                                        //             </label>
                                        //         </div>
                                        //     </div>
                                        // ))
                                        // )

                                        (
                                            dataDB.prescriptores.map((el, index) => (
                                                <div key={`hst-${index}`} className='card-user-suceso grid rounded-2xl items-center p-4 space-y-2'>
                                                    <div className=" w-full flex text-xs">
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                            <AgenteIcon title="Prescriptor" color={'white'} className='w-[1.1rem] h-[1.1rem]' />
                                                        </label>
                                                        <input placeholder='Nombres' value={el.nombre_completo} onChange={(e) => handleChangePrescriptor(e, el.id)} type="text" name='nombre_completo' className="p-2 w-[70%] outline-blue-800" />
                                                        <label className='p-2 w-[2rem] bg-white text-black col-span-2'><b>|</b></label>
                                                        <input placeholder='Teléfono' className="rounded-r-full1 p-2 w-[14rem] outline-blue-800" onChange={(e) => handleChangePrescriptor(e, el.id)} value={el.telefono} type="text" name='telefono' />
                                                        <label onClick={ () => fnSelectPrescriptor(el.id) } className={`px-2 py-2 h-auto w-[3rem] ${ (el.isSelected === undefined || el.isSelected === false)?'bg-[#0077bd]':'bg-red' } text-white rounded-r-full col-span-2`}>
                                                            {
                                                                (el.isSelected === undefined || el.isSelected === false) ? 
                                                                    <AiOutlineCheck title={`Prescriptor #${index+1}`} size={'1.1rem'} /> 
                                                                    :
                                                                    <AiOutlineClose title={`Prescriptor #${index+1}`} size={'1.1rem'} />
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className=" w-full  flex text-xs">
                                                        <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2mm'>
                                                            <AiOutlineMail title="email" color={'white'} className='w-[1.1rem] h-[1.1rem]' />
                                                        </label>
                                                        <input placeholder='Correo' value={el.email} onChange={(e) => handleChangePrescriptor(e, el.id)} type="text" name='email' className="p-2 w-[100%] outline-blue-800 rounded-r-full" />
                                                    </div>
    
                                                    <div className='grid grid-cols-2 space-x-2'>
                                                        <div className=" w-full flex text-xs">
                                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                                <BsFillHouseFill title='Empresa' size={'1.2rem'} />
                                                            </label>
                                                            <input placeholder='Nombre empresa' value={el.empresa} onChange={(e) => handleChangePrescriptor(e, el.id)} type="text" name='empresa' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                                                        </div>
                                                        <div className=" w-full flex text-xs">
                                                            <label className='px-2 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                                <BsListCheck title='Categoría' size={'1.2rem'} />
                                                            </label>
                                                            <select value={el.idcategoria} onChange={(e) => handleChangePrescriptor(e, el.id)} name='idcategoria' className="rounded-r-full p-2 w-[100%] col-span-6">
                                                                { drawListOnSelect(listCategoria, 'cat', 'Seleccionar Categoría') }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            )
                                }

                                {
                                    dataDB.prescriptores.filter( el => el.isSelected === true ).length !== 0 ?
                                        <div className='grid space-x-2'>
                                            <div className=" w-full flex text-sx">
                                                <label className='px-3 py-3 h-auto w-full rounded-l-full1 col-span-2'>
                                                    <b className='txt-red-c62608'>Importante:</b> <b>{ dataDB.prescriptores.filter( el => el.isSelected === true ).length } </b> { dataDB.prescriptores.filter( el => el.isSelected === true ).length === 1 ? 'prescriptor se moverá a Leads': 'prescriptores se moverán a Leads' }
                                                </label>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </fieldset>

                            
                        </div>
                    </div>

                    <div className="bg-[#c7dfee] rounded-2xl p-5 space-y-2 h-full">
                        <h1 className='text-lg text-[#0077bd] font-bold'>Histórico sucesos</h1>

                        <div className='grid grid-cols-2 space-x-2'>
                            <div className=" w-full flex text-xs">
                                <label className='p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>Next step</label>
                                <input value={dataDB.next_step} onChange={handleChange} type="date" name='next_step' className="rounded-r-full p-2 w-[100%] outline-blue-800" />
                            </div>
                        </div>

                        <div className="w-full flex text-sm">
                            <label className='px-4 py-2 h-auto w-[3.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                <span className='display-icon-error'>
                                    <AiOutlineComment title='Comentario' size={'1.5rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                </span>
                            </label>
                            <textarea placeholder='Ingresar comentarios' defaultValue={dataDB.comentario_suceso} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="comentario_suceso"></textarea>
                        </div>
                        
                        <div className="w-full max-h-[25rem] min-h-[24rem] p-3 overflow-y-scroll space-y-3">
                            {
                                listSucesos.length === 0 ? <div className="bg-white w-full h-auto p-3 rounded-lg">No existen registros!!</div> : (
                                    listSucesos.map((el, index) => (
                                        <div key={`hst-${index}`} className="bg-white w-full h-auto p-3 rounded-lg">
                                            {`${el.comentario}`}
                                            <div className="text-xs w-full text-blue-800 font-semibold text-right"> 
                                                {`${el.responsable}, `} <span className=' font-extrabold1'>{`${el.fecha_creacion_short}`}</span> 
                                            </div>
                                        </div>
                                    ))
                                )
                            }
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
        <Modal title="Regresar prescriptores al Lead!" isOpen={isModalOpen} >
            <div className='w-auto'>
                <p>Por favor, seleccionar al menos un prescriptor</p>
                {
                    dataDB.prescriptores.map((el, index) => (
                        <div key={`hst-mod-${index}`} className='grid space-x-2'>
                            <div className=" w-full flex text-ms text-black">
                                <input disabled placeholder='Nombres' value={el.nombre_completo} type="text" name='nombre_completo' className="p-2 w-[70%] outline-blue-800" />
                                <label className='p-2 w-[2rem] bg-white text-black col-span-2'><b>|</b></label>
                                <input disabled placeholder='Teléfono' className="rounded-r-full p-2 w-[14rem] outline-blue-800" value={el.telefono} type="text" name='telefono' />
                            </div>
                        </div>
                    ))
                }
            </div>
        </Modal>
    </Layout>
    )
}

export default LeadId