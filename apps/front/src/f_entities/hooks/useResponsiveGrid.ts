import {SCREEN_SIZES} from "../../g_shared/constants/theme";
import * as React from "react";
import {ResponsiveContext} from "grommet";

const GRID_CONFIG = {
  TWO_COMPONENT: {
    rows: ['auto'],
    columns: ['auto'],
    areas: [
      { name: 'content', start: [0, 0], end: [0, 0] },
    ],
  },
  TWO_COMPONENT_SMALL: {
    rows: ['60px', 'auto'],
    columns: ['auto'],
    areas: [
      { name: 'mainFilter', start: [0, 0], end: [0, 0] },
      { name: 'content', start: [0, 1], end: [0, 1] },
    ],
  },
  THREE_COMPONENT: {
    rows: ['70px', 'auto'],
    columns: ['3fr', '1fr', '2fr'],
    areas: [
      { name: 'mainFilter', start: [0, 0], end: [0, 0] },
      { name: 'secondaryFilter', start: [2, 0], end: [2, 0] },
      { name: 'content', start: [0, 1], end: [2, 1] },
    ],
  },
  THREE_COMPONENT_SMALL: {
    rows: ['60px', '60px', 'auto'],
    columns: ['auto'],
    areas: [
      { name: 'mainFilter', start: [0, 0], end: [0, 0] },
      { name: 'secondaryFilter', start: [0, 1], end: [0, 1] },
      { name: 'content', start: [0, 2], end: [0, 2] },
    ],
  },
}

const useResponsiveGrid = (isThreeComponents = false) => {
  const size = React.useContext(ResponsiveContext)
  const isSmall = size === SCREEN_SIZES.SMALL

  const getGridConfig = () => {
    if (isSmall) {
      return isThreeComponents ? GRID_CONFIG.THREE_COMPONENT_SMALL : GRID_CONFIG.TWO_COMPONENT_SMALL
    }
    return isThreeComponents ? GRID_CONFIG.THREE_COMPONENT : GRID_CONFIG.TWO_COMPONENT
  }

  const { columns, rows, areas } = getGridConfig()

  return {
    isSmall,
    columns,
    rows,
    areas
  }
}

export default useResponsiveGrid
