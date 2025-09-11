const ButtonContainer = ( { children } : {children: any} ) => {

    return (
        <div className="btnContent w-full h-min flex justify-center mt-10 sticky top-0" >
            { children }
        </div>
    )
}

export default ButtonContainer