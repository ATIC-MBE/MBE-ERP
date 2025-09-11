import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { menu_crm_master } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'
import PisoSelectContainer from '@/components/PisoSelectContainer'
import GestionPisoContainer from '@/components/GestionPisoContainer'

const GestionPisoId = () => {
    const _itemSelected = 'crm_gestion_piso' 
    const { userData } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
    }, [])
    
    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_crm_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <GestionPisoContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default GestionPisoId