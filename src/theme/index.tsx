import React from "react";
import { css } from "@emotion/core";
import { theme } from "@chakra-ui/core";

const customIcons = {
  daiIcon: {
    path: (
      <path
        fill="currentColor"
        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm10.633-16.183L15.817 5 5 15.817l10.817 3.996 10.816-3.996zM8.364 14.9l7.333-7.498s7.169 7.333 7.471 7.48c.303.146-4.931 0-4.931 0l-2.42-2.475-2.448 2.493H8.364zm7.453 5.674L5 16.605l10.817 10.028L26.633 16.55l-10.816 4.024z"
      />
    ),
    viewBox: "0 0 32 32",
  },
  githubIcon: {
    path: (
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    ),
    viewBox: "0 0 16 16",
  },
  menuIconClosed: {
    path: (
      <path
        fill="#f1404b"
        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
      />
    ),
    viewBox: "0 0 24 24",
  },
  menuIconOpen: {
    path: (
      <path
        fill="#f1404b"
        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
      />
    ),
    viewBox: "0 0 24 24",
  },
  dashboard: {
    path: (
      <path
        fill="currentColor"
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    ),
    viewBox: "0 0 24 24",
  },
  markets: {
    path: (
      <path
        fill="currentColor"
        d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84s1-2.43 2-2.84zM14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84zM13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"
      />
    ),
    viewBox: "0 0 24 24",
  },
  account: {
    path: (
      <path
        fill="currentColor"
        d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
      />
    ),
    viewBox: "0 0 24 24",
  },
  power: {
    path: (
      <path
        fill="currentColor"
        d="M12 3c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm5.14 2.86c-.39.39-.38 1-.01 1.39 1.13 1.2 1.83 2.8 1.87 4.57.09 3.83-3.08 7.13-6.91 7.17C8.18 19.05 5 15.9 5 12c0-1.84.71-3.51 1.87-4.76.37-.39.37-1-.01-1.38-.4-.4-1.05-.39-1.43.02C3.98 7.42 3.07 9.47 3 11.74c-.14 4.88 3.83 9.1 8.71 9.25 5.1.16 9.29-3.93 9.29-9 0-2.37-.92-4.51-2.42-6.11-.38-.41-1.04-.42-1.44-.02z"
      />
    ),
    viewBox: "0 0 24 24",
  },
};

export default {
  ...theme,
  colors: {
    ...theme.colors,
    black: { 100: "#252c41" },
    white: { 100: "#f4f5f9" },
    gray: { 100: "#dddfe6" },
    red: { 100: "#f1404b" },
  },
  icons: {
    ...theme.icons,
    ...customIcons,
  },
};

export const GlobalStyle = css`
  @import url("https://rsms.me/inter/inter.css");
  html {
    font-family: "Inter", sans-serif;
    letter-spacing: -0.018em;
  }
  @supports (font-variation-settings: normal) {
    html {
      font-family: "Inter var", sans-serif;
    }
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }

  body > div {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  html {
    font-size: 16px;
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  body {
    margin: 0;
    position: relative;
    background-color: #dddfe6;
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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  textarea:focus,
  input:focus {
    outline: none;
  }
`;
