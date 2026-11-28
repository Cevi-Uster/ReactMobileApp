export const COLOR_PRIMARY = '#6495ed'; // cornflowerblue
export const COLOR_SECONDARY = '#d3d3d3';
export const COLOR_HIGHLIGHT = 'navy';
export const BORDER_RADIUS = 20;

export type ThemeColors = {
  text: string;
  subtle: string;
  background: string;
  border: string;
  inputBorder: string;
  primary: string;
  accent: string;
  error: string;
};

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    text: '#000000',
    subtle: '#555555',
    background: '#ffffff',
    border: '#d9d9d9',
    inputBorder: '#cccccc',
    primary: COLOR_PRIMARY,
    accent: '#0097fe',
    error: '#c62828',
  },
  dark: {
    text: '#ffffff',
    subtle: '#aaaaaa',
    background: '#000000',
    border: '#333333',
    inputBorder: '#555555',
    primary: COLOR_PRIMARY,
    accent: '#0097fe',
    error: '#ef9a9a',
  },
};
