import React, { useEffect, useState } from 'react'

const TableHeader = () => (
    <thead style={{background: 'rgba(201,172,126,0.85)'}}>
        <tr>
            <th scope="col" className="px-6 py-3 text-[#005360] font-bold" style={{letterSpacing: '0.02em'}}>ID</th>
            <th scope="col" className="px-6 py-3 text-[#005360] font-bold" style={{letterSpacing: '0.02em'}}>Name</th>
            <th scope="col" className="px-6 py-3 text-[#005360] font-bold" style={{letterSpacing: '0.02em'}}>Category</th>
            <th scope="col" className="px-6 py-3 text-[#005360] font-bold" style={{letterSpacing: '0.02em'}}>Price</th>
            <th scope="col" className="px-6 py-3 text-[#005360] font-bold" style={{letterSpacing: '0.02em'}}>Action</th>
        </tr>
    </thead>
)

const TableRow = ({ ID, name }: { ID: number, name: string }) => (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {ID}
        </th>
        <td className="px-6 py-4">
            {name}
        </td>
        <td className="px-6 py-4">
            Laptop
        </td>
        <td className="px-6 py-4">
            $2999
        </td>
        <td className="px-6 py-4">
            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
        </td>
    </tr>
)

const PageBox = ({ page, isSelected, onClick }: { page: number, onClick: () => any, isSelected?: boolean }) => (
    isSelected ?
        <li className='w-full'>
            <button onClick={onClick} aria-current="page" className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white w-full">{page}</button>
        </li> : <li className='w-full'>
            <button onClick={onClick} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white w-full">{page}</button>
        </li>

)

const PageSelector = ({ currentPage, pages, moveToPage }: { currentPage: number, pages: number, moveToPage: (index: number) => any }) => {

    let start = (currentPage - 2)
    start = currentPage < 3 ? 1 : start > pages - 4 ? pages - 4 : start

    let end = ((currentPage + 2) > pages ? pages : (currentPage + 2))

    end = end + (start < 2 ? (5 - end) : 0)

    return (
        <nav aria-label="Page navigation example">
            <ul className=" grid items-center" style={{ gridTemplateColumns: `repeat(${7}, minmax(0, 1fr))` }}>
                <li>
                    <button onClick={() => moveToPage((currentPage - 1) <= 0 ? currentPage : currentPage - 1)} className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    </button>
                </li>
                {
                    (new Array((end - start) + 1).fill(0)).map((z, i) => (
                        <PageBox key={i} page={i + start} isSelected={(i + start) == currentPage} onClick={() => {
                            moveToPage((i + start))
                        }} />
                    ))
                }

                <li>
                    <button onClick={() => moveToPage((currentPage + 1) > pages ? currentPage : currentPage + 1)} className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

const users = (new Array(100).fill(0)).map((z, i) => ({ ID: i, name: '' + i + i + i + i }))

const getPage = (page: number, pageSize: number) => {

    const pagesNumber = Math.floor((users.length / pageSize) + ((users.length % pageSize) != 0 ? 1 : 0))

    const pageItems = users.slice(((page - 1) * pageSize), ((page - 1) * pageSize) + pageSize)

    return { pagesNumber, pageItems }

}

const PageTable = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageItems, setCurrentPageItems] = useState<any[]>([])
    const [pages, setPages] = useState(15)

    const moveToPage = (index: number) => {
        setCurrentPage(index)
    }



    useEffect(() => {
        const { pageItems, pagesNumber } = getPage(currentPage, 10)

        setPages(pagesNumber)
        setCurrentPageItems(pageItems)

    }, [currentPage])



    return (
        <div className="w-full h-full p-10 flex flex-col items-center justify-center space-y-2">

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[60rem] bg-gray-50">
                <div className="w-full h-[5rem] bg-black"></div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <TableHeader />
                    <tbody>
                        {
                            (currentPageItems).map(({ ID, name }, i) => <TableRow key={i} ID={ID} name={name} />)
                        }
                    </tbody>
                </table>
            </div>
            <PageSelector currentPage={currentPage} moveToPage={moveToPage} pages={pages} />
        </div>

    )
}

export default PageTable