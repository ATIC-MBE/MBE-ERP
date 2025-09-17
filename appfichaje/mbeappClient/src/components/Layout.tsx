import Head from 'next/head'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IoIosArrowDown } from 'react-icons/io'
import { VscThreeBars } from 'react-icons/vsc'
import {  TbWorld } from 'react-icons/tb'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { JSONObject, profile, user } from '@/client/types/globalTypes'
import UserService from '@/client/services/UserService'
import UserContext from '@/client/context/UserContext'
import { classNames } from '@/client/helpers/Util'
import CustomHouseIco from '@/components/CustomHouseIco'
import CustomHouseIcoBlue from './CustomHouseIcoBlue'
import CustomHouseIcoWhite from './CustomHouseIcoWhite'
import BirreteIco from './BirreteIco'
import Logos21 from './Logos-21'
import Logos22 from './Logos-22'
import Logos23 from './Logos-23'
import WebMCH24 from './webMCH24'
import WEBMCH_22_22 from './WEBMCH_22_22'
import AgenteIcon from './Iconos/AgenteIcon'
import PropietarioIcon from './Iconos/PropietarioIcon'
import { FaBusinessTime, FaCalendarCheck, FaMailchimp } from "react-icons/fa";
import { GoKey } from "react-icons/go";
import { AiOutlineClear, AiOutlineContainer, AiOutlineSnippets, AiOutlineTeam } from 'react-icons/ai'
import { BiDevices } from 'react-icons/bi'
import { MdMarkunreadMailbox } from 'react-icons/md'
import ChatBot from './ChatBot'  // ← AGREGAR ESTE IMPORT


const LangDropDown = (props: any) => {
    const Icos = {
        LangES: <img src='/public/img/ico/lang/icoES' />,
        LangFR: <img src='/public/img/ico/lang/icoFR' />,
        LangEN: <img src='/public/img/ico/lang/icoEN' />,
    }

    const { LangES, LangEN, LangFR } = Icos

    return (
        <Menu as="div" className="relative fixed sticky top-0 static navbar-fixed-top">
            <div>
                <Menu.Button className="flex rounded-full c-bg-secondary text-sm ">
                    <span className="sr-only">Open user menu</span>
                    <img src='/img/ico/lang/icoES.svg' />
                    <IoIosArrowDown color='blue' />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-[25%]">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                                <img src='/img/ico/lang/icoES.svg' />
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                                <img src='/img/ico/lang/icoEN.svg' />
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                onClick={props.logout}
                            >
                                <img src='/img/ico/lang/icoFR.svg' />
                            </Link>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

const navigation = [

    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
]

export const Layout = (props: JSONObject) => {

    const router = useRouter()
    const userService = new UserService()

    let [userProfile, setUserProfile] = useState<profile>()

    const getProfile = async () => {

        const response = await userService.getProfile(() => {
            router.push('/login')
        })

        if (response)
            setUserProfile({ ...userProfile, ...response })

    }

    const { useAllowedEffect, changeCurrentRol, getCurrentRol, userData, setUserData, isMobileMenuOpen, setIsMobileMenuOpen } = useContext(UserContext)

    const logout = async () => {
        const response = await axios.get('/api/auth/logout')
        changeCurrentRol('')
        setUserData('')

        router.push('/login')
    }

    useAllowedEffect(router, () => {

        // console.log(userProfile)
    })

    return (
        <div className='c-h-9 fixed sticky top-0 static navbar-fixed-top'>
            <Head>
                <title>MBE</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <link rel="shortcut icon" href="/img/ico/MBE_symbol.png" />
            </Head>

            <Disclosure as="nav" className="bg-gray-900 h-[15vh] lg:h-[15vh] h-[10vh] p-3 static top-0 c-bg-secondary">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-[95vw] px-2 sm:px-6 static top-0 lg:px-0">
                            <div className="relative flex h-16 items-center justify-center">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-[3rem] lg:h-[5rem] lg:hidden"
                                        src="/img/ico/LogoS.png"
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-[4.5rem] lg:block"
                                        src="/img/ico/LogoName.svg"
                                        alt="Your Company"
                                        onClick={() => { router.push(`/${getCurrentRol()}`) }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 c-text-primary' : 'text-gray-900 hover:bg-gray-900 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className="p-0 min-h-[85vh] lg:min-h-[85vh] min-h-[90vh] pb-10 c-bg-main-opac bg-cover bg-no-repeat">
                {props.children}
            </div>
            
            {/* ChatBot flotante - aparece en todas las páginas */}
            <ChatBot />  {/* ← AGREGAR ESTA LÍNEA AQUÍ */}
        </div>
    )
}

export const PropBox = (props: JSONObject) => {
    const { isActive, propID, menuPath = undefined, key = 1, codeIcon = 'home' } = props

    const getIcon = (key: any, codeIcon: string, isActive: any) => {
        switch(codeIcon) {
            case 'birrete':
                return <BirreteIco color={isActive ? '#0077bd' : 'white'} size={38} />
            case 'user':
                return <Logos22 color={isActive?'#0077bd':'white'} />
            case 'apartment':
                return <Logos23 color={isActive?'#0077bd':'white'} />
            case 'office':
                return <Logos21 color={isActive?'#0077bd':'white'} />
            case 'leads': // pendiente
                return <WEBMCH_22_22 color={isActive?'#0077bd':'white'} />
            case 'prescriptor':
                return <AgenteIcon title="Prescriptor" color={isActive?'#0077bd':'white'} className='w-[2.5rem] h-[3.5rem]' />
            case 'reports':
                return <AiOutlineContainer title="Reportes" color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'limpieza':
                return <AiOutlineClear title="Limpieza" color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'perfil':
                return <AiOutlineTeam title="Perfil" color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'propietario':
                return <PropietarioIcon title="Propietario" color={isActive?'#0077bd':'white'} className='w-[2.5rem] h-[3.5rem]' />
            case 'devices':
                return <BiDevices title='Dispositivos' color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'fichaje':
                return <FaCalendarCheck title='Fichajes' color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'vacaciones':
                return <MdMarkunreadMailbox title='Vacaciones' color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'solicitudes':
                return <FaMailchimp title='Solicitudes' color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            case 'esquema':
                return <FaBusinessTime title='Esquema' color={isActive?'#738e9eff':'white'} style={{border: 1}} size={35} />
            case 'key':
                return  <GoKey title='Llaves' color={isActive?'#0077bd':'white'} style={{border: 1}} size={35} />
            default:
                return isActive ?   <CustomHouseIcoBlue key={`ch-${key}`} className='w-[2.4rem]' /> :
                                    <CustomHouseIcoWhite key={`ch-${key}`} className='w-[2.4rem]' />
        }
    }

    return (
    <Link key={`ml-${key}`} href={menuPath ? menuPath : ('/propietario/' + (propID == 'Inicio' ? '' : propID))} className={'link-menu ' + (isActive ? 'c-bg-secondary' : 'c-bg-primary ') + ' ' + "mb-3 lg:rounded-l-2xl md:rounded-l-2xl lg:rounded-r-none md:rounded-r-none rounded-t-2xl pt-3 ml-[12%] flex flex-col items-center pr-1"} style={{ height: '5rem' }}>
            { getIcon(key, codeIcon, isActive) }
            <h3 className={(isActive ? 'text-blue text-bold' : 'text-white')}>{propID}</h3>
        </Link>
    )
}
