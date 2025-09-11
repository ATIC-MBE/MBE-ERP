import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PerfilContainer from "@/components/share/perfiles/PerfilContainer"

const Perfiles = () => {
    const _itemSelected = 'dn_master_perfil'
    const _path = '/dnmaster/perfiles'
    const _typeTotalData = 'perfiles_dn'
    const _pathGetDataApi = '/api/dn/p/responsables/'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_dn_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PerfilContainer pathAdd={`${_path}/new`} pathEdit={`${_path}`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Perfiles