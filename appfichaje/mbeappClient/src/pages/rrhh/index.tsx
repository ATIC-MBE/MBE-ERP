import UserContext from '@/client/context/UserContext'
import { menu_rrhh } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'

const RRHH = () => {

    const _itemSelected = 'rrhh_home'
    const { userData } = useContext(UserContext)

    return (

        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh} itemSelected={_itemSelected} />
                <ContentContainer>
                    <HomeContainer data={userData()}>
                    </HomeContainer>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default RRHH