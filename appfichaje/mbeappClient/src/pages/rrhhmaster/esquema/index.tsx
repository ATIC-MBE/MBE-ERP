import { Layout } from "@/components/Layout";
import React from "react";
import MenuLeftContainer from "@/components/MenuLeftContainer";
import { menu_rrhh_master } from "@/client/helpers/constants";
import ContentContainer from "@/components/ContentContainer";
import UsersContainer from "@/components/share/users/UsersContainer";
import UsersEsquemaContainer from "@/components/rrhh/esquema/esquema";

const UsersEsquema = () =>{
    const _itemSelected = 'rrhh_master_esquema'
    const _path = '/rrhhmaster/esquema'
    const _typeTotalData = 'all_esquema'
    const _pathGetDataApi = '/api/rrhh/esquema/'

    return (

        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    
                    {/* <UsersContainer pathAdd={`${_path}/new`} pathEdit={`${_path}`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi} /> */}
                    <UsersEsquemaContainer pathAdd={`${_path}/esquema`} pathEdit={`${_path}`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi}  />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default UsersEsquema