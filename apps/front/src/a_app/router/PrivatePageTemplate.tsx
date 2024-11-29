import * as React from 'react'
import PrivateRoute from "../../e_features/PrivateRoute";
import Menu from "../../d_widgets/Menu";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import Header from "../../e_features/Header";

// как я хочу: в темплейт прокидывается нужный компонент из роутера
// в темплейте есть меню и все остальное для корректного отображения
// при этом темплейт сам не управляет другими компонентами

const PrivatePageTemplate = ({children}) => {
  const {isSmall} = useResponsiveGrid()

  function isStandalone() {
    // @ts-ignore: next line
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  if (isSmall) {
    return (
      <div className="grid h-full grid-rows-[auto_1fr_60px] lg:grid-rows-[1fr_80px] grid-cols-1 gap-0">
        <Header/>
        <PrivateRoute>
          {children}
        </PrivateRoute>
        <Menu/>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-rows-[64px_1fr] grid-cols-[250px_1fr] gap-0">
      <div className="col-span-2 bg-white text-gray-800 px-6 py-2 flex items-center">
        <p className="text-2xl font-extrabold">
          VUDUDU
        </p>
      </div>
      <Menu/>
      <PrivateRoute>
        {children}
      </PrivateRoute>
    </div>
  )
}

export default PrivatePageTemplate
