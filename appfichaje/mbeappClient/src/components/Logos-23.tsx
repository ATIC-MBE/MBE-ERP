import { JSONObject } from "@/client/types/globalTypes"
import * as React from "react"
const Logos23 = (props: JSONObject) => {

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
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            id="Capa_1"
            x={0}
            y={0}

            viewBox="0 0 101 99"
            {...props}
        >

            <path d="M26.3 27.36V94c0 1.1.9 2 2 2h22.41" style={st8} />
            <path d="M74.75 27.36V94c0 1.1-.9 2-2 2H50.34" style={st8} />
            <path
                d="M3.94 50.17 47.33 6.68a4.991 4.991 0 0 1 7.06 0l43.39 43.49"
                style={st8}
            />
            <path
                d="M64.35 95.57V66.78c0-2.75-2.25-4.99-4.99-4.99H42.37c-2.78 0-5.05 2.27-5.05 5.05v28.74c0 .03.02.05.05.05H64.3c.03 0 .05-.03.05-.06z"
                style={{
                    fill: color,
                }}
            />
            <defs>
                <path
                    id="SVGID_00000121256111052227389790000003964970393694429102_"
                    d="M-.62 21.98H26.3v67.29H-.62z"
                />
            </defs>
            <clipPath id="SVGID_00000181798856812529923190000012891572633023209118_">
                <use
                    xlinkHref="#SVGID_00000121256111052227389790000003964970393694429102_"
                    style={{
                        overflow: "visible",
                    }}
                />
            </clipPath>
            <path
                d="M11.46 42.59v39.97c0 1.1.9 2 2 2h22.65"
                style={{
                    clipPath:
                        "url(#SVGID_00000181798856812529923190000012891572633023209118_)",
                    fill: 'none',
                    stroke: color,
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                }}
            />
            <path
                d="M60.38 42.59v39.97c0 1.1-.9 2-2 2H35.74"
                style={{
                    clipPath:
                        "url(#SVGID_00000181798856812529923190000012891572633023209118_)",
                    fill: 'none',
                    stroke: color,
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                }}
            />
            <defs>
                <path
                    id="SVGID_00000089551624886381894200000007249134575070997913_"
                    d="M74.75 21.98h26.92v67.29H74.75z"
                    transform="rotate(-180 88.21 55.625)"
                />
            </defs>
            <clipPath id="SVGID_00000072265564311301918170000000906076872245866422_">
                <use
                    xlinkHref="#SVGID_00000089551624886381894200000007249134575070997913_"
                    style={{
                        overflow: "visible",
                    }}
                />
            </clipPath>
            <path
                d="M89.59 42.59v39.97c0 1.1-.9 2-2 2H64.94"
                style={{
                    clipPath:
                        "url(#SVGID_00000072265564311301918170000000906076872245866422_)",
                    fill: 'none',
                    stroke: color,
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                }}
            />
            <path
                d="M40.67 42.59v39.97c0 1.1.9 2 2 2h22.65"
                style={{
                    clipPath:
                        "url(#SVGID_00000072265564311301918170000000906076872245866422_)",
                    fill: 'none',
                    stroke: color,
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                }}
            />
        </svg>
    )
}
export default Logos23
