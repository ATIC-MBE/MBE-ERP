import { JSONObject } from "@/client/types/globalTypes"
import * as React from "react"
const Logos22 = (props:JSONObject) => {

    const { color } = props

    const st0 = {
        fill: color
    }

    const st8 = {
        fill: 'none',
        stroke: color,
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
            
            <path d="M12.65 63.3v30.74c0 1.1.9 2 2 2h34.14" style={st8} />
            <path
                d="M84.39 63.3v30.74c0 1.1-.9 2-2 2H48.24M12.65 64.73V5.18c0-1.1.9-2 2-2h34.14"
                style={st8}
            />
            <path d="M84.39 64.73V5.18c0-1.1-.9-2-2-2H48.24" style={st8} />
            <path
                d="M71.68 94.62V78.1c0-10.46-8.79-19.02-19.52-19.02h-3.82c-10.85 0-19.73 8.65-19.73 19.22v16.33h43.07z"
                style={st0}
            />
            <circle cx={49.95} cy={46.94} r={13.82} style={st0} />
        </svg>
    )
}
export default Logos22
