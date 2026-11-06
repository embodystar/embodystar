import type { ProductArt as Art } from "../../lib/catalog";

// Illustrative product renders for the demo catalog.
export function ProductArt({ art, className = "" }: { art: Art; className?: string }) {
  return (
    <svg className={`product-art ${className}`} viewBox="0 0 320 260" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`metal-${art}`} x1="80" y1="30" x2="250" y2="230" gradientUnits="userSpaceOnUse"><stop stopColor="#f7f7ed" /><stop offset=".5" stopColor="#d0d5c8" /><stop offset="1" stopColor="#8e9c90" /></linearGradient>
        <linearGradient id={`green-${art}`} x1="85" y1="60" x2="225" y2="220" gradientUnits="userSpaceOnUse"><stop stopColor="#537b63" /><stop offset="1" stopColor="#183f33" /></linearGradient>
        <radialGradient id={`shadow-${art}`}><stop stopColor="#1b2926" stopOpacity=".2" /><stop offset="1" stopColor="#1b2926" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="164" cy="225" rx="108" ry="18" fill={`url(#shadow-${art})`} />
      {art === "arm" && <g stroke="#23463a" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m98 207 65-19 67 18-65 25-67-24Z" fill="#325b46" /><path d="M98 207v10l67 24v-10m65-25v10l-65 25" fill="#183b2e" />
        <path d="M146 192v-41l34-4v44c0 14-34 17-34 1Z" fill={`url(#green-${art})`} /><ellipse cx="164" cy="150" rx="18" ry="10" fill="#76917a" />
        <path d="m151 148-28-63 25-11 29 69-26 5Z" fill={`url(#metal-${art})`} /><path d="m158 145-25-63 7-3 28 66" fill="#a7b3a2" />
        <circle cx="137" cy="83" r="22" fill="#315844" /><circle cx="137" cy="83" r="13" fill="#b8c5af" /><circle cx="137" cy="83" r="5" fill="#3d5843" />
        <path d="m144 63 72 28-9 24-70-30 7-22Z" fill={`url(#metal-${art})`} /><path d="m150 70 58 22-3 8-59-23" fill="#e9eade" />
        <circle cx="213" cy="103" r="16" fill="#41664d" /><circle cx="213" cy="103" r="8" fill="#c1cbb7" />
        <path d="m217 115 7 20-13 16-7-7 9-12-6-14m17-9 18 11-1 21-10 1 1-17-15-8" fill="#293d33" />
        <path d="M130 103c-26 31 32 40 20 83" stroke="#1d3027" strokeWidth="3" strokeLinecap="round" />
        <circle cx="112" cy="209" r="2" fill="#d3d8c7" /><circle cx="214" cy="208" r="2" fill="#d3d8c7" />
      </g>}
      {art === "rover" && <g stroke="#29392f" strokeWidth="1.5" strokeLinejoin="round">
        <g fill="#27342c"><ellipse cx="93" cy="176" rx="22" ry="32" /><ellipse cx="227" cy="166" rx="22" ry="32" /><ellipse cx="135" cy="201" rx="22" ry="32" /><ellipse cx="259" cy="184" rx="21" ry="31" /></g>
        <g stroke="#7e8d7c" strokeWidth="6"><path d="m79 159 26 3m-29 8 31 3m-31 8 30 3m15 11 28 4m-28 5 28 4m96-35 28 4m-28 6 28 4" /></g>
        <path d="m79 144 111-38 78 43-117 44-72-49Z" fill="#bcc9ac" /><path d="M79 144v22l72 47v-20l-72-49Zm72 49 117-44v22l-117 42" fill="#52735a" />
        <path d="m109 139 76-25 54 30-82 29-48-34Z" fill="#dbe0cd" /><path d="m160 148 39-14 22 13-40 14-21-13Z" fill="#315a45" />
        <path d="M177 118V74l26-9 21 12v36l-27 10-20-5Z" fill={`url(#metal-${art})`} /><path d="m177 74 21 12 26-9m-26 9v37" />
        <ellipse cx="188" cy="96" rx="6" ry="9" fill="#1a2925" /><ellipse cx="209" cy="94" rx="6" ry="9" fill="#1a2925" />
        <path d="M141 128V80" strokeWidth="3" /><circle cx="141" cy="76" r="4" fill="#e7b85f" />
      </g>}
      {art === "camera" && <g stroke="#263c36" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m112 179 68-21 42 30-70 25-40-34Z" fill="#58756c" /><path d="m154 183 9-58 25-2-7 62" fill="#8b9c91" />
        <path d="m87 85 111-26 43 29v85l-111 28-43-30V85Z" fill={`url(#green-${art})`} /><path d="m87 85 43 29 111-26m-111 26v87" stroke="#849d87" />
        <ellipse cx="180" cy="140" rx="39" ry="43" fill="#172e28" /><ellipse cx="183" cy="138" rx="30" ry="34" fill="#80958b" /><ellipse cx="186" cy="136" rx="24" ry="29" fill="#162d2c" /><ellipse cx="190" cy="130" rx="13" ry="19" fill="#335856" /><ellipse cx="195" cy="121" rx="6" ry="9" fill="#9db9ac" />
        <circle cx="226" cy="106" r="3" fill="#d4dba1" /><path d="m99 102 17 11m-17 1 17 11m-17 1 17 11" stroke="#1b362b" />
      </g>}
      {art === "controller" && <g stroke="#244b3a" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m63 129 131-51 74 58-136 59-69-66Z" fill="#527f56" /><path d="M63 129v9l69 66 136-58v-10l-136 59-69-66Z" fill="#254d35" />
        <path d="m126 126 50-20 33 29-51 21-32-30Z" fill="#293c30" /><path d="m136 126 37-15 24 21-37 16-24-22Z" fill="#465547" />
        {[0,1,2,3,4,5].map(i=><g key={i}><path d={`m${93+i*14} ${119-i*5} -4 -17 5 -2 4 17`} fill="#e0c37d" /><path d={`m${147+i*14} ${179-i*6} 0 -14 5 -2 0 14`} fill="#e0c37d" /></g>)}
        <path d="m82 145 17-7 21 19-17 7-21-19Z" fill="#c6cdc2" /><path d="m86 146 13-5 13 12-13 5-13-12Z" fill="#303e34" />
        <path d="m203 102 14-5 15 12-14 5-15-12Z" fill="#d7dbc9" /><circle cx="83" cy="127" r="3" fill="#d4d5b7" /><circle cx="194" cy="89" r="3" fill="#d4d5b7" /><path d="m111 128 12 13-10 5 13 12m63-37 17-7 15 11m-42 31 12 11 22-9" stroke="#9dbf82" />
      </g>}
      {art === "gripper" && <g stroke="#37463b" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m125 189 52-20 35 21-54 23-33-24Z" fill="#47614a" /><path d="M143 181v-43l35-12 13 9v44l-33 13-15-11Z" fill={`url(#metal-${art})`} />
        <path d="m149 141-37-34-19-37 18-8 22 34 29 19 29-26 10-38 20 4-6 46-36 38-30 2Z" fill="#c0c9b6" /><path d="m96 70 13-5 16 27-15 9-14-31Zm104-14 17 4-4 32-16-2 3-34Z" fill="#c78360" />
        <path d="m143 117 23 11 26-18" strokeWidth="5" /><circle cx="164" cy="132" r="12" fill="#3b5943" /><circle cx="164" cy="132" r="5" fill="#b9c8ab" />
      </g>}
      {art === "motor" && <g stroke="#2b3c32" strokeWidth="1.5" strokeLinejoin="round">
        {[{x:0,y:0},{x:76,y:31}].map(({x,y},i)=><g key={i} transform={`translate(${x} ${y})`}>
          <path d="m73 119 52-20 35 25v59l-54 22-33-25v-61Z" fill={`url(#green-${art})`} /><path d="m73 119 33 25 54-20m-54 20v61" stroke="#75977b" />
          <path d="m81 112 40-14 29 20-42 16-27-22Z" fill="#a6b59e" /><path d="M111 113V85l14-5 9 6v27l-14 5-9-5Z" fill="#c9cdbb" /><ellipse cx="122" cy="84" rx="12" ry="7" fill="#e1e3d5" />
          <path d="m89 105 55-19m-27-2 1 35" stroke="#d9ddcc" strokeWidth="6" /><path d="M82 176c-26 35 1 38 20 30" stroke="#a57b4e" strokeWidth="3" />
        </g>)}
      </g>}
      {art === "toolkit" && <g stroke="#4c4a3e" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m66 133 127-42 68 45-132 49-63-52Z" fill="#aa9b7f" /><path d="M66 133v35l63 49 132-49v-32l-132 49-63-52Z" fill="#7f8065" /><path d="m79 134 111-35 55 36-114 42-52-43Z" fill="#e0d7bd" />
        {[0,1,2,3,4].map(i=><g key={i}><path d={`m${100+i*19} ${128-i*6} 24 20`} stroke="#8f9684" strokeWidth="8" strokeLinecap="round" /><path d={`m${100+i*19} ${128-i*6} -5 -5`} stroke="#343f32" strokeWidth="3" /></g>)}
        <path d="m134 177 67-24 20 12-70 26-17-14Z" fill="#324e3c" /><path d="m143 180 58-21" stroke="#bac4ac" strokeWidth="5" /><path d="m146 194 0 9 21-8v-8" fill="#3b4e3c" />
      </g>}
      {art === "sensor" && <g stroke="#264936" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m77 109 128-28 35 29v79l-126 31-37-28v-83Z" fill="#4e7252" /><path d="m77 109 37 29 126-28m-126 28v82" stroke="#99ad86" />
        <ellipse cx="145" cy="160" rx="24" ry="30" fill="#bcc7b3" /><ellipse cx="145" cy="160" rx="17" ry="22" fill="#304b3a" /><ellipse cx="145" cy="160" rx="11" ry="15" fill="#6f8b6d" />
        <ellipse cx="207" cy="145" rx="24" ry="30" fill="#bcc7b3" /><ellipse cx="207" cy="145" rx="17" ry="22" fill="#304b3a" /><ellipse cx="207" cy="145" rx="11" ry="15" fill="#6f8b6d" />
        <path d="M92 111V92m8 17V90m8 17V88m8 17V86" stroke="#d7bd76" strokeWidth="4" />
      </g>}
    </svg>
  );
}
