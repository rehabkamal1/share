/**
 * ShareFlow Design System & UI Tokens
 * Modern, calm, soft lavender-blue aesthetic
 */

export const colors = {
  primary: '#7667C9',
  primaryDark: '#5B4BB0',
  primarySoft: '#EAE5FF',
  background: '#F8F7FC',
  surface: '#FFFFFF',
  secondarySurface: '#F0EEFA',
  accentBlue: '#DDEBFF',
  accentMint: '#DDF3E8',
  accentPeach: '#F9E7DB',
  mainText: '#29283A',
  secondaryText: '#77758B',
  border: '#E8E5F0',
  success: '#328768',
  error: '#C45462',
  warning: '#D97706',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(41, 40, 58, 0.45)',
  transparent: 'transparent',
} as const;

export const radii = {
  sm: 8,
  md: 12,
  button: 16,     // 14-18px
  card: 20,       // 18-24px
  large: 24,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
} as const;

export const typography = {
  fontFamily: {
    arabic: "'Cairo', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 30,
    display: 36,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const shadows = {
  subtle: '0 2px 8px rgba(118, 103, 201, 0.06)',
  card: '0 4px 20px rgba(118, 103, 201, 0.08)',
  floating: '0 10px 30px rgba(91, 75, 176, 0.12)',
  glow: '0 0 25px rgba(118, 103, 201, 0.25)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

