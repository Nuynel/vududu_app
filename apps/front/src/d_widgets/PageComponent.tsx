import * as React from "react";
import {ReactNode} from "react";

type Props = {
  children: ReactNode,
  filter?: boolean
}

const PageComponent = ({children, filter}: Props) => {
  return (
    <div className={`relative grid p-4 ${filter ? 'grid-rows-[auto_1fr]' : 'grid-rows-[1fr]'} h-full grid-cols-[auto] overflow-scroll bg-gray-200 gap-4 lg:pt-4`}>
      {children}
    </div>
  )
}

export default PageComponent;
