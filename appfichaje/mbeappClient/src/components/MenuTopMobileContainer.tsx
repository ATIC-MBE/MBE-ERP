import React from 'react'
import { PropBox } from './Layout'
import { menu_superadmin as _menu_superadmin } from '@/client/helpers/constants'
import { classNames } from '@/client/helpers/Util'
import { JSONObject } from '@/client/types/globalTypes'
import PinCounter from './PinCounter';

const MenuTopMobileContainer = ({hidden}:JSONObject) => {
    // Defensive: fallback to empty array if undefined
    const menu = Array.isArray(_menu_superadmin) ? _menu_superadmin : [];
    
    return (
        <div className={classNames("w-full h-[5rem] c-bg-primary rounded-2xl flex items-center justify-between px-4 lg:hidden md:hidden",hidden ? 'hidden': 'flex')}>
            
            {/* Contenedor del Menú (Izquierda) */}
            <div className="flex space-x-2 overflow-x-auto overflow-y-hidden no-scrollbar flex-1">
                {menu.map((item,i) => (
                    <div key={i} className="w-[4rem] h-[4rem] grid items-center justify-items-center flex-shrink-0">
                        {<PropBox {...item} />}
                    </div>
                ))}
            </div>

            {/* Contenedor del PinCounter (Derecha) */}
            <div className="flex-shrink-0 ml-2">
                <PinCounter />
            </div>
            
        </div>
    )
}

export default MenuTopMobileContainer