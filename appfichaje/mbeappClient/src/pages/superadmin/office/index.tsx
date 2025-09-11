import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_superadmin } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import OfficeContainer from '@/components/OfficeContainer'
import MenuTopMobileContainer from '@/components/MenuTopMobileContainer'

const Admin = () => {
    const _itemSelected = 'share_office'
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])

    return (
        <Layout>
            <div className="h-100 overflow-hidden bg-image lg:p-5 md:p-5 p-1 pt-2 lg:flex md:flex grid justify-items-center ">
                <MenuTopMobileContainer />
                <MenuLeftContainer data={menu_superadmin} itemSelected={_itemSelected} />
                <ContentContainer>
                    <OfficeContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Admin