import {Button, Box} from "grommet";
import {useLocation} from "wouter";

type Props = {
  activeDataType: string,
  buttons: {
    type: string,
    label: string,
    link: string | null,
  }[],
  isLink: boolean,
  setActiveDataType: (string) => void,
}

const  SectionHeader = ({activeDataType, buttons, isLink, setActiveDataType} : Props) => {
  const [, setLocation] = useLocation();
  const handleClick = ({link, type}: {link: string | null, type: string}) => {
    setActiveDataType(type)
    if (isLink && link) return setLocation(link)
  }

  return (
    <Box
      gridArea='mainFilter'
      direction='row'
      alignSelf='center'
      justify='around'
      background={'white'}
    >
      { buttons.map((button, index) => (
        <Button
          key={index}
          style={{
            // width: '30vw',
            height: '48px',
            borderRadius: 0,
            border: 'none',
            opacity: activeDataType === button.type ? 1 : 0.7,
            borderBottom: activeDataType === button.type ? '' : 'none'
          }}
          label={button.label}
          secondary
          onClick={() => handleClick(button)}
        />
      )) }
    </Box>
  )
}

export default SectionHeader
