import {
  Box,
  Button,
  Grid,
  Heading,
} from "grommet";
import {CloseIcon} from "../g_shared/icons";
import * as React from "react";
import {ReactNode} from "react";

type Props = {
  children: ReactNode
  title: string,
  isNewDogCreator?: boolean,
}

const FormPageWrapper = ({children, title}: Props) => {

  return (
    <Grid
      rows={['60px', 'auto']}
      columns={['60px', 'auto', '60px']}
      areas={[
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'exit', start: [2, 0], end: [2, 0] },
        { name: 'content', start: [0, 1], end: [2, 1] },
      ]}
      height={'100%'}
    >
      <Box gridArea='exit' height={'100%'} justify={"center"} align={'center'}>
        <Button
          focusIndicator={false}
          icon={<CloseIcon color='black'/>}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          secondary
          onClick={() => window.history.back()}
        />
      </Box>
      <Box
        gridArea='header'
        direction='row'
        alignSelf='center'
        justify='around'
        background={'white'}
        border={{color: '#F1F5F8', side: 'bottom', size: 'small', style: 'solid'}}
      >
        <Heading level={3} margin={{vertical: "small"}}>
          {title}
        </Heading>
      </Box>
      <Box
        gridArea='content'
        overflow='scroll'
        gap={"small"}
        background={'white'}
      >
        { children }
      </Box>
    </Grid>
  )
}

export default FormPageWrapper
