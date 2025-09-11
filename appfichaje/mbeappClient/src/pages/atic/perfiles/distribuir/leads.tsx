import { Layout } from '@/components/Layout'
import React from 'react'
import DistribuirLeadsForm from '@/components/share/perfiles/leads/DistribuirLeadsForm'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import { MdCancel } from 'react-icons/md'
import { handleCancel } from '@/client/helpers/Util'
import { useRouter } from 'next/router'

const DistribuirLeads = () => {
    const router = useRouter()
    const _pathGoToBack = '/atic/perfiles'
    
    return (
    <Layout>
        <div className="w-auto h-full grid grid-flow-col">
            <DistribuirLeadsForm pathToBack={_pathGoToBack} />
            <ButtonContainerVertical>
                <FloatButton title='Cancelar' handler={() => handleCancel(`${_pathGoToBack}`, router)} Icon={MdCancel} />
            </ButtonContainerVertical>
        </div>
    </Layout>
    )
}

export default DistribuirLeads