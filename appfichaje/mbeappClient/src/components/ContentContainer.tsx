const ContentContainer = ( { children } : {children: any} ) => {
    return (
        <div className="flex-1 w-full h-full overflow-x-hidden">
            <div className="w-full h-full px-4 lg:px-8 py-4">
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ContentContainer