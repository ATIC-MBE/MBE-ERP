import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_atic_master } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import ReportDeviceContainer from '@/components/atic/reportdevicesstate/ReportDeviceContainer'

const ControlLimpiezaAde = () => {
    const _itemSelected = 'atic_reports' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    // Código temporal
    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex hola">
                <MenuLeftContainer data={menu_atic_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <ReportDeviceContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default ControlLimpiezaAde