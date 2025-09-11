import { Layout } from "@/components/Layout"
import TableContainer from "@/components/TableContainer"
import React, { useState } from 'react'
import Link from 'next/link'
import useUser from "@/client/hooks/superadmin/users/useUser"
import { menu_superadmin } from '@/client/helpers/constants'
import MenuLeftContainer from "@/components/MenuLeftContainer"
import ContentContainer from "@/components/ContentContainer"
import MenuTopMobileContainer from "@/components/MenuTopMobileContainer"
import Modal from "@/components/Modal"

const Users = () => {
    const _itemSelected = 'superadmin_users'
    const { listData, headerTable, loading, isModalOpen, rowID, handleResetPassword, toggleModal } = useUser()

    const drawActions = () => {
        return (
            <>
                <Link className="p-2 h-min rounded-xl bg-[#0077bd] hover:bg-[#0077bd] text-white" href='/superadmin/users/new'>Nuevo</Link>
            </>
        )
    }

    return (
        <Layout>
            <div className="h-100 overflow-hidden bg-image lg:p-5 md:p-5 p-1 pt-2 lg:flex md:flex grid justify-items-center">
                <MenuTopMobileContainer />
                <MenuLeftContainer data={menu_superadmin} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div>
                        <TableContainer drawactions={drawActions} title="Usuarios" header={headerTable} data={listData} loading={loading} />
                    </div>
                </ContentContainer>
            </div>
            <Modal title="Advertencia!" isOpen={isModalOpen} acceptHandler={()=>handleResetPassword(rowID)} cancelHandler={toggleModal} >
                <div className="">Se va a resetear la contraseña!</div>
            </Modal>
        </Layout>
    )
}

export default Users