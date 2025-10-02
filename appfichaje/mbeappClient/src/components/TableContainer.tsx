import { BsFillEmojiAngryFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill} from 'react-icons/bs'
import { MSG_TABLE_EMPTY, MSG_TABLE_LOADING } from "@/client/helpers/constants"


const TableContainer = ( { header, data, loading = false, title = 'Tabla', drawactions, drawfilters, nro_cols }: { header:Array<{key: string, label: string}>, data:Array<any>, loading: boolean, title: string, drawactions: any, drawfilters?: any, nro_cols?: number  } ) => {
    nro_cols = nro_cols || 6
    return (
        <div className="overflow-x-scroll grid w-full md:w-2/2 lg:w-2/2 xl:w-3/3 overflow-y-hidden lg:w-auto md:w-auto ">
            <div className="w-[80rem] h-auto bg-[#badaed] border border-blue rounded-t-3xl grid">
                <div className="w-full p-4 flex">
                    <div className="w-full flex">
                        <h1 className='text-lg text-primary font-bold'>{ title }</h1>
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
            <div className={`w-[80rem] h-[3rem] border border-blue grid grid-cols-7`} style={{background: '#3e7f82'}}>
                {
                    header.map((data, index)=>(<div key={`h-${data.key}-${index}`} className="text-[#c9ac7e] text-left ml-2 grid items-center font-bold uppercase" style={{letterSpacing: '0.02em'}}>{data.label}</div>))
                }
            </div>
            {
                loading ? (
                            <div className="w-full h-[2rem] border border-white" style={{textAlign: 'center'}}><b>{MSG_TABLE_LOADING}</b></div>
                        ) : (
                            ( data.length === 0 ) ? (<div className="w-full] h-[2rem] border border-white" style={{textAlign: 'center'}}><b>{MSG_TABLE_EMPTY}</b></div>) : (
                            <div className="tbl-body w-[80rem] h-[25rem] bg-neutral/45 overflow-y-scroll overflow-x-hidden">
                                {
                                    data.map((data, index) => (
                                        <div key={`b-${index}`} className={`w-[80rem] h-min py-2 border border-white grid grid-cols-7`}>
                                            {
                                                header.map(({key}) => {
                                                    const dataActions = (data[key] as Array<any>)
                                                    if (key === 'actions') {
                                                        return (
                                                                    <div style={{display: 'flex', justifyContent: 'left'}} className="content-actions text-[#0077bd] text-left ml-2 font-semibold" key={`b-${key}-${index}`}>
                                                                        {
                                                                            dataActions.map( (el,i) => {
                                                                                if (el.btnAction) return (<a className="tbl-btn-action" onClick={el.btnAction} key={`a-action-${i}`}>{el.label}{(i<dataActions.length-1?<span> |&nbsp;</span>:'')}</a>)
                                                                                return (<a href={el.link} key={`a-action-${i}`}>{el.label}{(i<dataActions.length-1?<span> |&nbsp;</span>:'')}</a>)
                                                                            } )
                                                                        }
                                                                    </div>
                                                                )
                                                    } else if (key === 'personahtml') {
                                                        if (data['name_tinteresa'] === 'Mucho') {
                                                            // Carita feliz (verde)
                                                            return (
                                                                <div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                    <span>
                                                                        <BsFillEmojiSmileFill className="text-green-600" style={{ display: 'inline' }} size={'1.1rem'} /> 
                                                                        <label className={data['estatus'] == '0' ? 'text-red-600' : ''}>{ data['persona'] }</label>
                                                                    </span>
                                                                </div>
                                                            );
                                                        } 
                                                        else if (data['name_tinteresa'] === 'Medio') {
                                                            // Carita neutra (amarilla)
                                                            return (
                                                                <div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                    <span>
                                                                        <BsFillEmojiNeutralFill className="text-yellow-600" style={{ display: 'inline' }} size={'1.1rem'} /> 
                                                                        <label className={data['estatus'] == '0' ? 'text-red-600' : ''}>{ data['persona'] }</label>
                                                                    </span>
                                                                </div>
                                                            );
                                                        } 
                                                        
                                                        else if (data['name_tinteresa']) {
                                                            // Sin carita (ninguna clasificación)
                                                            return (
                                                                <div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                    <label className={data['estatus'] == '0' ? 'text-red-600' : ''}>{ data['persona'] }</label>
                                                                </div>
                                                                
                                                            );
                                                        }
                                                
                                                      else if  (data['name_tinteresa'] === 'Poco') {
                                                        // Carita enojada (roja)
                                                        return (
                                                            <div key={`b-${key}-${index}`} className="ml-2 text-[#0077bd] text-left grid font-semibold">
                                                                <span>
                                                                    <BsFillEmojiAngryFill className="text-red-600" style={{ display: 'inline' }} size={'1.1rem'} /> 
                                                                    <label className={data['estatus'] == '0' ? 'text-red-600' : ''}>{ data['persona'] }</label>
                                                                </span>
                                                            </div>
                                                        );
                                                    }
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

export default TableContainer