import { BsFillEmojiAngryFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill} from 'react-icons/bs'
import { MSG_TABLE_EMPTY, MSG_TABLE_LOADING } from "@/client/helpers/constants"

const TableContainerUsersDN = ( { header, 
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
            <div className={`w-[80rem] h-[3rem] bg-[#0077BD] border border-blue grid grid-cols-3`}>
                {
                    header.map((data, index)=>(<div key={`h-${data.key}-${index}`} className="text-white text-left ml-2 grid items-center font-semibold">{data.label}</div>))
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
                                        <div onClick={() => actionOnRow(data.id as number)} key={`b-${index}`} className={`data-table-row w-[80rem] h-min py-2 border border-white grid grid-cols-3`}>
                                            {
                                                header.map(({key}) => {
                                                    return (
                                                        <div key={`b-${key}-${index}`} className="text-wraper-tbl text-[#0077bd] text-left ml-2 grid font-semibold">
                                                            <span>{ data[key] }</span>
                                                        </div>
                                                    )
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

export default TableContainerUsersDN