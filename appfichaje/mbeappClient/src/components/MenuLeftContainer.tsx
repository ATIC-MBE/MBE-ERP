import { MenuLeftType } from "@/client/types/globalTypes"
import { PropBox } from "./Layout"
import { useContext, useState } from "react"
import UserContext from "@/client/context/UserContext"
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import WebMCH24 from "./webMCH24"
import FilterInstance from "@/client/helpers/Filter"

const MenuLeftContainer = ({ data, itemSelected }: { data: Array<MenuLeftType>, itemSelected: string }) => {
    const router = useRouter()
    const { changeCurrentRol, setUserData } = useContext(UserContext)
    const [isOpen, setIsOpen] = useState(false)

    const handleExit = async () => {
        const response = await axios.get('/api/auth/logout')
        changeCurrentRol('')
        setUserData('')
        localStorage.removeItem('idlogin')
        FilterInstance.resetLogout()
        router.push('/login')
    }

    return (
        <>
            {/* Mobile menu button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed left-0 top-[12vh] z-50 bg-blue-600 hover:bg-blue-700 p-2 rounded-r-lg shadow-lg transition-colors duration-200"
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu container */}
            <div className={`
                fixed lg:static top-[10vh] bottom-0 left-0 z-40
                h-[90vh] lg:h-full w-[8rem] lg:w-[8rem] w-[6rem]
                c-rounded-large c-bg-primary
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                shadow-lg overflow-hidden
                `}>
                <div className="h-full overflow-y-auto py-2">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-1">
                        {(data || [])
                            .sort((a, b) => a.order - b.order)
                            .filter((item) => item.propID !== 'Pisos')
                            .map((item) => {
                                const isActive = item.key === itemSelected;
                                return (
                                    <div key={item.key} className="transform scale-90 lg:scale-100">
                                        {PropBox({ ...item, isActive })}
                                    </div>
                                );
                            })}
                    </div>
                    
                    <Link 
                        onClick={handleExit} 
                        key="ml-exit" 
                        href="#" 
                        className="link-menu c-bg-primary mt-2 rounded-lg flex flex-col items-center px-1 transform scale-90 lg:scale-100"
                        style={{ height: '4rem' }}
                    >
                        <WebMCH24 color="white" />
                        <h3 className="text-white text-xs lg:text-sm">Salir</h3>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MenuLeftContainer
