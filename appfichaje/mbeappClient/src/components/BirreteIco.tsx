import React from 'react';

const BirreteIco: React.FC<{ color?: string; size?: number }> = ({ color = '#0077bd', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M32 10L60 22L32 34L4 22L32 10Z" fill={color} stroke="#003b5c" strokeWidth="2"/>
      <path d="M12 27V38C12 41 32 50 52 38V27" stroke="#003b5c" strokeWidth="2" fill="none"/>
      <circle cx="52" cy="38" r="2.5" fill="#FFD700" stroke="#003b5c" strokeWidth="1.5"/>
      <line x1="52" y1="38" x2="52" y2="48" stroke="#FFD700" strokeWidth="2"/>
    </g>
  </svg>
);

export default BirreteIco;
