import { menu_rrhh_master } from '@/client/helpers/constants'
import P1NPage from '@/components/P1NPage'
import React from 'react'

const P1NRrhhMaster = () => {
    const _itemSelected = 'rrhh_master_p1n'

    return (
        <P1NPage
            menu={menu_rrhh_master}
            itemSelected={_itemSelected}
            title="P1N RRHH Master"
        />
    )
}

export default P1NRrhhMaster
