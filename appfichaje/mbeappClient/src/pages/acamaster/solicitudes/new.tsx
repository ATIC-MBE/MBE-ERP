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
import { FaTrashAlt } from 'react-icons/fa'
import useVacacionesIdd from '@/client/hooks/rrhhmaster/vacaciones/useVacacionesId'
import useVacacionesIddShare from '@/client/hooks/share/vacaciones/useVacacionesIdShare'


const SolicitudNew = () => {
    const _pathGoToBack = '/acamaster/solicitudes'
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel, 
            errorValidate, 
            msgError,
            roles,
            } = useVacacionesIddShare(_pathGoToBack)

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
                                    <h1 className='text-lg text-primary font-bold'>Solicitud</h1>
                                    <div className='grid grid-cols-2 space-x-3'>
                                        <div className="w-full flex text-sm">
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                                <span className='display-icon-error'>
                                                    <AiOutlineCalendar title='Fecha de inicio' size={'1.3rem'} /> <span style={{color: 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha de inicio'
                                                    type="date" 
                                                    onChange={handleChange}
                                                    name='fecha_inicio' 
                                                    value={dataDB.fecha_inicio} 
                                                    className="px-1 w-[100%] border border-l-0 border-[#0077bd]" />
                                            <label className='px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white'>
                                                <span className='display-icon-error'>
                                                    <span>a</span>
                                                </span>
                                            </label>
                                            <input  placeholder='Fecha final' 
                                                    type="date" 
                                                    onChange={handleChange}
                                                    name='fecha_final' 
                                                    value={dataDB.fecha_final} 
                                                    className="rounded-r-full px-1 w-[100%] border border-l-0 border-[#0077bd]" />
                                        </div>
                                        <div className="w-full flex text-sm">
                                            <label className = 'px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full'>
                                                <span className = 'display-icon-error' >
                                                    <AiOutlineBars title = "Tipo de solicitud" color={'white'} size={'1.2rem'} /> <span style = {{color : 'red'}} className='field-required'> * </span>
                                                </span>
                                            </label>
                                            <select value={dataDB.idsolicitud ? dataDB.idsolicitud.toString() : ''} name='idsolicitud' className="rounded-r-full p-1 w-[90%]" onChange={handleChange}>
                                                <option value={''} disabled>Seleccione un tipo</option>
                                                <option value={1}>Enfermedad común</option>
                                                <option value={2}>Renovar el DNI, pasaporte o visado</option>
                                                <option value={3}>Enfermedad laboral</option>
                                                <option value={4}>Citas médicas</option>
                                                <option value={5}>Cuidado de menores</option>
                                                <option value={6}>Vacaciones</option>
                                                <option value={7}>Días de asuntos propios</option>
                                                <option value={8}>Hospitalización o intervención quirúrgica de familiar</option>
                                                <option value={9}>Permisos formación</option>
                                                <option value={10}>Permiso por nacimiento de hijo</option>
                                                <option value={11}>Permiso por lactancia</option>
                                                <option value={12}>Permiso por fuerza mayor</option>
                                                <option value={13}>Permiso matrimonio o pareja de hecho</option>
                                                <option value={14}>Permiso por fallecimiento familiar</option>
                                                <option value={15}>Permiso por exámenes</option>
                                                <option value={16}>Permiso por traslado del domicilio habitual</option>
                                                <option value={17}>Permiso para el cumplimiento de un deber público y personal</option>
                                                    <option value={18}>Permiso acompañamiento medico familiar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 space-x-3'>
                                        <div className='grid grid-cols-1 space-x-3'>
                                            <div className="w-full flex text-sm">
                                                <label className='px-4 py-2 h-auto w-[3.0rem] bg-[#0077bd] text-white rounded-l-full col-span-2'>
                                                    <span className='display-icon-error'>
                                                        <AiOutlineComment title='Detalles' size={'1.5rem'} />
                                                    </span>
                                                </label>
                                                <textarea placeholder='Ingresar obervaciones adicionales' defaultValue={dataDB.descripcion} onChange={handleChange} className="rounded-r-full p-3 w-[100%] outline-blue-800" name="descripcion" ></textarea>
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

export default SolicitudNew