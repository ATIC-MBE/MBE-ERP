import { Layout } from "@/components/Layout"
import React from 'react'
import ContentContainer from "@/components/ContentContainer"
import UsersContainer from "@/components/share/users/UsersContainer"
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { MdCancel } from 'react-icons/md'
import { useRouter } from 'next/router'

const UsersUnsubscribeRRHH = () => {
    const router = useRouter()
    const _path = '/rrhhmaster/users'
    const _typeTotalData = 'all_users_rrhh'
    const _pathGetDataApi = '/api/rrhh/p/users/'

    const handleCancel = () => {
        router.push(_path)
    }

    return (
        <Layout>
            <style jsx>{`
                :global(a[href*="/changepassword"]) {
                    display: none !important;
                }
            `}</style>
            <div className="h-100 bg-image p-5 pt-2">
                <ContentContainer>
                    <div className="w-[80rem] h-auto mb-4">
                        <h1 className="text-2xl font-bold text-[#005360] mb-2">Dar de Baja Usuarios</h1>
                        <p className="text-gray-600 mb-4">Selecciona los usuarios que deseas dar de baja del sistema</p>
                    </div>
                    <UsersContainer 
                        pathEdit={`${_path}`} 
                        typeTotalData={_typeTotalData} 
                        pathGetData={_pathGetDataApi}
                        hideButtons={true}
                        isUnsubscribeMode={true}
                    />
                </ContentContainer>
            </div>
            <ButtonContainerVertical>
                <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
            </ButtonContainerVertical>
        </Layout>
    )
}

export default UsersUnsubscribeRRHH