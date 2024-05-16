import {BlocksConfig} from "../g_shared/types";
import {Grid, Box, Heading, Button} from "grommet";
import * as React from "react";
import CommonCard from "./CommonCard"
import AccordionCard from "./AccordionCard";
import {CloseIcon, BackIcon} from "../g_shared/icons";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Props = {
  config: BlocksConfig
  openBaseInfoEditor: () => void,
  closeEntityPage: () => void,
}

const EntityPage = ({config, openBaseInfoEditor, closeEntityPage}: Props) => {
  const {isSmall} = useResponsiveGrid()

  return (
    <Grid
      rows={[`${isSmall ? 60 : 90}px`, 'auto']}
      columns={['60px', 'auto', '60px']}
      areas={[
        { name: 'back', start: [0, 0], end: [0, 0] },
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'exit', start: [2, 0], end: [2, 0] },
        { name: 'content', start: [0, 1], end: [2, 1] },
      ]}
      height={'100%'}
    >
      <Box gridArea='back' height={'100%'} justify={"center"} align={'center'}>
        <Button
          focusIndicator={false}
          icon={<BackIcon color='black'/>}
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
        <Heading level={3}>
          {config.title}
        </Heading>
      </Box>
      <Box gridArea='exit' height={'100%'} justify={"center"} align={'center'}>
        <Button
          focusIndicator={false}
          icon={<CloseIcon color='black'/>}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          secondary
          onClick={closeEntityPage}
        />
      </Box>
      <Box gridArea='content' overflow='scroll' background={'lightBackground'}>
        <CommonCard blockName={config.commonData.blockName} blockFields={config.commonData.blockFields} openBaseInfoEditor={openBaseInfoEditor}/>
        {config.additionalData.map((block, index) => (
          <AccordionCard key={index} cardName={block.blockName} fields={block.blockFields}/>
        ))}
      </Box>
    </Grid>
  )
}

export default EntityPage
