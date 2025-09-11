import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import ReportLeadsContainer from "@/components/share/leads/reports/ReportLeadsContainer"

const LeadsReports = () => {
    const _itemSelected = 'na'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <ReportLeadsContainer />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default LeadsReports