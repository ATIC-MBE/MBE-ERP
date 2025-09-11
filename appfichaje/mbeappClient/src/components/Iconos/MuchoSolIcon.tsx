import React, { CSSProperties } from "react"

const MuchoSolIcon = (props: any) => {

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
      fill="#34acd1"
      d="M176.5 40.5c-1.377 7.465-3.71 14.465-7 21-7.074-10.533-17.074-15.2-30-14-12.155-.667-21.988 3.666-29.5 13a31.936 31.936 0 0 0-4 12l-1 85c-3.748 6.042-8.915 7.542-15.5 4.5-1.817-1.8-2.984-3.966-3.5-6.5l-1-84C83.167 57.667 75.333 49.833 61.5 48 35.184 43.374 21.017 54.207 19 80.5l-1 77c-2.815 5.669-7.315 7.502-13.5 5.5a32.865 32.865 0 0 1-5-4.5v-122c4.086-4.99 9.086-6.157 15-3.5 3.436 3.757 4.936 8.257 4.5 13.5 6.956-9.733 16.456-15.233 28.5-16.5 16.412-1.813 31.412 1.853 45 11a34.692 34.692 0 0 1 6.5 7.5c10.436-13.464 24.269-19.797 41.5-19 12.1-.148 23.433 2.686 34 8.5.881.708 1.547 1.542 2 2.5Z"
      style={{
        opacity: 0.917,
        ...st10
      }}
    />
    <path
      fill="#fbaa18"
      d="M176.5 40.5c3.934 2.098 7.1 5.098 9.5 9 3.636 7.078 6.136 14.411 7.5 22v85c-3.365 6.949-8.699 8.783-16 5.5a15.83 15.83 0 0 1-3.5-5.5l-1-83a49.798 49.798 0 0 0-3.5-12c3.29-6.535 5.623-13.535 7-21Z"
      style={{
        opacity: 0.901,
        ...st10
      }}
    />
  </svg>
}
export default MuchoSolIcon
