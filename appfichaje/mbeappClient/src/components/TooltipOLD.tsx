import { useState } from 'react';

type TooltipPropsType = { btnContent: JSX.Element, defaultValue?: string, saveHandler?: (inputValue: string) => void }

const TooltipOLD = ({ btnContent, defaultValue, saveHandler }: TooltipPropsType) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [inputValue, setInputValue] = useState('')

    const handleClick = async () => {

        setShowTooltip(!showTooltip);
        saveHandler!(inputValue)

    };

    return (
        <div className="relative inline-block">
            {showTooltip && (
                <div className="absolute bg-white p-4 shadow-md flex rounded-lg z-10">
                    <input onChange={(e) => setInputValue(e.target.value)} type="text" placeholder="Enter something" className="border border-gray-300 px-2 py-1 w-[8rem]" defaultValue={defaultValue ? defaultValue : ''} />
                    <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2">
                        Save
                    </button>
                </div>
            )}
            <button onClick={handleClick} className="">
                {btnContent}
            </button>

        </div>
    );
};

export default TooltipOLD;
