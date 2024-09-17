import * as React from 'react'
import PrivateRoute from "../../e_features/PrivateRoute";
import Menu from "../../d_widgets/Menu";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

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
      <div className="grid h-full grid-rows-[1fr_60px] lg:grid-rows-[1fr_80px] grid-cols-1 gap-0">
        <PrivateRoute>
          {children}
        </PrivateRoute>
        <Menu isDesktop={false} />
      </div>
    )
  }

  return (
    <div className="grid h-full grid-rows-[64px_1fr] grid-cols-[250px_1fr] gap-0">
      <div className="grid-area-header bg-[#e4b33a] px-6 py-2">
        <p className="text-4xl font-extrabold text-white">
          VUDUDU
        </p>
      </div>
      <PrivateRoute>
        {children}
      </PrivateRoute>
      <Menu isDesktop={true} />
    </div>
  )
}

export default PrivatePageTemplate
