import UserContext from '@/client/context/UserContext'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

const Admin = () => {

    const { isRoleAllowed } = useContext(UserContext)

    const router = useRouter()

    useEffect(() => {
        

    }, [])
    

  return (

    <Layout>
        <Link className='p-1 border' href='/rrhh'>Recursos</Link>
    </Layout>
  )
}

export default Admin