import { IVariablesReserva } from '@/client/models/IVariablesReserva'
import CardVarReservaDetails from './CardVarReservaDetails'

const CardVarReservaContainer = ( { data }: { data:Array<IVariablesReserva> } ) => {
    return (
        <div className="grid justify-items-stretch grid-cols-2 gap-5 px-20">
            {
                data.length === 0 ? '' : (
                    data.map((el, index) => (
                        <CardVarReservaDetails key={`card-cr-${index}`} data={el} index={index} />
                    ))
                )
            }
        </div>
    )
}

export default CardVarReservaContainer