import { useRouter } from 'next/router'
import { Layout, PropBox } from '@/components/Layout'
import { useContext, useState, useEffect } from 'react'
import { IPiso } from '@/client/models/IPiso'
import PisoServiceInstance from '@/client/services/PisoService'
import UserContext from '@/client/context/UserContext'
import PisoDetail from '@/components/PisoDetail'
import { MenuLeftType } from '@/client/types/globalTypes'
import { menu_propietario } from '@/client/helpers/constants'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import ContentContainer from '@/components/ContentContainer'

const Post = () => {

    const [propList, setPropList] = useState<Array<IPiso>>([])
    const { userData } = useContext(UserContext)
    const [indexL, setIndexL] = useState(-1)
    const [lMenu, setLMenu] = useState<Array<MenuLeftType>>(menu_propietario)

    const router = useRouter()
    const { pid } = router.query
    const _itemSelected = (pid || '') as string


    useEffect(()=> {
        PisoServiceInstance.getAllByUser(userData().id).then(data => {
            let __indexL = data!.findIndex(el => el.etiqueta.trim() === pid)

            let _lMenu: Array<MenuLeftType> = []
            setPropList(data!.map(piso => ({...piso, isActive: false, propID: piso.etiqueta})))
            data?.map((el, index) => {
                _lMenu.push( {   ...el, 
                                isActive: false, 
                                key: el.etiqueta, // id_dispositivo_ref
                                propID: el.etiqueta, 
                                order: menu_propietario.length + (index+1),
                                menuPath: ``,
                                codeIcon: ''
                            } as MenuLeftType)
                return el
            })
            let _lTmp = [...menu_propietario, ..._lMenu]
            console.log(_lTmp)
            let _indexL = _lTmp.findIndex(el => el.propID.trim() === pid)
            _lTmp[_indexL].isActive = true
            setIndexL(__indexL)
            setLMenu((mCurrent) => _lTmp)
    
        }).catch(err => console.log(err))
    }, [pid])

    console.log(propList)

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={lMenu} itemSelected={_itemSelected} />
                <ContentContainer>
                    <PisoDetail data={propList[indexL]}/>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default Post

