type Neutral = 'white' | 'borderColor' | 's500' | 's800' | 'black';
export const neutral: Record<Neutral, string> = {
  white: '#ffffff',
  borderColor: '#20202033',
  s500: 'rgba(108, 105, 105, 1)',
  s800: 'rgba(32, 32, 32, 1)',
  black: '#000000',
};

type Primary = 'brand' | 'textColor';
export const primary: Record<Primary, string> = {
  brand: 'rgba(51, 24, 159, 1)',
  textColor: '#010101',
};

type Warning = 'asterisk' | 'error';
export const warning: Record<Warning, string> = {
  asterisk: 'rgba(199, 65, 58, 1)',
  error: 'rgba(199, 65, 58, 1)',
};

type Variable =
  | 'primary'
  | 'primaryWithLightShade'
  | 'whiteBackground'
  | 'blackTextColor'
  | 'danger'
  | 'descriptionText';
export const variable: Record<Variable, string> = {
  primary: '#33189f',
  primaryWithLightShade: '#33189f0d',
  whiteBackground: '#ffffff',
  blackTextColor: '#202020',
  danger: '#C7413A',
  descriptionText: '#6c6969',
};
