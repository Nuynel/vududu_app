import {IconProps} from "./index";

const GraphIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
        <circle
          cx="128"
          cy="96"
          r="48"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <circle
          cx="256"
          cy="416"
          r="48"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <path
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="M256 256v112"
        />
        <circle
          cx="384"
          cy="96"
          r="48"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <path
          d="M128 144c0 74.67 68.92 112 128 112M384 144c0 74.67-68.92 112-128 112"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
      </svg>
    </div>
  )
}

export default GraphIcon;

