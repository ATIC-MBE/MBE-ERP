import { JSONObject } from "@/client/types/globalTypes"
import * as React from "react"
const WebMCH24 = (props:JSONObject) => {

    const { color } = props

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
            <style>
                {".st8{fill:none;stroke:#fff;stroke-width:2;stroke-miterlimit:10}"}
            </style>
            <path d="M98.18 47.99 79.03 30.18l19.15 17.81L79.03 65.8" style={st8} />
            <path
                d="M88.44 56.73H40.02V39.25h48.42l10.06 8.63z"
                style={{
                    fill: color,
                }}
            />
            <path d="M2.5 62.48V92.5c0 1.1.9 2 2 2h33.35" style={st8} />
            <path
                d="M67.09 62.48V92.5c0 1.1-.9 2-2 2H31.75M2.5 63.87V5.68c0-1.1.9-2 2-2h33.35"
                style={st8}
            />
            <path
                d="M67.09 63.87V5.68c0-1.1-.9-2-2-2H31.75M25.74 3.68v90.43"
                style={st8}
            />
        </svg>
    )
}
export default WebMCH24