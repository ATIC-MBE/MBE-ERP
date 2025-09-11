const ButtonContainerVertical = ( { children } : {children: any} ) => {

    return (
        <div className="btnContent grid grid-cols-3 lg:grid-cols-1 h-min px-5 justify-items-center lg:space-y-2 space-y-0 mt-10 sticky top-0">
            { children }
        </div>
    )
}

export default ButtonContainerVertical
