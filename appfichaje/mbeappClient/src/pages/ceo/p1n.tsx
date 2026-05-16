import { menu_ceo } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NCeo = () => {
    const _itemSelected = 'ceo_p1n'

    return (
        <P1NPage
            menu={menu_ceo}
            itemSelected={_itemSelected}
            title="P1N CEO"
        />
    )
}

export default P1NCeo
