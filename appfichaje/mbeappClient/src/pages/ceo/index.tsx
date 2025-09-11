import UserContext from '@/client/context/UserContext'
import { menu_ceo } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout, PropBox } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'


const Index = () => {
    const _itemSelected = 'ceo_home'
    const { userData } = useContext(UserContext)
    const router = useRouter()

    // const userLogin = userData()
    // console.log('ulogin', userLogin)

    useEffect(() => {
    }, [])

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_ceo} itemSelected={_itemSelected} />
                <ContentContainer>
                    <HomeContainer data={userData()}>
                        <p>Ústed puede realizar las siguientes gestiónes:</p>
                        <ul>
                            <li><b>1.- </b>Gestionar sus Leads</li>
                        </ul>
                    </HomeContainer>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Index