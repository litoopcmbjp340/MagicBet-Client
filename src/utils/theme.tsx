import React from 'react';
import { css } from '@emotion/core';
import { theme } from '@chakra-ui/core';

const customIcons = {
  daiIcon: {
    path: (
      <path
        fill="currentColor"
        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm10.633-16.183L15.817 5 5 15.817l10.817 3.996 10.816-3.996zM8.364 14.9l7.333-7.498s7.169 7.333 7.471 7.48c.303.146-4.931 0-4.931 0l-2.42-2.475-2.448 2.493H8.364zm7.453 5.674L5 16.605l10.817 10.028L26.633 16.55l-10.816 4.024z"
      />
    ),
    viewBox: '0 0 32 32',
  },
  githubIcon: {
    path: (
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    ),
    viewBox: '0 0 16 16',
  },
  menuClosedIcon: {
    path: (
      <path
        fill="currentColor"
        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
      />
    ),
    viewBox: '0 0 24 24',
  },
  menuOpenIcon: {
    path: (
      <path
        fill="currentColor"
        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
      />
    ),
    viewBox: '0 0 24 24',
  },
  dashboardIcon: {
    path: (
      <path
        fill="currentColor"
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    ),
    viewBox: '0 0 24 24',
  },
  marketsIcon: {
    path: (
      <path
        fill="currentColor"
        d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84s1-2.43 2-2.84zM14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84zM13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"
      />
    ),
    viewBox: '0 0 24 24',
  },
};

export default {
  ...theme,
  colors: {
    ...theme.colors,
    dark: { 100: '#252c41' },
    light: { 100: '#f4f5f9' },
    primary: { 100: '#d02933' },
    secondary: { 100: '#dddfe6' },
    dm: {
      100: '#717171',
      200: '#595959	',
      300: '#414141',
      400: '#2a2a2a',
      500: '#121212',
    },
  },
  icons: {
    ...theme.icons,
    ...customIcons,
  },
};

export const color1 = { light: 'dark.100', dark: 'white' };
export const color2 = { light: '#777', dark: 'light.100' };
export const bgColor1 = { light: 'light.100', dark: 'dm.400' };
export const bgColor2 = { light: 'secondary.100', dark: 'dm.100' };
export const bgColor3 = { light: 'dark.100', dark: 'dm.400' };
export const bgColor4 = { light: 'primary.100', dark: 'dm.500' };
export const bgColor5 = { light: 'secondary.100', dark: 'dm.100' };
export const bgColor6 = { light: 'dark.100', dark: 'primary.100' };
export const bgColor7 = { light: 'light.100', dark: 'dm.200' };
export const bgColor8 = { light: 'secondary.100', dark: 'dm.300' };

export const GlobalStyle = css`
  @import url('https://rsms.me/inter/inter.css');
  html {
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.018em;
  }
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Inter var', sans-serif;
    }
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #dddfe6;
    position: relative;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
`;
