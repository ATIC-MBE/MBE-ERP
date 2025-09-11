import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, CITIES, STATES, TIPO_LEADS } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import { AiOutlinePlus, AiFillSave, AiOutlineClose, AiOutlineWhatsApp, AiOutlineMail, AiOutlineComment } from 'react-icons/ai'
import { FaHandshake } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import ButtonContainerVertical from '@/components/ButtonContainerVertical'
import FloatButton from '@/components/FloatButton'
import EnumButtons from '@/components/EnumButtons'
import { BsFillHouseFill, BsFillPersonCheckFill, BsFillPersonFill, BsFillPhoneFill, BsFillTelephoneFill, BsLink, BsListCheck } from 'react-icons/bs'
import DeviceForm from '@/components/atic/devices/DeviceForm'
import useDeviceId from '@/client/hooks/atic/devices/useDeviceId'
import useDeviceForm from '@/client/hooks/atic/devices/useDeviceForm'

const DeviceNew = () => {
    const _pathGoToBack = '/atic/devices'
    const {
        dataDB,
        handleChange,
        handleSave, 
        handleCancel,
        flagTypeDevices,
        setFlagTypeDevices,
        dataTypeDeviceSel,
        msgError,
        errorValidate
    } = useDeviceId()
    
    return (
    <Layout>
        <div className="w-auto h-full grid grid-flow-col"> 
            <DeviceForm dataDB={dataDB} handleChange={handleChange} pathToBack={_pathGoToBack} setFlagTypeDevices={setFlagTypeDevices} flagTypeDevices={flagTypeDevices} dataTypeDeviceSel={dataTypeDeviceSel} msgError={msgError} errorValidate={errorValidate}/>
            <ButtonContainerVertical>
                <FloatButton title='Guardar' handler={handleSave} Icon={AiFillSave} />
                <FloatButton title='Cancelar' handler={handleCancel} Icon={MdCancel} />
            </ButtonContainerVertical>
        </div>
    </Layout>
    )
}

export default DeviceNew