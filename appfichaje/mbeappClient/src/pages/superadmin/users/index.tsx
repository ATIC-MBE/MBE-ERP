import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_superadmin } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import UsersContainer from "@/components/share/users/UsersContainer"

const UsersRRHH = () => {
    const _itemSelected = 'superadmin_users'
    const _path = '/superadmin/users'
    const _typeTotalData = 'users_superadmin'
    const _pathGetDataApi = '/api/share/p/users/'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_superadmin} itemSelected={_itemSelected} />
                <ContentContainer>
                    <UsersContainer pathAdd={`${_path}/new`} pathEdit={`${_path}`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default UsersRRHH