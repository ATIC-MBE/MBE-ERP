import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import MyLeadsContainer from "@/components/share/myleads/MyLeadsContainer"

const MyLeads = () => {
    const _itemSelected = 'rrhh_master_myleads'
    const _path = '/rrhhmaster/myleads'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <MyLeadsContainer pathEdit={`${_path}`} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default MyLeads