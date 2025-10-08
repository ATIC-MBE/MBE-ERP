import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { BsFillShieldLockFill, BsLockFill, BsPencilFill, BsTrashFill } from 'react-icons/bs'
import useUserItem from '@/client/hooks/share/users/useUserItem'
import { user } from '@/client/types/globalTypes'
import Link from 'next/link'
import { TbLockSquare } from 'react-icons/tb'
import Modal from '@/components/Modal'

const UserItem = ({ item, pathEdit, index, isUnsubscribeMode = false } : 
                            {
                                item: user,
                                pathEdit: string,
                                index: number,
                                isUnsubscribeMode?: boolean
                            }) => {

    const router = useRouter()
    const [openUnsubscribeModal, setOpenUnsubscribeModal] = useState(false)
    const [tasks, setTasks] = useState({
        ssAltasBajas: false,
        excelVacaciones: false,
        moverCarpeta: false,
        nominasFiniquitos: false,
    })
    const [actionsDone, setActionsDone] = useState({
        rrhh2Email: false,
        examenDiario: false,
        minqReminder: false,
        erpEstado: false,
    })

    // Resetear checklist al abrir/cerrar el modal
    useEffect(() => {
        if (!openUnsubscribeModal) {
            setTasks({
                ssAltasBajas: false,
                excelVacaciones: false,
                moverCarpeta: false,
                nominasFiniquitos: false,
            })
        }
    }, [openUnsubscribeModal])

    const toggleTask = (key: keyof typeof tasks) => {
        setTasks(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const {  
            itemContent,
            goEditData,
            handleResetPassword
        } = useUserItem(item, pathEdit)

    // Alternar colores de fondo: custom turquesa (pares) y blanco (impares) - matching app theme
    const rowBgColor = index % 2 === 0 ? 'bg-[#005360]/15' : 'bg-white';
    
    return (
        <>
        <div className={`w-full h-auto`}>
            <div
                className={`data-table-row-nopointer grid grid-cols-8 p-1 pl-2 ${rowBgColor} ${itemContent.estado === 0 ? 'text-[red]':'text-[#005360]'}`}>
                <div>
                    <span className='flex'>
                        &nbsp;{itemContent.username} 
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.nombre_completo}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.email}
                    </span>
                </div>

                <div className='grid col-span-2'>
                    <span className='flex'>
                        {itemContent.nombrerol_str}
                    </span>
                </div>

                <div className='flex justify-end'>
                    <div
                        onClick={() => {
                            if (isUnsubscribeMode) {
                                setOpenUnsubscribeModal(true)
                            } else {
                                goEditData(itemContent.id!)
                            }
                        }}
                        className='icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action'>
                        { isUnsubscribeMode ? (
                            <BsTrashFill title='Dar de baja' />
                        ) : (
                            <BsPencilFill title='Editar' />
                        ) }
                    </div>
                    <div onClick={() => handleResetPassword(itemContent.id || 0)} className='icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action'>
                        <BsLockFill title='Reset Contraseña' />
                    </div>
                    <div>
                        { /* Si estamos en rrhhmaster, usar su propia ruta de cambio de contraseña */ }
                        <Link
                            className="icon-table-row flex items-center justify-center rounded-full w-[1.8rem] h-[1.8rem] card-action"
                            href={`${router.pathname.startsWith('/rrhhmaster') ? '/rrhhmaster' : '/superadmin'}/users/${itemContent.id}/changepassword`}
                        >
                            <BsFillShieldLockFill  size={'1.1rem'} title='Cambiar Contraseña' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        {isUnsubscribeMode && (
            <Modal
                title={`Dar de baja usuario`}
                isOpen={openUnsubscribeModal}
                cancelHandler={() => setOpenUnsubscribeModal(false)}
                acceptHandler={() => { /* TODO: Confirmar baja (próximamente) */ }}
                acceptLabel={'Confirmar baja'}
                acceptClassName={'modal-accept-btn p-2 rounded-full'}
            >
                <div className='text-sm space-y-2'>
                    {/* Primera fila: ID y Rol */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-2'><span className='font-semibold'>ID:</span><span>{itemContent.id}</span></div>
                        <div className='flex items-center space-x-2'><span className='font-semibold'>Rol:</span><span>{itemContent.nombrerol_str}</span></div>
                    </div>
                    {/* Segunda fila: Usuario y Nombre completo */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-2'><span className='font-semibold'>Usuario:</span><span>{itemContent.username}</span></div>
                        <div className='flex items-center space-x-2'><span className='font-semibold'>Nombre completo:</span><span>{itemContent.nombre_completo}</span></div>
                    </div>
                    {itemContent.fecha_inicio && (
                        <div className='flex justify-between'><span className='font-semibold'>Inicio:</span><span>{itemContent.fecha_inicio}</span></div>
                    )}
                    {itemContent.fecha_fin && (
                        <div className='flex justify-between'><span className='font-semibold'>Fin:</span><span>{itemContent.fecha_fin}</span></div>
                    )}
                    <div className='pt-2 text-xs text-[#555]'>
                        Puedes consultar más detalles en la ficha: {`/rrhhmaster/users/${itemContent.id}`}
                    </div>
                    <hr className='my-3' />
                    <div className='space-y-2'>
                        <div className='text-sm font-semibold text-primary'>Checklist de tareas de baja</div>
                        <label className='flex items-start space-x-2'>
                            <input type='checkbox' className='mt-[0.2rem]' checked={tasks.ssAltasBajas} onChange={() => toggleTask('ssAltasBajas')} />
                            <span>Seguridad social: Altas y bajas (Mario Todo Impuesto) en caso que corresponda.</span>
                        </label>
                        <label className='flex items-start space-x-2'>
                            <input type='checkbox' className='mt-[0.2rem]' checked={tasks.excelVacaciones} onChange={() => toggleTask('excelVacaciones')} />
                            <span>Excel de Vacciones MBE: Dar de baja a colaboradores en las pestañas de Calendario, Progreso e Histórico.</span>
                        </label>
                        <label className='flex items-start space-x-2'>
                            <input type='checkbox' className='mt-[0.2rem]' checked={tasks.moverCarpeta} onChange={() => toggleTask('moverCarpeta')} />
                            <span>Mover carpeta personal desde Colaboradores Activos a Colaboradores Inactivos.</span>
                        </label>
                        <label className='flex items-start space-x-2'>
                            <input type='checkbox' className='mt-[0.2rem]' checked={tasks.nominasFiniquitos} onChange={() => toggleTask('nominasFiniquitos')} />
                            <span>Nóminas: solicitarlas y los finiquitos de ser necesario, a Mario Todo Impuesto y reenviarlas a Diego, con copia a RRHH y ADE.</span>
                        </label>
                        <hr className='my-3' />
                        {/* Líneas de acciones con botón (placeholders sin funcionalidad) */}
                        <div className='flex items-center justify-between'>
                            <span>Cambio contraseña Email RRHH2.</span>
                            <button type='button' onClick={() => setActionsDone(prev => ({...prev, rrhh2Email: true}))} className={`px-3 py-1 text-sm rounded-full w-[10rem] text-center ${actionsDone.rrhh2Email ? 'modal-action-btn--done' : 'modal-action-btn'}`}>Contraseña</button>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>EXAMEN diario. Quitar su correo electrónico del documento de examen del departamento en que se encontrara.</span>
                            <button type='button' onClick={() => setActionsDone(prev => ({...prev, examenDiario: true}))} className={`px-3 py-1 text-sm rounded-full w-[10rem] text-center ${actionsDone.examenDiario ? 'modal-action-btn--done' : 'modal-action-btn'}`}>Examen</button>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>MINQ Cambiar el reminder_activated a FALSE de todos los registros con su teléfono.</span>
                            <button type='button' onClick={() => setActionsDone(prev => ({...prev, minqReminder: true}))} className={`px-3 py-1 text-sm rounded-full w-[10rem] text-center ${actionsDone.minqReminder ? 'modal-action-btn--done' : 'modal-action-btn'}`}>MINQ</button>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span>ERP: Auto, Cambiar el registro de la tbl_usuario.estado a -1.</span>
                            <button type='button' onClick={() => setActionsDone(prev => ({...prev, erpEstado: true}))} className={`px-3 py-1 text-sm rounded-full w-[10rem] text-center ${actionsDone.erpEstado ? 'modal-action-btn--done' : 'modal-action-btn'}`}>Estado</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )}
        </>
    )
}

export default UserItem