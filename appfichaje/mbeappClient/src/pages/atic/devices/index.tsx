import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_atic } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import DevicesContainer from '@/components/atic/devices/DevicesContainer'

const Devices = () => {
    const _itemSelected = 'atic_devices' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_atic} itemSelected={_itemSelected} />
                <ContentContainer>
                    <DevicesContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Devices