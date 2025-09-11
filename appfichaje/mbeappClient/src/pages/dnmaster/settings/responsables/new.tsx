import { Layout } from '@/components/Layout'
import { useMemo } from 'react'
import React from 'react'
import { ALERT_DANGER, STATES, TYPE_LEAD_RESPONSABLE } from '@/client/helpers/constants'
import AlertContainer from '@/components/AlertContainer'
import OptionsOnSelect from '@/components/OptionsOnSelect'
import ButtonContainer from '@/components/ButtonContainer'
import useResponsableLeadId from '@/client/hooks/dnmaster/settings/responsableLead/useResponsableLeadId'

const ResponsableNew = () => {
    const { dataDB, 
            handleChange, 
            handleSave,
            handleCancel,
            usuarios, 
            errorValidate, 
            msgError } = useResponsableLeadId()

    const drawListOnSelect = (lData: Array<{ key:string, name: string }>, codeKey: string, label?: string) => {
        return <OptionsOnSelect data={lData} codeKey={codeKey} label={label} />
    }

    return (
        <Layout>
            <div className="w-full h-full grid items-center justify-items-center">
                <div className="w-[45rem] h-full rounded-3xl bg-[#0077bdaf] py-10 px-10 space-y-5">
                    { errorValidate ?
                        <AlertContainer typeAlert={ALERT_DANGER}>
                            <div dangerouslySetInnerHTML={{ __html: msgError }} />
                        </AlertContainer>:<></>
                    }
                    <input type="hidden" name='id' value={dataDB.id?.toString()} />

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Aplica a <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <select value={dataDB.tipo_lead} onChange={handleChange} name='tipo_lead' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(TYPE_LEAD_RESPONSABLE, 'tl', 'Seleccionar aplica a'), [TYPE_LEAD_RESPONSABLE]) }
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Código <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='codigo' value={dataDB.codigo} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>
                    
                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Nombre <span style={{color: 'red', fontSize: 'bold'}}>*</span></label>
                            <input type="text" onChange={handleChange} name='nombre' value={dataDB.nombre} className="rounded-r-full p-4 col-span-6" />
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Responsable</label>
                            <select value={dataDB.idusuario_resp} onChange={handleChange} name='idusuario_resp' className="rounded-r-full p-4 col-span-6">
                                { useMemo(() => drawListOnSelect(usuarios, 'usu', 'Seleccionar responsable'), [usuarios]) }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className=" w-full grid grid-cols-8 text-lg">
                            <label className='p-4 h-min bg-[#0077bd] text-white rounded-l-full col-span-2'>Observaciones</label>
                            <textarea defaultValue={dataDB.observacion} onChange={handleChange} className="rounded-r-full p-4 col-span-6" name="observacion"></textarea>
                        </div>
                    </div>
                    
                    <ButtonContainer>
                        <button onClick={handleSave} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Guardar</button>
                        <button onClick={handleCancel} className='text-white p-3 text-lg border border-white rounded-full hover:bg-white hover:text-blue-800 duration-300' type='button'>Cancelar</button>
                    </ButtonContainer>
                </div>
                <br />
            </div>
        </Layout>
    )
}

export default ResponsableNew