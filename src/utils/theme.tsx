import { css } from '@emotion/core';
import theme from '@chakra-ui/theme';

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
};

export const color1 = { light: 'dark.100', dark: 'white' };
export const color2 = { light: '#777', dark: 'light.100' };
export const color3 = { light: '#555', dark: 'light.100' };
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
        font-family: 'Inter', monospace;
    }
    @supports (font-variation-settings: normal) {
        html {
            font-family: 'Inter var', monospace;
        }
    }

    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
        min-width: 480px;
        height: 100%;
        position: relative;
    }
`;
