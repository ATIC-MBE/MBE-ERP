import React, { CSSProperties } from "react"

const HoliduIconIcon = (props: any) => {

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
      fill="#02809d"
      d="M18.5-.5h82a94.262 94.262 0 0 1 11 6.5c3.577 3.671 6.244 7.838 8 12.5v82a94.252 94.252 0 0 1-6.5 11c-3.671 3.577-7.838 6.244-12.5 8h-82a94.235 94.235 0 0 1-11-6.5c-3.577-3.671-6.244-7.838-8-12.5v-82A94.245 94.245 0 0 1 6 7.5c3.671-3.577 7.838-6.244 12.5-8Z"
      style={{
        opacity: 0.991,
        ...st10
      }}
    />
    <path
      fill="#f5fafb"
      d="M54.5 13.5c3.35-.165 6.683.002 10 .5a712.615 712.615 0 0 0 31 18c2.606 1.938 4.44 4.438 5.5 7.5a600.2 600.2 0 0 1 0 49c-1.068 4.735-3.901 7.902-8.5 9.5-23.665 9.265-46.998 8.598-70-2-2.117-1.73-3.617-3.898-4.5-6.5-.667-17-.667-34 0-51a25.556 25.556 0 0 1 5.5-6.5 355.173 355.173 0 0 0 31-18.5Z"
      style={{
        opacity: 1,
        ...st10
      }}
    />
    <path
      fill="#11839f"
      d="M56.5 18.5c3.63-.34 6.964.494 10 2.5l24 14c2.5 1.167 4.333 3 5.5 5.5.667 16 .667 32 0 48-.833 2.167-2.333 3.667-4.5 4.5-22.16 7.608-44.16 7.275-66-1a6.975 6.975 0 0 1-2.5-3.5c-.667-16-.667-32 0-48 1.167-2.5 3-4.333 5.5-5.5a567.799 567.799 0 0 0 28-16.5Z"
      style={{
        opacity: 1,
        ...st10
      }}
    />
    <path
      fill="#f4f9fb"
      d="M70.5 38.5c8.737.712 10.07 4.212 4 10.5-6.577 1.59-8.744-.91-6.5-7.5a10.521 10.521 0 0 0 2.5-3Z"
      style={{
        opacity: 1,
        ...st10
      }}
    />
    <path
      fill="#f8fbfc"
      d="M42.5 42.5h8v15h-8v-15Z"
      style={{
        opacity: 1,
        ...st10
      }}
    />
    <path
      fill="#f9fcfd"
      d="M79.5 50.5c1.752-.082 2.752.75 3 2.5a25.402 25.402 0 0 1-5.5 6.5c-.5 8.327-.666 16.66-.5 25h-8v-19a53.514 53.514 0 0 1-18 3v16h-8a81.872 81.872 0 0 0-1-18l-5-2.5c-.837-1.011-1.17-2.178-1-3.5 15.988 1.873 30.654-1.46 44-10Z"
      style={{
        opacity: 1,
        ...st10
      }}
    />
  </svg>
}
export default HoliduIconIcon
