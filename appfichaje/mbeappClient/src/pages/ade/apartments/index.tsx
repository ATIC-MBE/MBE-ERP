import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_ade } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PisosShareContainer from "@/components/share/apartments/PisosShareContainer"
// import PisosDAContainer from "@/components/da/PisosDAContainer"

const Apartments = () => {
    const _itemSelected = 'ade_apartments'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_ade} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PisosShareContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Apartments