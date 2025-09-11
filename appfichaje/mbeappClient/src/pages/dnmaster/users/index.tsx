import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import useUser from "@/client/hooks/dnmaster/users/useUser"

const Users = () => {

    const _itemSelected = 'dn_master_users'
    const { listData, headerTable, loading } = useUser()

    const drawActions = () => {
        return (
            <>
                <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/dnmaster/users/new'>Nuevo</Link>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} title="Propietarios"  header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Users