import { JSONObject } from "@/client/types/globalTypes"
import * as React from "react"
const CustomHouseIcoWhite = (props:JSONObject) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="Capa_1"
        x={0}
        y={0}
        
        viewBox="0 0 99 99"
        
        {...props}
    >
        <style>
            {`.CustomHouseIcoWhiteStroke{fill:none;stroke:#fff;stroke-width:3;stroke-miterlimit:10}`}
        </style>
        <path d="M14.51 37.48V95c0 1.1.9 2 2 2h32.95" className="CustomHouseIcoWhiteStroke" />
        <path d="M83.88 37.48V95c0 1.1-.9 2-2 2H48.93" className="CustomHouseIcoWhiteStroke" />
        <path
            d="M1.19 50.11 45.66 5.54a4.991 4.991 0 0 1 7.06 0L97.2 50.11"
            className="CustomHouseIcoWhiteStroke"
        />
        <path
            d="M63 96.51V72.15C63 66.57 58.43 62 52.85 62h-7.24c-5.64 0-10.26 4.61-10.26 10.26v24.26c0 .06.05.11.11.11H62.9c.05-.01.1-.06.1-.12z"
            style={{
                fill: '#fff',
            }}
        />
    </svg>
)
export default CustomHouseIcoWhite
