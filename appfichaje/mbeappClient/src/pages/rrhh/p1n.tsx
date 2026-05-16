import { menu_rrhh } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NRrhh = () => {
    const _itemSelected = 'rrhh_p1n'

    return (
        <P1NPage
            menu={menu_rrhh}
            itemSelected={_itemSelected}
            title="P1N RRHH"
        />
    )
}

export default P1NRrhh
