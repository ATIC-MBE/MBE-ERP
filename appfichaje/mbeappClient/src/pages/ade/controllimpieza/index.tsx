import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_ade } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import ControlLimpiezaContainer from '@/components/ade/controllimpieza/ControlLimpiezaContainer'

const ControlLimpiezaAde = () => {
    const _itemSelected = 'ade_controllimpieza' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_ade} itemSelected={_itemSelected} />
                <ContentContainer>
                    <ControlLimpiezaContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default ControlLimpiezaAde