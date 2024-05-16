import {IconProps} from "./index";

const CloseIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 112 112 l 256 256 m 0 -256 l -256 256"
        />
      </svg>
    </div>
  )
}

export default CloseIcon;
