import UserContext from '@/client/context/UserContext'
import { menu_rrhh } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import DepartmentCalendar from '@/components/Calendar/DepartmentCalendar'
import React, { useContext } from 'react'

const CalendarioRrhh = () => {
    const _itemSelected = 'rrhh_calendario'
    const { userData } = useContext(UserContext)

    const currentUserData = typeof userData === 'function' ? userData() : userData

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={menu_rrhh} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <span className="text-2xl mr-2">📅</span>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Calendario RRHH
                            </h1>
                        </div>

                        <div style={{ height: '650px' }}>
                            <DepartmentCalendar
                                department="rrhh"
                                userRole={currentUserData?.roles || 'rrhh'}
                            />
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default CalendarioRrhh