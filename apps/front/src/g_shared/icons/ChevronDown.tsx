import {IconProps} from "./index";

const ChevronDownIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="M 112 184 l 144 144 144 -144"
        />
      </svg>
    </div>
  )
}

export default ChevronDownIcon;
