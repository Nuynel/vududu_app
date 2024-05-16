import {IconProps} from "./index";

const PlusIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M256 112v288M400 256H112"
        />
      </svg>
    </div>
  )
}

export default PlusIcon;
