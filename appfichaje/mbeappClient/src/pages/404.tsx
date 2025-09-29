import { Layout } from '@/components/Layout'
import React from 'react'
import { BsSearch } from 'react-icons/bs'

const NotFound = () => {
    
    return (
        <Layout>
            <div className="w-full h-full grid items-center justify-items-center text-center">
                <div className="w-[20rem] h-[20rem] grid justify-items-center space-y-0 pb-16">
                    <BsSearch size={'5rem'} />
                    <h1 className='text-3xl font-bold'>404 Not found</h1>
                    <p>El recurso solicitado no ha sido encontrado</p>
                </div>
            </div>
        </Layout>
    )
}

export default NotFound