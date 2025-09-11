import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_da_master, menu_rmg } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import OfficeContainer from '@/components/OfficeContainer'

const OfficeAtic = () => {
    const _itemSelected = 'share_office' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_da_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <OfficeContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default OfficeAtic