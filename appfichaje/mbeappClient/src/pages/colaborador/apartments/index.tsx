import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_colaborador } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PisosColContainer from "@/components/colaborador/PisosColContainer"

const Apartments = () => {
    const _itemSelected = 'col_apartments'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_colaborador} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PisosColContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Apartments