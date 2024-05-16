import {IconProps} from "./index";

const PencilIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M364.13 125.25L87 403l-23 45 44.99-23 277.76-277.13-22.62-22.62zM420.69 68.69l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 000-22.62h0a16 16 0 00-22.62 0z"
        />
      </svg>
    </div>
  )
}

export default PencilIcon;
