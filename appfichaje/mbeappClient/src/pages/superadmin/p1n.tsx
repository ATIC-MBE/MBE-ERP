import { menu_superadmin } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NSuperadmin = () => {
    const _itemSelected = 'superadmin_p1n'

    return (
        <P1NPage
            menu={menu_superadmin}
            itemSelected={_itemSelected}
            title="P1N Superadmin"
        />
    )
}

export default P1NSuperadmin
