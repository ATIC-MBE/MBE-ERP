import { Layout } from "@/components/Layout"
import React from 'react'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { menu_ade, menu_atic, menu_dn_master } from '@/client/helpers/constants'
import ContentContainer from "@/components/ContentContainer"
import KeyContainer from "@/components/atic/keys/KeyContainer"
//import PerfilContainerAtic from "@/components/share/perfiles/KeysContainerAtic"
// import KeysContainerAtic from "@/components/share/keys/KeysContainerAtic"

const Keys = () => {
    
    const _itemSelected = 'atic_key'
    

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                
                    <MenuLeftContainer data={menu_atic} itemSelected={_itemSelected} />
                
                    <ContentContainer>                          
                        <KeyContainer/>
                    </ContentContainer>
                
            </div>
        </Layout>
    )
}

export default Keys