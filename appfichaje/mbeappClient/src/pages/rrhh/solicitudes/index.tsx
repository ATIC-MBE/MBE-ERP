import { Layout } from "@/components/Layout";
import React from "react";
import MenuLeftContainer from "@/components/MenuLeftContainer";
import { menu_atic, menu_rrhh} from "@/client/helpers/constants";
import ContentContainer from "@/components/ContentContainer";
import VacacionesContainerShare from "@/components/share/vacaciones/VacacionesShare";

const VacacionesShare = () =>{
    const _itemSelected = 'rrhh_solicitudes'
    const _path = '/rrhh/solicitudes'
    const _typeTotalData = 'all_vacaciones'
    const _pathGetDataApi = '/api/share/vacaciones/'

    return (

        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={menu_rrhh} itemSelected={_itemSelected} />
                <ContentContainer>
                    
                    <VacacionesContainerShare pathAdd={`${_path}/new`} pathEdit={`${_path}`} typeTotalData={_typeTotalData} pathGetData={_pathGetDataApi}  />
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default VacacionesShare