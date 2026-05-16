import { menu_atic } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NAtic = () => {
    const _itemSelected = 'atic_p1n'

    return (
        <P1NPage
            menu={menu_atic}
            itemSelected={_itemSelected}
            title="P1N ATIC"
        />
    )
}

export default P1NAtic
