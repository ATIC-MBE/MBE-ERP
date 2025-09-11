import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_da_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PisosDAContainer from "@/components/da/PisosDAContainer"

const Apartments = () => {
    const _itemSelected = 'da_apartments'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_da_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PisosDAContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Apartments