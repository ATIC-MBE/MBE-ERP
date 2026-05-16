import { menu_myd } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NMyd = () => {
    const _itemSelected = 'myd_p1n'

    return (
        <P1NPage
            menu={menu_myd}
            itemSelected={_itemSelected}
            title="P1N MYD"
        />
    )
}

export default P1NMyd
