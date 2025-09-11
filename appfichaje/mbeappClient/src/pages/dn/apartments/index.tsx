import useApartment from "@/client/hooks/dn/apartments/useApartment"
import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React from 'react'
import Link from 'next/link'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"

const Apartments = () => {

    const _itemSelected = 'dn_apartments'
    const { listData, headerTable, loading } = useApartment()

    const drawActions = () => {
        return (
            <>
                {/* <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/dn/apartments/new'>Nuevo</Link> */}
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn} itemSelected={_itemSelected} />
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