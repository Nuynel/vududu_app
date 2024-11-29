import {IconProps} from "./index";

const BackIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="none"
          strokeLinecap="round"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="32" d="M320 448L128 256l192-192"
        />
      </svg>
    </div>
  )
}

export default BackIcon;
