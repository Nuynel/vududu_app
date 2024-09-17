import {BlocksConfig} from "../g_shared/types";
import * as React from "react";
import CommonCard from "./CommonCard"
import AccordionCard from "./AccordionCard";

type Props = {
  config: BlocksConfig
  openBaseInfoEditor: () => void,
}

const EntityPage = ({config, openBaseInfoEditor}: Props) => {
  return (
    <div className="overflow-scroll bg-gray-100">
      <CommonCard blockName={config.commonData.blockName} blockFields={config.commonData.blockFields} openBaseInfoEditor={openBaseInfoEditor}/>
      {config.additionalData.map((block, index) => (
        <AccordionCard key={index} cardName={block.blockName} fields={block.blockFields}/>
      ))}
    </div>
  )
}

export default EntityPage
