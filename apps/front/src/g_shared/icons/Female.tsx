import {IconProps} from "./index";

const FemaleIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24, minWidth: 24, minHeight: 24}}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 512 512">
        <circle
          cx="256"
          cy="184"
          r="152"
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
          d="M256 336v144M314 416H198"
        />
      </svg>
    </div>
  )
}

export default FemaleIcon;
