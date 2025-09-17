import UserContext from '@/client/context/UserContext'
import { acceso_directos } from "@/client/helpers/constants"
import { AiFillCalendar, AiFillContacts, AiFillFileExcel, AiFillFolder, AiFillMessage, AiOutlineContainer, AiOutlineEuroCircle, AiOutlineFileDone, AiOutlineFileProtect, AiOutlineFrown, AiOutlineKey, AiOutlineLike, AiOutlineMail, AiOutlineMobile, AiOutlineProfile, AiOutlineSolution, AiOutlineUnorderedList } from "react-icons/ai"
import Link from 'next/link'
import { BsBarChart, BsBook, BsBookFill, BsChatLeftText, BsClipboardData, BsClock, BsFillPersonCheckFill, BsFolderSymlink, BsInboxes, BsKey } from "react-icons/bs"
import { TbBrandAirbnb, TbBrandBooking, TbBrandWhatsapp, TbReportMoney } from "react-icons/tb";
import { useEffect, useState, useContext } from "react";
import { CiSettings } from 'react-icons/ci'
import { GoAlert } from "react-icons/go";
import { FcTodoList } from "react-icons/fc";
import { MdAccountBalanceWallet, MdInventory, MdOutlineRateReview, MdMiscellaneousServices, MdSmartToy } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { LuAppWindow } from "react-icons/lu";

const getIcon = (value: string, lblIcon?: string) => {
    let _titleIcon = lblIcon || 'Desconocido'
    switch(value) {
        case 'report':
            return 'blue'
        case 'alerta':
            return <GoAlert title={_titleIcon} color='#005360' size={'5rem'} />
        case 'tareas':
            return <FcTodoList title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'contactos':
            return <AiFillContacts title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'excel':
            return <AiFillFileExcel title={_titleIcon} color='#005360' size={'5rem'} />
        case 'inventario':
            return <MdInventory title={_titleIcon} color='#005360' size={'5rem'} /> // AiOutlineContainer
        case 'folder':
            return <AiFillFolder title={_titleIcon} color='#005360' size={'5rem'} />
        case 'listado':
            return <AiOutlineProfile title={_titleIcon} color='#005360' size={'5rem'} />
        case 'message':
            return <AiFillMessage title={_titleIcon} color='#005360' size={'5rem'} />
        case 'calendar':
            return <AiFillCalendar title={_titleIcon} color='#005360' size={'5rem'} />
        case 'book':
            return <BsBook title={_titleIcon} color='#005360' size={'5rem'} />
        case 'person':
            return <BsFillPersonCheckFill title={_titleIcon} color='#005360' size={'5rem'} />
        case 'time':
            return <BsClock title={_titleIcon} color='#005360' size={'5rem'} />
        case 'r_grafica':
            return <BsClipboardData title={_titleIcon} color='#005360' size={'5rem'} />
        case 'message_two':
            return <BsChatLeftText title={_titleIcon} color='#005360' size={'5rem'} />
        case 'file_done':
            return <AiOutlineFileDone title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'file_protected':
            return <AiOutlineFileProtect title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'file_user':
            return <AiOutlineSolution title={_titleIcon} color='#005360' size={'5rem'} />
        case 'correo':
            return <AiOutlineMail title={_titleIcon} color='#005360' size={'5rem'} />
        case 'euro':
            return <AiOutlineEuroCircle title={_titleIcon} color='#005360' size={'5rem'} />
        case 'list':
            return <AiOutlineUnorderedList title={_titleIcon} color='#005360' size={'5rem'} />
        case 'key':
            return <AiOutlineKey title={_titleIcon} color='#005360' size={'5rem'} />
        case 'bot':
            return <MdSmartToy title={_titleIcon} color='#005360' size={'5rem'} />
        case 'airbnb':
            return <TbBrandAirbnb title={_titleIcon} color='#005360' size={'5rem'} />
        case 'booking':
            return <TbBrandBooking title={_titleIcon} color='#005360' size={'5rem'} />
        case 'whatsapp':
            return <TbBrandWhatsapp title={_titleIcon} color='#005360' size={'5rem'} />
        case 'folder_link':
            return <BsFolderSymlink title={_titleIcon} color='#005360' size={'5rem'} />
        case 'estadistica': 
            return <BsBarChart title={_titleIcon} color='#005360' size={'5rem'} />
        case 'herramienta_ayuda': 
            return <CiSettings title={_titleIcon} color='#005360' size={'5rem'} />
        case 'reporteDinero': 
            return <TbReportMoney title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'cuenta':
            return <MdAccountBalanceWallet title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'telefono':
            return <FaPhone title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'servicios':
            return <MdMiscellaneousServices title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'appWindows':
            return <LuAppWindow title={_titleIcon} color='#005360' size={'5rem'}/>
        case 'glovo':
            return (
                <img
                    src="/img/ico/icono_glovo.png"
                    title={_titleIcon}
                    style={{ width: '7rem', height: '7rem' }}
                />
            )
        case 'LE':
            return (
                <img
                    src="/img/ico/LE_icono.png"
                    title={_titleIcon}
                    style={{ width: '7rem', height: '7rem' }}
                />
            )
        case 'gastosPisos':
            return(
                <img
                    src="/img/ico/icono_gastosPisos.png"
                    title={_titleIcon}
                    style={{ width: '7rem', height: '7rem' }}
                />
            )
        case 'movimientosTPV':
            return(
                <img
                    src="/img/ico/icono_movimientosTPV.png"
                    title={_titleIcon}
                    style={{ width: '7rem', height: '7rem' }}
                />
            )
        case 'phoneSell':
            return(
                <img
                    src="/img/ico/icono_phoneSell.png"
                    title={_titleIcon}
                    style={{ width: '7rem', height: '7rem' }}
                />
            )
        case 'review':
            return <MdOutlineRateReview title={_titleIcon} color='#005360' size={'5rem'} />

        default:
            return <AiOutlineLike title={_titleIcon} color='#005360' size={'5rem'} />
    }
}

