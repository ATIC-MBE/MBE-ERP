import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import GrupoPropietarioContainer from "@/components/dn/grupo/propietario/GrupoPropietarioContainer"

// EDITAR, para tu pantalla
const GrupoPropietario = () => {

    const _itemSelected = 'dn_master_sucess_propietario'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <GrupoPropietarioContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default GrupoPropietario