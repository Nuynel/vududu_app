import * as React from "react";
import {Box, Heading, Diagram, Stack} from "grommet";
import {ColorType} from "grommet/utils";
import {DiagramConnectionType} from "grommet/components/Diagram";

type Connections = {
  fromTarget: string | object;
  toTarget: string | object;
  thickness:
    | 'hair'
    | 'xxsmall'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | string;
  color: ColorType,
  type: DiagramConnectionType,
}[]

const Connections: Connections = [
  // {
  //   fromTarget: '00',
  //   toTarget: '0',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '01',
  //   toTarget: '0',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '10',
  //   toTarget: '1',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '11',
  //   toTarget: '1',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  //
  // {
  //   fromTarget: '000',
  //   toTarget: '00',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '001',
  //   toTarget: '00',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '010',
  //   toTarget: '01',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '011',
  //   toTarget: '01',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '100',
  //   toTarget: '10',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '101',
  //   toTarget: '10',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '110',
  //   toTarget: '11',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '111',
  //   toTarget: '11',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  //
  //
  //
  // {
  //   fromTarget: '0',
  //   toTarget: 'x0',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '0',
  //   toTarget: 'x1',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '0',
  //   toTarget: 'x2',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '0',
  //   toTarget: 'x3',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '0',
  //   toTarget: 'x4',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '0',
  //   toTarget: 'x5',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x0',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x1',
  //   thickness: 'xsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x2',
  //   thickness: 'xxsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x3',
  //   thickness: 'xxsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x4',
  //   thickness: 'xxsmall',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // },
  // {
  //   fromTarget: '1',
  //   toTarget: 'x5',
  //   thickness: 'hair',
  //   color: 'graph-1',
  //   type: 'rectilinear',
  // }
]

const PedigreeScreen = () => {
  return (
    <Box align='center' background={'lightBackground'} fill={"vertical"}>
      <Heading level={2}>
        Скоро!
      </Heading>
      <Stack>
        <Diagram connections={Connections}/>
        {/*<Box width={'min-content'}>*/}
        {/*  <Box width={'100%'} justify={"around"} direction='row'>*/}
        {/*    <Box id='000' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='001' margin='small' pad='medium' background="pink"/>*/}
        {/*    <Box id='010' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='011' margin='small' pad='medium' background="pink"/>*/}
        {/*    <Box id='100' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='101' margin='small' pad='medium' background="pink"/>*/}
        {/*    <Box id='110' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='111' margin='small' pad='medium' background="pink"/>*/}
        {/*  </Box>*/}
        {/*  <Box width={'100%'} justify={"around"} direction='row'>*/}
        {/*    <Box id='00' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='01' margin='small' pad='medium' background="pink"/>*/}
        {/*    <Box id='10' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='11' margin='small' pad='medium' background="pink"/>*/}
        {/*  </Box>*/}
        {/*  <Box width={'100%'} justify={"around"} direction='row'>*/}
        {/*    <Box id='0' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='1' margin='small' pad='medium' background="pink"/>*/}
        {/*  </Box>*/}
        {/*  <Box width={'100%'} justify={"around"} direction='row'>*/}
        {/*    <Box id='x0' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='x1' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='x2' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='x3' margin='small' pad='medium' background="blue"/>*/}
        {/*    <Box id='x4' margin='small' pad='medium' background="pink"/>*/}
        {/*    <Box id='x5' margin='small' pad='medium' background="pink"/>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Stack>
    </Box>
  );
}

export default PedigreeScreen
