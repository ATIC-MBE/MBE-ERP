import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import useResponsableLead from "@/client/hooks/dnmaster/settings/responsableLead/useResponsableLead"

const Responsable = () => {

    const _itemSelected = 'dn_master_settings'
    const {listData, headerTable, loading} = useResponsableLead()

    const drawActions = () => {
        return (
            <>
                <Link className="p-1 px-2 h-min text-[1rem] rounded-xl bg-[#0077bd] border border-blue text-white" href='/dnmaster/settings/responsables/new'>Nuevo</Link>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} title="Perfiles Leads"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Responsable