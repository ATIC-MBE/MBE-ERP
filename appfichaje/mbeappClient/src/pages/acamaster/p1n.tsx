import { menu_aca_master } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAcaMaster = () => {
    const _itemSelected = 'aca_master_p1n'

    return (
        <P1NPage
            menu={menu_aca_master}
            itemSelected={_itemSelected}
            title="P1N ACA Master"
        />
    )
}

export default P1NAcaMaster
