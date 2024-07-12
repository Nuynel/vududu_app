import {BlocksConfig} from "../g_shared/types";
import {Box} from "grommet";
import * as React from "react";
import CommonCard from "./CommonCard"
import AccordionCard from "./AccordionCard";

type Props = {
  config: BlocksConfig
  openBaseInfoEditor: () => void,
}

const EntityPage = ({config, openBaseInfoEditor}: Props) => {
  return (
    <Box gridArea='content' overflow='scroll' background={'lightBackground'}>
      <CommonCard blockName={config.commonData.blockName} blockFields={config.commonData.blockFields} openBaseInfoEditor={openBaseInfoEditor}/>
      {config.additionalData.map((block, index) => (
        <AccordionCard key={index} cardName={block.blockName} fields={block.blockFields}/>
      ))}
    </Box>
  )
}

export default EntityPage
