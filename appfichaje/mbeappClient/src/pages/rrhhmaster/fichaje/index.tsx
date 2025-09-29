import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_ade, menu_rrhh_master } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import FichajeContainer from '@/components/rrhh/fichaje/FichajeContainer'

const FichajeRRHH = () => {
    const _itemSelected = 'rrhh_master_fichaje' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <FichajeContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default FichajeRRHH