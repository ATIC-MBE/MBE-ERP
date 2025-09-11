import { IconType } from 'react-icons'
import SpinnerCustom from './SpinnerCustom'

type floatButtonType = { 
    handler: () => any, 
    Icon: IconType, 
    title?: string,
    disabledEvent?: boolean
    stateDisabled?: boolean
}

const FloatButton = ({ handler, Icon, title = 'Default', disabledEvent = false, stateDisabled = false}: floatButtonType) => (
        disabledEvent ? 
            <button disabled={ stateDisabled === undefined ? false : stateDisabled } title={title} onClick={handler} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>
                {
                    (stateDisabled) ? <SpinnerCustom msn='' /> : <Icon size={'2rem'} />
                }
            </button>
            : 
            <button title={title} onClick={handler} className='bg-[#0077bd] text-white p-3 text-lg border border-blue rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>
                <Icon size={'2rem'} />
            </button>
)

export default FloatButton
