import { BsFillEmojiAngryFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill} from 'react-icons/bs'
import { MSG_TABLE_EMPTY, MSG_TABLE_LOADING } from "@/client/helpers/constants"
import AgenteIcon from './Iconos/AgenteIcon'
import PropietarioIcon from './Iconos/PropietarioIcon'

const TableContainerL = ( { header, 
                            data, 
                            loading = false, 
                            title = 'Tabla', 
                            drawactions, 
                            drawfilters, 
                            nro_cols,
                            actionOnRow = (id) => { console.log(`Sin efecto!! ${id}`) }, 
                        }
                            : 
                            {   header:Array<{key: string, label: string}>, 
                                data:Array<any>, 
                                loading: boolean, 
                                title: string,
                                actionOnRow?: (id: number) => void, 
                                drawactions: any, 
                                drawfilters?: any, 
                                nro_cols?: number  
                            } ) => {
    nro_cols = nro_cols || 6
    return (
        <div className=" overflow-x-scroll overflow-y-hidden lg:w-auto md:w-auto w-[95vw]">
            <div className="w-[80rem] h-auto bg-[#badaed] border border-blue rounded-t-3xl grid">
                <div className="w-full p-4 flex">
                    <div className="w-full flex">
                        <h1 className="w-full text-bold text-blue" style={{fontSize:'22px'}}>{ title }</h1>
                    </div>
                    <div className="w-min flex justify-end">
                        { drawactions ? drawactions() : '' }
                    </div>
                </div>
                { drawfilters ?
                    <div className="w-full p-3 flex">
                        <div className="w-full flex justify-end">
                            { drawfilters ? drawfilters() : '' }
                        </div>
                    </div>
                : ''}
            </div>
            <div className={`w-[80rem] h-[3rem] border border-blue grid grid-cols-5`} style={{background: '#3e7f82'}}>
                {
                    header.map((data, index)=>(<div key={`h-${data.key}-${index}`} className="text-[#c9ac7e] text-left ml-2 grid items-center font-bold uppercase" style={{letterSpacing: '0.02em'}}>{data.label}</div>))
                }
            </div>
            {
                loading ? (
                            <div className="w-full h-[2rem] border border-white" style={{textAlign: 'center'}}><b>{MSG_TABLE_LOADING}</b></div>
                        ) : (
                            ( data.length === 0 ) ? (<div className="w-full] h-[2rem] border border-white" style={{textAlign: 'center'}}><b>{MSG_TABLE_EMPTY}</b></div>) : (
                            <div className="tbl-body w-[80rem] h-[25rem] bg-[#ffffff71] overflow-y-scroll overflow-x-hidden">
                                {
                                    data.map((data, index) => (
                                        <div onClick={() => actionOnRow(data.id as number)} key={`b-${index}`} className={`data-table-row w-[80rem] h-min py-2 border border-white grid grid-cols-5`}>
                                            {
                                                header.map(({key}) => {
                                                    // const dataActions = (data[key] as Array<any>)
                                                    if (key === 'personahtml') {

                                                        if ( data['name_tinteresa'] === 'Mucho' ) {
                                                            return (<div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                <p className='inline-flex space-x-2 px-2'>
                                                                    {
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'colaborador' ||
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                                                                        <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.2rem] h-[1.2rem]' />
                                                                        : 
                                                                        <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                                                                    }
                                                                    <BsFillEmojiSmileFill className="text-green-600" style={{display: 'inline'}} size={'1.1rem'}/> 
                                                                    <label className={data['lbl_orden'] == 'orden_2'?'txt-orange-f3bb6d':''}>{ data['persona'] }</label>
                                                                </p>
                                                            </div>)


                                                        
                                                        }
                                                        else if( data['name_tinteresa'] === 'Medio' ) {
                                                            return (<div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                <p className='inline-flex space-x-2 px-2'>
                                                                    {
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'colaborador' ||
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                                                                        <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.2rem] h-[1.2rem]' />
                                                                        : 
                                                                        <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                                                                    }
                                                                    <BsFillEmojiNeutralFill className="text-yellow-600" style={{display: 'inline'}} size={'1.1rem'}/> 
                                                                    <label className={data['lbl_orden'] == 'orden_2'?'txt-orange-f3bb6d':''}>{ data['persona'] }</label>
                                                                </p>
                                                            </div>)
                                                        }



                                                        
                                                        if 
                                                        
                                                
                                                        ( data['name_tinteresa'] === 'Poco' ) {
                                                            return (<div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                <p className='inline-flex space-x-2 px-2'>
                                                                    {
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'colaborador' ||
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                                                                        <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.2rem] h-[1.2rem]' />
                                                                        : 
                                                                        <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                                                                    }
                                                                    <BsFillEmojiAngryFill className="text-red-600" style={{display: 'inline'}} size={'1.1rem'} /> 
                                                                    <label className={data['lbl_orden'] == 'orden_2'?'txt-orange-f3bb6d':''}>{ data['persona'] }</label>
                                                                </p>
                                                            </div>)
                                                        }
                                                        else {
                                                            return (<div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                <p className='inline-flex space-x-2 px-2'>
                                                                    {
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'colaborador' ||
                                                                        ( data['tipo_lead'] as string || '' ).trim().toLowerCase() === 'prescriptor' ?
                                                                        <AgenteIcon title="Prescriptor" color={'#ef8221'} className='w-[1.2rem] h-[1.2rem]' />
                                                                        : 
                                                                        <PropietarioIcon title="Propietario" color={'#0077bd'} className='w-[1.2rem] h-[1.2rem]' />
                                                                    }
                                                                    <label className={data['lbl_orden'] == 'orden_2'?'txt-orange-f3bb6d':''}>{ data['persona'] }</label>
                                                                </p>
                                                            </div>)
                                                        }





                                                    } else {
                                                        return (
                                                            <div key={`b-${key}-${index}`} className="text-wraper-tbl text-[#0077bd] text-left ml-2 grid font-semibold">
                                                                <span className={data['lbl_orden'] == 'orden_2'?'txt-orange-f3bb6d':''}>{ data[key] }</span>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            )
                        )
            }
        </div>
    )
}

export default TableContainerL