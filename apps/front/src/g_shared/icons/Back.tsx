import {IconProps} from "./index";

const BackIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M244 400L100 256l144-144M120 256h292"/>
      </svg>
    </div>
  )
}

export default BackIcon;
