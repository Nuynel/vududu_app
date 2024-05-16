import {IconProps} from "./index";

const MaleIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24, minWidth: 24, minHeight: 24}}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 512 512">
        <circle
          cx="216"
          cy="296"
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
          d="M448 160V64h-96M324 188L448 64"
        />
      </svg>
    </div>
  )
}

export default MaleIcon;
