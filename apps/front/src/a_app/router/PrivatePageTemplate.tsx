import * as React from 'react'
import PrivateRoute from "../../e_features/PrivateRoute";
import {ResponsiveContext, Grid, Box, Text} from "grommet";
import Menu from "../../d_widgets/Menu";
import {SCREEN_SIZES} from "../../g_shared/constants/theme";

// как я хочу: в темплейт прокидывается нужный компонент из роутера
// в темплейте есть меню и все остальное для корректного отображения
// при этом темплейт сам не управляет другими компонентами

const PrivatePageTemplate = ({children}) => {
  const size = React.useContext(ResponsiveContext)

  if (size === SCREEN_SIZES.SMALL) {
    return (
      <Grid
        height='full'
        rows={['flex', '60px']}
        columns={['full']}
        gap='none'
        areas={[
          { name: 'main', start: [0, 0], end: [0, 0] },
          { name: 'nav', start: [0, 1], end: [0, 1] },
        ]}
      >
        <PrivateRoute>
          {children}
        </PrivateRoute>
        <Menu isDesktop={false} />
      </Grid>
    )
  }

  return (
    <Grid
      rows={['64px', 'flex']}
      columns={['250px', 'flex']}
      gap='none'
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'nav', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Box
        gridArea='header'
        pad={{horizontal: 'medium', vertical: 'small'}}
        background={'#e4b33a'}
      >
        <Text size={"xxlarge"} weight={800} color={'white'}>VUDUDU</Text>
      </Box>
      <PrivateRoute>
        {children}
      </PrivateRoute>
      <Menu isDesktop={true} />
    </Grid>
  )
}

export default PrivatePageTemplate