const AccesoDirectoContainer = ( {coderol} : {coderol: string} ) => {
    const { solPendientesRMG, updateSolPendientesRMG } = useContext(UserContext)
    
    // Actualizamos solo cuando
    useEffect(() => {
        console.log(`${coderol} -> ${new Date().toLocaleDateString()} -> ${solPendientesRMG}`)
        if ( coderol === 'rmg' ) {
            updateSolPendientesRMG()
        }
    }, [updateSolPendientesRMG, coderol])

    return (
        <>
            {
            (Array.isArray(acceso_directos[coderol])) ?
                [ 
                    ...acceso_directos['share'].sort( (a,b) => b.orden - a.orden ),
                    ...acceso_directos[coderol].sort( (a,b) => a.orden - b.orden )
                ].map((el, index) => {
                    return (
                        <Link key={`card-${index}`} href={`${el.link}`} target='_blank' 
                        className={`card-acceso-directo h-min text-[1rem] rounded-xl border ${(coderol === 'rmg' && el.orden === 0 && solPendientesRMG !== 0) ? 'border-red' : 'border-blue'} text-white mt-3`}>
                            <div key={`card-${index}`} className={`w-[10rem] h-[12rem] ${(coderol === 'rmg' && el.orden === 0 && solPendientesRMG !== 0) ? 'bg-red-50' : 'bg-[#fffffffb]'} rounded-xl shadow-sm grid grid-rows-3`}>
                                <div className="row-span-3 grid items-center justify-items-center-xx">
                                    <div className=" flex flex-col items-center space-y-2">
                                        <span style={{color:'#005360'}}>{getIcon(el.codeIcon, el.label)}</span>
                                        <h1 className="text-ms text-[#0077bd] text-center hover:text-[#ef8221] hover:text-[#ef8221]">
                                            <b>{el.label} { (coderol === 'rmg' && el.orden === 0 && solPendientesRMG !== 0) ? <span className='bg-red font-bold rounded-full px-3 py-2 text-white'>{solPendientesRMG}</span> : '' }</b>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
            : 
                [ 
                    ...acceso_directos['share'].sort( (a,b) => b.orden - a.orden )
                ].map((el, index) => {
                    return (
                        <Link key={`card-${index}`} href={`${el.link}`} target='_blank' 
                        className="card-acceso-directo h-min text-[1rem] rounded-xl border border-blue text-white mt-3">
                            <div key={`card-${index}`} className="w-[10rem] h-[12rem] bg-[#fffffffb] rounded-xl shadow-sm grid grid-rows-3">
                                <div className="row-span-3 grid items-center justify-items-center-xx">
                                    <div className=" flex flex-col items-center space-y-2">
                                        {getIcon(el.codeIcon, el.label)}
                                        <h1 className="text-ms text-[#0077bd] text-center hover:text-[#ef8221] hover:text-[#ef8221]"><b>{el.label}</b></h1>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </>
    )
}

export default AccesoDirectoContainer