import {Box, Grid, Text} from "grommet";
import * as React from "react";

type Props = {
  nodeId: string,
  fullName: string,
  position: string,
  setActiveDogId: (id: string) => void,
}

const imageSizes = {
  1: 'xsmall',
  2: 'xxsmall',
}

const roundSize = {
  1: 'small',
  2: 'small',
  3: 'xsmall',
  4: 'xxsmall',
}

const colors = {
  lightBlue: '#3B4EC1',
  darkBlue: '#4437BB',
  violet: '#5D27B8',
  purple: '#7A28C2',
  pink: '#9525C1',
}

const PedigreeNode = ({nodeId, fullName, position, setActiveDogId}: Props) => {
  return (
    <Box
      id={nodeId}
      gridArea={position}
      style={{minWidth: '250px'}}
      background={'white'}
      round={roundSize[position.length]}
      border={{color: '#777777', side: 'all', size: 'xsmall', style: 'solid'}}
      margin={position.length <= 3 ? 'small' : 'xxsmall'}
      onClick={() => setActiveDogId(nodeId)}
    >
      <Grid
        pad={{horizontal: "small"}}
        align={"center"}
        fill={"vertical"}
        gap={"small"}
        columns={[imageSizes[position.length], 'auto']}
        rows={['auto']}
        areas={[
          { name: 'image', start: [0, 0], end: [0, 0] },
          { name: 'text', start: [position.length < 3 ? 1 : 0, 0], end: [1, 0] },
        ]}
      >
        {position.length < 3 && (
          <Box
            height={imageSizes[position.length]}
            width={imageSizes[position.length]}
            background={'#777777'}
            gridArea={'image'}
          />
        )}
        <Box gridArea={'text'}>
          <Text size={'xsmall'}>
            {fullName}
          </Text>
        </Box>
      </Grid>
    </Box>
  )
}

export default PedigreeNode
