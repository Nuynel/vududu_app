import {BoxStyleType} from "grommet/utils";

const accordionBorderStyle: BoxStyleType = 'hidden'

export enum SCREEN_SIZES {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export const theme = {
  global: {
    colors: {
      brand: '#E4B33A'
    },
    focus: {
      // shadow: 'none',
      // outline: {
      //   color: 'red'
      // },
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
    backgrounds: {
      lightBackground: '#F1F5F8',
    }
  },
  layer: {
    container: {
      extend: {
        overflow: 'scroll'
      }
    }
  },
  card: {
    container: {
      height: {
        // min: 'auto',
        // max: '900px'
      },
      // overflow: 'auto',
      // overflowAnchor: 'auto',
      // overflowClipMargin: '0px',
      // overflowWrap: 'normal',
      // overflowX: 'visible',
      // overflowY: 'visible',
    },
    body: {
      height: {
        // min: 'auto',
        // max: '400px'
      }
    }
  },
  accordion: {
    panel: {
      border: {
        style: accordionBorderStyle
      }
    },
    border: {
      style: accordionBorderStyle
    },
  }
};
