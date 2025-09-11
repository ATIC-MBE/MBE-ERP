import React, { CSSProperties } from "react"

const HousingAnywhereIcon = (props: any) => {

    const { color, title, titleId} = props
    
    const st10:CSSProperties = {
        fill:color,
        opacity: 0.984,
        shapeRendering: "geometricPrecision",
        textRendering: "geometricPrecision",
        fillRule: "evenodd",
        clipRule: "evenodd",
    }

    const st12_st69:CSSProperties = {
        fill:'none',
        stroke:color,
        strokeWidth:2,
        strokeMiterlimit:10
    }

    const st69:CSSProperties = {
        strokeWidth:0.5
    }

    return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={512}
    viewBox="0 0 512 512"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#f6941c"
      d="M-.5 425.5v-52h352c.333-56.337 0-112.671-1-169A27886.393 27886.393 0 0 0 201 72.5a22285.678 22285.678 0 0 1-150 133c-.5 39.999-.667 79.999-.5 120h-51v-145A16376.723 16376.723 0 0 0 198.5 5c1.259-.982 2.592-1.315 4-1A79561.842 79561.842 0 0 1 403 181.5c.5 81.333.667 162.666.5 244H-.5Z"
      style={{
        opacity: 0.984,
        ...st10
      }}
    />
  </svg>
}
export default HousingAnywhereIcon
