import { menu_ade } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAde = () => {
    const _itemSelected = 'ade_p1n'

    return (
        <P1NPage
            menu={menu_ade}
            itemSelected={_itemSelected}
            title="P1N ADE"
        />
    )
}

export default P1NAde
