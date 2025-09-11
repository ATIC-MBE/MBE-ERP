import React from 'react'
import { useRouter } from 'next/router'
import { BsPencilFill } from 'react-icons/bs'
import AgenteIcon from '@/components/Iconos/AgenteIcon'
import PropietarioIcon from '@/components/Iconos/PropietarioIcon'
import { IResponsableLead } from '@/client/models/IResponsableLead'
import usePerfilDNItem from '@/client/hooks/share/perfiles/usePerfilDNItem'

const PerfilItem = ({ item, pathEdit } : 
                            {
                                item: IResponsableLead,
                                pathEdit: string
                            }) => {

    const router = useRouter()

    const {  
            itemContent,
            goEditData
        } = usePerfilDNItem(item, pathEdit)

    return (
        <div
            className={`w-full h-auto`}
            style={{
                backgroundImage: "url('/img/bg/fondo.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100px',
                borderRadius: '0.5rem',
            }}
        >
            <div
                className={`data-table-row-nopointer grid grid-cols-6 p-1 pl-2 ${itemContent.estado === 0 ? 'text-[red]':'text-[#0077BD]'}`}
                style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '0.5rem' }}
            >
                {/* ...existing code... */}
                <div>
                    <span className='flex'>
                        {
                            ( itemContent.tipo_lead as string || '' ).trim().toLowerCase() === 'colaborador' ||
                            ( itemContent.tipo_lead as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                                <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.3rem] h-[1.3rem]' />
                            : 
                            (
                                ( itemContent.tipo_lead as string || '' ).trim().toLowerCase() === 'propietario' ?
                                    <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                                :
                                    <>
                                        <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />&nbsp;<AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.3rem] h-[1.3rem]' />
                                    </>
                            )
                        }
                        &nbsp;{ itemContent.codigo }
                    </span>
                </div>

                <div className='grid col-span-3'>
                    <span className='flex'>
                        {itemContent.responsable}
                    </span>
                </div>

                <div>
                    <span className='flex'>
                        {/* {itemContent.email} */}
                        {/* {itemContent.} */}
                        {itemContent.nro_leads}
                    </span>
                </div>

                {/* <div>
                    <span className='flex'>
                        ddd
                    </span>
                </div> */}

                <div className='flex justify-end'>
                    <div onClick={() => goEditData(itemContent.id!)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsPencilFill className='mt-1' title='Editar' />
                    </div>
                    {/* <div onClick={() => handleResetPassword(itemContent.id || 0)} className='icon-table-row grid justify-center rounded-full w-[1.8rem] h-[1.6rem] card-action'>
                        <BsLockFill className='mt-1' title='Reset Contraseña' />
                    </div> */}
                </div>

                {/* <div>
                    <span className='flex grid justify-end'>
                        {
                            // getValueHoras(itemContent.entrada || '', itemContent.salida || '')
                        }
                        ff
                    </span>
                </div>

                <div>
                    <div className='grid justify-end pr-3 card-action'>
                        <BsPencilFill onClick={() => goEditData(itemContent.id!)} className='mt-1' title='Editar' />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default PerfilItem