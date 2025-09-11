import { NO_SELECTED } from "@/client/helpers/constants"

const OptionsOnSelect = ( { data, codeKey, label, addSelecionar = true }: { data: Array<{key:string, name: string}>, codeKey: string, label?: string, addSelecionar?: boolean} ) => {
    NO_SELECTED.name = label || NO_SELECTED.name
    const safeData = Array.isArray(data) ? data : [];
    return (
        <>
            {
                addSelecionar ?
                [ NO_SELECTED, ...safeData ].map( (el) => {
                    return (<option key={`${codeKey}-${el.key}`} value={el.key}>{el.name}</option>)
                })
                :
                [ ...safeData ].map( (el) => {
                    return (<option key={`${codeKey}-${el.key}`} value={el.key}>{el.name}</option>)
                })
            }
        </>
    )
}

export default OptionsOnSelect