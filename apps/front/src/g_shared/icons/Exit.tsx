import {IconProps} from "./index";

const ExitIcon = ({color}: IconProps) => {
  return (
    <div style={{width: 24, height: 24}}>
      <svg xmlns='http://www.w3.org/2000/svg'  viewBox="0 0 512 512">
        <path
          d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273"
          fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"
        />
      </svg>
    </div>
  )
}

export default ExitIcon;
