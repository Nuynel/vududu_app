import {IconProps} from "./index";

const PlusCircleIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          // d="M 256 32 A 224 224 0 0 1 256 512"
          strokeMiterlimit="10"
          fill='none'
          stroke={color}
          strokeWidth="32"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M256 176v160M336 256H176"
          // d="M 32 256 H 448 M 256 32 V 448"
          strokeWidth="32"
        />
      </svg>

    </div>
  )
}

export default PlusCircleIcon;
