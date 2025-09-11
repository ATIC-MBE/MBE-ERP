import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_ade, menu_atic, menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import PerfilContainerAtic from "@/components/share/perfiles/PerfilContainerAtic"


const Perfiles = () => {
    const _itemSelected = 'atic_perfil'
    const _path = '/atic/perfiles'
    const _typeTotalData = 'perfiles_dn'
    const _pathGetDataApi = '/api/dn/p/responsables/'

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_atic} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PerfilContainerAtic    pathMoverLead={`${_path}/distribuir/leads`} 
                                            pathAdd={`${_path}/new`} 
                                            pathEdit={`${_path}`} 
                                            typeTotalData={_typeTotalData} 
                                            pathGetData={_pathGetDataApi} />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Perfiles