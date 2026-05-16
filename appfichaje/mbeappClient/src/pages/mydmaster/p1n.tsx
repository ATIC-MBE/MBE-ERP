import { menu_myd_master } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NMydMaster = () => {
    const _itemSelected = 'myd_master_p1n'

    return (
        <P1NPage
            menu={menu_myd_master}
            itemSelected={_itemSelected}
            title="P1N MYD Master"
        />
    )
}

export default P1NMydMaster
