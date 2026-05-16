import { menu_ade_master } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAdeMaster = () => {
    const _itemSelected = 'ade_master_p1n'

    return (
        <P1NPage
            menu={menu_ade_master}
            itemSelected={_itemSelected}
            title="P1N ADE Master"
        />
    )
}

export default P1NAdeMaster
