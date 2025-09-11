import { Layout } from '@/components/Layout'
import React from 'react'
import PasswordForm from '@/components/share/users/change/passwordForm'
import { useRouter } from 'next/router'

const ChangePassword = () => {
    const _pathGoToBack = '/superadmin/users'
    const router = useRouter()

    let id = parseInt((router.query.id as string) || '0')

    return (
        <Layout>
            <PasswordForm pathToBack={_pathGoToBack} id={id} />
        </Layout>
    )
}

export default ChangePassword