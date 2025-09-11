import { Layout } from '@/components/Layout'
import React from 'react'
import { AiFillSave } from 'react-icons/ai'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import DeviceForm from '@/components/atic/devices/DeviceForm'
import usePisoIdDevices from '@/client/hooks/da/pisos/devices/usePisoIdDevices'
import AsociarDeviceContainer from '@/components/da/pisos/device/asociar/AsociarDeviceContainer'

const DeviceNew = () => {
    const _pathGoToBack = '/da/apartments'
    const {
            dataDB,
            setDataDB,
            handleSave, 
            handleCancel
    } = usePisoIdDevices()
    
    return (
    <Layout>
        <div className="w-auto h-full grid grid-flow-col">
            <AsociarDeviceContainer dataDB={dataDB} setDataDB={setDataDB} />
            <ButtonContainerVertical>
                <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
            </ButtonContainerVertical>
        </div>
    </Layout>
    )
}

export default DeviceNew