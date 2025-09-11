import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import useApartment from "@/client/hooks/dnmaster/apartments/useApartment"

const Apartments = () => {

    const _itemSelected = 'dn_master_apartments'
    const { listData, headerTable, loading } = useApartment()

    const drawActions = () => {
        return (
            <>
                <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/dnmaster/apartments/new'>Nuevo</Link>
            </>
        )
    }

    return (
        <Layout>
            <div className="w-full md:w-2/2 lg:w-2/2 xl:w-3/3 bg-image p-5 pt-2 lg:flex grid">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} title="Pisos" header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Apartments