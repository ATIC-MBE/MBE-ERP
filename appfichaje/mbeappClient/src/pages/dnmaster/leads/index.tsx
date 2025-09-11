import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_da, menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import LeadsContainer from "@/components/share/leads/LeadsContainer"

const Leads = () => {
    const _itemSelected = 'dn_master_leads_t'
    const _path = '/dnmaster/leads'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <LeadsContainer pathAdd={`${_path}/new`} pathEdit={`${_path}`} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Leads