import UserContext from '@/client/context/UserContext'
import { menu_atic, menu_colaborador } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useState } from 'react'


const Colaborador = () => {

    const _itemSelected = 'col_home'
    const { userData } = useContext(UserContext)

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_colaborador} itemSelected={_itemSelected} />
                <ContentContainer>
                    <HomeContainer data={userData()}>
                    </HomeContainer>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Colaborador