import {IconProps} from "./index";

const InjectorIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24, minWidth: 24, minHeight: 24}}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 512 512">
        <rect
          fill="none"
          height="254.56"
          rx="32.03"
          ry="32.03"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          transform="matrix(1 0 0 1 0 0) matrix(0.707107 0.707107 -0.707107 0.707107 274.392 -108.302)"
          width="98.81"
          x="198.02" y="171.71"
        />
        <line
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          x1="270" x2="384" y1="132" y2="241.86"
        />
        <line
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          transform="matrix(1 0 0 1 0 0)"
          x1="148" x2="82" y1="369" y2="432"
        />
        <line
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          transform="matrix(1 0 0 1 0 0)"
          x1="328" x2="389" y1="183" y2="126"
        />
        <line
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          x1="340" x2="454" y1="67.57" y2="177.43"
        />
      </svg>
    </div>
  )
}

export default InjectorIcon;
