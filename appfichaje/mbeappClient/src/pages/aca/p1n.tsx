import { menu_aca } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAca = () => {
    const _itemSelected = 'aca_p1n'

    return (
        <P1NPage
            menu={menu_aca}
            itemSelected={_itemSelected}
            title="P1N ACA"
        />
    )
}

export default P1NAca
