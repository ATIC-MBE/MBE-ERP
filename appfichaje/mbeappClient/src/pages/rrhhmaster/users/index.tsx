import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import UsersContainer from "@/components/share/users/UsersContainer"

const UsersRRHH = () => {
    const _itemSelected = 'rrhh_master_users'
    const _path = '/rrhhmaster/users'
    const _typeTotalData = 'all_users_rrhh'
    const _pathGetDataApi = '/api/rrhh/p/users/'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <UsersContainer pathAdd={`${_path}/new`} pathEdit={`${_path}`} pathUnsubscribe={`${_path}/unsubscribe`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default UsersRRHH