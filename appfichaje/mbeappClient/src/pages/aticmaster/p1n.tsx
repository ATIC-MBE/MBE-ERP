import { menu_atic_master } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAticMaster = () => {
    const _itemSelected = 'atic_master_p1n'

    return (
        <P1NPage
            menu={menu_atic_master}
            itemSelected={_itemSelected}
            title="P1N ATIC Master"
        />
    )
}

export default P1NAticMaster
