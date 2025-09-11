import UserContext from '@/client/context/UserContext'
import UserState from '@/client/context/UserState'
import { menu_propietario } from '@/client/helpers/constants'
import { IPiso } from '@/client/models/IPiso'
import PisoServiceInstance from '@/client/services/PisoService'
import { MenuLeftType } from '@/client/types/globalTypes'
import ContentContainer from '@/components/ContentContainer'
import HomeContainer from '@/components/HomeContainer'
import { Layout, PropBox } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'


const Index = () => {
    const _itemSelected = 'propietario_home'
    const [lMenu, setLMenu] = useState<Array<MenuLeftType>>(menu_propietario)

    const { currentRol, userData } = useContext(UserContext)
    const router = useRouter()

    useEffect(() => {
        PisoServiceInstance.getAllByUser(userData().id).then(data => {
            let _lMenu: Array<MenuLeftType> = []
            data?.map((el, index) => {
                _lMenu.push( {   ...el, 
                                isActive: false, 
                                key: el.id_dispositivo_ref, 
                                propID: el.etiqueta, 
                                order: menu_propietario.length + (index+1),
                                menuPath: ``,
                                codeIcon: ''
                            } as MenuLeftType)
                return el
            })
            setLMenu((mCurrent) => [...menu_propietario, ..._lMenu])
        }).catch(err => console.log(err))
    }, [])

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex ">
                <MenuLeftContainer data={lMenu} itemSelected={_itemSelected} />
                <ContentContainer>
                    <HomeContainer data={userData()}>
                    </HomeContainer>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Index