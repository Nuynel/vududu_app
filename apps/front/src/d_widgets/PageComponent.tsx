import * as React from "react";
import {ReactNode} from "react";
import Header from "../e_features/Header";
import {Paths} from "../g_shared/constants/routes";

type Props = {
  children: ReactNode,
  filter?: boolean
  headerProps: {
    title: string,
    submenu?: {
      left: {
        path: Paths,
        title: string,
        isActive: boolean
      },
      right: {
        path: Paths,
        title: string,
        isActive: boolean
      },
    },
    back: boolean
  }
}

const PageComponent = ({children, headerProps, filter}: Props) => {

  return (
    <div className={`grid ${filter ? 'grid-rows-[auto_auto_1fr]' : 'grid-rows-[auto_1fr]'} grid-cols-[auto] h-full overflow-scroll`}>
      <Header {...headerProps}/>
      {children}
    </div>
  )
}

export default PageComponent;
