import { JSONObject } from "@/client/types/globalTypes"
import * as React from "react"

const Logos21 = (props:JSONObject) => {

    const { color } = props

    const st0 = {
        fill:color
    }
    
    const st8 = {
        fill:'none',
        stroke:color,
        strokeWidth: 2,
        strokeMiterlimit: 10,
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Capa_1"
            x={0}
            y={0}
            
            viewBox="0 0 101 99"
            {...props}
        >
            
            <path d="M70.29 59.06 52.8 80.44 41.11 65.81l11.69 9.18z" style={st0} />
            <path d="m35.3 79.7 17.5-21.38 11.68 14.63-11.68-9.18z" style={st0} />
            <path d="M17.88 45.38v45.1c0 1.1.9 2 2 2h32.17" style={st8} />
            <path
                d="M85.69 45.38v45.1c0 1.1-.9 2-2 2H51.53M3 45.38h96.9"
                
                style={st8}
            />
            <path
                d="M67.6 45.38V34.11c0-7.13-5.99-12.96-13.3-12.96h-2.6c-7.39 0-13.44 5.89-13.44 13.1v11.13H67.6z"
                
                style={st0}
            />
            <circle cx={52.8} cy={14.42} r={9.42}  style={st0} />
        </svg>
    )
}
export default Logos21
