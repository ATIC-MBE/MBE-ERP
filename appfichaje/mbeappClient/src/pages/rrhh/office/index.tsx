import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_rrhh } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import OfficeContainer from '@/components/OfficeContainer'

const Admin = () => {
    const _itemSelected = 'share_office' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh} itemSelected={_itemSelected} />
                <ContentContainer>
                    <OfficeContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Admin