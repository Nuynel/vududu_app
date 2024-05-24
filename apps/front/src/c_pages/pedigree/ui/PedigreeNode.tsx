import {Box, Text} from "grommet";
import * as React from "react";

type Props = {
  nodeId: string,
  fullName: string,
  position: string,
}

const PedigreeNode = ({nodeId, fullName, position}: Props) => {
  return (
    <Box
      gridArea={position}
      id={nodeId}
      pad={{horizontal: "small"}}
      background={'white'}
      justify={"center"}
      overflow={"hidden"}
      border={{color: '#777777', side: 'all', size: 'xsmall', style: 'solid'}}
    >
      <Text>
        {fullName}
      </Text>
    </Box>
  )
}

export default PedigreeNode
