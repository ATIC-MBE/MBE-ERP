import React from 'react'
import { PropBox } from './Layout'
import { menu_superadmin as _menu_superadmin } from '@/client/helpers/constants'
import { classNames } from '@/client/helpers/Util'
import { JSONObject } from '@/client/types/globalTypes'

const MenuTopMobileContainer = ({hidden}:JSONObject) => {
    // Defensive: fallback to empty array if undefined
    const menu = Array.isArray(_menu_superadmin) ? _menu_superadmin : [];
    return (
        <div className={classNames("w-full h-[5rem] c-bg-primary rounded-2xl flex space-x-2 lg:hidden md:hidden",hidden ? 'hidden': 'flex')}>
            {menu.map((item,i) => (
                <div key={i} className="w-[4rem] h-[4rem] grid items-center justify-items-center">
                    {<PropBox {...item} />}
                </div>
            ))}
        </div>
    )
}

export default MenuTopMobileContainer