import React, { CSSProperties } from "react"

const HomelikeIcon = (props: any) => {

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
    width={200}
    height={200}
    // viewBox="0 0 512 512"
    // style={{
    //   shapeRendering: "geometricPrecision",
    //   textRendering: "geometricPrecision",
    //   imageRendering: "optimizeQuality",
    //   fillRule: "evenodd",
    //   clipRule: "evenodd",
    // }}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      // fill={color}
      d="M8.5-.5h8c2.715 1.572 5.715 2.572 9 3v23h-8v-16c-3.333-1.333-6.667-1.333-10 0v16h-8v-23c3.285-.428 6.285-1.428 9-3Z"
      style={{
        opacity: 0.962,
        ...st10
      }}
    />
  </svg>
}
export default HomelikeIcon
